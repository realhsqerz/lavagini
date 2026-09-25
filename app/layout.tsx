import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { Footer } from "@/components/footer";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { Navbar } from "@/components/navbar";
import { JsonLd } from "@/components/seo/json-ld";
import { contactDetails, seoKeywords, siteUrl } from "@/lib/site-content";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lavage de voiture à domicile en Tunisie | Lavagini",
    template: "%s | Lavagini",
  },
  description:
    "Lavage de voiture à domicile à Sousse et ses alentours, en Tunisie. Réservez en ligne un lavage auto mobile : extérieur, intérieur et complet, à partir de 20 TND.",
  keywords: seoKeywords,
  applicationName: "Lavagini",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Lavagini",
    title: "Lavage de voiture à domicile en Tunisie | Lavagini",
    description:
      "Réservez un lavage de voiture à domicile à Sousse et ses alentours. Extérieur, intérieur et complet à partir de 20 TND.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lavage de voiture à domicile en Tunisie — Lavagini",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lavage de voiture à domicile en Tunisie | Lavagini",
    description:
      "Réservez un lavage de voiture à domicile à Sousse et ses alentours. Extérieur, intérieur et complet à partir de 20 TND.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/apple-touch-icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Lavagini",
            url: siteUrl,
            inLanguage: "fr-FR",
            publisher: { "@id": `${siteUrl}/#organization` },
            description:
              "Service de lavage de voiture à domicile à Sousse et ses alentours, en Tunisie.",
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": ["Organization", "LocalBusiness"],
            "@id": `${siteUrl}/#organization`,
            name: contactDetails.brandName,
            url: siteUrl,
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/android-chrome-512x512.png`,
              width: 512,
              height: 512,
            },
            image: `${siteUrl}/android-chrome-512x512.png`,
            description:
              "Service de lavage de voiture mobile à Sousse, Sahline et Monastir, en Tunisie.",
            areaServed: [
              { "@type": "City", name: "Sousse" },
              { "@type": "City", name: "Sahline" },
              { "@type": "City", name: "Monastir" },
              { "@type": "Country", name: "Tunisie" },
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Sousse",
              addressRegion: "Sousse",
              addressCountry: "TN",
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: contactDetails.phoneHref,
                contactType: "customer service",
                areaServed: "TN",
                availableLanguage: ["fr", "ar"],
              },
            ],
          }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}