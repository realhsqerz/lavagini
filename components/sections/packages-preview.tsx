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
          description="Les prix restent affichés en fourchette pour vous laisser de la souplesse selon le type de véhicule et l'état général."
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
