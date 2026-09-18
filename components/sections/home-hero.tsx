import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

import { contactDetails, packages } from "@/lib/site-content";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  const featured = packages.find((pkg) => pkg.featured);

  return (
    <section className="overflow-hidden">
      <div className="container-shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
        <div className="space-y-6">
          <Badge>Lavage auto mobile en Tunisie · Sousse et alentours</Badge>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-primary sm:text-5xl">
              Lavage de voiture à domicile en Tunisie
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Nous venons directement à votre maison, votre bureau ou votre parking pour
              nettoyer votre voiture avec un service professionnel, à Sousse et ses
              alentours.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/reserver">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Réserver maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href={contactDetails.phoneHref}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Phone className="mr-2 h-4 w-4" />
                Appeler maintenant
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {packages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/reserver?forfait=${pkg.id}`}
                className="rounded-2xl border border-slate-200 bg-white px-2 py-3 text-center transition hover:border-accent hover:bg-blue-50"
              >
                <p className="text-xs text-slate-500">{pkg.name}</p>
                <p className="mt-1 text-sm font-bold text-primary sm:text-base">
                  {pkg.price}
                </p>
              </Link>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {[
              "Déplacement à domicile",
              "Confirmation par téléphone",
              "Réservation en moins de 2 minutes",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-700 sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="surface bg-hero-glow p-5 sm:p-8">
          {featured ? (
            <div className="rounded-[1.5rem] bg-primary p-6 text-white sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-blue-200">
                    Forfait conseillé
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{featured.name}</p>
                </div>
                <p className="rounded-full bg-green-400/20 px-3 py-1 text-sm font-semibold text-green-300">
                  {featured.price}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                {featured.features.slice(0, 3).join(", ")} et plus encore.
              </p>
              <Link href={`/reserver?forfait=${featured.id}`} className="mt-5 block">
                <Button
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-slate-100"
                >
                  Choisir le {featured.name}
                </Button>
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/8 p-4">
                  <p className="text-2xl font-semibold">7j/7</p>
                  <p className="mt-1 text-xs text-slate-200">Créneaux à confirmer</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-4">
                  <p className="text-2xl font-semibold">Sousse</p>
                  <p className="mt-1 text-xs text-slate-200">Et ses alentours</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}