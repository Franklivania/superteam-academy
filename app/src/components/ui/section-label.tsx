import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-mono text-xs tracking-widest uppercase text-primary dark:text-accent mb-3",
        className
      )}
    >
      // {children}
    </p>
  );
}
