import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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
  description: "Established in 2025, AK Batteries & RO Solutions provides fast, reliable sales, installation, maintenance, and repair services for batteries, inverters, and RO water purifiers.",
  keywords: ["AK Batteries kannamangalam", "RO Service kannamangalam", "Inverter Battery Sales kannamangalam", "Water Purifier Repair kannamangalam", "AK Batteries established 2025", "Battery installation doorstep"],
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
    >
      <title>AK Batteries and RO Solutions</title>
      <body className="min-h-full flex flex-col bg-[#FAFBFD] text-slate-900 font-sans selection:bg-rose-500 selection:text-white">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
