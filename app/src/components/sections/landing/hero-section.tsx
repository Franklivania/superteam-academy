"use client";

import { motion } from "motion/react";
import { FlatButton } from "@/components/ui/flat-button";
import { FadeUp } from "@/components/ui/fade-up";
import { XpBar } from "@/components/ui/xp-bar";
import type { HeroContent } from "@/lib/types/landing";

interface HeroSectionProps {
  content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="pt-36 min-h-screen flex items-center relative overflow-hidden px-4 md:px-8 pb-16 bg-background"
    >
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <FadeUp delay={0}>
            <div className="inline-flex items-center gap-2 bg-(--color-yellow) text-(--color-near-black) border-2 border-border rounded-none px-3 py-1 font-mono text-[0.7rem] font-medium tracking-widest uppercase mb-6 shadow-(--shadow-flat)">
              <span className="size-1.5 rounded-full bg-(--color-green)" />
              {content.tag}
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="font-extrabold text-foreground leading-tight mb-6 [font-family:var(--font-archivo)] text-[clamp(2rem,5vw,3.5rem)]">
              {content.headline}
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-[480px] mb-8">
              {content.subheading}
            </p>
          </FadeUp>
          <FadeUp delay={0.16}>
            <div className="flex flex-wrap gap-2 mb-8">
              {content.pills.map((pill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-card border-2 border-border rounded-none font-mono text-[0.7rem] text-muted-foreground tracking-wide"
                >
                  {pill}
                </span>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="flex gap-4 flex-wrap">
              <FlatButton href="/login" variant="primary" size="lg">
                {content.ctaPrimary} →
              </FlatButton>
              <FlatButton href="/courses" variant="outline" size="lg">
                {content.ctaSecondary}
              </FlatButton>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="relative flex items-center justify-center">
          <motion.div
            className="w-full max-w-[480px] bg-card border-2 border-border rounded-xl p-6 md:p-8 shadow-(--shadow-flat-xl) dark:shadow-(--shadow-flat-yellow-lg) relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute -top-5 -right-5 bg-(--color-yellow) border-2 border-border px-3.5 py-2 shadow-(--shadow-flat) font-extrabold text-[0.7rem] flex items-center gap-1.5 [font-family:var(--font-archivo)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ◆ {content.badgeVerified}
            </motion.div>
            <p className="font-mono text-[0.65rem] text-muted-foreground mb-2 tracking-widest">
              {content.codeLabel}
            </p>
            <div className="bg-(--color-near-black) dark:bg-(--color-surface-dark) rounded-lg p-4 font-mono text-xs text-(--color-code-text) leading-relaxed overflow-hidden mb-4">
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">1</span>
                <span><span className="text-(--color-yellow)">#[program]</span></span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">2</span>
                <span><span className="text-(--color-yellow)">pub mod</span> <span className="text-(--color-code-string)">course_nft</span> {"{"}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">3</span>
                <span>  <span className="text-(--color-yellow)">use super</span>::*;</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">4</span>
                <span>  <span className="text-(--color-yellow)">pub fn</span> <span className="text-(--color-code-string)">mint_credential</span>(</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">5</span>
                <span>    ctx: Context&lt;MintCred&gt;</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">6</span>
                <span>  ) -&gt; Result&lt;()&gt; {"{"}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">7</span>
                <span>
                  {"    "}
                  <span className="text-(--color-code-muted)">
                    {"// emit verified badge"}
                  </span>
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-muted-foreground min-w-[20px]">8</span>
                <span>    emit!(XPEarned {"{"} <span className="text-(--color-code-string)">xp: 250</span> {"}"});<CursorBlink /></span>
              </div>
            </div>
            <div className="flex justify-between font-mono text-[0.65rem] text-muted-foreground mb-1">
              <span>{content.xpProgress}</span>
              <span className="text-primary dark:text-accent">{content.xpValue}</span>
            </div>
            <XpBar valuePercent={72} className="mb-4" />
            <div className="grid grid-cols-3 gap-4">
              <StatBox value={content.statLessonsCount} label={content.statLessons} />
              <StatBox value={content.statCertsCount} label={content.statCerts} />
              <StatBox value={content.statStreakCount} label={content.statStreak} />
            </div>
            <motion.div
              className="absolute -bottom-4 -left-5 bg-primary text-primary-foreground border-2 border-border px-3.5 py-2 shadow-(--shadow-flat) font-mono text-[0.7rem]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              ◆ {content.badgeNft}
            </motion.div>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  );
}

function CursorBlink() {
  return (
    <motion.span
      className="inline-block w-0.5 h-3.5 bg-(--color-green) align-middle"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt) border-2 border-border rounded-none p-2.5 text-center">
      <div className="font-extrabold text-primary dark:text-accent [font-family:var(--font-archivo)] text-lg">
        {value}
      </div>
      <div className="font-mono text-[0.65rem] text-muted-foreground">{label}</div>
    </div>
  );
}
