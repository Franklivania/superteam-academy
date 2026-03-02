import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
};

export function SectionWrapper({
  children,
  className,
  id,
  as: Comp = "section",
}: SectionWrapperProps): React.ReactElement {
  return (
    <Comp id={id} className={cn("w-full py-16 md:py-24", className)}>
      {children}
    </Comp>
  );
}
