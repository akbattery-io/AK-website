"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { ContactContent } from "@/components/ContactContent";

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
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs">
        <p>© {new Date().getFullYear()} AK Batteries & RO Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
