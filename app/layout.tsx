import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

import { Footer } from "@/components/footer";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { Navbar } from "@/components/navbar";
import { JsonLd } from "@/components/seo/json-ld";
import { seoKeywords, siteUrl } from "@/lib/site-content";

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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
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
            description:
              "Service de lavage de voiture à domicile à Sousse et ses alentours, en Tunisie.",
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