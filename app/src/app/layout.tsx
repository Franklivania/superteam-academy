import type { ReactElement, ReactNode } from "react";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>): ReactElement {
  return (
    <html suppressHydrationWarning>
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
