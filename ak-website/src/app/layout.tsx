import type { Metadata } from "next";
import Image from "next/image";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PageLoader } from "@/components/PageLoader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ak-website-ashen.vercel.app"),
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  title: "AK Batteries & RO Solutions kannamangalam",
  description: "Battery, Inverter & RO Water Purifier shop in Kannamangalam. Doorstep service for Exide, Amaron, Purosis in Kannamangalam & Vellore.",
  keywords: [
    "AK Batteries Kannamangalam",
    "Battery Shop Kannamangalam",
    "RO Service Kannamangalam",
    "Inverter Battery Dealer Kannamangalam",
    "Amaron Battery Kannamangalam",
    "Exide Battery Shop Kannamangalam",
    "Water Purifier Repair Kannamangalam",
    "RO Filter Service Kannamangalam",
    "Inverter Sales Kannamangalam",
    "Battery Home Delivery Kannamangalam",
    "Kannamangalam RO Water Purifier",
    "Battery Service Centre Kannamangalam"
  ],
  openGraph: {
    title: "AK Batteries & RO Solutions kannamangalam",
    description: "Doorstep sales, installation & service for batteries, inverters & RO water purifiers in Kannamangalam.",
    siteName: "AK Batteries & RO Solutions",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "AK Batteries & RO Solutions Kannamangalam",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AK Batteries & RO Solutions kannamangalam",
    description: "Doorstep sales, installation & service for batteries, inverters & RO water purifiers in Kannamangalam.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "AK Batteries & RO Solutions",
  "telephone": "+918870534049",
  "email": "akbattery.ro@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Main Road",
    "addressLocality": "Kannamangalam",
    "addressRegion": "Tamil Nadu",
    "postalCode": "632311",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "12.7533",
    "longitude": "79.1557"
  },
  "priceRange": "₹₹",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "08:00",
    "closes": "21:00"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "Kannamangalam" },
    { "@type": "AdministrativeArea", "name": "Arani" },
    { "@type": "AdministrativeArea", "name": "Vellore" },
    { "@type": "AdministrativeArea", "name": "Polur" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFBFD] text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
        <PageLoader />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
