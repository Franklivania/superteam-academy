import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BentoCardProps = {
  children: ReactNode;
  className?: string;
};

/** Raised card container: rounded, shadow, not flat. Use for section content. */
export function BentoCard({ children, className }: BentoCardProps): React.ReactElement {
  return <div className={cn("bento p-6 md:p-8 lg:p-10", className)}>{children}</div>;
}

type BentoGridProps = {
  children: ReactNode;
  className?: string;
};

export function BentoGrid({ children, className }: BentoGridProps): React.ReactElement {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

type BentoCellSize = "large" | "medium" | "small";

type BentoCellProps = {
  children: ReactNode;
  size: BentoCellSize;
  className?: string;
};

const size_classes: Record<BentoCellSize, string> = {
  large: "lg:col-span-2 lg:row-span-2",
  medium: "lg:col-span-2 lg:row-span-1",
  small: "lg:col-span-1 lg:row-span-1",
};

export function BentoCell({ children, size, className }: BentoCellProps): React.ReactElement {
  return (
    <div
      className={cn(
        "bento p-6 text-card-foreground",
        size_classes[size],
        className
      )}
    >
      {children}
    </div>
  );
}
