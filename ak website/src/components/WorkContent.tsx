"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowUpRight, Tag, Search, Inbox } from "lucide-react";
import { Button } from "./ui/Button";
import { supabase } from "../lib/supabase";

export function WorkContent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [projects, setProjects] = React.useState<any[]>([]);
  const [dbLoading, setDbLoading] = React.useState(true);

  const defaultProjects = [
    {
      image: "/images/battery.png",
      category: "Battery Backup",
      brandname: "Exide",
      location: "Dwarka Sector 12, Delhi",
      date: "June 15, 2026",
      price: "₹14,499",
      tagColor: "bg-amber-50 text-amber-700 border-amber-100/70",
      description: "High-performance heavy-duty inverter battery with long backup life.",
    },
    {
      image: "/images/purifier.png",
      category: "Water Purification",
      brandname: "FINPURE WATER PURIFIER",
      location: "Rohini Sector 8, Delhi",
      date: "May 28, 2026",
      price: "₹12,999",
      tagColor: "bg-rose-50 text-rose-700 border-rose-100/70",
      description: "Multi-stage advanced RO + UV water purifier for pristine drinking water.",
    },
    {
      image: "/images/battery.png",
      category: "Battery Backup",
      brandname: "Luminous",
      location: "DLF Phase 3, Gurugram",
      date: "April 10, 2026",
      price: "₹18,500",
      tagColor: "bg-amber-50 text-amber-700 border-amber-100/70",
      description: "Smart sine wave solar inverter with high charging efficiency.",
    },
    {
      image: "/images/purifier.png",
      category: "Water Purification",
      brandname: "AQUA ORCA",
      location: "Sector 62, Noida",
      date: "March 22, 2026",
      price: "₹8,999",
      tagColor: "bg-rose-50 text-rose-700 border-rose-100/70",
      description: "Eco-friendly premium water purifier with active copper filter technology.",
    },
  ];

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const conformedData = data.map((item: any) => ({
            ...item,
            tagColor: item.category === "Battery Backup"
              ? "bg-amber-50 text-amber-700 border-amber-100/70"
              : "bg-rose-50 text-rose-700 border-rose-100/70"
          }));
          setProjects(conformedData);
        } else {
          setProjects(defaultProjects);
        }
      } catch (err) {
        console.error("Failed to load live products from Supabase:", err);
        setProjects(defaultProjects);
      } finally {
        setDbLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Memoized filter logic
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Battery Backup" && project.category === "Battery Backup") ||
        (selectedCategory === "Water Purification" && project.category === "Water Purification");

      const matchesSearch = project.brandname
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [projects, searchQuery, selectedCategory]);

  if (dbLoading) {
    return (
      <div className="py-16 sm:py-24 bg-mesh-gradient min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-semibold animate-pulse">Loading catalog...</p>
        </div>
      </div>
    );
  }

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
        <div className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {["All", "Battery Backup", "Water Purification"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${selectedCategory === cat
                  ? "bg-slate-900 text-white border-transparent shadow-[0_4px_15px_rgba(15,23,42,0.15)]"
                  : "bg-white text-slate-600 border-slate-200/50 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
                  }`}
              >
                {cat === "All" ? "All Products" : cat === "Battery Backup" ? "Battery Backups" : "Water Purification"}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by brand name (e.g. Exide)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm text-slate-800 transition-all bg-white shadow-[0_2px_10px_rgba(15,23,42,0.01)]"
            />
          </div>
        </div>

        {/* Catalog Output Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_30px_rgba(15,23,42,0.01)] max-w-lg mx-auto"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
              No products found
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
              We couldn't find any products matching "{searchQuery}" in this category.
            </p>
            <Button
              onClick={() => {
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
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(15,23,42,0.02)] border border-slate-100 hover:shadow-[0_10px_45px_rgba(225,29,72,0.05)] hover:border-rose-100 transition-all duration-300 flex flex-col gap-6 justify-between"
              >
                {/* Product Visual Container (FIRST) */}
                <div className="bg-slate-50 rounded-2xl h-44 w-full overflow-hidden relative">
                  <Image
                    src={project.image}
                    alt={`${project.brandname} ${project.category} Product`}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-w-768px) 100vw, 50vw"
                  />
                </div>

                {/* Content Details (SECOND) */}
                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    {/* Upper row: Category & Date */}
                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${project.tagColor}`}>
                        {project.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{project.date}</span>
                      </div>
                    </div>

                    {/* Brand and link arrow */}
                    <div className="space-y-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-600 uppercase tracking-widest">
                          <span>{project.brandname}</span>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>

                      {/* Product Description */}
                      {project.description && (
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3 my-2 border-t border-slate-50 pt-3">
                          {project.description}
                        </p>
                      )}

                      {/* Price Tag */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight group-hover:text-rose-600 transition-colors duration-300 select-all">
                          {project.price}
                        </span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                          M.R.P.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location row */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border-t border-slate-50 pt-4 mt-auto">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
