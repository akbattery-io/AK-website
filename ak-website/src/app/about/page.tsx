import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AboutContent } from "@/components/AboutContent";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | AK Batteries & RO Solutions",
  description: "Learn more about our journey, core values, expert doorstep installation, and maintenance services for battery inverters and RO water purifiers in Kannamangalam & Vellore.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <AboutContent />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
