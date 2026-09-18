import type { Metadata } from "next";
import { Suspense } from "react";

import { BookingForm } from "@/components/booking-form";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Réserver un lavage de voiture à domicile",
  description:
    "Réservez en ligne votre lavage de voiture à domicile à Sousse et ses alentours en Tunisie. Choisissez votre voiture, votre forfait, votre adresse et votre créneau, nous vous rappelons pour confirmer.",
  alternates: {
    canonical: "/reserver",
  },
};

export default function BookingPage() {
  return (
    <section className="section-space">
      <div className="container-shell max-w-3xl">
        <div className="mb-8 flex justify-center">
          <SectionHeading
            eyebrow="Réservation"
            title="Réservez votre lavage en quelques étapes"
            description="Votre voiture, votre offre, votre adresse et votre créneau. Un récapitulatif confirme vos choix, puis nous vous rappelons pour valider le rendez-vous."
          />
        </div>

        <Suspense
          fallback={<div className="surface p-6 sm:p-8">Chargement du formulaire...</div>}
        >
          <div className="surface p-5 sm:p-8">
            <BookingForm />
          </div>
        </Suspense>
      </div>
    </section>
  );
}