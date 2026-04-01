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
  serviceArea: "Sfax et ses alentours",
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
    price: "15–20 TND",
    description: "La formule simple pour un extérieur propre et net.",
    features: ["Lavage extérieur", "Nettoyage jantes", "Nettoyage vitres"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "30–35 TND",
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
    price: "50–80 TND",
    description: "Une remise à niveau complète pour un résultat plus profond.",
    features: [
      "Nettoyage intérieur complet",
      "Shampoing sièges",
      "Lavage extérieur",
      "Polish carrosserie",
      "Brillance pneus",
    ],
  },
];

export const carTypes = [
  "Citadine",
  "Berline",
  "SUV / 4x4",
  "Utilitaire",
  "Autre",
];
