import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://skywayaviators.com'),
  title: {
    default: 'Skyway Aviators — Flight Training in Lancaster, TX',
    template: '%s | Skyway Aviators',
  },
  description:
    'Premier Part 61 flight school near Dallas, Texas offering private pilot through commercial certifications, time-building packages, and aircraft rental at Lancaster Regional Airport (KLNC).',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    siteName: 'Skyway Aviators',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
        <HeaderWrapper />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
