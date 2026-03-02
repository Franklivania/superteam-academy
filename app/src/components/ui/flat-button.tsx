"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type FlatButtonVariant = "primary" | "outline" | "yellow";
type FlatButtonSize = "sm" | "md" | "lg";

interface FlatButtonProps {
  variant?: FlatButtonVariant;
  size?: FlatButtonSize;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<FlatButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground border-2 border-border shadow-(--shadow-flat) dark:shadow-(--shadow-flat-yellow)",
  outline:
    "bg-transparent text-foreground border-2 border-border shadow-(--shadow-flat) dark:shadow-(--shadow-flat-yellow)",
  yellow:
    "bg-accent text-accent-foreground border-2 border-border shadow-(--shadow-flat)",
};

const sizeClasses: Record<FlatButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export function FlatButton({
  variant = "primary",
  size = "md",
  href,
  onClick,
  children,
  className,
}: FlatButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-semibold rounded-none transition-colors [font-family:var(--font-archivo)]";
  const classes = cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/90",
    className
  );

  const motionProps = {
    whileHover: { x: -2, y: -2 },
    whileTap: { x: 2, y: 2 },
    transition: { type: "spring" as const, stiffness: 400, damping: 20 },
  };

  if (href) {
    return (
      <motion.span {...motionProps}>
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
