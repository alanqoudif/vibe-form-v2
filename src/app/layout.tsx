import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/providers/locale-provider";
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
  title: "Vibe Form - Create Forms with AI",
  description: "Turn your ideas into professional surveys in seconds. Get responses from our community.",
  keywords: ["forms", "surveys", "AI", "questionnaire", "feedback", "research"],
  authors: [{ name: "Vibe Form" }],
  openGraph: {
    title: "Vibe Form - Create Forms with AI",
    description: "Turn your ideas into professional surveys in seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Form - Create Forms with AI",
    description: "Turn your ideas into professional surveys in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-body`}
      >
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
