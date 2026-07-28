"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Tag, Search, Inbox, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "./ui/Button";
import { ProductDetailModal } from "./ProductDetailModal";

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

function ProductCard({ project, idx, onSelectProduct }: { project: any; idx: number; onSelectProduct: (p: any) => void }) {
  const productImages = project.images && project.images.length > 0
    ? project.images
    : project.image
      ? [project.image]
      : [];

  const discountBadge = calculateDiscount(project.mrp, project.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.4) }}
      onClick={() => onSelectProduct(project)}
      className="group bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_25px_rgba(15,23,42,0.03)] border border-slate-200/80 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)] hover:border-rose-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative cursor-pointer overflow-hidden"
    >
      {/* Product Image Frame (Clean Amazon Style Viewport) */}
      <div className="bg-slate-50/80 rounded-xl aspect-[4/3] w-full overflow-hidden relative flex items-center justify-center p-3 border border-slate-100 mb-3 group-hover:bg-slate-100/60 transition-colors duration-300">
        {productImages.length > 0 ? (
          <div className="relative w-full h-full select-none">
            <Image
              src={productImages[0]}
              alt={`${project.brandname} ${project.category} Product`}
              fill
              priority
              loading="eager"
              className="object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-semibold">No Image</span>
        )}

        {discountBadge && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm select-none">
            {discountBadge}
          </span>
        )}

        <span className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Eye className="w-3 h-3 text-rose-600" />
          Quick View
        </span>
      </div>

      {/* Main Content Details */}
      <div className="flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border select-none ${
              project.category === "ups inventer & batteries"
                ? "bg-amber-50 text-amber-700 border-amber-200/80"
                : "bg-rose-50 text-rose-700 border-rose-200/80"
            }`}>
              {project.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"}
            </span>

            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-300 select-none">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Product Brand Title */}
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors line-clamp-2 leading-snug">
            {project.brandname}
          </h3>
        </div>

        {/* Pinned Price & CTA Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          {/* Price Block */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors">
              {formatPrice(project.price)}
            </span>
            {project.mrp && (
              <span className="text-xs font-semibold text-slate-400 line-through">
                M.R.P: {formatPrice(project.mrp)}
              </span>
            )}
          </div>

          {/* View Details / Order Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(project);
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-xl py-2.5 px-4 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer"
          >
            <Eye className="w-4 h-4 text-rose-400" />
            View Details & Order
          </button>
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
  const [selectedProductModal, setSelectedProductModal] = React.useState<any | null>(null);

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
      brandname: item.brandname || item.name || "Product",
      category: (item.category || "").toLowerCase(),
      description: item.description || "",
      price: item.price || item.selling_price || 0,
      mrp: item.mrp || 0,
      images: Array.isArray(item.images) ? item.images : item.image ? [item.image] : [],
      image: item.image || (Array.isArray(item.images) && item.images[0]) || "",
      created_at: item.created_at
    }));
  }, [initialProducts]);

  // Memoized filter logic
  const filteredProjects = React.useMemo(() => {
    return conformedInitial.filter((project: any) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category === selectedCategory.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        project.brandname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

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
                    {cat === "All" ? "All Products" : cat === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifiers"}
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
              <ProductCard
                key={idx}
                project={project}
                idx={idx}
                onSelectProduct={(p) => setSelectedProductModal(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Amazon Style Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductModal}
        isOpen={!!selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
      />
    </div>
  );
}
