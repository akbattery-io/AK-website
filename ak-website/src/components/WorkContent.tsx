"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Tag, Search, Inbox, ChevronLeft, ChevronRight, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "./ui/Button";
import { PageLoader } from "./PageLoader";

const formatPrice = (p: string | number) => {
  if (p === undefined || p === null || p === "") return "";
  const str = String(p).trim();
  if (str.startsWith("₹") || str.toLowerCase().startsWith("rs")) {
    return str;
  }
  return `₹${str}`;
};

const parseNumericPrice = (p: any) => {
  if (!p) return 0;
  const num = parseInt(String(p).replace(/[^0-9]/g, ""), 10);
  return isNaN(num) ? 0 : num;
};

const calculateDiscount = (mrpVal?: string | number, sellVal?: string | number) => {
  if (mrpVal === undefined || mrpVal === null || sellVal === undefined || sellVal === null) return null;
  const numMrp = parseInt(String(mrpVal).replace(/[^0-9]/g, ""), 10);
  const numSell = parseInt(String(sellVal).replace(/[^0-9]/g, ""), 10);
  if (isNaN(numMrp) || isNaN(numSell) || numMrp <= numSell) return null;
  const pct = Math.round(((numMrp - numSell) / numMrp) * 100);
  return `${pct}% OFF`;
};

function ProductCard({ project, idx, onNavigate }: { project: any; idx: number; onNavigate: (url: string) => void }) {
  const productImages = project.images && project.images.length > 0
    ? project.images
    : project.image
      ? [project.image]
      : [];

  const discountBadge = calculateDiscount(project.mrp, project.price);
  const productUrl = `/product/${project.id || encodeURIComponent(project.brandname)}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(productUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.3) }}
    >
      <div
        onClick={handleClick}
        className="group bg-white rounded-xl p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(15,23,42,0.03)] border border-slate-200/80 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)] hover:border-rose-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative cursor-pointer overflow-hidden block"
      >
        {/* Product Image Frame (Fixed Height Viewport) */}
        <div className="bg-slate-50/80 rounded-xl h-44 sm:h-48 w-full overflow-hidden relative flex items-center justify-center p-3 border border-slate-100 mb-3 group-hover:bg-slate-100/60 transition-colors duration-300">
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
            <span className="text-[11px] text-slate-400 font-semibold">No Image</span>
          )}

          {discountBadge && (
            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm select-none">
              {discountBadge}
            </span>
          )}

          <span className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Eye className="w-3 h-3 text-rose-600" />
            View Details
          </span>
        </div>

        {/* Main Content Details */}
        <div className="flex flex-col flex-1 justify-between gap-2">
          <div className="space-y-1.5">
            {/* Category Tag */}
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border select-none ${project.category === "ups inventer & batteries"
                ? "bg-amber-50 text-amber-700 border-amber-200/80"
                : "bg-rose-50 text-rose-700 border-rose-200/80"
                }`}>
                {project.category === "ups inventer & batteries" ? "UPS & Batteries" : "Water Purifier"}
              </span>

              <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-300 select-none">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>

            {/* Product Brand Title */}
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors line-clamp-1 leading-tight">
              {project.brandname}
            </h3>
          </div>

          {/* Compact Price & CTA Footer */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2">
            {/* Price Block */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors">
                {formatPrice(project.price)}
              </span>
              {project.mrp && (
                <span className="text-[11px] font-semibold text-slate-400 line-through">
                  M.R.P: {formatPrice(project.mrp)}
                </span>
              )}
            </div>

            {/* View Details / Order Button */}
            <button
              onClick={handleClick}
              className="w-full bg-slate-900 group-hover:bg-slate-800 text-white rounded-lg py-2 px-3 text-[11px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              View Details & Order
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface WorkContentProps {
  initialProducts: any[];
  showFilters?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
}

export function WorkContent({ initialProducts = [], showFilters = false, pageTitle, pageSubtitle }: WorkContentProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("default");
  const [isNavigating, setIsNavigating] = React.useState(false);

  const router = useRouter();
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleNavigate = (url: string) => {
    setIsNavigating(true);
    router.push(url);
  };

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
      id: item.id || encodeURIComponent(item.brandname || "product"),
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
    const filtered = conformedInitial.filter((project: any) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category === selectedCategory.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        project.brandname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "lowToHigh") {
      return [...filtered].sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price));
    }
    if (sortBy === "highToLow") {
      return [...filtered].sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price));
    }

    return filtered;
  }, [conformedInitial, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="py-16 sm:py-24 bg-mesh-gradient min-h-screen">
      {/* Full-screen spinning logo loader overlay during navigation */}
      {isNavigating && <PageLoader />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gradient text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
          >
            {pageTitle || "Products & Pricing"}
          </motion.h1>
          {pageSubtitle && (
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
              {pageSubtitle}
            </p>
          )}
        </div>

        {/* Filters & Sorting Panel */}
        {initialProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-0">
            {/* Search Box & Sort Controls Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search brand name..."
                  defaultValue=""
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm text-slate-800 transition-all bg-white shadow-[0_2px_10px_rgba(15,23,42,0.01)]"
                />
              </div>

              {/* Price Sort Dropdown */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-md border border-slate-200 shadow-[0_2px_10px_rgba(15,23,42,0.01)]">
                <ArrowUpDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-8 bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="default">Sort: Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Tabs (if showFilters enabled) */}
            {showFilters && (
              <div className="flex flex-wrap gap-2">
                {["All", "ups inventer & batteries", "water purifier"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${selectedCategory === cat
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-slate-50 border border-slate-100 text-slate-400 mb-4">
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
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
