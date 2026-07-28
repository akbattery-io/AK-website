"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Phone, ShieldCheck, Truck, Star, Sparkles } from "lucide-react";

interface ProductDetailModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (p: string | number) => {
  if (p === undefined || p === null || p === "") return "";
  const str = String(p).trim();
  if (str.startsWith("₹") || str.toLowerCase().startsWith("rs")) {
    return str;
  }
  return `₹${str}`;
};

const calculateDiscount = (mrpVal?: string | number, sellVal?: string | number) => {
  if (mrpVal === undefined || mrpVal === null || sellVal === undefined || sellVal === null) return null;
  const numMrp = parseInt(String(mrpVal).replace(/[^0-9]/g, ""), 10);
  const numSell = parseInt(String(sellVal).replace(/[^0-9]/g, ""), 10);
  if (isNaN(numMrp) || isNaN(numSell) || numMrp <= numSell) return null;
  const pct = Math.round(((numMrp - numSell) / numMrp) * 100);
  return `${pct}% OFF`;
};

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Reset selected image when a new product opens
  React.useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
    }
  }, [product]);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const productImages: string[] = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const discountBadge = calculateDiscount(product.mrp, product.price);

  const featuresList = product.description
    ? product.description.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto border border-slate-100 max-h-[90vh] flex flex-col"
          >
            {/* Header Close Button */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border select-none ${product.category === "ups inventer & batteries"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                  {product.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"}
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline-block">
                  Product Details
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="overflow-y-auto p-6 sm:p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

                {/* Left Column: Multi-Image Gallery */}
                <div className="flex flex-col gap-4">
                  {/* Main Display Image */}
                  <div className="relative w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200/80 p-4 flex items-center justify-center overflow-hidden group">
                    {productImages.length > 0 ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={productImages[selectedImageIndex] || productImages[0]}
                          alt={product.brandname}
                          fill
                          priority
                          loading="eager"
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold">No Image Available</span>
                    )}

                    {discountBadge && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {discountBadge}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Row (Amazon Style) */}
                  {productImages.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                      {productImages.map((img: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 transition-all duration-200 cursor-pointer ${selectedImageIndex === idx
                            ? "border-rose-600 ring-2 ring-rose-500/20 scale-105"
                            : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                            }`}
                        >
                          <Image
                            src={img}
                            alt={`${product.brandname} thumbnail ${idx + 1}`}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Amazon-Style Details */}
                <div className="flex flex-col gap-5">
                  {/* Brand Title */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {product.brandname}
                    </h2>

                  </div>

                  {/* Price Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col gap-1.5">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
                        {formatPrice(product.price)}
                      </span>
                      {product.mrp && (
                        <span className="text-sm font-semibold text-slate-400 line-through">
                          M.R.P: {formatPrice(product.mrp)}
                        </span>
                      )}
                      {discountBadge && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                          Save {discountBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Inclusive of all taxes & free local doorstep delivery
                    </p>
                  </div>

                  {/* Service Badges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Free Doorstep Delivery</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">Warranty Support</span>
                    </div>
                  </div>

                  {/* Specifications & Features Checklist */}
                  {featuresList.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        About this Item & Key Features
                      </h4>
                      <ul className="space-y-2">
                        {featuresList.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium leading-relaxed">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Footer CTA (2 Stacked Row Buttons) */}
            <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 sm:px-8 flex flex-col gap-2.5 shadow-[0_-10px_25px_rgba(15,23,42,0.05)]">
              {/* Row 1: Order on WhatsApp */}
              <a
                href={`https://wa.me/918870534049?text=${encodeURIComponent(
                  `Hello, I would like to order the *${product.brandname}* (${product.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"
                  }) priced at *${formatPrice(product.price)}*.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl py-3 px-5 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <svg
                  className="w-4.5 h-4.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.16 1.448 4.787 1.449 5.518 0 10.008-4.487 10.01-10.007.001-2.673-1.03-5.188-2.903-7.062C16.618 1.66 14.11 1.628 11.999 1.628 6.48 1.628 1.99 6.115 1.988 11.635c0 1.674.437 3.313 1.272 4.773L2.24 21.05l4.407-1.156zM17.07 14.04c-.274-.137-1.62-.8-1.87-.89-.25-.09-.43-.137-.61.137-.18.274-.69.89-.846 1.072-.156.18-.313.2-.587.06-.275-.135-1.16-.427-2.21-1.365-.817-.73-1.37-1.63-1.53-1.905-.16-.275-.016-.423.12-.56.124-.124.275-.32.413-.48.137-.16.183-.275.275-.457.09-.18.046-.34-.02-.48-.069-.137-.61-1.486-.838-2.036-.223-.53-.45-.457-.61-.465-.16-.008-.344-.01-.53-.01-.18 0-.477.067-.73.343-.25.274-.96.94-.96 2.29 0 1.35.98 2.65 1.117 2.83.137.18 1.93 2.946 4.675 4.13.654.28 1.164.448 1.56.574.657.21 1.256.18 1.73.1.527-.08 1.62-.66 1.85-1.3.23-.64.23-1.187.16-1.3-.07-.11-.253-.18-.527-.315z" />
                </svg>
                Order on WhatsApp
              </a>

              {/* Row 2: Call Technician */}
              <a
                href="tel:+918870534049"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3 px-5 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                Call Technician Now
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
