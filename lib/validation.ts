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
