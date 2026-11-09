import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && env.length > 0) return env.replace(/\/$/, "");
  return "https://hamzaos.vercel.app";
}

const TITLE = "HamzaOS — Hamza Alkhaldi, Software Engineer · Mobile";
const DESCRIPTION =
  "A macOS-inspired portfolio by Hamza Alkhaldi: projects, research and a fast Recruiter View. Senior CS student at AUBH targeting graduate mobile/software engineering roles.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: TITLE,
    template: "%s · HamzaOS",
  },
  description: DESCRIPTION,
  applicationName: "HamzaOS",
  authors: [{ name: "Hamza Alkhaldi" }],
  creator: "Hamza Alkhaldi",
  publisher: "Hamza Alkhaldi",
  keywords: [
    "Hamza Alkhaldi",
    "HamzaOS",
    "portfolio",
    "software engineer",
    "mobile developer",
    "Android",
    "iOS",
    "Kotlin",
    "Jetpack Compose",
    "React Native",
    "AUBH",
    "Bahrain",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "HamzaOS",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  category: "portfolio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#22D3FF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vercel Analytics is wired in production only (set NEXT_PUBLIC_ENABLE_ANALYTICS=0 to disable).
  const analyticsEnabled =
    process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "0" &&
    process.env.NODE_ENV === "production";
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
