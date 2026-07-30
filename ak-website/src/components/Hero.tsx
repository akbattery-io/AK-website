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
    { text: "Genuine Products", Icon: BadgeCheck },
    { text: "Doorstep Installation", Icon: Wrench },
    { text: "Expert Technicians", Icon: UserCheck },
    { text: "Warranty Support", Icon: ShieldCheck },
    { text: "Affordable Pricing", Icon: Tag },
    { text: "Fast Response", Icon: Zap },
    { text: "Trusted Local Service", Icon: MapPin }
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
      className="relative overflow-hidden bg-[#F9FAFB] text-[#0B1B3A] min-h-[calc(100dvh-5.5rem)] flex flex-col justify-between py-10 sm:py-16"
    >
      {/* Giant Background Watermark Text - Positioned high behind headline on mobile */}
      <div className="absolute inset-x-0 top-16 sm:top-24 lg:top-1/3 flex items-center justify-center overflow-hidden pointer-events-none select-none opacity-10 sm:opacity-[0.12] z-0">
        <span className="text-[14vw] sm:text-8xl md:text-[12vw] lg:text-[14vw] font-black tracking-tighter text-[#0B1B3A] uppercase text-center whitespace-nowrap leading-none">
          AK BATTERIES
        </span>
      </div>

      {/* Radial Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">

          {/* 1. Top Light Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-rose-200/80 bg-rose-50/90 text-rose-700 text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-2xs select-none"
          >
            <Sparkles className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
            <span>Authorized Sales & Doorstep Service Specialist</span>
          </motion.div>

          {/* 2. Big Impact Bold Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#0B1B3A] leading-[1.05] max-w-4xl"
          >
            YOUR TRUSTED <span className="text-rose-600">BATTERY</span> & <span className="text-rose-600">RO PURIFIER</span> STORE
          </motion.h1>

          {/* 3. Description Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal"
          >
            Doorstep sales, installation & service across Kannamangalam, Vellore and nearby areas — budget to premium. Trusted by 1000+ happy homes since 2025.
          </motion.p>

          {/* 4. Action CTAs Buttons (Stacked full-width on mobile like reference layout) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none px-2"
          >
            <Link href="/water-purifier" className="w-full sm:w-72">
              <button className="w-full py-4 px-6 rounded-xl bg-[#0B1B3A] hover:bg-[#07132B] active:scale-[0.99] text-white font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer">
                <Droplets className="w-5 h-5 text-rose-500 shrink-0" />
                <span>EXPLORE RO PURIFIERS</span>
              </button>
            </Link>

            <Link href="/batteries-inverters" className="w-full sm:w-72">
              <button className="w-full py-4 px-6 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 active:scale-[0.99] text-[#0B1B3A] font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer">
                <BatteryCharging className="w-5 h-5 text-rose-600 shrink-0" />
                <span>EXPLORE BATTERIES</span>
              </button>
            </Link>
          </motion.div>

          {/* 5. Bottom Light Feature Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl pt-6"
          >
            {features.slice(0, 5).map((feature, idx) => {
              const IconComp = feature.Icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 text-slate-700 text-xs sm:text-sm font-semibold shadow-2xs hover:border-slate-300 hover:bg-slate-50 transition-colors select-none"
                >
                  <IconComp className="w-4 h-4 text-[#0B1B3A] shrink-0" />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </motion.div>

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
              <div className="w-11 h-11 rounded-full bg-[#14B8A6]/10 text-rose-600 flex items-center justify-center font-bold">
                <BatteryCharging className="w-5 h-5" />
              </div>
              {/* Accent-tinted tag top-right */}
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#14B8A6]/10 text-[#0D9488]">
                Popular Category
              </span>
            </div>
            {/* Title (Bold, 18px) */}
            <h3 className="text-lg font-bold text-[#0B1B3A] mb-2 group-hover:text-rose-600 transition-colors">
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
              <div className="w-11 h-11 rounded-full bg-[#14B8A6]/10 text-rose-600 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#14B8A6]/10 text-[#0D9488]">
                Pure Water
              </span>
            </div>
            {/* Title (Bold, 18px) */}
            <h3 className="text-lg font-bold text-[#0B1B3A] mb-2 group-hover:text-rose-600 transition-colors">
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
