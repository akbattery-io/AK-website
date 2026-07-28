"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Phone, ShieldCheck, Truck, Star, Sparkles, Share2 } from "lucide-react";

interface ProductDetailClientProps {
  product: any;
  relatedProducts?: any[];
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

export function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const productImages: string[] = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const discountBadge = calculateDiscount(product.mrp, product.price);

  const featuresList = product.description
    ? product.description.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.brandname,
        text: `Check out ${product.brandname} at AK Batteries & RO Solutions!`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-mesh-gradient min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-600 hover:text-rose-600 bg-white/80 backdrop-blur-md px-4 py-2 rounded-md border border-slate-200 shadow-sm transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4 text-rose-600" />
            Back to Catalog
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-md border border-slate-200 shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-rose-600" />
            {copied ? "Link Copied!" : "Share Product"}
          </button>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_10px_40px_rgba(15,23,42,0.05)] border border-slate-200/80 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* Left Column: Image Gallery Viewport */}
            <div className="flex flex-col gap-4">
              {/* Main Image Frame (Fixed Viewport Height - No Cropping) */}
              <div className="relative w-full h-80 sm:h-[420px] bg-slate-50 rounded-2xl border border-slate-200/80 p-4 sm:p-6 flex items-center justify-center overflow-hidden group">
                {productImages.length > 0 ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={productImages[selectedImageIndex] || productImages[0]}
                      alt={product.brandname}
                      fill
                      priority
                      loading="eager"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">No Image Available</span>
                )}

                {discountBadge && (
                  <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {discountBadge}
                  </span>
                )}
              </div>

              {/* Multi-Image Thumbnails Row */}
              {productImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto p-2 scrollbar-thin">
                  {productImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 overflow-hidden flex-shrink-0 bg-slate-50 transition-all duration-200 cursor-pointer ${selectedImageIndex === idx
                        ? "border-rose-600 ring-4 ring-rose-500/20 scale-105"
                        : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.brandname} thumbnail ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Full Specifications & Purchasing Details */}
            <div className="flex flex-col gap-6">
              {/* Category Pill Tag */}
              <div>
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider border select-none ${product.category === "ups inventer & batteries"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                  {product.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"}
                </span>
              </div>

              {/* Product Brand Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.brandname}
                </h1>
              </div>

              {/* Price Container */}
              <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col gap-2">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
                    {formatPrice(product.price)}
                  </span>
                  {product.mrp && (
                    <span className="text-base font-semibold text-slate-400 line-through">
                      M.R.P: {formatPrice(product.mrp)}
                    </span>
                  )}
                  {discountBadge && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-md uppercase">
                      Save {discountBadge}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Inclusive of all taxes + Free Doorstep Delivery & Professional Installation across Kannamangalam & Vellore.
                </p>
              </div>

              {/* Key Trust Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 leading-tight">Free Doorstep Delivery</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 leading-tight">On-site Warranty Support</span>
                </div>
              </div>

              {/* Product Specifications & Feature Checklist */}
              {featuresList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-600" />
                    Product Specifications & Highlights
                  </h3>
                  <ul className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-100">
                    {featuresList.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        <span className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons (2 Columns Inside Product Card) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-2">
                <a
                  href={`https://wa.me/918870534049?text=${encodeURIComponent(
                    `Hello, I would like to order *${product.brandname}* (${product.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"
                    }) priced at *${formatPrice(product.price)}*.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl py-3.5 px-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <svg
                    className="w-4.5 h-4.5 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.16 1.448 4.787 1.449 5.518 0 10.008-4.487 10.01-10.007.001-2.673-1.03-5.188-2.903-7.062C16.618 1.66 14.11 1.628 11.999 1.628 6.48 1.628 1.99 6.115 1.988 11.635c0 1.674.437 3.313 1.272 4.773L2.24 21.05l4.407-1.156zM17.07 14.04c-.274-.137-1.62-.8-1.87-.89-.25-.09-.43-.137-.61.137-.18.274-.69.89-.846 1.072-.156.18-.313.2-.587.06-.275-.135-1.16-.427-2.21-1.365-.817-.73-1.37-1.63-1.53-1.905-.16-.275-.016-.423.12-.56.124-.124.275-.32.413-.48.137-.16.183-.275.275-.457.09-.18.046-.34-.02-.48-.069-.137-.61-1.486-.838-2.036-.223-.53-.45-.457-.61-.465-.16-.008-.344-.01-.53-.01-.18 0-.477.067-.73.343-.25.274-.96.94-.96 2.29 0 1.35.98 2.65 1.117 2.83.137.18 1.93 2.946 4.675 4.13.654.28 1.164.448 1.56.574.657.21 1.256.18 1.73.1.527-.08 1.62-.66 1.85-1.3.23-.64.23-1.187.16-1.3-.07-.11-.253-.18-.527-.315z" />
                  </svg>
                  Order on WhatsApp
                </a>

                <a
                  href="tel:+918870534049"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-3.5 px-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                  Call Technician
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
