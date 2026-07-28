"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface PageLoaderProps {
  isSuspense?: boolean;
}

export function PageLoader({ isSuspense = false }: PageLoaderProps) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isSuspense) return;
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isSuspense]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center select-none"
        >
          {/* Logo Container with Glow & Rotation */}
          <div className="relative flex items-center justify-center mb-5">
            {/* Soft Glowing Ring */}


            {/* Spinning Ring */}


            {/* Pulsing Spinning Logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute w-12 h-12 flex items-center justify-center"
            >
              <Image
                src="/logo.svg"
                alt="AK Batteries Logo"
                width={48}
                height={48}
                priority
                className="w-12 h-12 object-contain drop-shadow-sm rounded-full"
              />
            </motion.div>
          </div>

          {/* Business Name Branding */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mt-10"
          >
            <h3 className="text-sm font-extrabold text-slate-900 tracking-wider uppercase">
              AK Batteries & RO
            </h3>
            <p className="text-[11px] font-bold text-rose-600 mt-0.5 tracking-widest uppercase">
              Kannamangalam
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
