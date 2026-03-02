"use client";

import type { LandingContent } from "@/lib/types/landing";
import {
  HeroSection,
  WhySection,
  FeaturesSection,
  HowItWorksSection,
  EcosystemSection,
  GainsSection,
  AdvantagesSection,
  CommunitySection,
  CtaBanner,
} from "./index";

interface LandingPageViewProps {
  content: LandingContent;
}

export function LandingPageView({ content }: LandingPageViewProps) {
  return (
    <>
      <HeroSection content={content.hero} />
      <WhySection content={content.whys} />
      <FeaturesSection content={content.platform_provides} />
      <HowItWorksSection content={content.how_it_operates} />
      <EcosystemSection content={content.ecosystem_alignment} />
      <GainsSection content={content.student_gain} />
      <AdvantagesSection content={content.advantages} />
      <CommunitySection content={content.community_growth} />
      <CtaBanner content={content.cta_banner} />
    </>
  );
}
