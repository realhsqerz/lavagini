import Image from "next/image";
import Link from "next/link";

import { contactDetails, navigation } from "@/lib/site-content";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-shell grid gap-10 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-mark.svg"
              alt={contactDetails.brandName}
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl"
            />
            <p className="text-lg font-semibold text-primary">{contactDetails.brandName}</p>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            Lavage de voiture à domicile pour les particuliers et professionnels à Sfax
            et ses alentours.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </p>
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-slate-600 transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-primary">Contact</p>
          <a href={contactDetails.phoneHref} className="block hover:text-accent">
            {contactDetails.phoneDisplay}
          </a>
          <a href={contactDetails.whatsappHref} className="block hover:text-accent">
            WhatsApp
          </a>
          {contactDetails.email ? (
            <a href={`mailto:${contactDetails.email}`} className="block hover:text-accent">
              {contactDetails.email}
            </a>
          ) : (
            <span className="block text-slate-500">{contactDetails.emailLabel}</span>
          )}
          <p>{contactDetails.serviceArea}</p>
        </div>
      </div>
    </footer>
  );
}
