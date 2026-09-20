import { NextResponse } from "next/server";

import { getAdminDb } from "@/lib/firebase-admin";
import { normalizePhone } from "@/lib/phone";
import { adminBookingUpdateSchema, adminClientUpdateSchema } from "@/lib/validation";

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

function clientFromDoc(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = doc.data();
  const toIso = (value: unknown) => {
    const timestamp = value as { toDate?: () => Date };
    return typeof timestamp?.toDate === "function"
      ? timestamp.toDate().toISOString()
      : new Date().toISOString();
  };

  return {
    id: doc.id,
    name: data.name ?? "",
    phone: data.phone ?? "",
    secondaryPhone: typeof data.secondaryPhone === "string" ? data.secondaryPhone : "",
    bookingsCount: typeof data.bookingsCount === "number" ? data.bookingsCount : 0,
    firstConfirmedAt: toIso(data.firstConfirmedAt ?? new Date()),
    lastConfirmedAt: toIso(data.lastConfirmedAt ?? new Date()),
  };
}

async function confirmedBookingsForPhone(phone: string) {
  const db = getAdminDb();
  const normalized = normalizePhone(phone);
  const exact = await db.collection("bookings").where("phone", "==", phone).get();
  const keyed = await db.collection("bookings").where("phoneKey", "==", normalized).get();

  const seen = new Set<string>();
  const bookings = [];

  for (const doc of [...exact.docs, ...keyed.docs]) {
    if (seen.has(doc.id)) {
      continue;
    }
    seen.add(doc.id);
    const booking = bookingFromDoc(doc);
    if (booking.status === "confirmed" && normalizePhone(booking.phone) === normalized) {
      bookings.push(booking);
    }
  }

  bookings.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  return bookings;
}

async function syncClient(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return;
  }

  const db = getAdminDb();
  const confirmedBookings = await confirmedBookingsForPhone(phone);
  const existing = await db.collection("clients").where("phone", "==", normalized).limit(1).get();

  if (!confirmedBookings.length) {
    const batch = db.batch();
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    return;
  }

  const firstConfirmedAt = confirmedBookings[0].createdAt;
  const lastConfirmedAt = confirmedBookings[confirmedBookings.length - 1].createdAt;
  const newest = confirmedBookings[confirmedBookings.length - 1];
  const updatedAt = new Date();

  const existingFirst =
    existing.docs[0]?.data()?.firstConfirmedAt;
  const existingFirstIso =
    typeof existingFirst?.toDate === "function"
      ? existingFirst.toDate().toISOString()
      : typeof existingFirst === "string"
        ? existingFirst
        : null;

  const data = {
    name: newest.name,
    phone: normalized,
    bookingsCount: confirmedBookings.length,
    firstConfirmedAt: existingFirstIso && existingFirstIso < firstConfirmedAt
      ? existingFirstIso
      : firstConfirmedAt,
    lastConfirmedAt,
    updatedAt,
  };

  if (existing.docs[0]) {
    await existing.docs[0].ref.set(data, { merge: true });
  } else {
    await db.collection("clients").add(data);
  }
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
  const db = getAdminDb();
  const [bookingsSnapshot, clientsSnapshot] = await Promise.all([
    db.collection("bookings").orderBy("createdAt", "desc").get(),
    db.collection("clients").orderBy("lastConfirmedAt", "desc").get(),
  ]);

  const bookings = bookingsSnapshot.docs.map(bookingFromDoc);
  const clients = clientsSnapshot.docs.map(clientFromDoc);

  return {
    bookings,
    clients,
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

    if (typeof payload?.clientId === "string") {
      const clientParsed = adminClientUpdateSchema.safeParse(payload);
      if (!clientParsed.success) {
        return NextResponse.json(
          { message: clientParsed.error.issues[0]?.message ?? "Données client invalides." },
          { status: 400 },
        );
      }

      const { clientId, ...clientUpdate } = clientParsed.data;
      const data = {
        ...clientUpdate,
        updatedAt: new Date(),
      };
      await getAdminDb().collection("clients").doc(clientId).set(data, { merge: true });

      return NextResponse.json(await fetchAdminPayload());
    }

    const parsed = adminBookingUpdateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Données invalides." },
        { status: 400 },
      );
    }

    const { id, ...booking } = parsed.data;
    const ref = getAdminDb().collection("bookings").doc(id);
    const beforeDoc = await ref.get();
    const oldPhone = beforeDoc.data()?.phone as string | undefined;

    await ref.set(booking, { merge: true });

    await syncClient(booking.phone);
    if (oldPhone && normalizePhone(oldPhone) !== normalizePhone(booking.phone)) {
      await syncClient(oldPhone);
    }

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

    const ref = getAdminDb().collection("bookings").doc(id);
    const beforeDoc = await ref.get();

    await ref.delete();

    if (beforeDoc.data()?.phone) {
      await syncClient(beforeDoc.data()?.phone as string);
    }

    return NextResponse.json(await fetchAdminPayload());
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de supprimer la réservation.";

    return NextResponse.json({ message }, { status: 500 });
  }
}
