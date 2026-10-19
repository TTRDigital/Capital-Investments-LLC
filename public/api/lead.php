<?php
/*
 * Lead form handler for SiteGround (the static site has no Node server).
 * Handles the site's four forms (components/forms/LeadForm.tsx):
 *   contact     Full Name, Email, Phone                 ("Let's Chat" popup, /contact-us/)
 *   newsletter  Full Name, Email                        (footer)
 *   subscribe   First Name, Last Name, Email            (/subscribe/)
 *   careers     Name, Email, Phone, resume file         (/careers-in-…/, multipart)
 * Every form requires the consent checkbox. Requests are validated like the
 * form does, spam is filtered, and the lead is posted as flat JSON to the
 * GoHighLevel inbound webhook. A careers resume is emailed as an attachment
 * (webhooks cannot carry files), and the lead itself goes to the webhook too.
 *
 * Settings live in lead-config.php (next to public_html or in this folder;
 * blocked from the web by .htaccess), returning e.g.
 *   ['webhook_url' => 'https://services.leadconnectorhq.com/hooks/...',
 *    'careers_email' => 'reza@capitalinvestmentllc.com']
 * The deploy workflow writes it when the GHL_WEBHOOK_URL secret is set.
 * Without a webhook, requests are accepted (the visitor sees the thank-you
 * message) but NOT forwarded anywhere, and the server error log says so.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function reply(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

// Same-site posts only.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = strtolower(preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
if ($origin !== '' && strtolower((string) parse_url($origin, PHP_URL_HOST)) !== $host) {
    reply(403, ['ok' => false, 'error' => 'Forbidden.']);
}

/* Best-effort per-IP rate limit: 10 requests per 10 minutes. */
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/ci-lead-' . md5($ip);
$now = time();
$recent = array_filter(
    json_decode((string) @file_get_contents($bucket), true) ?: [],
    fn($t) => is_int($t) && $now - $t < 600
);
$recent[] = $now;
@file_put_contents($bucket, json_encode(array_values($recent)), LOCK_EX);
if (count($recent) > 10) {
    reply(429, ['ok' => false, 'error' => 'Too many requests. Please call us instead.']);
}

// JSON body, or multipart with a "payload" JSON field (careers form with a resume).
$isMultipart = stripos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') === 0;
$raw = $isMultipart ? (string) ($_POST['payload'] ?? '') : (string) file_get_contents('php://input', false, null, 0, 64 * 1024);
$in = json_decode($raw, true);
if (!is_array($in)) {
    reply(400, ['ok' => false, 'error' => 'Invalid request.']);
}

function text(array $in, string $key, int $max): string {
    $v = $in[$key] ?? '';
    if (!is_string($v)) return '';
    return mb_substr(trim($v), 0, $max);
}

// Keep in sync with components/forms/LeadForm.tsx.
$FORMS = [
    'contact' => ['full_name' => true, 'email' => true, 'phone' => true],
    'newsletter' => ['full_name' => true, 'email' => true],
    'subscribe' => ['first_name' => true, 'last_name' => true, 'email' => true],
    'careers' => ['full_name' => true, 'email' => true, 'phone' => false],
];
$form = text($in, 'form', 20);
if (!isset($FORMS[$form])) {
    reply(400, ['ok' => false, 'error' => 'Invalid request.']);
}

$lead = [];
$errors = [];
foreach ($FORMS[$form] as $field => $required) {
    $v = text($in, $field, $field === 'email' ? 200 : 120);
    $lead[$field] = $v;
    if ($v === '') {
        if ($required) $errors[$field] = 'This field is required.';
        continue;
    }
    if ($field === 'email' && !filter_var($v, FILTER_VALIDATE_EMAIL)) $errors[$field] = 'Please enter a valid email address.';
    if ($field === 'phone' && (!preg_match('/^[0-9()#&+*\-=. ]+$/', $v) || strlen(preg_replace('/\D/', '', $v)) < 10)) $errors[$field] = 'Please enter a phone number with area code.';
    if (in_array($field, ['full_name', 'first_name', 'last_name'], true) && mb_strlen($v) < 2) $errors[$field] = 'Please enter your name.';
}
if (($in['consent'] ?? false) !== true) $errors['consent'] = 'Please check the box to agree.';

// Careers: one resume, PDF or Word, up to 5 MB (RESUME_MAX_BYTES in lib/lead-options.ts).
$resume = null;
if ($form === 'careers') {
    $f = $_FILES['resume'] ?? null;
    if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) {
        $errors['resume'] = 'Please attach your resume.';
    } else {
        $ext = strtolower(pathinfo((string) $f['name'], PATHINFO_EXTENSION));
        $mime = function_exists('finfo_open') ? (string) finfo_file(finfo_open(FILEINFO_MIME_TYPE), $f['tmp_name']) : '';
        $okMime = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/octet-stream', 'application/x-ole-storage', 'application/CDFV2'];
        if ($f['size'] > 5 * 1024 * 1024) $errors['resume'] = 'Please attach a file under 5 MB.';
        elseif (!in_array($ext, ['pdf', 'doc', 'docx'], true) || ($mime !== '' && !in_array($mime, $okMime, true))) $errors['resume'] = 'Please attach a PDF or Word document.';
        else $resume = ['path' => $f['tmp_name'], 'name' => preg_replace('/[^A-Za-z0-9._-]+/', '-', basename((string) $f['name'])), 'mime' => $mime ?: 'application/octet-stream'];
    }
}

if ($errors) {
    reply(422, ['ok' => false, 'error' => 'Please check the form.', 'fields' => $errors]);
}

// Spam: drop only when both signals agree (hidden field filled AND sent faster
// than a person can type). One signal alone can be autofill or a fast typist,
// so that request is delivered with a "suspected-spam" tag.
$trapFilled = text($in, 'website_url', 200) !== '';
$elapsed = is_int($in['elapsed_ms'] ?? null) ? $in['elapsed_ms'] : null;
$tooFast = $elapsed !== null && $elapsed < 2500; // MIN_FILL_MS in lib/lead-options.ts
if ($trapFilled && $tooFast) {
    reply(200, ['ok' => true]);
}
$spamCheck = $trapFilled ? 'suspect: hidden field filled' : ($tooFast ? "suspect: sent in {$elapsed} ms" : 'ok');

// Settings
$config = [];
foreach ([dirname(__DIR__, 2) . '/lead-config.php', __DIR__ . '/lead-config.php'] as $file) {
    if (is_file($file)) {
        $config = (array) include $file;
        break;
    }
}

/* Name parts and E.164 phone for GoHighLevel. */
$fullName = $lead['full_name'] ?? trim(($lead['first_name'] ?? '') . ' ' . ($lead['last_name'] ?? ''));
$parts = preg_split('/\s+/', $fullName);
$first = $lead['first_name'] ?? $parts[0];
$last = $lead['last_name'] ?? implode(' ', array_slice($parts, 1));
$phoneRaw = $lead['phone'] ?? '';
$digits = preg_replace('/\D/', '', $phoneRaw);
if (strlen($digits) === 10) $phone = '+1' . $digits;
elseif (strlen($digits) === 11 && $digits[0] === '1') $phone = '+' . $digits;
else $phone = $digits === '' ? '' : ((str_starts_with($phoneRaw, '+') ? '+' : '') . $digits);

$TAGS = ['contact' => ['website-lead', 'contact-form'], 'newsletter' => ['newsletter'], 'subscribe' => ['newsletter'], 'careers' => ['career-application']];
$tags = $TAGS[$form];
if ($spamCheck !== 'ok') $tags[] = 'suspected-spam';

$payload = [
    'source' => 'Website ' . $form . ' form',
    'form' => $form,
    'submitted_at' => gmdate('c'),
    'name' => $fullName,
    'first_name' => $first,
    'last_name' => $last,
    'email' => $lead['email'],
    'phone' => $phone,
    'phone_raw' => $phoneRaw,
    'position' => text($in, 'position', 200),
    'resume_file' => $resume['name'] ?? '',
    'consent' => true,
    'consent_text' => text($in, 'consent_text', 2000),
    'tags' => $tags,
    'spam_check' => $spamCheck,
];
foreach (['page_url', 'landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as $key) {
    $payload[$key] = text($in, $key, 1000);
}

/* Careers: email the resume (the webhook cannot carry the file). */
$mailed = null;
if ($resume) {
    $to = trim((string) ($config['careers_email'] ?? 'reza@capitalinvestmentllc.com'));
    $from = trim((string) ($config['mail_from'] ?? ('no-reply@' . preg_replace('/^www\./', '', $host ?: 'capitalinvestmentllc.com'))));
    $boundary = 'b' . bin2hex(random_bytes(12));
    $clean = fn($s) => str_replace(["\r", "\n"], ' ', (string) $s);
    $subject = $clean('Resume: ' . $fullName . ($payload['position'] ? ' – ' . $payload['position'] : ''));
    $bodyText = "New application from the website careers form.\r\n\r\n"
        . 'Name: ' . $clean($fullName) . "\r\n"
        . 'Email: ' . $clean($lead['email']) . "\r\n"
        . 'Phone: ' . $clean($phoneRaw) . "\r\n"
        . 'Position: ' . $clean($payload['position']) . "\r\n"
        . 'Page: ' . $clean($payload['page_url']) . "\r\n"
        . 'Spam check: ' . $spamCheck . "\r\n";
    $msg = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$bodyText\r\n"
        . "--$boundary\r\nContent-Type: {$resume['mime']}; name=\"{$resume['name']}\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"{$resume['name']}\"\r\n\r\n"
        . chunk_split(base64_encode((string) file_get_contents($resume['path']))) . "--$boundary--\r\n";
    $headers = "From: Capital Investment LLC Website <$from>\r\nReply-To: " . $clean($lead['email']) . "\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary=\"$boundary\"";
    $mailed = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $msg, $headers);
    if (!$mailed) error_log('[lead] Could not email the resume to ' . $to);
}

$webhook = trim((string) ($config['webhook_url'] ?? ''), " \t\n\r\0\x0B\"'");
// A resume that could not be emailed and has no webhook to go to would be lost: say so.
if ($resume && !$mailed && $webhook === '') {
    reply(502, ['ok' => false, 'error' => 'We could not send your resume. Please email it to us instead.']);
}
if ($webhook === '') {
    error_log('[lead] No GoHighLevel webhook configured (lead-config.php): ' . $form . ' request accepted but NOT sent.');
    reply(200, ['ok' => true, 'delivered' => false, 'mailed' => $mailed]);
}
// https only; plain http is allowed for a local test webhook (localhost).
if (!preg_match('#^https://#', $webhook) && !preg_match('#^http://(localhost|127\.0\.0\.1)(:\d+)?/#', $webhook)) {
    error_log('[lead] GoHighLevel webhook URL is not https: request accepted but NOT sent. Check lead-config.php.');
    reply(200, ['ok' => true, 'delivered' => false, 'mailed' => $mailed]);
}

// One retry for rate limits, server errors and network failures.
$body = json_encode($payload);
for ($attempt = 0; $attempt < 2; $attempt++) {
    $ch = curl_init($webhook);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
    ]);
    $res = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($status >= 200 && $status < 300) {
        reply(200, ['ok' => true, 'delivered' => true, 'mailed' => $mailed]);
    }
    error_log("[lead] GoHighLevel webhook answered {$status}: " . substr((string) $res, 0, 300));
    if ($status !== 0 && $status !== 429 && $status < 500) break;
    usleep(600000);
}

// A resume that was emailed still reached the office; otherwise ask the visitor to call.
if ($mailed) {
    reply(200, ['ok' => true, 'delivered' => false, 'mailed' => true]);
}
reply(502, ['ok' => false, 'error' => 'We could not send your request. Please call us instead.']);
