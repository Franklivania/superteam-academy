"use client";

import { motion } from "motion/react";
import { BookOpen, Terminal, Zap, Link2 } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import type { HowItOperatesContent } from "@/lib/types/landing";
import { cn } from "@/lib/utils";

interface HowItWorksSectionProps {
  content: HowItOperatesContent;
}

const stepIcons = [BookOpen, Terminal, Zap, Link2];

export function HowItWorksSection({ content }: HowItWorksSectionProps) {
  return (
    <section id="how" className="py-20 md:py-24 px-4 md:px-8 bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt)">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="text-foreground text-3xl md:text-4xl font-extrabold leading-tight mb-12 whitespace-pre-line [font-family:var(--font-archivo)]">
          {content.title}
        </h2>

        <div className="relative mt-12">
          <div className="absolute top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-primary dark:border-accent z-0 hidden md:block" />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {content.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="flex flex-col items-center text-center px-4"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 border-border bg-card flex items-center justify-center mb-4 shadow-(--shadow-flat) dark:shadow-(--shadow-flat-yellow) text-primary dark:text-accent">
                    {Icon && <Icon className="size-8" strokeWidth={1.5} />}
                  </div>
                  <motion.div
                    className="size-14 rounded-none border-2 border-border bg-card shadow-(--shadow-flat) dark:shadow-(--shadow-flat-yellow) flex items-center justify-center font-extrabold text-lg text-primary dark:text-accent mb-4 [font-family:var(--font-archivo)]"
                    whileHover={{ backgroundColor: "#008c4c", color: "white" }}
                    transition={{ duration: 0.2 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.div>
                  <h3 className="[font-family:var(--font-archivo)] font-bold text-base mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.content}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
