// @ts-nocheck
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Crowd&Cult — Admin",
    template: "%s | Crowd&Cult Admin",
  },
  description:
    "Internal admin console to review and approve artist and venue profile submissions for Crowd&Cult.",
  applicationName: "Crowd&Cult Admin",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crowd&Cult Admin",
  },
  icons: {
    icon: [
      { url: "/SHORT-LOGO.png", sizes: "192x192", type: "image/png" },
      { url: "/LOGO.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/SHORT-LOGO.png",
    apple: [{ url: "/SHORT-LOGO.png", sizes: "180x180", type: "image/png" }],
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}