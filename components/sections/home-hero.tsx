import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

import { contactDetails } from "@/lib/site-content";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="overflow-hidden">
      <div className="container-shell section-space grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <Badge>Service mobile à Sousse</Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              Lavage de voiture à domicile
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Nous venons directement à votre maison ou votre bureau pour nettoyer
              votre voiture avec un service professionnel.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/reserver">
              <Button variant="secondary" size="lg">
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href={contactDetails.phoneHref}>
              <Button variant="outline" size="lg">
                <Phone className="mr-2 h-4 w-4" />
                Appeler maintenant
              </Button>
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Déplacement à domicile",
              "Confirmation par téléphone",
              "Réservation en moins de 2 minutes",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="surface bg-hero-glow p-6 sm:p-8">
          <div className="rounded-[2rem] bg-primary p-6 text-white sm:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-blue-200">
              Simple et pratique
            </p>
            <div className="mt-8 space-y-6">
              <div className="rounded-3xl bg-white/8 p-5">
                <p className="text-sm text-blue-100">Forfait conseillé</p>
                <p className="mt-2 text-2xl font-semibold">Standard</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Lavage extérieur, aspirateur intérieur, vitres et brillance pneus.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white/8 p-5">
                  <p className="text-3xl font-semibold">7j/7</p>
                  <p className="mt-2 text-sm text-slate-200">Créneaux à confirmer</p>
                </div>
                <div className="rounded-3xl bg-white/8 p-5">
                  <p className="text-3xl font-semibold">Sousse</p>
                  <p className="mt-2 text-sm text-slate-200">Et ses alentours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
