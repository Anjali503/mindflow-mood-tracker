import type { Metadata } from "next";
import { Outfit, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindFlow — Intelligent Mood Tracking & Emotional Analytics",
  description:
    "Understand your emotions, track moods with ease, and gain AI-inspired insights with MindFlow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${dmSans.variable} ${playfair.variable}`}
    >
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
