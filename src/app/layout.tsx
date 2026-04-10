import type { Metadata } from "next";
import { DM_Serif_Display, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hobbyistgames.com"),
  title: "Hobbyist Games — Jiu-Jitsu RPG",
  description:
    "A pixel-art RPG where Brazilian Jiu-Jitsu meets adventure. Train, fight, and build your legacy. Coming soon.",
  icons: {
    icon: "/brand/favicon-32.png",
    apple: "/brand/favicon-180.png",
  },
  openGraph: {
    title: "Hobbyist Games — Jiu-Jitsu RPG",
    description:
      "A pixel-art RPG where Brazilian Jiu-Jitsu meets adventure. Coming soon.",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
