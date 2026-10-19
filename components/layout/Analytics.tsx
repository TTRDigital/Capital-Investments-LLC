import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const AHREFS_KEY = process.env.NEXT_PUBLIC_AHREFS_KEY;

/**
 * Google Analytics 4, Tag Manager and Ahrefs Web Analytics (the old site ran
 * all three). Loaded after the page is idle; nothing loads when the env vars
 * are empty (the deploy workflow sets the old site's IDs).
 */
export function Analytics() {
  return (
    <>
      {GTM_ID ? (
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
      {GA_ID ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
          <Script id="ga" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      ) : null}
      {AHREFS_KEY ? <Script src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_KEY} strategy="lazyOnload" /> : null}
    </>
  );
}
