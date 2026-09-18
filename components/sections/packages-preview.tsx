import { packages } from "@/lib/site-content";

import { PackageCard } from "@/components/package-card";
import { SectionHeading } from "@/components/section-heading";

export function PackagesPreviewSection() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Forfaits"
          title="Trois formules claires pour réserver vite"
          description="Des tarifs fixes et simples : Basique à 20 TND, Standard à 30 TND et Premium à 40 TND."
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
