"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { carTypes, packages } from "@/lib/site-content";
import { BookingFormValues, bookingSchema } from "@/lib/validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function BookingForm() {
  const searchParams = useSearchParams();
  const selectedPackage = searchParams.get("forfait");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

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

  async function onSubmit(values: BookingFormValues) {
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
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom" error={form.formState.errors.name?.message}>
          <Input placeholder="Votre nom complet" {...form.register("name")} />
        </Field>
        <Field label="Téléphone" error={form.formState.errors.phone?.message}>
          <Input placeholder="+216 ..." {...form.register("phone")} />
        </Field>
      </div>

      <Field
        label="Adresse / localisation"
        error={form.formState.errors.location?.message}
      >
        <Input
          placeholder="Maison, bureau, parking, repère..."
          {...form.register("location")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Type de voiture" error={form.formState.errors.carType?.message}>
          <Select {...form.register("carType")}>
            <option value="">Sélectionnez</option>
            {carTypes.map((carType) => (
              <option key={carType} value={carType}>
                {carType}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Forfait choisi" error={form.formState.errors.package?.message}>
          <Select {...form.register("package")}>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Date souhaitée"
          error={form.formState.errors.preferredDate?.message}
        >
          <Input type="date" {...form.register("preferredDate")} />
        </Field>
        <Field
          label="Heure souhaitée"
          error={form.formState.errors.preferredTime?.message}
        >
          <Input type="time" {...form.register("preferredTime")} />
        </Field>
      </div>

      <Field label="Notes supplémentaires" error={form.formState.errors.notes?.message}>
        <Textarea
          placeholder="Accès parking, état du véhicule, consignes..."
          {...form.register("notes")}
        />
      </Field>

      {submitError ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="secondary"
        size="lg"
        className="w-full sm:w-auto"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Envoi..." : "Envoyer ma réservation"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-primary">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}
