"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search customer name, phone, product, address..." }: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-9 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
