"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import { EnquiryModal } from "@/components/EnquiryModal";
import { Clock, Mail, Phone, Pin } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />

      {/* Lead capture modal */}
      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

