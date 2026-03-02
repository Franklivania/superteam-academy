"use client";

import { motion } from "motion/react";
import { DoorOpen, Lightbulb, Rocket, Wallet } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import type { StudentGainContent } from "@/lib/types/landing";
import { cn } from "@/lib/utils";

interface GainsSectionProps {
  content: StudentGainContent;
}

const gainIcons = [DoorOpen, Lightbulb, Rocket, Wallet];

export function GainsSection({ content }: GainsSectionProps) {
  return (
    <section id="gains" className="py-20 md:py-24 px-4 md:px-8 bg-background">
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="text-foreground text-3xl md:text-4xl font-extrabold leading-tight mb-4 [font-family:var(--font-archivo)]">
          {content.title}
        </h2>
        <p className="text-muted-foreground max-w-[560px] leading-relaxed mb-12">
          {content.subtitle}
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {content.items.map((item, i) => {
            const Icon = gainIcons[i];
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className={cn(
                  "bg-card border-2 border-border rounded-xl p-6",
                  "shadow-(--shadow-flat) dark:shadow-(--shadow-flat-yellow)",
                  "hover:shadow-(--shadow-flat-lg) dark:hover:shadow-(--shadow-flat-yellow-lg) transition-shadow cursor-default"
                )}
                whileHover={{ x: -3, y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <div className="h-20 rounded-lg border-2 border-border bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt) flex items-center justify-center mb-4">
                  {Icon && <Icon className="size-8 text-primary dark:text-accent" strokeWidth={1.5} />}
                </div>
                <h3 className="[font-family:var(--font-archivo)] font-bold text-base mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
