"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaButtonsProps = {
  primary_label: string;
  secondary_label: string;
  primary_href?: string;
  secondary_href?: string;
  on_primary_click?: () => void;
  on_secondary_click?: () => void;
  className?: string;
  variant?: "default" | "inverse";
};

export function CtaButtons({
  primary_label,
  secondary_label,
  primary_href = "#",
  secondary_href = "#",
  on_primary_click,
  on_secondary_click,
  className,
  variant = "default",
}: CtaButtonsProps): React.ReactElement {
  const primary_el = on_primary_click ? (
    <Button
      type="button"
      variant={variant === "inverse" ? "outline" : "default"}
      className={cn(
        variant === "inverse" &&
          "border-background bg-transparent text-background hover:bg-background hover:text-foreground"
      )}
      onClick={on_primary_click}
    >
      {primary_label}
    </Button>
  ) : (
    <Button
      asChild
      variant={variant === "inverse" ? "outline" : "default"}
      className={cn(
        variant === "inverse" &&
          "border-background bg-transparent text-background hover:bg-background hover:text-foreground"
      )}
    >
      <Link href={primary_href}>{primary_label}</Link>
    </Button>
  );

  const secondary_el = on_secondary_click ? (
    <Button type="button" variant="outline" onClick={on_secondary_click}>
      {secondary_label}
    </Button>
  ) : (
    <Button asChild variant="outline">
      <Link href={secondary_href}>{secondary_label}</Link>
    </Button>
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {primary_el}
      {secondary_el}
    </div>
  );
}
