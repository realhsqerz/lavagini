import { packages } from "@/lib/site-content";

import { PackageCard } from "@/components/package-card";
import { SectionHeading } from "@/components/section-heading";

export default function PackagesPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Forfaits"
          title="Des prix lisibles et des niveaux de service clairs"
          description="Le premier lancement reste volontairement simple avec trois formules. Vous pourrez ajuster les fourchettes de prix dès que vous aurez vos tarifs définitifs."
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
