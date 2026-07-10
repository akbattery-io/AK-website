"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { ContactContent } from "@/components/ContactContent";
import Footer from "@/components/Footer";

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
