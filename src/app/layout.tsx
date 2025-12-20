import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { ErrorBoundaryWrapper } from "@/components/error-boundary";
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
  // Get Supabase URL for preconnect (fallback if env var not available)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://*.supabase.co';
  const supabaseHost = supabaseUrl.replace(/^https?:\/\//, '').split('/')[0];
  
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="zOkN7Q1wCNFEe4F5gStZFsunUwjCDDaDeKSy0mtLshk"
        />
        
        {/* Resource Hints for Performance */}
        {/* Preconnect to Supabase for faster API calls */}
        {supabaseHost && (
          <link rel="preconnect" href={`https://${supabaseHost}`} crossOrigin="anonymous" />
        )}
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Font Preloading - Critical fonts only */}
        <link
          rel="preload"
          href="/fonts/Effra-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Effra-Medium.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/TheYearofHandicrafts-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-body`}
      >
        <ErrorBoundaryWrapper>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
