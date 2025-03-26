import React, { Suspense, lazy } from "react";
import CyberIndustrialBackground from "@/components/ui/CyberIndustrialBackground";
import PageTransition from "@/components/PageTransition";
import { CyberErrorBoundary } from "@/components/ui/CyberErrorBoundary";
import CyberTerminal from "@/components/ui/CyberTerminal";
import "@/styles/globals.css";
import "@fontsource/orbitron";
import "@fontsource/share-tech-mono";
import "@fontsource/permanent-marker";
import FractalDotGrid from "@/components/FractalDotGrid";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Innovare Technical Club",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <CyberIndustrialBackground />
        <CyberErrorBoundary>
        <FractalDotGrid />
          <PageTransition>
            {children}
          </PageTransition>
        </CyberErrorBoundary>
      </body>
    </html>
  );
}
