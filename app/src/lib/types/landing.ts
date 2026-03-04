import type { ReactNode } from "react";

export type NavContent = {
  about: string;
  platform: string;
  howItWorks: string;
  community: string;
  startLearning: string;
  toggleTheme: string;
  dashboard: string;
};

export type HeroContent = {
  layout: "split-horizontal";
  tag: string;
  headline: ReactNode;
  subheading: string;
  pills: [string, string, string];
  ctaPrimary: string;
  ctaSecondary: string;
  badgeVerified: string;
  codeLabel: string;
  xpProgress: string;
  xpValue: string;
  statLessons: string;
  statCerts: string;
  statStreak: string;
  statLessonsCount: string;
  statCertsCount: string;
  statStreakCount: string;
  badgeNft: string;
};

export type WhyItem = {
  title: string;
  content: string;
};

export type WhysContent = {
  layout: "three-column-block";
  label: string;
  title: string;
  subtitle: string;
  items: WhyItem[];
  credentialNft: string;
  credentialName: string;
  credentialVerified: string;
};

export type BentoItemSize = "large" | "medium" | "small";

export type BentoItem = {
  size: BentoItemSize;
  title: string;
  content: string;
};

export type PlatformProvidesContent = {
  layout: "bento";
  label: string;
  title: string;
  subtitle: string;
  handsOn: { tag: string; title: string; desc: string };
  xp: { tag: string; title: string; desc: string; level4: string; level3Done: string; level3Xp: string; currentXp: string };
  creds: { tag: string; title: string; desc: string; tiers: Array<{ name: string; sub: string; variant?: string }> };
  challenge: { title: string; desc: string; testPass: string; testFail: string };
  gamified: { title: string; desc: string; currentStreak: string; streakLabel: string };
  runButton: string;
  testButton: string;
};

export type HowStep = {
  title: string;
  content: string;
};

export type HowItOperatesContent = {
  layout: "slider-scroll-sync";
  label: string;
  title: string;
  steps: HowStep[];
};

export type EcosystemAlignmentContent = {
  layout: "split-horizontal";
  label: string;
  title: string;
  subtitle: string;
  features: string[];
  cta: string;
};

export type StudentGainItem = {
  title: string;
  content: string;
};

export type StudentGainContent = {
  layout: "grid-four";
  label: string;
  title: string;
  subtitle: string;
  items: StudentGainItem[];
};

export type LeaderboardRow = {
  name: string;
  level: string;
  xp: string;
  highlight?: boolean;
};

export type AdvantagesContent = {
  layout: "two-column-list";
  label: string;
  title: string;
  points: string[];
  leaderboardLabel: string;
  leaderboardRows: LeaderboardRow[];
};

export type CommunityGrowthContent = {
  layout: "split-horizontal";
  label: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statBuilders: string;
  statBuildersLabel: string;
  statCerts: string;
  statCertsLabel: string;
  chapterName: string;
  chapterLabel: string;
};

export type CtaBannerContent = {
  layout: "full-width-cta";
  label: string;
  title: string;
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type FooterLinkSection = {
  title: string;
  links: Array<{ label: string; href?: string }>;
};

export type FooterContent = {
  layout: "multi-column";
  brandDesc: string;
  sections: FooterLinkSection[];
  copyright: string;
  builtOn: string;
};

export type LandingContent = {
  nav: NavContent;
  hero: HeroContent;
  whys: WhysContent;
  platform_provides: PlatformProvidesContent;
  how_it_operates: HowItOperatesContent;
  ecosystem_alignment: EcosystemAlignmentContent;
  student_gain: StudentGainContent;
  advantages: AdvantagesContent;
  community_growth: CommunityGrowthContent;
  cta_banner: CtaBannerContent;
  footer: FooterContent;
};
