"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { FlatButton } from "@/components/ui/flat-button";
import type { CtaBannerContent } from "@/lib/types/landing";

interface CtaBannerProps {
  content: CtaBannerContent;
}

export function CtaBanner({ content }: CtaBannerProps) {
  return (
    <section
      id="cta"
      className="py-12 md:py-16 px-4 md:px-8 bg-accent border-t-2 border-b-2 border-border"
    >
      <div className="max-w-[1200px] mx-auto text-center">
        <SectionLabel className="text-(--color-dark-green) justify-center">
          {content.label}
        </SectionLabel>
        <h2 className="text-foreground text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 [font-family:var(--font-archivo)] whitespace-pre-line">
          {content.title}
        </h2>
        <p className="font-mono text-sm md:text-base tracking-widest text-muted-foreground mb-8">
          {content.subtext}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <FlatButton href="#features" variant="primary" size="lg" className="bg-(--color-near-black)! text-(--color-cream)!">
            {content.ctaPrimary} →
          </FlatButton>
          <FlatButton href="#features" variant="outline" size="lg" className="text-foreground! border-border!">
            {content.ctaSecondary}
          </FlatButton>
        </div>
      </div>
    </section>
  );
}
