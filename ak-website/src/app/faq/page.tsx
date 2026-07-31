import * as React from "react";
import { Header } from "@/components/Header";
import { FAQ } from "@/components/FAQ";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | AK Batteries & RO Solutions",
  description: "Get answers to common queries about battery selection, backups, maintenance periods, and RO water purifier servicing.",
  keywords: ["RO purifier FAQ", "Battery selection help", "Inverter backup questions", "AK Batteries service questions", "TDS water purifier questions"],
  alternates: {
    canonical: "https://ak-website-ashen.vercel.app/faq",
  },
};

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-8 sm:pt-12">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
