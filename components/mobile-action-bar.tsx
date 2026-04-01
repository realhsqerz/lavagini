import { Phone, CalendarDays, MessageCircle } from "lucide-react";
import Link from "next/link";

import { contactDetails } from "@/lib/site-content";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-2xl sm:hidden">
      <div className="grid grid-cols-3">
        <a
          href={contactDetails.phoneHref}
          className="flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium text-primary"
        >
          <Phone className="h-4 w-4" />
          Appeler
        </a>
        <a
          href={contactDetails.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium text-primary"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <Link
          href="/reserver"
          className="flex flex-col items-center gap-1 bg-accent px-3 py-3 text-xs font-semibold text-white"
        >
          <CalendarDays className="h-4 w-4" />
          Réserver
        </Link>
      </div>
    </div>
  );
}
