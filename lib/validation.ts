import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "Entrez votre nom complet."),
  phone: z.string().min(8, "Entrez un numéro de téléphone valide."),
  location: z.string().min(5, "Entrez votre adresse ou localisation."),
  carType: z.string().min(2, "Sélectionnez le type de voiture."),
  package: z.string().min(2, "Choisissez un forfait."),
  preferredDate: z.string().min(1, "Choisissez une date."),
  preferredTime: z.string().min(1, "Choisissez une heure."),
  notes: z.string().max(500, "500 caractères maximum.").optional().or(z.literal("")),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export type BookingRecord = BookingFormValues & {
  id: string;
  status: "pending" | "confirmed";
  createdAt: string;
};

export const adminBookingUpdateSchema = bookingSchema.extend({
  id: z.string().min(1, "Réservation introuvable."),
  status: z.enum(["pending", "confirmed"]),
});

export type AdminBookingUpdateValues = z.infer<typeof adminBookingUpdateSchema>;

export type ClientRecord = {
  id: string;
  name: string;
  phone: string;
  secondaryPhone: string;
  bookingsCount: number;
  firstConfirmedAt: string;
  lastConfirmedAt: string;
};

export const adminClientUpdateSchema = z.object({
  clientId: z.string().min(1, "Client introuvable."),
  name: z
    .string()
    .trim()
    .min(2, "Entrez un nom d'au moins 2 caractères.")
    .optional(),
  secondaryPhone: z
    .string()
    .trim()
    .max(15, "2e numéro trop long (15 caractères max).")
    .refine((value) => value === "" || /^[0-9+ ]{8,15}$/.test(value), {
      message: "Entrez un numéro valide (8 à 15 chiffres) ou laissez vide.",
    }),
});

export type AdminClientUpdateValues = z.infer<typeof adminClientUpdateSchema>;
