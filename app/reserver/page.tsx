import type { ComponentType } from "react";
import { Suspense } from "react";
import { CalendarDays, Clock3, PhoneCall } from "lucide-react";

import { contactDetails } from "@/lib/site-content";

import { BookingForm } from "@/components/booking-form";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingPage() {
  return (
    <section className="section-space">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Réservation"
            title="Réservez votre lavage et nous vous rappelons pour confirmer"
            description="Le formulaire collecte juste les informations utiles pour organiser l'intervention. La confirmation finale se fait toujours par téléphone."
          />

          <Card>
            <CardHeader>
              <CardTitle>Avant de valider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <Info icon={CalendarDays} text="Choisissez votre date souhaitée." />
              <Info icon={Clock3} text="Proposez une heure approximative." />
              <Info
                icon={PhoneCall}
                text={`Notre équipe vous rappelle au ${contactDetails.phoneDisplay} pour confirmer.`}
              />
            </CardContent>
          </Card>
        </div>

        <Suspense
          fallback={<div className="surface p-6 sm:p-8">Chargement du formulaire...</div>}
        >
          <div className="surface p-6 sm:p-8">
            <BookingForm />
          </div>
        </Suspense>
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-accent">
        <Icon className="h-4 w-4" />
      </div>
      <p className="leading-6">{text}</p>
    </div>
  );
}
