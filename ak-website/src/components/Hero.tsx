"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BadgeCheck, Wrench, UserCheck, ShieldCheck, Tag, Zap, MapPin, ShoppingCart } from "lucide-react";
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
      className="relative pt-12 pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 overflow-hidden"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">


          {/* Social Proof Group */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8 flex items-center justify-center px-4"
          >
            {/* <div className="flex flex-wrap items-center justify-center gap-2.5">
        
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-rose-50/60 border border-rose-100/50 shadow-[0_2px_10px_rgba(225,29,72,0.01)] backdrop-blur-[1px] select-none text-xs font-bold text-rose-600">
                <Wrench className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>1000+ Services Completed</span>
              </div>

              
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-50/80 border border-slate-200/60 shadow-[0_2px_10px_rgba(15,23,42,0.01)] backdrop-blur-[1px] select-none text-xs font-bold text-slate-600">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>5-6 Installations Daily</span>
              </div>
            </div> */}
          </motion.div>

          {/* Main Title Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight max-w-4xl leading-[1.2] md:leading-[1.25]"
            style={{ fontFamily: "system-ui" }}
          >
            AK BATTERIES <br />
            <span className="block mt-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wider bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
              RO WATER PURIFIERS & BATTERIES
            </span>
          </motion.h1>

          {/* Service Areas Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-medium"
          >
            Providing doorstep sales, installation, and services across{" "}
            <span className="text-slate-900 font-bold ">Kannamangalam</span>,{" "}
            <span className="text-slate-900 font-semibold">Vellore</span>, and surrounding areas.
          </motion.p>

          {/* Call To Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-row justify-center gap-3 w-full sm:w-auto px-4 sm:px-0"
          >
            <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} className="flex-1 sm:flex-initial">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  window.open("https://wa.me/918870534049?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20your%20Battery%20and%20RO%20services.", "_blank", "noopener,noreferrer");
                }}
                className="group shadow-sm hover:shadow-md w-full sm:w-auto bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white border-transparent transition-all text-xs sm:text-sm h-11"
              >
                Enquire now
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>

          </motion.div>
        </div>

        {/* Centered Social Proof Review Card */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center py-6 px-6 bg-white/80 rounded-md border border-slate-200/50 shadow-[0_4px_30px_rgba(15,23,42,0.02)] backdrop-blur-md max-w-[280px] w-full mx-auto"
          >
            {/* Avatar Overlap */}
            <div className="flex -space-x-3 mb-3">
              {avatars.map((avatar, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.15, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className={`w-10 h-10 rounded-full border-2 border-white ${avatar.bg} bg-gradient-to-tr ${avatar.grad} flex items-center justify-center text-white text-[11px] font-bold shadow-sm select-none cursor-pointer relative hover:z-10`}
                >
                  {avatar.label}
                </motion.div>
              ))}
              <motion.div
                whileHover={{ scale: 1.15, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-10 h-10 rounded-full border-2 border-white bg-slate-950 flex items-center justify-center text-white text-[11px] font-bold shadow-sm cursor-pointer relative hover:z-10"
              >
                +1000
              </motion.div>
            </div>

            {/* Trust Text */}
            <div className="text-center">
              <span className="block text-slate-800 font-extrabold text-base leading-tight">
                1000+ Happy Customers
              </span>
              <div className="flex items-center justify-center gap-0.5 mt-1.5 mb-1.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block">
                Verified Local Reviews
              </span>
            </div>
          </motion.div>
        </div>

        {/* Unified Trusted Partners Section at the bottom of Hero */}
        {/* <div className="mt-20 md:mt-28 pt-12 border-t border-slate-100/70">
          <h2 className="text-center text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-8">
            Our Trusted Partners
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12 md:gap-x-16 lg:gap-x-20">
            {partners.map((partner, idx) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="h-7 sm:h-9 flex items-center justify-center grayscale opacity-45 hover:opacity-90 hover:grayscale-0 transition-all duration-500 cursor-pointer select-none"
                title={partner.name}
              >
                {partner.src ? (
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={partner.width}
                    height={partner.height}
                    className="max-h-full max-w-[120px] w-auto h-auto object-contain"
                  />
                ) : (
                  <div className="h-6 sm:h-7 text-slate-500 hover:text-rose-600 transition-colors flex items-center justify-center">
                    {partner.logo}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
