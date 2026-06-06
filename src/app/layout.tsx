import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hikorea.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HiKorea — Learn Korean Online",
    template: "%s | HiKorea",
  },
  description:
    "Free Korean learning materials for English speakers. Master Hangul, grammar, vocabulary, and everyday phrases.",
  keywords: ["learn korean", "korean language", "hangul", "korean grammar", "korean for beginners"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HiKorea",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
