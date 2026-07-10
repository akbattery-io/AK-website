"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { AboutContent } from "@/components/AboutContent";
import { EnquiryModal } from "@/components/EnquiryModal";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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

      {/* Lead capture modal */}
      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
