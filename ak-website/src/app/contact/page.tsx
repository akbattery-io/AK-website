import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ContactContent } from "@/components/ContactContent";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us | AK Batteries & RO Solutions",
  description: "Get in touch with AK Batteries & RO Solutions for doorstep sales, installation, maintenance, and repair of water purifiers and battery inverters in Kannamangalam, Vellore, and surrounding areas.",
  alternates: {
    canonical: "https://ak-website-ashen.vercel.app/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <ContactContent />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
