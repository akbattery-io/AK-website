"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall } from "lucide-react";

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    // Show a tooltip helper after 3.5 seconds to guide the user
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-3 select-none pb-[env(safe-area-inset-bottom)]">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-2 bg-white text-slate-800 px-4 py-2.5 rounded-md shadow-[0_4px_20px_rgba(15,23,42,0.12)] border border-slate-100 font-semibold text-sm whitespace-nowrap mb-1"
          >
            <span className="w-2.5 h-2.5 rounded-md bg-emerald-500" />
            <span>Need help? Call or Chat with us!</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="ml-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-base cursor-pointer focus:outline-none"
              aria-label="Close tooltip"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vertical Stack of Floating Buttons */}
      <div className="flex flex-col items-center gap-3">
        {/* Floating Call Button */}
        <motion.a
          href="tel:+918870534049"
          aria-label="Call AK Batteries Specialist"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#0B1B3A] text-white rounded-full shadow-[0_6px_24px_rgba(11,27,58,0.35)] hover:shadow-[0_8px_32px_rgba(11,27,58,0.5)] transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-[#0B1B3A]/40 cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <PhoneCall className="w-6 h-6 text-white" />
        </motion.a>

        {/* Floating WhatsApp Button */}
        <motion.a
          href="https://wa.me/918870534049?text=Hello! I visited your website and want to enquire about your services."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-[0_6px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.5)] transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* WhatsApp SVG Icon */}
          <svg className="w-7 h-7 relative z-10 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.115-2.906-6.99C16.257 1.876 13.779 1.84 11.139 1.84c-5.439 0-9.865 4.425-9.87 9.87-.001 1.73.454 3.42 1.32 4.933l-.994 3.635 3.73-.978zm11.23-6.52c-.3-.15-1.77-.875-2.047-.976-.277-.1-.477-.15-.677.15-.2.3-.77.975-.944 1.175-.173.2-.35.225-.65.075-.3-.15-1.263-.465-2.403-1.485-.888-.79-1.487-1.77-1.663-2.07-.177-.3-.019-.461.13-.61.136-.134.3-.349.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.625-.926-2.225-.244-.596-.492-.514-.677-.525-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.276.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.11 3.22 5.11 4.52.714.31 1.27.496 1.7.635.717.227 1.37.195 1.885.118.574-.085 1.77-.724 2.02-1.425.25-.7.25-1.3 0-1.425-.075-.125-.275-.2-.575-.35z" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
