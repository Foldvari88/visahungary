import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AiChatWidget } from "@/components/ai-chat-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VisaHungary Eligibility Calculator",
  description: "Find your likely Hungary visa or residence route in a few minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}
