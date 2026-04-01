import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { getAdminDb } from "@/lib/firebase-admin";
import { packages } from "@/lib/site-content";
import { bookingSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = bookingSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Données invalides." },
        { status: 400 },
      );
    }

    const packageName =
      packages.find((pkg) => pkg.id === parsed.data.package)?.name ?? parsed.data.package;

    await getAdminDb().collection("bookings").add({
      ...parsed.data,
      package: packageName,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible d'enregistrer la réservation.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
