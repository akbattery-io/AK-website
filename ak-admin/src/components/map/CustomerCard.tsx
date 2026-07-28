"use client";

import React from "react";
import { MapPin, Phone, Calendar, Wrench, Navigation } from "lucide-react";
import { CustomerMapItem } from "@/types/customerMap";

interface CustomerCardProps {
  customer: CustomerMapItem;
  isSelected: boolean;
  onSelect: (customer: CustomerMapItem) => void;
}

export default function CustomerCard({ customer, isSelected, onSelect }: CustomerCardProps) {
  const getStatusBadge = (status: CustomerMapItem["status"]) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Inactive":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "AMC Due Soon":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const hasCoords = customer.latitude !== null && customer.longitude !== null;

  return (
    <div
      onClick={() => onSelect(customer)}
      className={`p-4 rounded-md border transition-all duration-200 cursor-pointer ${isSelected
          ? "bg-rose-50/50 border-rose-300 shadow-md ring-1 ring-rose-400/30"
          : "bg-white border-slate-100/90 hover:border-slate-200 hover:shadow-sm"
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{customer.customer_name}</h4>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-0.5">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{customer.phone_number}</span>
          </div>
        </div>
        <span
          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border shrink-0 ${getStatusBadge(
            customer.status
          )}`}
        >
          {customer.status}
        </span>
      </div>

      <div className="mt-2.5 space-y-1 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="line-clamp-1">{customer.product_name}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="line-clamp-1">{customer.place}</span>
        </div>

        {customer.installation_date && (
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Installed: {customer.installation_date}</span>
          </div>
        )}

        {customer.distance_km !== undefined && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 pt-1">
            <Navigation className="w-3 h-3" />
            <span>{customer.distance_km.toFixed(2)} km away</span>
          </div>
        )}
      </div>

      {!hasCoords && (
        <div className="mt-2 text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 inline-block">
          ⚠️ No Coordinates Saved
        </div>
      )}
    </div>
  );
}
