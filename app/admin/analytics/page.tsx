import type { Metadata } from "next";

import { AdminDashboard } from "@/components/admin-dashboard";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Analytics",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAnalyticsPage() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-8">
        <SectionHeading
          eyebrow="Analytics"
          title="Suivre les réservations et la demande"
          description="Cette page affiche une lecture simple de l'activité: volume total, statuts, répartition par forfait et dates les plus demandées."
        />
        <AdminDashboard initialView="analytics" />
      </div>
    </section>
  );
}
