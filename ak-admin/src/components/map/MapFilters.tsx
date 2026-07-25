"use client";

import React from "react";
import { Filter, Layers, CheckCircle2, XCircle, Clock } from "lucide-react";
import { MapStatusFilter } from "@/types/customerMap";

interface MapFiltersProps {
  status: MapStatusFilter;
  onStatusChange: (status: MapStatusFilter) => void;
}

const statusOptions: {
  label: string;
  value: MapStatusFilter;
  icon: React.ElementType;
  badgeClass: string;
  activeClass: string;
}[] = [
  {
    label: "All",
    value: "All",
    icon: Layers,
    badgeClass: "bg-white/90 text-slate-700 hover:bg-slate-100 border-slate-200/80",
    activeClass: "bg-slate-900 text-white border-slate-900 shadow-sm",
  },
  {
    label: "Active",
    value: "Active",
    icon: CheckCircle2,
    badgeClass: "bg-white/90 text-emerald-700 hover:bg-emerald-50 border-emerald-200/80",
    activeClass: "bg-emerald-600 text-white border-emerald-600 shadow-sm",
  },
  {
    label: "Non Active",
    value: "Inactive",
    icon: XCircle,
    badgeClass: "bg-white/90 text-rose-700 hover:bg-rose-50 border-rose-200/80",
    activeClass: "bg-rose-600 text-white border-rose-600 shadow-sm",
  },
  {
    label: "AMC Due Soon",
    value: "AMC Due Soon",
    icon: Clock,
    badgeClass: "bg-white/90 text-amber-700 hover:bg-amber-50 border-amber-200/80",
    activeClass: "bg-amber-500 text-white border-amber-500 shadow-sm",
  },

];

export default function MapFilters({ status, onStatusChange }: MapFiltersProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-lg p-2.5 shadow-xl flex items-center gap-1.5 flex-wrap max-w-full">
      <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1 px-1.5 mr-1">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <span className="hidden sm:inline">Filter:</span>
      </span>

      {statusOptions.map((opt) => {
        const isActive = status === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onStatusChange(opt.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-extrabold transition-all border flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              isActive ? opt.activeClass : opt.badgeClass
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
