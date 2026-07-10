import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Pretendard Variable, self-hosted for Korean (CJK) glyphs. Paired with Geist
// for Latin via the --font-sans stack in globals.css.
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

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
      className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <FirebaseAnalytics />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
