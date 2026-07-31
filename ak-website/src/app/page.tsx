import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AK Batteries & RO Solutions Kannamangalam | Doorstep Battery, Inverter & Water Purifier Service",
  description: "Best Battery, Inverter & RO Water Purifier shop in Kannamangalam. Doorstep sales, installation and repair for Exide, Amaron, Purosis across Kannamangalam & Vellore.",
  alternates: {
    canonical: "https://ak-website-ashen.vercel.app",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
      </main>

      <Footer />
    </div>
  );
}

