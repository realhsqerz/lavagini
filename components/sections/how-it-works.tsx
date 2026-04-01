import { CalendarCheck2, CarFront, PhoneCall } from "lucide-react";

import { steps } from "@/lib/site-content";

import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const icons = [CalendarCheck2, PhoneCall, CarFront];

export function HowItWorksSection() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <SectionHeading
          eyebrow="Comment ça marche"
          title="Une réservation simple, puis on s'occupe du reste"
          description="Le parcours est pensé pour mobile: quelques informations, un rappel de confirmation, puis notre équipe se déplace jusqu'à vous."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <Card key={step.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
