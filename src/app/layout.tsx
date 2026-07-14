import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@/components/shared/theme-provider";
import { publicEnv } from "@/lib/env/public";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
  title: { default: "Snippet Vault", template: "%s · Snippet Vault" },
  description:
    "A secure personal workspace for saving, organizing, and sharing reusable code snippets.",
  icons: { icon: "/brand/mark.svg" },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
