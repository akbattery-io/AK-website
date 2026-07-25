"use client";

import React from "react";
import dynamic from "next/dynamic";
import { CustomerMapItem } from "@/types/customerMap";

const CustomerLeafletMap = dynamic(
  () => import("./CustomerLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[520px] bg-slate-50 border border-slate-200/80 rounded-md flex flex-col items-center justify-center gap-3 animate-pulse">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Loading Leaflet Map Engine...</p>
      </div>
    ),
  }
);

interface CustomerMapContainerProps {
  customers: CustomerMapItem[];
  selectedCustomerId: string | null;
}

export default function CustomerMapContainer({
  customers,
  selectedCustomerId,
}: CustomerMapContainerProps) {
  return (
    <CustomerLeafletMap
      customers={customers}
      selectedCustomerId={selectedCustomerId}
    />
  );
}
