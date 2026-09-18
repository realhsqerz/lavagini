import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "À propos de notre service de lavage mobile",
  description:
    "Le service mobile de lavage de voiture à domicile en Tunisie, à Sousse et ses alentours : nous nous déplaçons jusqu'à vous pour un lavage rapide et professionnel.",
  alternates: {
    canonical: "/a-propos",
  },
};

export default function AboutPage() {
  return (
    <section className="section-space">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeading
          eyebrow="À propos"
          title="Un service mobile conçu pour supprimer le déplacement inutile"
          description="Nous sommes un service de lavage de voiture mobile qui permet aux clients de nettoyer leur voiture sans se déplacer. Notre équipe se rend directement à votre domicile, votre bureau ou votre parking pour offrir un service rapide et professionnel."
        />
        <Card>
          <CardContent className="space-y-4 p-8 text-sm leading-7 text-slate-600">
            <p>
              Le concept est pensé pour les personnes qui veulent un véhicule propre
              sans perdre du temps dans une station de lavage.
            </p>
            <p>
              Le premier objectif du site est simple: présenter clairement les services,
              afficher des forfaits lisibles et convertir rapidement en réservation.
            </p>
            <p>
              La validation finale est gérée par téléphone afin de confirmer la zone,
              l'accès, le créneau et les éventuelles contraintes du véhicule.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
