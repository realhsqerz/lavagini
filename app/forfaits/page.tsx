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
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:p-0">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="w-[82vw] shrink-0 snap-center sm:w-[400px] lg:w-auto lg:shrink"
            >
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-500 lg:hidden">
          Faites glisser pour découvrir les trois forfaits →
        </p>
      </div>
    </section>
  );
}
