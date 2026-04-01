"use client";

import type { ComponentType, Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { BarChart3, CalendarRange, CheckCircle2, ClipboardList, Trash2 } from "lucide-react";

import { AdminBookingUpdateValues, BookingRecord } from "@/lib/validation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type AdminAnalytics = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  packageCounts: Record<string, number>;
  upcomingDates: Array<{ date: string; count: number }>;
};

type AdminPayload = {
  message?: string;
  bookings?: BookingRecord[];
  analytics?: AdminAnalytics;
};

const emptyAnalytics: AdminAnalytics = {
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  packageCounts: {},
  upcomingDates: [],
};

export function AdminDashboard({
  initialView = "dashboard",
}: {
  initialView?: "dashboard" | "analytics";
}) {
  const [token, setToken] = useState("");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics>(emptyAnalytics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "analytics">(initialView);
  const [selectedId, setSelectedId] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formValues, setFormValues] = useState<AdminBookingUpdateValues | null>(null);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("lavage-admin-token");
    if (savedToken) {
      setToken(savedToken);
      void loadAdminData(savedToken, { restoreSession: true });
    }
  }, []);

  function applyPayload(payload: AdminPayload) {
    const nextBookings = payload.bookings ?? [];
    const nextAnalytics = payload.analytics ?? emptyAnalytics;

    setBookings(nextBookings);
    setAnalytics(nextAnalytics);

    if (!nextBookings.length) {
      setSelectedId("");
      setFormValues(null);
      return;
    }

    const current =
      nextBookings.find((booking) => booking.id === selectedId) ?? nextBookings[0];
    setSelectedId(current.id);
    setFormValues(toAdminForm(current));
  }

  async function loadAdminData(
    adminToken = token,
    options?: { restoreSession?: boolean },
  ) {
    setLoading(true);
    setError("");

    const response = await fetch("/api/bookings/admin", {
      headers: {
        "x-admin-token": adminToken,
      },
    });

    const payload = (await response.json()) as AdminPayload;

    setLoading(false);

    if (!response.ok) {
      setAuthenticated(false);
      setBookings([]);
      setAnalytics(emptyAnalytics);
      setSelectedId("");
      setFormValues(null);
      setError(payload.message ?? "Accès refusé.");
      window.localStorage.removeItem("lavage-admin-token");
      return;
    }

    setAuthenticated(true);
    setError("");
    setNotice(options?.restoreSession ? "Session administrateur restaurée." : "");
    window.localStorage.setItem("lavage-admin-token", adminToken);
    applyPayload(payload);
  }

  async function saveBooking() {
    if (!formValues) {
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    const response = await fetch("/api/bookings/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify(formValues),
    });

    const payload = (await response.json()) as AdminPayload;

    setSaving(false);

    if (!response.ok) {
      setError(payload.message ?? "Impossible d'enregistrer les modifications.");
      return;
    }

    applyPayload(payload);
    setNotice("Réservation mise à jour.");
  }

  async function deleteBooking() {
    if (!selectedId) {
      return;
    }

    const confirmed = window.confirm(
      "Supprimer cette réservation ? Cette action est définitive.",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");
    setNotice("");

    const response = await fetch(`/api/bookings/admin?id=${selectedId}`, {
      method: "DELETE",
      headers: {
        "x-admin-token": token,
      },
    });

    const payload = (await response.json()) as AdminPayload;

    setDeleting(false);

    if (!response.ok) {
      setError(payload.message ?? "Impossible de supprimer la réservation.");
      return;
    }

    applyPayload(payload);
    setNotice("Réservation supprimée.");
  }

  function logout() {
    setAuthenticated(false);
    setBookings([]);
    setAnalytics(emptyAnalytics);
    setSelectedId("");
    setFormValues(null);
    setNotice("");
    setError("");
    setToken("");
    window.localStorage.removeItem("lavage-admin-token");
  }

  return (
    <div className="space-y-6">
      {!authenticated ? (
        <Card>
          <CardHeader>
            <CardTitle>Accès administrateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Entrez le code d'accès"
            />
            <Button onClick={() => loadAdminData()} disabled={loading || !token}>
              {loading ? "Connexion..." : "Entrer dans le dashboard"}
            </Button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              icon={ClipboardList}
              label="Réservations"
              value={String(analytics.totalBookings)}
            />
            <StatCard
              icon={CalendarRange}
              label="En attente"
              value={String(analytics.pendingBookings)}
            />
            <StatCard
              icon={CheckCircle2}
              label="Confirmées"
              value={String(analytics.confirmedBookings)}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <Button
                variant={activeView === "dashboard" ? "default" : "outline"}
                onClick={() => setActiveView("dashboard")}
              >
                Gestion des réservations
              </Button>
              <Button
                variant={activeView === "analytics" ? "default" : "outline"}
                onClick={() => setActiveView("analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => loadAdminData()}>
                Actualiser
              </Button>
              <Button variant="ghost" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          </div>

          {notice ? (
            <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {activeView === "dashboard" ? (
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Réservations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bookings.map((booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(booking.id);
                        setFormValues(toAdminForm(booking));
                      }}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        selectedId === booking.id
                          ? "border-accent bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-primary">{booking.name}</p>
                          <p className="text-sm text-slate-600">{booking.phone}</p>
                        </div>
                        <StatusPill status={booking.status} />
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{booking.location}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {booking.package} · {booking.preferredDate} · {booking.preferredTime}
                      </p>
                    </button>
                  ))}
                  {!bookings.length ? (
                    <p className="text-sm text-slate-500">
                      Aucune réservation enregistrée pour le moment.
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Modifier la réservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {formValues ? (
                    <>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Nom">
                          <Input
                            value={formValues.name}
                            onChange={(event) =>
                              updateForm("name", event.target.value, setFormValues)
                            }
                          />
                        </Field>
                        <Field label="Téléphone">
                          <Input
                            value={formValues.phone}
                            onChange={(event) =>
                              updateForm("phone", event.target.value, setFormValues)
                            }
                          />
                        </Field>
                      </div>

                      <Field label="Adresse / localisation">
                        <Input
                          value={formValues.location}
                          onChange={(event) =>
                            updateForm("location", event.target.value, setFormValues)
                          }
                        />
                      </Field>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Type de voiture">
                          <Input
                            value={formValues.carType}
                            onChange={(event) =>
                              updateForm("carType", event.target.value, setFormValues)
                            }
                          />
                        </Field>
                        <Field label="Forfait">
                          <Input
                            value={formValues.package}
                            onChange={(event) =>
                              updateForm("package", event.target.value, setFormValues)
                            }
                          />
                        </Field>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Date souhaitée">
                          <Input
                            type="date"
                            value={formValues.preferredDate}
                            onChange={(event) =>
                              updateForm("preferredDate", event.target.value, setFormValues)
                            }
                          />
                        </Field>
                        <Field label="Heure souhaitée">
                          <Input
                            type="time"
                            value={formValues.preferredTime}
                            onChange={(event) =>
                              updateForm("preferredTime", event.target.value, setFormValues)
                            }
                          />
                        </Field>
                      </div>

                      <Field label="Statut">
                        <Select
                          value={formValues.status}
                          onChange={(event) =>
                            updateForm(
                              "status",
                              event.target.value as AdminBookingUpdateValues["status"],
                              setFormValues,
                            )
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                        </Select>
                      </Field>

                      <Field label="Notes supplémentaires">
                        <Textarea
                          value={formValues.notes ?? ""}
                          onChange={(event) =>
                            updateForm("notes", event.target.value, setFormValues)
                          }
                        />
                      </Field>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button onClick={saveBooking} disabled={saving}>
                          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={deleteBooking}
                          disabled={deleting}
                          className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deleting ? "Suppression..." : "Supprimer la réservation"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Sélectionnez une réservation pour la modifier.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par forfait</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(analytics.packageCounts).map(([pkg, count]) => (
                    <AnalyticsRow key={pkg} label={pkg} value={count} />
                  ))}
                  {!Object.keys(analytics.packageCounts).length ? (
                    <p className="text-sm text-slate-500">
                      Pas encore assez de données pour afficher les forfaits.
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dates demandées à venir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analytics.upcomingDates.map((entry) => (
                    <AnalyticsRow
                      key={entry.date}
                      label={entry.date}
                      value={entry.count}
                    />
                  ))}
                  {!analytics.upcomingDates.length ? (
                    <p className="text-sm text-slate-500">
                      Aucune date demandée n'est disponible pour le moment.
                    </p>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Lecture rapide</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <Insight
                    title="Charge totale"
                    text={`${analytics.totalBookings} réservation(s) enregistrée(s) depuis le lancement.`}
                  />
                  <Insight
                    title="Suivi commercial"
                    text={`${analytics.pendingBookings} réservation(s) sont encore à confirmer.`}
                  />
                  <Insight
                    title="Exécution"
                    text={`${analytics.confirmedBookings} réservation(s) ont déjà été marquées comme confirmées.`}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function toAdminForm(booking: BookingRecord): AdminBookingUpdateValues {
  return {
    id: booking.id,
    name: booking.name,
    phone: booking.phone,
    location: booking.location,
    carType: booking.carType,
    package: booking.package,
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
    notes: booking.notes ?? "",
    status: booking.status,
  };
}

function updateForm<K extends keyof AdminBookingUpdateValues>(
  key: K,
  value: AdminBookingUpdateValues[K],
  setFormValues: Dispatch<SetStateAction<AdminBookingUpdateValues | null>>,
) {
  setFormValues((current) => (current ? { ...current, [key]: value } : current));
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-primary">{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusPill({ status }: { status: BookingRecord["status"] }) {
  const classes =
    status === "confirmed"
      ? "bg-green-50 text-green-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${classes}`}>
      {status}
    </span>
  );
}

function AnalyticsRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-700">{label}</span>
      <span className="text-sm font-semibold text-primary">{value}</span>
    </div>
  );
}

function Insight({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-5">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
