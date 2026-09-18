import type { Metadata } from "next";

import { packages } from "@/lib/site-content";

import { PackageCard } from "@/components/package-card";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Forfaits lavage de voiture à domicile : 20, 30 et 40 TND",
  description:
    "Forfaits de lavage de voiture à domicile en Tunisie : Basique 20 TND, Standard 30 TND, Premium 40 TND. Réservation en ligne à Sousse et ses alentours.",
  alternates: {
    canonical: "/forfaits",
  },
};

export default function PackagesPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Forfaits"
          title="Des prix lisibles et des niveaux de service clairs"
          description="Trois formules à tarif fixe : Basique à 20 TND, Standard à 30 TND et Premium à 40 TND."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}
