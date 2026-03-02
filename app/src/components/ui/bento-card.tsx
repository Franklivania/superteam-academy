"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type BentoCardSize = "sm" | "md" | "lg";
type BentoCardAccent = "default" | "yellow" | "green";

interface BentoCardProps {
  size?: BentoCardSize;
  accent?: BentoCardAccent;
  tag?: string;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<BentoCardSize, string> = {
  sm: "",
  md: "",
  lg: "md:col-span-2",
};

export function BentoCard({
  size = "md",
  accent = "default",
  tag,
  children,
  className,
}: BentoCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-xl border-2 border-border bg-card p-5 md:p-6 overflow-hidden",
        "shadow-(--shadow-flat) dark:shadow-(--shadow-flat-yellow) hover:shadow-(--shadow-flat-xl) dark:hover:shadow-(--shadow-flat-yellow-lg)",
        sizeClasses[size],
        className
      )}
      whileHover={{ x: -3, y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {tag && (
        <span className="inline-flex px-2.5 py-1 mb-2 font-mono text-[0.65rem] font-medium tracking-wider bg-accent text-accent-foreground border border-border rounded-none">
          {tag}
        </span>
      )}
      {children}
    </motion.div>
  );
}
