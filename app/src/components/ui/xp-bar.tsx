"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface XpBarProps {
  valuePercent: number;
  className?: string;
  barClassName?: string;
}

export function XpBar({
  valuePercent,
  className,
  barClassName,
}: XpBarProps) {
  return (
    <div
      className={cn(
        "relative h-2.5 border-2 border-border bg-(--color-surface-alt) dark:bg-(--color-surface-dark-alt) overflow-hidden rounded-none",
        className
      )}
    >
      <motion.div
        className={cn(
          "absolute inset-y-0 left-0 bg-primary dark:bg-accent",
          barClassName
        )}
        initial={{ width: 0 }}
        whileInView={{ width: `${valuePercent}%` }}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  );
}
