import { NextResponse } from "next/server";

import { getAdminDb } from "@/lib/firebase-admin";
import { adminBookingUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const adminToken = request.headers.get("x-admin-token");
  return !!process.env.ADMIN_ACCESS_TOKEN && adminToken === process.env.ADMIN_ACCESS_TOKEN;
}

function bookingFromDoc(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = doc.data();
  const createdAt =
    typeof data.createdAt?.toDate === "function"
      ? data.createdAt.toDate().toISOString()
      : new Date().toISOString();

  return {
    id: doc.id,
    name: data.name ?? "",
    phone: data.phone ?? "",
    location: data.location ?? "",
    carType: data.carType ?? "",
    package: data.package ?? "",
    preferredDate: data.preferredDate ?? "",
    preferredTime: data.preferredTime ?? "",
    notes: data.notes ?? "",
    status: data.status ?? "pending",
    createdAt,
  };
}

function buildAnalytics(bookings: ReturnType<typeof bookingFromDoc>[]) {
  const packageCounts = bookings.reduce<Record<string, number>>((accumulator, booking) => {
    accumulator[booking.package] = (accumulator[booking.package] ?? 0) + 1;
    return accumulator;
  }, {});

  const statusCounts = bookings.reduce<Record<string, number>>((accumulator, booking) => {
    accumulator[booking.status] = (accumulator[booking.status] ?? 0) + 1;
    return accumulator;
  }, {});

  const bookingsByDate = bookings.reduce<Record<string, number>>((accumulator, booking) => {
    accumulator[booking.preferredDate] = (accumulator[booking.preferredDate] ?? 0) + 1;
    return accumulator;
  }, {});

  const upcomingDates = Object.entries(bookingsByDate)
    .filter(([date]) => !!date)
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(0, 7)
    .map(([date, count]) => ({ date, count }));

  return {
    totalBookings: bookings.length,
    pendingBookings: statusCounts.pending ?? 0,
    confirmedBookings: statusCounts.confirmed ?? 0,
    packageCounts,
    upcomingDates,
  };
}

async function fetchAdminPayload() {
  const snapshot = await getAdminDb()
    .collection("bookings")
    .orderBy("createdAt", "desc")
    .get();

  const bookings = snapshot.docs.map(bookingFromDoc);

  return {
    bookings,
    analytics: buildAnalytics(bookings),
  };
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 401 });
    }

    return NextResponse.json(await fetchAdminPayload());
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de récupérer les réservations.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 401 });
    }

    const payload = await request.json();
    const parsed = adminBookingUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Données invalides." },
        { status: 400 },
      );
    }

    const { id, ...booking } = parsed.data;

    await getAdminDb().collection("bookings").doc(id).set(booking, { merge: true });

    return NextResponse.json(await fetchAdminPayload());
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de modifier la réservation.";

    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Accès refusé." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Réservation introuvable." }, { status: 400 });
    }

    await getAdminDb().collection("bookings").doc(id).delete();

    return NextResponse.json(await fetchAdminPayload());
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de supprimer la réservation.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
