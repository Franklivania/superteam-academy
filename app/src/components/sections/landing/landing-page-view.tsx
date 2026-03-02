"use client";

import type { LandingContent } from "@/lib/types/landing";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import {
  Navbar,
  HeroSection,
  WhySection,
  FeaturesSection,
  HowItWorksSection,
  EcosystemSection,
  GainsSection,
  AdvantagesSection,
  CommunitySection,
  CtaBanner,
  Footer,
} from "./index";

interface LandingPageViewProps {
  content: LandingContent;
}

export function LandingPageView({ content }: LandingPageViewProps) {
  return (
    <>
      <ScrollProgress />
      <Navbar content={content.nav} />
      <main>
        <HeroSection content={content.hero} />
        <WhySection content={content.whys} />
        <FeaturesSection content={content.platform_provides} />
        <HowItWorksSection content={content.how_it_operates} />
        <EcosystemSection content={content.ecosystem_alignment} />
        <GainsSection content={content.student_gain} />
        <AdvantagesSection content={content.advantages} />
        <CommunitySection content={content.community_growth} />
        <CtaBanner content={content.cta_banner} />
        <Footer content={content.footer} />
      </main>
    </>
  );
}
