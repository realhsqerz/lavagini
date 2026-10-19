import { redirect } from "next/navigation";

import { whatsappReservationLink } from "@/lib/site-content";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ forfait?: string }>;
}) {
  const { forfait } = await searchParams;

  redirect(whatsappReservationLink(forfait));
}
