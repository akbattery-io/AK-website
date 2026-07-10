"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, Users, Award, Landmark, Trophy, Clock, BadgeCheck } from "lucide-react";

export function AboutContent() {
  const pillars = [
    {
      title: "Quality Products",
      description: "We are authorized dealers for premium battery and purifier brands. We strictly distribute 100% original manufacturer products with official warranty cards.",
      icon: <Award className="w-6 h-6 text-rose-500" />,
    },
    {
      title: "Expert Servicing",
      description: "Our field engineers are certified and undergo regular training to service and install multi-brand inverters and RO water systems perfectly.",
      icon: <Users className="w-6 h-6 text-rose-500" />,
    },
    {
      title: "Fast Doorstep Service",
      description: "Located locally, we pride ourselves on responding to service and repair calls within 2 hours. Prompt and reliable delivery at your convenience.",
      icon: <Truck className="w-6 h-6 text-rose-500" />,
    },
    {
      title: "Honest Guarantee",
      description: "No hidden call-out fees or inflated pricing. We estimate repairs transparently and replace filters and battery elements with genuine spares.",
      icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
    },
  ];

  const stats = [
    { value: "2025", label: "Established" },
    { value: "200+", label: "Happy Homes" },
    { value: "2 Hrs", label: "Response Time" },
    { value: "100%", label: "Genuine Spares" },
  ];

  return (
    <div className="py-16 sm:py-24 bg-mesh-gradient min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block mb-4">
              Our Journey
            </span>
            <h1 className="text-gradient text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Powering Homes, <br />
              Purifying Life
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              Established in 2025, AK Batteries & RO Solutions was founded on a simple mission: to bridge the gap between premium home utility sales and highly reliable doorstep services.
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We realized that home power backups (inverters) and drinking water purifiers (RO filters) are the two most critical devices for family safety and comfort, yet servicing them is often slow and complicated. We solve this by bringing factory-certified repairs, genuine battery components, and clean water filter cartridges directly to your home.
            </p>
          </motion.div>

          {/* Stats Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 sm:gap-6 bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(15,23,42,0.02)] border border-slate-100/80"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100 flex flex-col justify-center">
                <span className="block text-rose-600 font-extrabold text-3xl sm:text-4xl tracking-tight mb-1 select-none">
                  {stat.value}
                </span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pillars / Values Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-gradient text-3xl font-extrabold tracking-tight mb-4">
              Our Core Promises
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Every sales inquiry, inspection call, and emergency filter replacement is backed by our key business tenets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 shadow-[0_4px_30px_rgba(15,23,42,0.01)] border border-slate-100/80 hover:shadow-[0_8px_30px_rgba(225,29,72,0.04)] hover:border-rose-100 transition-all duration-300 flex gap-4 sm:gap-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center flex-shrink-0 border border-rose-100/50">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
