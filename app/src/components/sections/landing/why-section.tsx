"use client";

import { motion } from "motion/react";
import { Target, TrendingUp, Trophy } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { FadeUp } from "@/components/ui/fade-up";
import type { WhysContent } from "@/lib/types/landing";
import { cn } from "@/lib/utils";

interface WhySectionProps {
  content: WhysContent;
}

const icons = [Target, TrendingUp, Trophy];

function StairSvg() {
  return (
    <svg className="w-full h-[60px] mt-4" viewBox="0 0 200 60" fill="none" aria-hidden>
      <rect x="0" y="48" width="40" height="12" fill="var(--color-green)" opacity={0.6} />
      <rect x="40" y="36" width="40" height="24" fill="var(--color-green)" opacity={0.7} />
      <rect x="80" y="24" width="40" height="36" fill="var(--color-green)" opacity={0.8} />
      <rect x="120" y="12" width="40" height="48" fill="var(--color-green)" opacity={0.9} />
      <rect x="160" y="0" width="40" height="60" fill="var(--color-green)" />
      <rect x="0" y="48" width="200" height="2" fill="var(--color-yellow)" opacity={0.3} />
    </svg>
  );
}

export function WhySection({ content }: WhySectionProps) {
  return (
    <section
      id="why"
      className="py-20 md:py-24 px-4 md:px-8 bg-(--color-near-black) dark:bg-(--color-surface-dark)"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="text-(--color-cream) [font-family:var(--font-archivo)] font-extrabold text-3xl md:text-4xl leading-tight mb-4 whitespace-pre-line">
          {content.title}
        </h2>
        <p className="text-(--color-code-muted) text-base max-w-[560px] leading-relaxed mb-12">
          {content.subtitle}
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {content.items.map((item, i) => (
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
                "bg-(--color-surface-dark-card) border-2 border-border rounded-xl p-8",
                "hover:shadow-(--shadow-flat-yellow-lg) transition-shadow cursor-default"
              )}
              whileHover={{ x: -4, y: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <div className="size-12 md:size-14 rounded-lg border-2 border-border bg-(--color-green) flex items-center justify-center mb-5 text-primary-foreground">
                {icons[i] && (() => {
                  const Icon = icons[i];
                  return <Icon className="size-6" strokeWidth={1.5} />;
                })()}
              </div>
              <h3 className="[font-family:var(--font-archivo)] font-bold text-lg text-(--color-cream) mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-(--color-code-muted) leading-relaxed">{item.content}</p>
              {i === 0 && <StairSvg />}
              {i === 1 && (
                <div className="mt-4 flex flex-col gap-1.5">
                  {["Lv.4", "Lv.3", "Lv.2 ✓"].map((lv, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div
                        className="h-2 rounded-sm flex-1 max-w-[85%]"
                        style={{
                          backgroundColor: j === 0 ? "var(--color-yellow)" : j === 1 ? "var(--color-green)" : "var(--color-dark-green)",
                          width: j === 0 ? "85%" : j === 1 ? "60%" : "100%",
                        }}
                      />
                      <span className="font-mono text-[0.6rem] text-(--color-code-muted)">{lv}</span>
                    </div>
                  ))}
                </div>
              )}
              {i === 2 && (
                <div className="mt-4 bg-(--color-code-panel) border border-border rounded-lg p-4">
                  <div className="font-mono text-[0.65rem] text-(--color-code-muted) mb-1.5">
                    {content.credentialNft}
                  </div>
                  <div className="[font-family:var(--font-archivo)] font-bold text-sm text-(--color-cream)">
                    {content.credentialName}
                  </div>
                  <div className="font-mono text-[0.6rem] text-(--color-yellow) mt-1">
                    ◆ {content.credentialVerified}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
