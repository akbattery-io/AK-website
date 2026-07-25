"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Calendar, Wrench, ExternalLink, Copy, Check, Eye, Edit } from "lucide-react";
import { CustomerMapItem } from "@/types/customerMap";

interface CustomerPopupProps {
  customer: CustomerMapItem;
}

export default function CustomerPopup({ customer }: CustomerPopupProps) {
  const [copied, setCopied] = useState(false);

  const lat = customer.latitude;
  const lng = customer.longitude;
  const hasCoords = lat !== null && lng !== null;

  const handleCopyCoords = () => {
    if (!hasCoords) return;
    const text = `${lat}, ${lng}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  return (
    <div className="p-1 max-w-[280px] font-sans">
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
        <div>
          <h3 className="font-serif text-base font-black text-slate-900 tracking-tight leading-tight">
            {customer.customer_name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold mt-0.5">
            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
            <a href={`tel:${customer.phone_number}`} className="hover:text-rose-600 transition-colors">
              {customer.phone_number}
            </a>
          </div>
        </div>
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border shrink-0 ${getStatusBadge(customer.status)}`}>
          {customer.status}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600 mb-3">
        <div className="flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-800">{customer.product_name}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{customer.place}</span>
        </div>

        {customer.installation_date && (
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Installed: {customer.installation_date}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
        <Link
          href={`/customers`}
          className="h-8 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
        >
          <Eye className="w-3 h-3 text-slate-500" />
          <span>View</span>
        </Link>

        <Link
          href={`/customers`}
          className="h-8 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
        >
          <Edit className="w-3 h-3 text-rose-600" />
          <span>Edit</span>
        </Link>

        {hasCoords && (
          <>
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 transition-all col-span-2 sm:col-span-1"
            >
              <ExternalLink className="w-3 h-3 text-emerald-600" />
              <span>Google Maps</span>
            </a>

            <button
              type="button"
              onClick={handleCopyCoords}
              className="h-8 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 transition-all col-span-2 sm:col-span-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-indigo-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-indigo-600" />
                  <span>Copy Coords</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
