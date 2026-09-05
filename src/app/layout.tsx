import type { Metadata } from "next";
import React from "react";
import { Poppins, Cairo } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dahab Dream Tour | Discover Egypt Like Never Before",
  description: "Experience luxury travel to Egypt's most breathtaking destinations. Dahab, Hurghada, Sharm El Sheikh - exclusive packages for honeymooners, adventurers, and luxury seekers.",
  keywords: ["Egypt travel", "Dahab tours", "Hurghada", "Sharm El Sheikh", "luxury Egypt", "Red Sea diving", "Egypt honeymoon", "Dahab Dream Tour"],
  authors: [{ name: "Dahab Dream Tour" }],
  openGraph: {
    title: "Dahab Dream Tour | Discover Egypt Like Never Before",
    description: "Experience luxury travel to Egypt's most breathtaking destinations.",
    type: "website",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${poppins.variable} ${cairo.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
