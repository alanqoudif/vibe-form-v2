import type { Metadata } from "next";

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
  return children;
}
