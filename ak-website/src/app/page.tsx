"use client";

import * as React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import { EnquiryModal } from "@/components/EnquiryModal";
import { Clock, Mail, Phone, Pin } from "lucide-react";

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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Company */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                AK Batteries & RO Solutions
              </h3>
              <p className="text-sm leading-6">
                Your trusted partner for premium batteries, RO water purifiers,
                genuine spare parts, installation, and maintenance services.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-white transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white my-5">
                Contact Info
              </h3>

              <div className="space-y-4 text-sm">

                <div className="flex items-start gap-3">
                  <Pin className="w-5 h-5 mt-0.5" />
                  <span className="leading-6">
                    Your Business Address
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 " />
                  <a
                    href="tel:+918870534049"
                    className="hover:text-white transition-colors"
                  >
                    +91 88705 34049
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <a
                    href="mailto:akbattery.ro@gmail.com"
                    className="hover:text-white transition-colors break-all"
                  >
                    akbattery.ro@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>Mon - Sat : 9:00 AM - 7:00 PM</span>
                </div>

              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} AK Batteries & RO Solutions. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Lead capture modal */}
      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

