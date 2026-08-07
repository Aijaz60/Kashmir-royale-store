import CartProvider from "./context/CartContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),

  title: {
    default: "Kashmir Royale",
    template: "%s | Kashmir Royale",
  },

  description:
    "Shop authentic Kashmiri Shawls, Premium Pashmina, Aari Suits and handcrafted luxury collections from Kashmir Royale.",

  keywords: [
    "Kashmir Royale",
    "Kashmiri Shawls",
    "Pashmina",
    "Aari Suit",
    "Luxury Shawls",
    "Kashmir",
    "Handmade Shawls",
  ],

  authors: [
    {
      name: "Kashmir Royale",
    },
  ],

  creator: "Kashmir Royale",

  openGraph: {
    title: "Kashmir Royale",
    description:
      "Authentic Kashmiri Shawls, Pashmina & Luxury Collections.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000",
    siteName: "Kashmir Royale",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Kashmir Royale",
    description:
      "Authentic Kashmiri Shawls & Pashmina.",
  },

  robots: {
    index: true,
    follow: true,
    
  },
  themeColor: "#D4AF37",

category: "Fashion",

icons: {
  icon: "/favicon.ico",
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
        <CartProvider>
          {children}
        </CartProvider>

       <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"
/>
      </body>
    </html>
  );
}