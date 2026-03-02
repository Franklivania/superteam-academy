import type { ReactNode } from "react";
import { WebLayoutClient } from "./web-layout";

type WebLayoutProps = { children: ReactNode };

export default function WebLayout({ children }: WebLayoutProps): ReactNode {
  return <WebLayoutClient>{children}</WebLayoutClient>;
}
