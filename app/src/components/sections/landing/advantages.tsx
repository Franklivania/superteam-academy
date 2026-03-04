"use client";

import { motion } from "motion/react";
import { KeyRound, Package, Medal, BarChart2, Map } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import type { AdvantagesContent } from "@/lib/types/landing";
import { cn } from "@/lib/utils";

interface AdvantagesSectionProps {
  content: AdvantagesContent;
}

const pointIcons = [KeyRound, Package, Medal, BarChart2, Map];

export function AdvantagesSection({ content }: AdvantagesSectionProps) {
  return (
    <section
      id="advantages"
      className="py-20 md:py-24 px-4 md:px-8 bg-(--color-near-black) dark:bg-(--color-surface-dark) border-t-2 border-b-2 border-border"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="text-(--color-cream) text-3xl md:text-4xl font-extrabold mb-12 [font-family:var(--font-archivo)]">
          {content.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ul className="list-none flex flex-col gap-4">
            {content.points.map((point, i) => {
              const Icon = pointIcons[i];
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4 px-5 py-4 bg-(--color-surface-dark-card) border-2 border-border rounded-xl hover:border-(--color-yellow) transition-colors"
                  whileHover={{ x: 4 }}
                >
                  {Icon && (
                    <span className="flex items-center justify-center w-9 text-(--color-yellow)">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>
                  )}
                  <span className="text-sm text-(--color-cream)">{point}</span>
                </motion.li>
              );
            })}
          </ul>
          <div className="bg-(--color-surface-dark-card) border-2 border-border rounded-xl p-8 flex flex-col gap-4">
            <p className="font-mono text-[0.65rem] text-(--color-yellow) tracking-widest mb-1">
              {"// "}
              {content.leaderboardLabel}
            </p>
            {content.leaderboardRows.map((row, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 bg-(--color-code-panel) border rounded-lg border-border",
                  row.highlight && "border-(--color-yellow)"
                )}
              >
                <span className="[font-family:var(--font-archivo)] font-extrabold text-base text-(--color-yellow) min-w-[28px]">
                  #{i + 1}
                </span>
                <div
                  className={cn(
                    "size-8 rounded-full border-2 border-border flex items-center justify-center text-sm font-bold text-primary-foreground",
                    row.highlight ? "bg-(--color-code-panel) text-(--color-yellow)" : i === 1 ? "bg-(--color-dark-green)" : "bg-(--color-green)"
                  )}
                >
                  {row.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="[font-family:var(--font-archivo)] font-semibold text-sm text-(--color-cream) truncate">
                    {row.name}
                  </div>
                  <div className="font-mono text-[0.65rem] text-(--color-code-muted) truncate">{row.level}</div>
                </div>
                <span className="font-mono text-xs text-(--color-yellow) font-medium shrink-0">
                  {row.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
