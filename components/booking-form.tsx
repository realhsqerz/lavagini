"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  Clock3,
  Loader2,
  MapPin,
  Sun,
  Sunset,
  User,
} from "lucide-react";

import { carModels, formatCarType, formatTimeSlot, packages, timeSlots } from "@/lib/site-content";
import { BookingFormValues, bookingSchema } from "@/lib/validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { AppointmentCalendar } from "@/components/appointment-calendar";
import type { MapPosition } from "@/components/map-picker";

const CarModelViewer = dynamic(
  () => import("@/components/car-model-viewer").then((mod) => mod.CarModelViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    ),
  },
);

const MapPicker = dynamic(() => import("@/components/map-picker").then((mod) => mod.MapPicker), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
      <Loader2 className="h-6 w-6 animate-spin text-accent" />
    </div>
  ),
});

const steps = [
  {
    id: "identity",
    title: "Vos informations",
    short: "Informations",
    description: "Comment pouvons-nous vous appeler pour confirmer le rendez-vous ?",
    icon: User,
  },
  {
    id: "car",
    title: "Votre voiture",
    short: "Voiture",
    description: "Sélectionnez le type de véhicule à laver, avec son aperçu 3D.",
    icon: Car,
  },
  {
    id: "offer",
    title: "Choisissez l'offre",
    short: "Offre",
    description: "Une formule simple, au tarif fixe, adaptée à votre voiture.",
    icon: Check,
  },
  {
    id: "location",
    title: "Votre adresse",
    short: "Adresse",
    description: "Où devons-nous nous déplacer ? Vous pouvez taper l'adresse ou la repérer sur la carte.",
    icon: MapPin,
  },
  {
    id: "datetime",
    title: "Date & heure",
    short: "Créneau",
    description: "Choisissez votre jour et votre créneau : matin à 10h00 ou après-midi à 14h00.",
    icon: Clock3,
  },
] as const;

export function BookingForm() {
  const searchParams = useSearchParams();
  const selectedPackage = searchParams.get("forfait");
  const [step, setStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [carId, setCarId] = useState("");
  const [carError, setCarError] = useState("");
  const [offerError, setOfferError] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [timeError, setTimeError] = useState("");
  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const navTimeRef = useRef(0);

  const defaultPackage = useMemo(() => {
    if (selectedPackage && packages.some((pkg) => pkg.id === selectedPackage)) {
      return selectedPackage;
    }
    return "standard";
  }, [selectedPackage]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      carType: "",
      package: defaultPackage,
      preferredDate: "",
      preferredTime: "",
      notes: "",
    },
  });

  const selectedOffer = packages.find((pkg) => pkg.id === form.watch("package"));

  function handlePositionChange(position: MapPosition, address: string) {
    setMapPosition(position);
    if (address) {
      form.setValue("location", address, { shouldValidate: true });
    }
  }

  async function goNext() {
    const now = Date.now();
    if (now - navTimeRef.current < 300) {
      return;
    }

    let valid = true;

    if (step === 0) {
      valid = await form.trigger(["name", "phone"]);
    } else if (step === 1) {
      if (!carId) {
        setCarError("Choisissez d'abord votre type de voiture.");
        valid = false;
      } else {
        const car = carModels.find((model) => model.id === carId);
        form.setValue("carType", car ? car.label : formatCarType(carId), {
          shouldValidate: true,
        });
      }
    } else if (step === 2) {
      valid = form.getValues("package").length > 0;
      setOfferError(valid ? "" : "Choisissez une offre pour continuer.");
    } else if (step === 3) {
      valid = await form.trigger(["location"]);
    } else if (step === 4) {
      valid = await form.trigger(["preferredDate"]);
      if (!timeSlotId) {
        setTimeError("Choisissez une tranche horaire (matin ou après-midi).");
        valid = false;
      } else {
        setTimeError("");
        form.setValue("preferredTime", formatTimeSlot(timeSlotId), {
          shouldValidate: true,
        });
      }
    }

    if (!valid) {
      return;
    }

    navTimeRef.current = Date.now();
    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    navTimeRef.current = Date.now();
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: BookingFormValues) {
    if (Date.now() - navTimeRef.current < 300) {
      return;
    }

    setSubmitError("");
    setSuccessMessage("");

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setSubmitError(payload.message ?? "Une erreur est survenue.");
      return;
    }

    setSuccessMessage(
      "Merci pour votre réservation. Notre équipe vous contactera bientôt pour confirmer votre rendez-vous.",
    );
    form.reset({
      name: "",
      phone: "",
      location: "",
      carType: "",
      package: defaultPackage,
      preferredDate: "",
      preferredTime: "",
      notes: "",
    });
    setCarId("");
    setTimeSlotId("");
    setMapPosition(null);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const values = form.getValues();

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      }}
    >
      {successMessage ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700">
          {successMessage}
        </div>
      ) : null}

      {submitError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      {!successMessage ? (
        <>
          {step <= 4 ? <Stepper current={step} /> : null}

          <StepTitle
            step={step === 5 ? 6 : step + 1}
            title={step === 5 ? "Confirmez votre réservation" : steps[step].title}
            description={
              step === 5
                ? "Vérifiez le récapitulatif ci-dessous, puis confirmez. L'équipe vous rappelle pour valider."
                : steps[step].description
            }
          />

          {step === 0 ? (
            <IdentityStep form={form} />
          ) : step === 1 ? (
            <CarStep
              carId={carId}
              carError={carError}
              onSelect={(id) => {
                setCarId(id);
                setCarError("");
              }}
            />
          ) : step === 2 ? (
            <OfferStep
              selected={selectedOffer?.id ?? ""}
              offerError={offerError}
              onSelect={(id) => {
                form.setValue("package", id);
                setOfferError("");
              }}
            />
          ) : step === 3 ? (
            <LocationStep
              form={form}
              mapPosition={mapPosition}
              onPositionChange={handlePositionChange}
            />
          ) : step === 4 ? (
            <DateTimeStep
              form={form}
              timeSlotId={timeSlotId}
              timeError={timeError}
              onSelectSlot={(id) => {
                setTimeSlotId(id);
                setTimeError("");
              }}
            />
          ) : (
            <Receipt values={values} />
          )}

          {step <= 4 ? (
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <Button type="button" onClick={goNext}>
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
                className="order-2 sm:order-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Modifier mes informations
              </Button>
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="order-1 sm:order-2"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    Confirmer la réservation
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : null}
    </form>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((item, index) => {
        const Icon = item.icon;
        const done = index < current;
        const active = index === current;
        return (
          <div key={item.id} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                done
                  ? "bg-accent text-white"
                  : active
                    ? "bg-accent text-white ring-4 ring-blue-100"
                    : "border border-slate-300 bg-white text-slate-400"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            <span
              className={`hidden text-[11px] sm:block ${
                active ? "font-semibold text-primary" : "text-slate-400"
              }`}
            >
              {item.short}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StepTitle({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Étape {step.toString().padStart(2, "0")}
      </p>
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function IdentityStep({
  form,
}: {
  form: ReturnType<typeof useForm<BookingFormValues>>;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Nom complet" error={form.formState.errors.name?.message}>
        <Input placeholder="Votre nom" {...form.register("name")} />
      </Field>
      <Field label="Numéro de téléphone" error={form.formState.errors.phone?.message}>
        <Input type="tel" placeholder="+216 ..." {...form.register("phone")} />
      </Field>
    </div>
  );
}

function CarStep({
  carId,
  carError,
  onSelect,
}: {
  carId: string;
  carError: string;
  onSelect: (id: string) => void;
}) {
  const selected = carModels.find((car) => car.id === carId);

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3">
        {carModels.map((car) => {
          const active = car.id === carId;
          return (
            <button
              key={car.id}
              type="button"
              onClick={() => onSelect(car.id)}
              className={`flex w-[70vw] shrink-0 snap-center flex-col items-start rounded-2xl border p-4 text-left transition sm:w-auto lg:w-auto ${
                active
                  ? "border-accent bg-blue-50 ring-2 ring-accent/20"
                  : "border-slate-200 bg-white hover:border-accent/50"
              }`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                <Car className="h-5 w-5" />
              </div>
              <p className="mt-3 font-semibold text-primary">{car.label}</p>
              {active ? (
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-accent">
                  <Check className="h-3.5 w-3.5" /> Sélectionné
                </p>
              ) : null}
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="surface overflow-hidden">
          <CarModelViewer key={selected.id} src={selected.file} alt={`Aperçu 3D — ${selected.label}`} />
          <p className="border-t border-slate-100 p-3 text-center text-xs text-slate-500">
            Aperçu 3D d'illustration — {selected.label}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          Choisissez un type de voiture pour voir son aperçu 3D.
        </div>
      )}

      {carError ? <p className="text-sm text-red-600">{carError}</p> : null}
    </div>
  );
}

function OfferStep({
  selected,
  offerError,
  onSelect,
}: {
  selected: string;
  offerError: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {packages.map((pkg) => {
        const active = pkg.id === selected;
        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onSelect(pkg.id)}
            className={`w-full rounded-2xl border p-5 text-left transition ${
              active
                ? "border-accent bg-blue-50 ring-2 ring-accent/20"
                : "border-slate-200 bg-white hover:border-accent/50"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-primary">{pkg.name}</p>
                  {pkg.featured ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
                      Conseillé
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-slate-500">{pkg.description}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {pkg.features.slice(0, 3).join(" · ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{pkg.price}</p>
                {active ? (
                  <p className="mt-1 flex items-center justify-end gap-1 text-xs font-semibold text-accent">
                    <Check className="h-3.5 w-3.5" /> Sélectionné
                  </p>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
      {offerError ? <p className="text-sm text-red-600">{offerError}</p> : null}
    </div>
  );
}

function LocationStep({
  form,
  mapPosition,
  onPositionChange,
}: {
  form: ReturnType<typeof useForm<BookingFormValues>>;
  mapPosition: MapPosition | null;
  onPositionChange: (position: MapPosition, address: string) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Adresse / localisation"
        error={form.formState.errors.location?.message}
        hint="L'adresse est remplie automatiquement quand vous placez le repère sur la carte."
      >
        <Input
          placeholder="Ex : Rue de la Liberté, Sousse"
          {...form.register("location")}
        />
      </Field>

      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Position sur la carte</p>
        <MapPicker position={mapPosition} onPositionChange={onPositionChange} />
      </div>

      <Field label="Notes supplémentaires" error={form.formState.errors.notes?.message}>
        <Textarea
          placeholder="Accès parking, état du véhicule, consignes..."
          {...form.register("notes")}
        />
      </Field>
    </div>
  );
}

function DateTimeStep({
  form,
  timeSlotId,
  timeError,
  onSelectSlot,
}: {
  form: ReturnType<typeof useForm<BookingFormValues>>;
  timeSlotId: string;
  timeError: string;
  onSelectSlot: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Date souhaitée" error={form.formState.errors.preferredDate?.message}>
        <AppointmentCalendar
          value={form.watch("preferredDate")}
          onChange={(iso) =>
            form.setValue("preferredDate", iso, { shouldValidate: true })
          }
        />
      </Field>

      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Tranche horaire</p>
        <div className="grid grid-cols-2 gap-3">
          {timeSlots.map((slot) => {
            const active = slot.id === timeSlotId;
            const Icon = slot.id === "matin" ? Sun : Sunset;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-accent bg-blue-50 ring-2 ring-accent/20"
                    : "border-slate-200 bg-white hover:border-accent/50"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-semibold text-primary">{slot.label}</p>
                <p className="mt-1 text-xs text-slate-500">{slot.description}</p>
                {active ? (
                  <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-accent">
                    <Check className="h-3.5 w-3.5" /> Sélectionné
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
        {timeError ? <p className="text-sm text-red-600">{timeError}</p> : null}
      </div>
    </div>
  );
}

function Receipt({ values }: { values: BookingFormValues }) {
  const offer = packages.find((pkg) => pkg.id === values.package);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="bg-primary px-6 py-4 text-white">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-200">
          Récapitulatif
        </p>
        <p className="mt-1 font-semibold">Votre réservation de lavage</p>
      </div>
      <div className="space-y-0 p-6">
        <Row label="Nom" value={values.name} />
        <Row label="Téléphone" value={values.phone} />
        <Row label="Voiture" value={values.carType} />
        <Row
          label="Offre"
          value={offer ? `${offer.name} — ${offer.price}` : values.package}
        />
        <Row label="Adresse" value={values.location} />
        <Row label="Date" value={formatStoredDate(values.preferredDate)} />
        <Row label="Heure" value={values.preferredTime} />
        {values.notes ? <Row label="Notes" value={values.notes} /> : null}
      </div>
    </div>
  );
}

function formatStoredDate(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-semibold text-primary">{value || "—"}</span>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-primary">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-slate-400">{hint}</span> : null}
      {error ? <span className="block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}