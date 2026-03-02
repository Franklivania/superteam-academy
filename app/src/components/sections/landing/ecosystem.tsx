"use client";

import { motion } from "motion/react";
import { SectionLabel } from "@/components/ui/section-label";
import { FlatButton } from "@/components/ui/flat-button";
import type { EcosystemAlignmentContent } from "@/lib/types/landing";

interface EcosystemSectionProps {
  content: EcosystemAlignmentContent;
}

export function EcosystemSection({ content }: EcosystemSectionProps) {
  return (
    <section
      id="ecosystem"
      className="py-20 md:py-24 px-4 md:px-8 bg-(--color-green) border-t-2 border-b-2 border-border"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <SectionLabel className="text-(--color-cream)">{content.label}</SectionLabel>
          <h2 className="text-(--color-cream) text-3xl md:text-4xl font-extrabold leading-tight mb-4 whitespace-pre-line [font-family:var(--font-archivo)]">
            {content.title}
          </h2>
          <p className="text-(--color-cream) text-base leading-relaxed mb-6">
            {content.subtitle}
          </p>
          <ul className="list-none mt-8 flex flex-col gap-3">
            {content.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-(--color-cream) text-sm md:text-base">
                <span className="size-5 rounded-none border-2 border-black/20 bg-(--color-yellow) flex items-center justify-center shrink-0 font-black text-[0.7rem] text-(--color-near-black)">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <FlatButton
              href="#features"
              variant="primary"
              className="bg-(--color-cream)! text-(--color-near-black)! border-2 border-border"
            >
              {content.cta} →
            </FlatButton>
          </div>
        </div>
        <div className="bg-black/15 border-2 border-white/20 rounded-xl p-8 min-h-[280px] flex items-center justify-center">
          <EcosystemSvg />
        </div>
      </div>
    </section>
  );
}

function EcosystemSvg() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 220" fill="none" className="max-h-[280px]" aria-hidden>
      <circle cx="150" cy="110" r="24" fill="var(--color-green)" stroke="var(--color-yellow)" strokeWidth={2} />
      <text x="150" y="115" textAnchor="middle" fill="white" fontFamily="var(--font-mono)" fontSize="9">CORE</text>
      {[
        { cx: 60, cy: 55, label: "DEV" },
        { cx: 240, cy: 55, label: "ANCHOR" },
        { cx: 60, cy: 165, label: "dAPP" },
        { cx: 240, cy: 165, label: "NFT" },
      ].map((node, i) => (
        <g key={i}>
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={6}
            fill="var(--color-dark-green)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1.5}
            animate={{ opacity: [1, 0.4, 1], r: [6, 9, 6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
          <text x={node.cx} y={node.cy + 4} textAnchor="middle" fill="#c8e8d4" fontFamily="var(--font-mono)" fontSize="7">{node.label}</text>
        </g>
      ))}
      <line x1="126" y1="96" x2="76" y2="67" stroke="rgba(255,210,63,0.4)" strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1="174" y1="96" x2="224" y2="67" stroke="rgba(255,210,63,0.4)" strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1="126" y1="124" x2="76" y2="153" stroke="rgba(255,210,63,0.4)" strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1="174" y1="124" x2="224" y2="153" stroke="rgba(255,210,63,0.4)" strokeWidth={1.5} strokeDasharray="4 4" />
      <circle cx="105" cy="30" r="4" fill="rgba(255,210,63,0.5)" />
      <circle cx="210" cy="185" r="3" fill="rgba(255,210,63,0.4)" />
      <circle cx="270" cy="110" r="5" fill="rgba(0,140,76,0.6)" />
      <circle cx="30" cy="110" r="4" fill="rgba(0,140,76,0.5)" />
    </svg>
  );
}
