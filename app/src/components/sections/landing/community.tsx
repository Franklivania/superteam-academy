"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SectionLabel } from "@/components/ui/section-label";
import { FlatButton } from "@/components/ui/flat-button";
import type { CommunityGrowthContent } from "@/lib/types/landing";
import { cn } from "@/lib/utils";

interface CommunitySectionProps {
  content: CommunityGrowthContent;
}

export function CommunitySection({ content }: CommunitySectionProps) {
  return (
    <section id="community" className="py-20 md:py-24 px-4 md:px-8 bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt)">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          className="bg-card border-2 border-border rounded-xl shadow-(--shadow-flat-xl) dark:shadow-(--shadow-flat-yellow-lg) p-8 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt) border-2 border-border rounded-lg p-4 text-center">
            <div className="[font-family:var(--font-archivo)] font-extrabold text-2xl text-primary dark:text-accent">
              {content.statBuilders}
            </div>
            <div className="font-mono text-[0.65rem] text-muted-foreground">{content.statBuildersLabel}</div>
          </div>
          <div className="bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt) border-2 border-border rounded-lg p-4 text-center">
            <div className="[font-family:var(--font-archivo)] font-extrabold text-2xl text-primary dark:text-accent">
              {content.statCerts}
            </div>
            <div className="font-mono text-[0.65rem] text-muted-foreground">{content.statCertsLabel}</div>
          </div>
          <div className="col-span-2 flex items-center gap-4 p-4 bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt) border-2 border-border rounded-lg">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
              <Image
                src="https://flagcdn.com/w80/br.png"
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <div className="[font-family:var(--font-archivo)] font-extrabold text-lg text-primary dark:text-accent">
                {content.chapterName}
              </div>
              <div className="font-mono text-[0.65rem] text-muted-foreground">{content.chapterLabel}</div>
            </div>
          </div>
        </motion.div>
        <div>
          <SectionLabel>{content.label}</SectionLabel>
          <h2 className="text-foreground text-3xl md:text-4xl font-extrabold leading-tight mb-4 whitespace-pre-line [font-family:var(--font-archivo)]">
            {content.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {content.subtitle}
          </p>
          <div className="flex gap-4 flex-wrap">
            <FlatButton href="#cta" variant="primary">
              {content.ctaPrimary}
            </FlatButton>
            <FlatButton href="#community" variant="outline">
              {content.ctaSecondary}
            </FlatButton>
          </div>
        </div>
      </div>
    </section>
  );
}
