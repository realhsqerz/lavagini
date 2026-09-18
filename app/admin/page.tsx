import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin-dashboard";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Administration",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeading
          eyebrow="Admin"
          title="Gérer les réservations et suivre l'activité"
          description="Entrez le code d'accès pour ouvrir le dashboard administrateur, modifier ou supprimer les réservations, puis consulter une vue analytics simple."
        />
        <AdminDashboard />
      </div>
    </section>
  );
}
