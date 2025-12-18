import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateSEOMetadata({
  locale: "en",
  path: "/",
  type: "website",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="zOkN7Q1wCNFEe4F5gStZFsunUwjCDDaDeKSy0mtLshk"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-body`}
      >
        <ErrorBoundary>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
