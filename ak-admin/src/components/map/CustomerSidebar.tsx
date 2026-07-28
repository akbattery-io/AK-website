"use client";

import React from "react";
import { Users, MapPinOff } from "lucide-react";
import { CustomerMapItem } from "@/types/customerMap";
import CustomerCard from "./CustomerCard";

interface CustomerSidebarProps {
  customers: CustomerMapItem[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customer: CustomerMapItem) => void;
  isLoading: boolean;
}

export default function CustomerSidebar({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  isLoading,
}: CustomerSidebarProps) {
  return (
    <div className="bg-white rounded-md border border-slate-100 shadow-sm flex flex-col h-full max-h-[680px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Users className="w-4.5 h-4.5 text-slate-500" />
          <h3 className="font-serif text-base font-black text-slate-900 tracking-tight">Customer Directory</h3>
        </div>
        <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-md">
          {customers.length}
        </span>
      </div>

      {/* Customer List */}
      <div className="p-3 overflow-y-auto flex-1 space-y-2.5">
        {isLoading ? (
          <div className="space-y-3 p-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-24 bg-slate-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400">
            <MapPinOff className="w-8 h-8 mb-2 stroke-[1.5]" />
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">No Customers Found</p>
            <p className="text-[11px] text-slate-400 mt-1">Try adjusting search or status filters.</p>
          </div>
        ) : (
          customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              isSelected={selectedCustomerId === customer.id}
              onSelect={onSelectCustomer}
            />
          ))
        )}
      </div>
    </div>
  );
}
