import { Sparkles } from "lucide-react";

import { highlights } from "@/lib/site-content";

import { SectionHeading } from "@/components/section-heading";

export function HighlightsSection() {
  return (
    <section className="section-space pt-0">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          eyebrow="Pourquoi nous choisir"
          title="Un service pensé pour les personnes qui n'ont pas le temps de se déplacer"
          description="Le positionnement est simple: venir à vous, garder un niveau de qualité professionnel, et rendre la réservation évidente depuis un téléphone."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item}
              className="surface flex items-center gap-3 p-5 text-sm font-medium text-primary"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
