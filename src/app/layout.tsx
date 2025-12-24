import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Voice RAG Chat - Real-time AI Assistant",
  description:
    "Real-time voice conversation with AI using GPT-4 Realtime API and PDF document search (RAG)",
  keywords: [
    "voice chat",
    "AI assistant",
    "RAG",
    "GPT-4",
    "real-time",
    "PDF search",
  ],
  authors: [{ name: "Oshri Shekuri" }],
  openGraph: {
    title: "Voice RAG Chat",
    description: "Real-time voice conversation with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
