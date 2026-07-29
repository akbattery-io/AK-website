"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BadgeCheck, Wrench, UserCheck, ShieldCheck, Tag, Zap, MapPin, ShoppingCart, Droplets, BatteryCharging, ChevronRight, PhoneCall } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export function Hero() {
  const router = useRouter();
  const features = [
    { text: "Genuine Products", Icon: BadgeCheck, color: "text-blue-600 bg-blue-50 border-blue-100 shadow-[0_1px_2px_rgba(37,99,235,0.05)]" },
    { text: "Doorstep Installation", Icon: Wrench, color: "text-amber-600 bg-amber-50 border-amber-100 shadow-[0_1px_2px_rgba(217,119,6,0.05)]" },
    { text: "Expert Technicians", Icon: UserCheck, color: "text-purple-600 bg-purple-50 border-purple-100 shadow-[0_1px_2px_rgba(147,51,234,0.05)]" },
    { text: "Warranty Support", Icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-[0_1px_2px_rgba(16,185,129,0.05)]" },
    { text: "Affordable Pricing", Icon: Tag, color: "text-rose-600 bg-rose-50 border-rose-100 shadow-[0_1px_2px_rgba(225,29,72,0.05)]" },
    { text: "Fast Response", Icon: Zap, color: "text-yellow-600 bg-yellow-50 border-yellow-100 shadow-[0_1px_2px_rgba(202,138,4,0.05)]" },
    { text: "Trusted Local Service", Icon: MapPin, color: "text-indigo-600 bg-indigo-50 border-indigo-100 shadow-[0_1px_2px_rgba(79,70,229,0.05)]" }
  ];
  // Avatars data for social proof
  const avatars = [
    { bg: "bg-blue-500", label: "JD", grad: "from-blue-400 to-blue-600" },
    { bg: "bg-emerald-500", label: "AS", grad: "from-emerald-400 to-emerald-600" },
    { bg: "bg-rose-500", label: "RK", grad: "from-rose-400 to-rose-600" },
    { bg: "bg-amber-500", label: "ML", grad: "from-amber-400 to-amber-600" },
  ];

  interface Partner {
    name: string;
    color: string;
    src?: string;
    width?: number;
    height?: number;
    logo?: React.ReactNode;
  }

  // Partners data for trusted partners strip
  const partners: Partner[] = [
    {
      name: "EXIDE",
      color: "text-[#DC2626]",
      src: "/logos/1.png",
      width: 206,
      height: 41,
    },
    {
      name: "AMARON",
      color: "text-[#4CAF50]",
      src: "/logos/2.jpg",
      width: 178,
      height: 56,
    },
    {
      name: "LUMINOUS",
      color: "text-[#0284C7]",
      src: "/logos/3.webp",
      width: 148,
      height: 35,
    },
    {
      name: "purosis",
      color: "text-[#10B981]",
      logo: (
        <svg className="max-h-full max-w-full" viewBox="0 0 110 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="22" fontFamily="Georgia, serif" fontStyle="italic" fontSize="20" fill="currentColor">purosis</text>
          <circle cx="85" cy="8" r="2.5" fill="#10B981" />
        </svg>
      ),
    },
    {
      name: "Aquaguard",
      color: "text-[#0369A1]",
      src: "/logos/5.png",
      width: 340,
      height: 231,
    },
    {
      name: "Aqua Era",
      color: "text-[#0284C7]",
      src: "/logos/4.png",
      width: 432,
      height: 282,
    },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#F9FAFB]"
    >
      {/* 100vh Vertically Centered Hero Section */}
      <div className="min-h-[calc(100dvh-5.5rem)] flex flex-col items-center justify-center py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center w-full my-auto">

          {/* Headline (Navy #0B1B3A, Bold 28px/mobile) */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#0B1B3A] text-[28px] sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight max-w-4xl leading-tight"
            style={{ fontFamily: "system-ui" }}
          >
            AK BATTERIES <br />
            {/* Subheadline (Teal #14B8A6 accent, 16px semibold/bold, letter-spacing) */}
            <span className="block mt-2.5 sm:mt-4 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wider text-[#14B8A6]">
              RO WATER PURIFIERS & BATTERIES
            </span>
          </motion.h1>

          {/* Service Area Body (Medium Gray #6B7280, 14px regular) */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-[#6B7280] text-sm sm:text-base md:text-lg max-w-sm sm:max-w-xl mx-auto leading-relaxed font-normal"
          >
            Doorstep sales, installation & service across Kannamangalam, Vellore and nearby areas.
          </motion.p>

          {/* Single Primary Action: Call Now for Installation (Max Content Width) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 sm:mt-8 flex justify-center w-full px-2 sm:px-0"
          >
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} className="w-auto">
              <a href="tel:+918870534049" className="inline-block w-auto">
                <Button
                  variant="primary"
                  size="md"
                  className="group shadow-md hover:shadow-lg active:scale-[0.99] w-auto max-w-max bg-[#0B1B3A] hover:bg-[#07132B] text-white hover:text-white border-transparent transition-all text-xs sm:text-base h-12 min-h-[48px] px-6 font-extrabold inline-flex items-center justify-center gap-2.5 rounded-full cursor-pointer whitespace-nowrap"
                >
                  <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-[#14B8A6] group-hover:scale-110 transition-transform shrink-0" />
                  <span className="text-white">Call Now for Installation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0 ml-1 text-white" />
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Section 4: Trust/Stats Card - Single Clean Card */}
          <div className="mt-8 sm:mt-10 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center justify-center py-5 px-6 bg-white rounded-2xl border border-slate-200/80 shadow-md max-w-[290px] sm:max-w-[320px] w-full mx-auto text-center"
            >
              {/* Evenly spaced avatar row */}
              <div className="flex -space-x-2.5 mb-3">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className={`w-9 h-9 rounded-full border-2 border-white ${avatar.bg} bg-gradient-to-tr ${avatar.grad} flex items-center justify-center text-white text-[11px] font-bold shadow-sm select-none relative`}
                  >
                    {avatar.label}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full border-2 border-white bg-[#0B1B3A] flex items-center justify-center text-white text-[11px] font-bold shadow-sm relative">
                  +1K
                </div>
              </div>

              {/* "1000+ Happy Customers" — Bold */}
              <span className="block text-[#0B1B3A] font-extrabold text-base sm:text-lg leading-tight">
                1000+ Happy Customers
              </span>

              {/* Star rating on its own line below in Teal accent color */}
              <div className="flex items-center justify-center gap-1 mt-2 text-[#14B8A6]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-[#14B8A6]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>

        {/* Section 5: Category Cards (Repeatable Component) */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
          {/* Card 1: Batteries & Inverters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                {/* 40-48px circular badge top-left */}
                <div className="w-11 h-11 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center font-bold">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                {/* Accent-tinted tag top-right */}
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#14B8A6]/10 text-[#0D9488]">
                  Popular Category
                </span>
              </div>
              {/* Title (Bold, 18px) */}
              <h3 className="text-lg font-bold text-[#0B1B3A] mb-2 group-hover:text-[#14B8A6] transition-colors">
                Batteries & Inverters
              </h3>
              {/* Description (Gray, 13px, 2-3 lines) */}
              <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed mb-4">
                Genuine Exide, Amaron & Luminous batteries for home UPS, inverters, and vehicles with free doorstep delivery and expert installation.
              </p>
            </div>

            {/* Max-content CTA button at bottom: Solid Navy, rounded-full */}
            <div className="pt-4 border-t border-slate-100 flex justify-center">
              <Link href="/batteries-inverters" className="inline-block">
                <Button
                  variant="primary"
                  size="md"
                  className="w-auto max-w-max bg-[#0B1B3A] hover:bg-[#07132B] text-white hover:text-white font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-full inline-flex items-center justify-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
                >
                  <span className="text-white">Explore Batteries & Inverters</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Card 2: RO Water Purifiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                {/* 40-48px circular badge top-left */}
                <div className="w-11 h-11 rounded-full bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center font-bold">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#14B8A6]/10 text-[#0D9488]">
                  Pure Water
                </span>
              </div>
              {/* Title (Bold, 18px) */}
              <h3 className="text-lg font-bold text-[#0B1B3A] mb-2 group-hover:text-[#14B8A6] transition-colors">
                RO Water Purifiers
              </h3>
              {/* Description (Gray, 13px, 2-3 lines) */}
              <p className="text-[#6B7280] text-xs sm:text-sm leading-relaxed mb-4">
                Top brand RO purifiers (Purosis, Aquaguard, Aqua Era), filter replacements, periodic maintenance, and rapid technician support.
              </p>
            </div>

            {/* Max-content CTA button at bottom: Solid Navy, rounded-full */}
            <div className="pt-4 border-t border-slate-100 flex justify-center">
              <Link href="/water-purifier" className="inline-block">
                <Button
                  variant="primary"
                  size="md"
                  className="w-auto max-w-max bg-[#0B1B3A] hover:bg-[#07132B] text-white hover:text-white font-bold text-xs uppercase tracking-wider h-11 px-6 rounded-full inline-flex items-center justify-center gap-1.5 transition-all shadow-sm whitespace-nowrap"
                >
                  <span className="text-white">Explore RO Water Purifiers</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Unified Trusted Partners Section at the bottom of Hero */}
    </section>
  );
}
