"use client";

import { motion } from "motion/react";
import { Flame, Trophy } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { BentoCard } from "@/components/ui/bento-card";
import { XpBar } from "@/components/ui/xp-bar";
import type { PlatformProvidesContent } from "@/lib/types/landing";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface FeaturesSectionProps {
  content: PlatformProvidesContent;
}

export function FeaturesSection({ content }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-20 md:py-24 px-4 md:px-8 bg-background">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="text-foreground text-3xl md:text-4xl font-extrabold leading-tight mb-4 whitespace-pre-line [font-family:var(--font-archivo)]">
          {content.title}
        </h2>
        <p className="text-muted-foreground max-w-[560px] leading-relaxed mb-12">
          {content.subtitle}
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:grid-rows-[1fr_1fr_auto] items-stretch"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="md:col-span-2 h-full min-h-[260px]">
            <BentoCard size="lg" tag={content.handsOn.tag} className="h-full min-h-[260px]">
              <h3 className="[font-family:var(--font-archivo)] font-bold text-lg mb-2">{content.handsOn.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.handsOn.desc}</p>
              <div className="mt-5 h-[120px] rounded-lg border-2 border-border bg-(--color-near-black) dark:bg-(--color-surface-dark) p-4 flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <div className="flex-1 bg-(--color-code-panel) border border-border rounded px-2 py-2 font-mono text-[0.65rem] text-(--color-code-text) leading-relaxed">
                    <div><span className="text-(--color-yellow)">fn</span> main() {"{"}</div>
                    <div>  println!(<span className="text-(--color-code-string)">&quot;hello&quot;</span>);</div>
                    <div>{"}"}</div>
                  </div>
                  <div className="flex flex-col gap-1 justify-center">
                    <div className="bg-primary rounded px-2.5 py-1 font-mono text-[0.6rem] text-primary-foreground">
                      ▶ {content.runButton}
                    </div>
                    <div className="bg-(--color-dark-green) rounded px-2.5 py-1 font-mono text-[0.6rem] text-primary-foreground">
                      ✓ {content.testButton}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  <span className="bg-(--color-code-tab) border border-border rounded px-2 py-0.5 font-mono text-[0.6rem] text-(--color-code-muted)">lesson_04.rs</span>
                  <span className="bg-(--color-code-tab) border border-border rounded px-2 py-0.5 font-mono text-[0.6rem] text-(--color-code-muted)">cargo.toml</span>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full min-h-[260px]">
            <BentoCard tag={content.xp.tag} className="h-full min-h-[260px]">
              <h3 className="[font-family:var(--font-archivo)] font-bold text-lg mb-2">{content.xp.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.xp.desc}</p>
              <div className="mt-4">
                <div className="flex justify-between font-mono text-[0.65rem] mb-1">
                  <span className="text-muted-foreground">{content.xp.level4}</span>
                  <span className="text-primary dark:text-accent">{content.xp.currentXp}</span>
                </div>
                <XpBar valuePercent={72} className="h-2" />
              </div>
              <div className="mt-2">
                <div className="flex justify-between font-mono text-[0.6rem] text-muted-foreground mb-1">
                  <span>{content.xp.level3Done}</span>
                  <span>{content.xp.level3Xp}</span>
                </div>
                <div className="relative h-2 border-2 border-border bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt) overflow-hidden rounded-none">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-(--color-yellow)"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full min-h-[260px]">
            <BentoCard className="h-full min-h-[260px]">
              <h3 className="[font-family:var(--font-archivo)] font-bold text-lg mb-2">{content.challenge.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.challenge.desc}</p>
              <div className="mt-4 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 bg-primary/20 border border-primary/50 rounded-md px-2.5 py-2">
                  <span className="text-primary text-base">✓</span>
                  <span className="font-mono text-xs text-(--color-code-muted)">{content.challenge.testPass}</span>
                </div>
                <div className="flex items-center gap-2 bg-destructive/20 border border-destructive/50 rounded-md px-2.5 py-2">
                  <span className="text-destructive text-base">✗</span>
                  <span className="font-mono text-xs text-(--color-code-muted)">{content.challenge.testFail}</span>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 h-full min-h-[260px]">
            <BentoCard tag={content.creds.tag} className="h-full min-h-[260px]">
              <h3 className="[font-family:var(--font-archivo)] font-bold text-lg mb-2">{content.creds.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.creds.desc}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {content.creds.tiers.map((tier, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "flex-1 min-w-[80px] py-1.5 px-2 border-2 rounded-lg text-center font-mono text-[0.6rem] transition-colors",
                      tier.variant === "protocol"
                        ? "bg-tier-protocol/10 text-tier-protocol border-tier-protocol/30"
                        : i === 0
                          ? "bg-tier-bronze/10 text-tier-bronze border-border"
                          : i === 1
                            ? "bg-tier-silver/10 text-tier-silver border-border"
                            : "bg-yellow text-foreground dark:text-background border-border"
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    {tier.name}
                    <br />
                    <span className="text-[0.55rem]">{tier.sub}</span>
                  </motion.div>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-3">
            <BentoCard accent="yellow" className="bg-accent border-border text-accent-foreground w-full">
              <h3 className="[font-family:var(--font-archivo)] font-bold text-foreground dark:text-background text-lg mb-2">{content.gamified.title}</h3>
              <p className="text-sm text-muted-foreground dark:text-black leading-relaxed">{content.gamified.desc}</p>
              <div className="mt-4 flex gap-2 items-center">
                <Flame className="size-6 text-foreground dark:text-background" strokeWidth={1.5} />
                <div>
                  <div className="[font-family:var(--font-archivo)] font-extrabold text-foreground dark:text-background text-lg">{content.gamified.currentStreak}</div>
                  <div className="font-mono text-[0.6rem] text-muted-foreground dark:text-black">{content.gamified.streakLabel}</div>
                </div>
                <Trophy className="size-6 text-foreground dark:text-background ml-auto" strokeWidth={1.5} />
              </div>
            </BentoCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
