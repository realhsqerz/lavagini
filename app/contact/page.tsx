import type { ComponentType, ReactNode } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { contactDetails } from "@/lib/site-content";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <section className="section-space">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionHeading
          eyebrow="Contact"
          title="Un accès direct pour réserver ou poser une question"
          description="La version actuelle met en avant les canaux les plus utiles sur mobile: appel et WhatsApp, avec l'email ajouté dès qu'il sera prêt."
        />
        <Card>
          <CardContent className="space-y-4 p-8">
            <ContactLine icon={Phone} label="Téléphone" href={contactDetails.phoneHref}>
              {contactDetails.phoneDisplay}
            </ContactLine>
            <ContactLine
              icon={MessageCircle}
              label="WhatsApp"
              href={contactDetails.whatsappHref}
            >
              {contactDetails.whatsappDisplay}
            </ContactLine>
            {contactDetails.email ? (
              <ContactLine
                icon={Mail}
                label="Email"
                href={`mailto:${contactDetails.email}`}
              >
                {contactDetails.email}
              </ContactLine>
            ) : (
              <ContactStatus icon={Mail} label="Email">
                {contactDetails.emailLabel}
              </ContactStatus>
            )}
            <div className="flex items-start gap-4 rounded-3xl bg-slate-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-accent">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Zone de service
                </p>
                <p className="mt-1 text-sm font-medium text-primary">
                  {contactDetails.serviceArea}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ContactLine({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-start gap-4 rounded-3xl bg-slate-50 p-4 transition hover:bg-slate-100"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-primary">{children}</p>
      </div>
    </a>
  );
}

function ContactStatus({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-3xl bg-slate-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-primary">{children}</p>
      </div>
    </div>
  );
}
