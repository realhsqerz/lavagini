import { ContactCtaSection } from "@/components/sections/contact-cta";
import { HighlightsSection } from "@/components/sections/highlights";
import { HomeHero } from "@/components/sections/home-hero";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { PackagesPreviewSection } from "@/components/sections/packages-preview";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HowItWorksSection />
      <HighlightsSection />
      <PackagesPreviewSection />
      <ContactCtaSection />
    </>
  );
}
