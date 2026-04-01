import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PackageCardProps = {
  pkg: {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    featured?: boolean;
  };
};

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <Card
      className={
        pkg.featured
          ? "!border-[#2563EB] !bg-[#0F172A] !text-white shadow-[0_24px_60px_rgba(15,23,42,0.32)]"
          : ""
      }
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className={pkg.featured ? "!text-white" : ""}>{pkg.name}</CardTitle>
            <CardDescription className={pkg.featured ? "!text-slate-100" : ""}>
              {pkg.description}
            </CardDescription>
          </div>
          <p
            className={
              pkg.featured
                ? "text-lg font-semibold !text-blue-100"
                : "text-lg font-semibold"
            }
          >
            {pkg.price}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span className={pkg.featured ? "!text-white" : "text-slate-700"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        <Link href={`/reserver?forfait=${pkg.id}`} className="block">
          <Button
            variant={pkg.featured ? "default" : "default"}
            className={
              pkg.featured
                ? "w-full !bg-white !text-[#0F172A] hover:!bg-slate-100"
                : "w-full"
            }
          >
            Choisir ce forfait
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
