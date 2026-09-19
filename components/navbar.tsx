import Image from "next/image";
import Link from "next/link";

import { navigation } from "@/lib/site-content";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Lavagini"
            width={66}
            height={40}
            className="h-10 w-auto rounded-xl"
            priority
          />
          <div>
            <p className="text-sm font-semibold text-primary">Lavagini</p>
            <p className="text-xs text-slate-500">Service mobile à Sousse</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/reserver" className="hidden sm:block">
          <Button variant="secondary" size="sm">
            Réserver maintenant
          </Button>
        </Link>
      </div>
    </header>
  );
}
