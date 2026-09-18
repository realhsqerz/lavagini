import type { Metadata } from "next";

import { ContactCtaSection } from "@/components/sections/contact-cta";
import { FaqSection, faqItems } from "@/components/sections/faq";
import { HighlightsSection } from "@/components/sections/highlights";
import { HomeHero } from "@/components/sections/home-hero";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { PackagesPreviewSection } from "@/components/sections/packages-preview";
import { JsonLd } from "@/components/seo/json-ld";
import { contactDetails, packages, siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Lavage de voiture à domicile en Tunisie",
  description:
    "Lavage et nettoyage de voiture à domicile à Sousse et ses alentours, en Tunisie. Réservez en ligne : lavage extérieur, intérieur, cire brillante et nettoyage complet dès 20 TND.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Lavage de voiture à domicile en Tunisie | Lavagini",
    description:
      "Réservez un lavage de voiture à domicile à Sousse et ses alentours. Extérieur, intérieur et complet à partir de 20 TND.",
    url: siteUrl,
    type: "website",
  },
};

export default function HomePage() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["AutoWash", "LocalBusiness"],
    name: "Lavagini",
    description:
      "Service de lavage de voiture à domicile à Sousse et ses alentours, en Tunisie. Réservation en ligne, confirmation par téléphone.",
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    telephone: contactDetails.phoneHref.replace("tel:", "+"),
    priceRange: "20–40 TND",
    currenciesAccepted: "TND",
    areaServed: {
      "@type": "Place",
      name: "Sousse, Tunisie",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sousse",
      addressCountry: "TN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contactDetails.phoneHref.replace("tel:", "+"),
      contactType: "customer service",
      areaServed: "TN",
      availableLanguage: "French",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "20",
      highPrice: "40",
      priceCurrency: "TND",
      offerCount: packages.length,
      offers: packages.map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        description: pkg.description,
        price: pkg.price.replace(" TND", ""),
        priceCurrency: "TND",
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />
      <HomeHero />
      <HowItWorksSection />
      <HighlightsSection />
      <PackagesPreviewSection />
      <FaqSection />
      <ContactCtaSection />
    </>
  );
}