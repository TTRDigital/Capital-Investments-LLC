/*
 * Texting opt-in page for carrier approval of Capital Investment's texts
 * (TTR-2572, part of TTR-1450). Words are Ivy's draft, exactly as written on
 * the task, for Kia's review. Staging only: noindex, so it stays out of
 * sitemap.xml, the /sitemap/ page and search; it is in no menu.
 */
import type { Page } from "@/lib/types";

export const textingPages: Page[] = [
  {
    path: "/text-messages/",
    title: "Text messages from Capital Investment",
    group: "forms",
    order: 50,
    seo: {
      title: "Text messages from Capital Investment",
      description: "Sign up for text messages from Capital Investment about your appointments and requests.",
      noIndex: true,
    },
    sections: [
      {
        _type: "hero",
        heading: "Text messages from Capital Investment",
        image: { src: "/images/heroes/blue-skyline.webp", alt: "City skyline at night in blue tones", width: 2400, height: 713 },
        overlay: 0.7,
        position: "center",
        _key: "s1",
      },
      {
        _type: "textOptIn",
        text: ["Want texts about your appointments and requests? Add your mobile number below. You can stop at any time by replying STOP."],
        consentText:
          "By checking this box, I agree to receive text messages about my appointments and requests from Capital Investment at the mobile number I entered. Consent is not a condition of any purchase. Message frequency varies. Message and data rates may apply. Reply STOP to cancel or HELP for help. We do not share mobile numbers with third parties for marketing. See our Privacy Policy and Terms.",
        submitLabel: "Sign up for texts",
        _key: "s2",
      },
    ],
  },
];
