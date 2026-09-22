export const siteUrl = "https://lavagini.tn";

export const seoKeywords = [
  "lavage de voiture à domicile en Tunisie",
  "lavage auto à domicile",
  "lavage de voiture à domicile Sousse",
  "lavage voiture mobile Tunisie",
  "nettoyage de voiture à domicile",
  "lavage à domicile Tunisie",
  "service de lavage voiture à domicile",
  "lavage extérieur intérieur Tunisie",
];

export const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/forfaits", label: "Forfaits" },
  { href: "/reserver", label: "Réserver" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export const contactDetails = {
  brandName: "Lavagini",
  phoneDisplay: "+216 99 486 202",
  phoneHref: "tel:+21699486202",
  whatsappDisplay: "+216 99 486 202",
  whatsappHref: "https://wa.me/21699486202",
  email: "",
  emailLabel: "Email bientôt disponible",
  serviceArea: "Sousse et ses alentours",
};

export const steps = [
  {
    title: "Réservez en ligne",
    description:
      "Choisissez votre forfait, indiquez votre adresse et proposez le créneau qui vous convient.",
  },
  {
    title: "Confirmation par téléphone",
    description:
      "Notre équipe vous rappelle pour confirmer la localisation, l'heure et les détails du service.",
  },
  {
    title: "Nous venons chez vous",
    description:
      "Le nettoyage est réalisé sur place à votre domicile, au bureau ou sur votre parking.",
  },
];

export const highlights = [
  "Service pratique à domicile",
  "Produits professionnels",
  "Service rapide et fiable",
  "Prix abordables",
];

export const services = [
  {
    title: "Lavage extérieur",
    description: "Un nettoyage soigné de la carrosserie pour une voiture propre et brillante.",
    items: ["Nettoyage carrosserie", "Nettoyage jantes", "Nettoyage vitres"],
  },
  {
    title: "Nettoyage intérieur",
    description: "Une remise en état de l'habitacle pour retrouver un intérieur net et agréable.",
    items: [
      "Aspirateur sièges et tapis",
      "Nettoyage tableau de bord",
      "Nettoyage surfaces",
    ],
  },
  {
    title: "Nettoyage complet",
    description:
      "Une prestation plus poussée pour les véhicules qui ont besoin d'un vrai rafraîchissement.",
    items: [
      "Nettoyage intérieur profond",
      "Shampoing sièges",
      "Polish carrosserie",
    ],
  },
];

export const packages = [
  {
    id: "basique",
    name: "Basique",
    price: "20 TND",
    description: "La formule simple pour un extérieur propre et net.",
    features: ["Lavage extérieur", "Nettoyage jantes", "Nettoyage vitres"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "30 TND",
    description: "Le meilleur équilibre entre rapidité, propreté et confort.",
    features: [
      "Lavage extérieur",
      "Aspirateur intérieur",
      "Nettoyage tableau de bord",
      "Nettoyage vitres",
      "Brillance pneus",
    ],
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "40 TND",
    description: "Une remise à niveau complète pour un résultat plus profond.",
    features: [
      "Nettoyage extérieur",
      "Nettoyage ciblé",
      "Cire brillante",
      "Essuyage",
      "Aspiration intégrale",
      "Tapis — brossage à mousse",
      "Nettoyage tableau de bord",
    ],
  },
];

export const carModels = [
  {
    id: "sedan",
    label: "Berline",
    model: "Volkswagen Passat",
    file: "/models/2025_volkswagen_passat_pro_380tsi_2.0t.glb",
  },
  {
    id: "suv",
    label: "SUV",
    model: "Range Rover Sport 2018",
    file: "/models/range_rover_sport_2018.glb",
  },
  {
    id: "pickup",
    label: "Pickup",
    model: "Jeep Gladiator 2020",
    file: "/models/2020_jeep_gladiator.glb",
  },
];

export const timeSlots = [
  {
    id: "matin",
    label: "Matin",
    time: "10h00",
    description: "Réservation à 10h00",
  },
  {
    id: "apres-midi",
    label: "Après-midi",
    time: "14h00",
    description: "Réservation à 14h00",
  },
];

export function formatCarType(carModelId: string) {
  const model = carModels.find((item) => item.id === carModelId);
  return model ? `${model.label} — ${model.model}` : carModelId;
}

export function formatTimeSlot(slotId: string) {
  const slot = timeSlots.find((item) => item.id === slotId);
  return slot ? `${slot.label} (${slot.time})` : slotId;
}
