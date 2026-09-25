import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "../styles/design-tokens.css";
import "../styles/reset.css";
import "../styles/animations.css";
import "../styles/utilities.css";
import "../styles/layout.css";
import "../styles/components.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lume — Watch. Create. Connect.",
  description:
    "Lume — A premium video sharing and social platform. Watch, create, and connect.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
