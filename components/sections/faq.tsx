import { SectionHeading } from "@/components/section-heading";

export const faqItems = [
  {
    question: "Comment réserver un lavage de voiture à domicile en Tunisie ?",
    answer:
      "Remplissez le formulaire de réservation en ligne avec votre nom, votre téléphone, votre adresse et le créneau souhaité. Notre équipe vous rappelle ensuite pour confirmer le rendez-vous.",
  },
  {
    question: "Quels sont les prix d'un lavage de voiture à domicile ?",
    answer:
      "Le forfait Basique est à 20 TND, le forfait Standard à 30 TND et le forfait Premium à 40 TND. Le déplacement à domicile et l'utilisation de produits professionnels sont inclus.",
  },
  {
    question: "Dans quelles zones intervenez-vous en Tunisie ?",
    answer:
      "Nous intervenons à Sousse et dans ses alentours. Nous nous déplaçons directement à votre domicile, votre bureau ou votre parking.",
  },
  {
    question: "Comment se déroule le lavage de voiture à domicile ?",
    answer:
      "Notre équipe se rend à l'adresse indiquée et réalise le forfait choisi : lavage extérieur, aspirateur intérieur, cire brillante, essuyage et nettoyage du tableau de bord selon la formule.",
  },
  {
    question: "Combien de temps dure le lavage d'une voiture à domicile ?",
    answer:
      "La durée dépend du forfait et de l'état du véhicule. Elle est confirmée avec vous par téléphone lors de la validation de votre réservation.",
  },
];

export function FaqSection() {
  return (
    <section className="section-space">
      <div className="container-shell max-w-3xl space-y-10">
        <SectionHeading
          eyebrow="Questions fréquentes"
          title="Tout savoir sur le lavage de voiture à domicile"
          description="Réponses rapides sur la réservation, les zones couvertes en Tunisie et les tarifs de nos forfaits."
        />
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-200 bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="text-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}