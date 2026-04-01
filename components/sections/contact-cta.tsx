import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { contactDetails } from "@/lib/site-content";

import { Button } from "@/components/ui/button";

export function ContactCtaSection() {
  return (
    <section className="section-space pt-0">
      <div className="container-shell">
        <div className="overflow-hidden rounded-3xl border border-slate-800 !bg-[#0F172A] p-8 text-white shadow-soft sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.18em] !text-white/80">
                Besoin d'un rendez-vous rapide
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Réservez en ligne ou contactez-nous directement
              </h2>
              <p className="max-w-2xl text-sm leading-7 !text-slate-100">
                Pour un besoin urgent, un accès parking particulier ou une demande
                professionnelle, vous pouvez nous appeler ou nous écrire sur WhatsApp.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={contactDetails.phoneHref}>
                <Button variant="outline" className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </Button>
              </a>
              <a href={contactDetails.whatsappHref} target="_blank" rel="noreferrer">
                <Button className="w-full bg-success text-white hover:bg-emerald-600">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
              <Link href="/reserver">
                <Button className="w-full bg-white text-primary hover:bg-slate-100">
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
