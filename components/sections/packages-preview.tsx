import Link from "next/link";

import { packages } from "@/lib/site-content";

import { PackageCard } from "@/components/package-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export function PackagesPreviewSection() {
  return (
    <section className="section-space" id="forfaits">
      <div className="container-shell space-y-6">
        <SectionHeading
          eyebrow="Nos forfaits"
          title="Les offres de lavage à domicile"
          description="Des tarifs fixes et simples : Basique à 20 TND, Standard à 30 TND et Premium à 40 TND. Choisissez votre formule et réservez en ligne."
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
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-slate-500 lg:hidden">
            Faites glisser pour découvrir les trois forfaits →
          </p>
          <Link href="/forfaits">
            <Button variant="outline">Voir tous les forfaits</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}