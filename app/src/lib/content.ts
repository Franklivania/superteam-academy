import React from "react";
import type { FooterContent, LandingContent, NavContent } from "@/lib/types/landing";
import { landingContentPtBR, landingContentEs, landingContentHi, landingContentPt } from "./content-locales";

function headlineEn(): React.ReactNode {
  return React.createElement(
    React.Fragment,
    null,
    "Solana-Native Developer Courses for ",
    React.createElement("span", {
      className: "text-primary dark:text-accent font-semibold not-italic",
    }, "Production"),
    " dApp Engineering"
  );
}

/** Default landing content in English. Single source of truth for copy. */
export const landingContentEn: LandingContent = {
  nav: {
    about: "About",
    platform: "Platform",
    howItWorks: "How it Works",
    community: "Community",
    startLearning: "Start Learning",
    toggleTheme: "Toggle theme",
    dashboard: "Dashboard",
  },
  hero: {
    layout: "split-horizontal",
    tag: "Superteam Brasil · Solana Education · Open Source",
    headline: headlineEn(),
    subheading: "Superteam Brasil delivers structured, interactive education designed to move builders from fundamentals to protocol-level competence — with on-chain verification built in.",
    pills: ["Project-Based Courses", "Coding Challenges", "On-Chain Credentials"],
    ctaPrimary: "Start Learning",
    ctaSecondary: "Explore Courses",
    badgeVerified: "Verified On-Chain",
    codeLabel: "LESSON 04 — ANCHOR FRAMEWORK",
    xpProgress: "XP Progress",
    xpValue: "1,840 / 2,500 XP",
    statLessons: "Lessons Done",
    statCerts: "Certs Earned",
    statStreak: "Day Streak",
    statLessonsCount: "12",
    statCertsCount: "3",
    statStreakCount: "7",
    badgeNft: "NFT Credential Minted",
  },
  whys: {
    layout: "three-column-block",
    label: "WHY THIS PLATFORM",
    title: "Built for Real\nBuilder Outcomes",
    subtitle: "Clear progression. Measurable growth. Cryptographically verifiable results.",
    items: [
      {
        title: "Structured Competence",
        content: "Clear learning progression from beginner to advanced protocol engineering. No guesswork.",
      },
      {
        title: "Measurable Growth",
        content: "Skill advancement reflected through XP, levels, and track completion milestones.",
      },
      {
        title: "Verifiable Outcomes",
        content: "Achievements and credentials recorded permanently on the Solana blockchain.",
      },
    ],
    credentialNft: "CREDENTIAL NFT",
    credentialName: "Solana Foundation Track",
    credentialVerified: "VERIFIED · wallet: 7xK3...af9",
  },
  platform_provides: {
    layout: "bento",
    label: "PLATFORM FEATURES",
    title: "What the Platform\nProvides",
    subtitle: "Every tool built to bridge theory and production-level development.",
    handsOn: {
      tag: "CORE FEATURE",
      title: "Hands-On Learning Environment",
      desc: "Interactive coding directly within structured lessons. Write, compile, and deploy without leaving the platform.",
    },
    xp: {
      tag: "XP SYSTEM",
      title: "On-Chain XP System",
      desc: "Non-transferable tokens reflect real, verifiable progress on-chain.",
      level4: "LEVEL 4",
      level3Done: "LEVEL 3 ✓",
      level3Xp: "1,200 XP",
      currentXp: "1,840 / 2,500 XP",
    },
    creds: {
      tag: "CREDENTIALS",
      title: "Evolving Certifications",
      desc: "Credentials upgrade as learning tracks advance through progressive tiers.",
      tiers: [
        { name: "BRONZE", sub: "Beginner Track" },
        { name: "SILVER", sub: "Intermediate Track" },
        { name: "GOLD", sub: "Advanced Track" },
        { name: "PROTOCOL", sub: "Production Level", variant: "protocol" },
      ],
    },
    challenge: {
      title: "Challenge Validation",
      desc: "Visible pass/fail feedback on every coding challenge.",
      testPass: "test_mint_credential",
      testFail: "test_overflow",
    },
    gamified: {
      title: "Gamified Progression",
      desc: "Streaks, achievements, and milestone rewards keep motivation high.",
      currentStreak: "7 Days",
      streakLabel: "Current Streak",
    },
    runButton: "RUN",
    testButton: "TEST",
  },
  how_it_operates: {
    layout: "slider-scroll-sync",
    label: "HOW IT WORKS",
    title: "How the System\nOperates",
    steps: [
      {
        title: "Learn",
        content: "Concept-driven lessons structured into progressive modules with a clear knowledge map.",
      },
      {
        title: "Practice",
        content: "Embedded code editor with real-time validation feedback on every challenge you complete.",
      },
      {
        title: "Earn",
        content: "XP accumulates through measurable completion. Level up and unlock new tracks.",
      },
      {
        title: "Verify",
        content: "On-chain credential NFT tied to your wallet identity. Permanent, portable proof.",
      },
    ],
  },
  ecosystem_alignment: {
    layout: "split-horizontal",
    label: "ECOSYSTEM ALIGNMENT",
    title: "Built to Solana's\nProduction Standards",
    subtitle: "Curriculum reflects Anchor architecture, production deployment workflows, and real protocol standards. Completion aligns learners with ecosystem contribution readiness.",
    features: [
      "Anchor framework native curriculum",
      "Real deployment & verification workflows",
      "Protocol-grade code standards",
      "Community-reviewed lesson quality",
    ],
    cta: "View Curriculum Docs",
  },
  student_gain: {
    layout: "grid-four",
    label: "STUDENT OUTCOMES",
    title: "What Students Gain",
    subtitle: "From first commit to production-ready developer.",
    items: [
      {
        title: "Beginner Accessibility",
        content: "Clear onboarding and progressive complexity designed for anyone entering Web3 development.",
      },
      {
        title: "Practical Confidence",
        content: "Direct exposure to real Anchor contract patterns used in production protocols.",
      },
      {
        title: "Production Awareness",
        content: "Deep understanding of deployment, verification, and upgrade flows in the Solana ecosystem.",
      },
      {
        title: "Visible Reputation",
        content: "Wallet-linked skill progression that showcases your competence to teams and protocols.",
      },
    ],
  },
  advantages: {
    layout: "two-column-list",
    label: "PLATFORM ADVANTAGES",
    title: "Why It Works",
    points: [
      "Wallet-anchored identity",
      "On-chain credential portability",
      "Leaderboard visibility",
      "Clear measurable progression",
      "Structured learning tracks",
    ],
    leaderboardLabel: "LEADERBOARD",
    leaderboardRows: [
      { name: "alex.sol", level: "Advanced Track · Lv.8", xp: "12,450 XP" },
      { name: "mariana.sol", level: "Intermediate · Lv.6", xp: "9,820 XP" },
      { name: "you.sol", level: "Beginner · Lv.4", xp: "1,840 XP", highlight: true },
    ],
  },
  community_growth: {
    layout: "split-horizontal",
    label: "COMMUNITY & GROWTH",
    title: "Build Inside an Active\nDeveloper Network",
    subtitle: "Learners operate within an active Superteam Brasil developer network. Shared progression, hackathon preparation, and visible achievement history strengthen long-term growth.",
    ctaPrimary: "Join Community",
    ctaSecondary: "View Events",
    statBuilders: "2,400+",
    statBuildersLabel: "Active Builders",
    statCerts: "180+",
    statCertsLabel: "Certs Issued",
    chapterName: "Superteam Brasil",
    chapterLabel: "Active Solana Chapter · est. 2022",
  },
  cta_banner: {
    layout: "full-width-cta",
    label: "GET STARTED",
    title: "Begin Structured\nSolana Development",
    subtext: "LEARN  ·  PRACTICE  ·  EARN  ·  VERIFY",
    ctaPrimary: "Start Learning",
    ctaSecondary: "View Courses",
  },
  footer: {
    layout: "multi-column",
    brandDesc: "Solana-native developer education platform. Building the next generation of blockchain engineers in Brazil and beyond.",
    sections: [
      {
        title: "Platform",
        links: [
          { label: "Courses", href: "/courses" },
          { label: "Leaderboard", href: "/leaderboard" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Certificates", href: "/certificates" },
        ],
      },
      {
        title: "Account",
        links: [
          { label: "Sign In", href: "/login" },
          { label: "Register", href: "/register" },
          { label: "Settings", href: "/settings" },
        ],
      },
      {
        title: "Community",
        links: [
          { label: "Superteam Brasil" },
          { label: "Events" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy" },
          { label: "Terms" },
        ],
      },
    ],
    copyright: "© 2025 Superteam Brasil — Solana Developer Education Platform",
    builtOn: "Built on Solana",
  },
};

const contentByLocale: Record<string, LandingContent> = {
  en: landingContentEn,
  "pt-BR": landingContentPtBR,
  es: landingContentEs,
  hi: landingContentHi,
  pt: landingContentPt,
};

/**
 * Returns landing content for the given locale. Content is passed through props;
 * all five locales (en, pt-BR, es, hi, pt) have dedicated translated content.
 */
export function getLandingContent(locale: string): LandingContent {
  return contentByLocale[locale] ?? landingContentEn;
}

export type WebLayoutContent = { nav: NavContent; footer: FooterContent };

/** Nav + footer only, for (web) layout. */
export function getWebLayoutContent(locale: string): WebLayoutContent {
  const full = getLandingContent(locale);
  return { nav: full.nav, footer: full.footer };
}
