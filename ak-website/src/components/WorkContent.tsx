"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Tag, Search, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";

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

function ProductCard({ project, idx }: { project: any; idx: number }) {
  const productImages = project.images && project.images.length > 0
    ? project.images
    : project.image
      ? [project.image]
      : [];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const discountBadge = calculateDiscount(project.mrp, project.selling_price || project.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group bg-white rounded-md p-5 shadow-[0_4px_30px_rgba(15,23,42,0.01)] border border-slate-100/80 hover:shadow-[0_20px_50px_rgba(225,29,72,0.06)] hover:border-rose-100/70 hover:-translate-y-1.5 transition-all duration-500 flex flex-col gap-5 justify-between relative overflow-hidden"
    >
      {/* Product Visual Container (FIRST) */}
      <div className="bg-slate-50/60 rounded-md aspect-[4/3] w-full overflow-hidden relative flex items-center justify-center p-3 border border-slate-100/30">
        {productImages.length > 0 ? (
          <div className="relative w-full h-full select-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative w-full h-full cursor-grab active:cursor-grabbing touch-pan-y"
                {...(productImages.length > 1
                  ? {
                    drag: "x",
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.6,
                    onDragEnd: (_e, info) => {
                      const swipeThreshold = 50;
                      if (info.offset.x < -swipeThreshold) {
                        setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                      } else if (info.offset.x > swipeThreshold) {
                        setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                      }
                    },
                  }
                  : {})}
              >
                <Image
                  src={productImages[currentImageIndex]}
                  alt={`${project.brandname} ${project.category} Product - Visual ${currentImageIndex + 1}`}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Slide Arrows for navigation */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/75 backdrop-blur-sm border border-white/40 hover:bg-white text-slate-800 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer focus:outline-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/75 backdrop-blur-sm border border-white/40 hover:bg-white text-slate-800 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer focus:outline-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </>
            )}

            {/* Slide Dot Indicators */}
            {productImages.length > 1 && (
              <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                {productImages.map((_: string, i: number) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentImageIndex === i ? "bg-rose-500 w-3.5" : "bg-white/40 hover:bg-white/80 w-1.5"
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-semibold">No Image</span>
        )}
      </div>

      {/* Content Details (SECOND) */}
      <div className="flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-3">
          {/* Upper row: Category */}
          <div>
            <span className={`text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border select-none ${project.category === "ups inventer & batteries"
              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
              : "bg-rose-500/10 text-rose-600 border-rose-500/20"
              }`}>
              {project.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"}
            </span>
          </div>

          {/* Brand header */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors select-all line-clamp-1">
              {project.brandname}
            </h3>
            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-300 select-none">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          {/* Product Description */}
          {project.description && (
            <ul className="text-xs text-slate-500 font-medium leading-relaxed select-all min-h-[54px] list-disc pl-4 space-y-1">
              {project.description
                .split(",")
                .map((item: string) => item.trim())
                .filter(Boolean)
                .map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          )}

          {/* Price Tag with MRP, Selling Price, and Discount Badge */}
          <div className="flex items-center gap-2.5 flex-wrap pt-1.5 select-all">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors duration-300">
                {formatPrice(project.selling_price || project.price)}
              </span>
            </div>
            {project.mrp && (
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                M.R.P: <span className="line-through">{formatPrice(project.mrp)}</span>
              </div>
            )}
            {discountBadge && (
              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm select-none">
                {discountBadge}
              </span>
            )}
          </div>
        </div>

        {/* WhatsApp Enquiry Button */}
        <div className="pt-2 border-t border-slate-100/60">
          <a
            href={`https://wa.me/918870534049?text=${encodeURIComponent(
              `Hello, I would like to enquire about the *${project.brandname}* (${project.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"
              }) priced at *${formatPrice(project.selling_price || project.price)}*.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white rounded-md py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_4px_12px_rgba(16,185,129,0.12)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.24)] cursor-pointer select-none"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.16 1.448 4.787 1.449 5.518 0 10.008-4.487 10.01-10.007.001-2.673-1.03-5.188-2.903-7.062C16.618 1.66 14.11 1.628 11.999 1.628 6.48 1.628 1.99 6.115 1.988 11.635c0 1.674.437 3.313 1.272 4.773L2.24 21.05l4.407-1.156zM17.07 14.04c-.274-.137-1.62-.8-1.87-.89-.25-.09-.43-.137-.61.137-.18.274-.69.89-.846 1.072-.156.18-.313.2-.587.06-.275-.135-1.16-.427-2.21-1.365-.817-.73-1.37-1.63-1.53-1.905-.16-.275-.016-.423.12-.56.124-.124.275-.32.413-.48.137-.16.183-.275.275-.457.09-.18.046-.34-.02-.48-.069-.137-.61-1.486-.838-2.036-.223-.53-.45-.457-.61-.465-.16-.008-.344-.01-.53-.01-.18 0-.477.067-.73.343-.25.274-.96.94-.96 2.29 0 1.35.98 2.65 1.117 2.83.137.18 1.93 2.946 4.675 4.13.654.28 1.164.448 1.56.574.657.21 1.256.18 1.73.1.527-.08 1.62-.66 1.85-1.3.23-.64.23-1.187.16-1.3-.07-.11-.253-.18-.527-.315z" />
            </svg>
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

interface WorkContentProps {
  initialProducts: any[];
  showFilters?: boolean;
}

export function WorkContent({ initialProducts = [], showFilters = false }: WorkContentProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 400);
  };

  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const conformedInitial = React.useMemo(() => {
    return initialProducts.map((item: any) => ({
      ...item,
      tagColor: item.category === "ups inventer & batteries"
        ? "bg-amber-50 text-amber-700 border-amber-100/70"
        : "bg-rose-50 text-rose-700 border-rose-100/70"
    }));
  }, [initialProducts]);

  // Memoized filter logic
  const filteredProjects = React.useMemo(() => {
    return conformedInitial.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "ups inventer & batteries" && project.category === "ups inventer & batteries") ||
        (selectedCategory === "water purifier" && project.category === "water purifier");

      const matchesSearch = project.brandname
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [conformedInitial, searchQuery, selectedCategory]);

  return (
    <div className="py-16 sm:py-24 bg-mesh-gradient min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className=" max-w-3xl mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gradient text-4xl sm:text-4xl font-extrabold tracking-tight mb-6"
          >
            Products & Pricing
          </motion.h1>
        </div>

        {/* Filters Panel */}
        {initialProducts.length > 0 && (
          <div className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 sm:px-0">
            {/* Left Side: Search Box */}
            <div className="relative max-w-sm w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by brand name (e.g. Exide)..."
                defaultValue=""
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm text-slate-800 transition-all bg-white shadow-[0_2px_10px_rgba(15,23,42,0.01)]"
              />
            </div>

            {/* Category Tabs (if showFilters enabled) */}
            {showFilters && (
              <div className="flex flex-wrap gap-2.5">
                {["All", "ups inventer & batteries", "water purifier"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${selectedCategory === cat
                      ? "bg-slate-900 text-white border-transparent shadow-[0_4px_15px_rgba(15,23,42,0.15)]"
                      : "bg-white text-slate-600 border-slate-200/50 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                  >
                    {cat === "All" ? "All Products" : cat === "ups inventer & batteries" ? "ups inventer & batteriess" : "water purifier"}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Catalog Output Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-md border border-slate-100 shadow-[0_4px_30px_rgba(15,23,42,0.01)] max-w-lg mx-auto"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
              No products found
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
              We couldn't find any products matching in this category.
            </p>
            <Button
              onClick={() => {
                if (searchInputRef.current) {
                  searchInputRef.current.value = "";
                }
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              variant="secondary"
              size="sm"
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredProjects.map((project, idx) => (
              <ProductCard key={idx} project={project} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
