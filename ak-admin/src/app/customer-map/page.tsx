"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth, isAdminEmail } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import MapFilters from "@/components/map/MapFilters";
import CustomerMapContainer from "@/components/map/CustomerMapContainer";
import { CustomerMapItem, MapStatusFilter } from "@/types/customerMap";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

// Dynamic status calculation helper (Active vs Inactive vs AMC Due Soon vs Unknown)
function computeCustomerStatus(
  installDateStr: string | null,
  periodMonths: number | null,
  rawStatus?: string
): CustomerMapItem["status"] {
  if (!installDateStr) {
    if (rawStatus === "Active" || rawStatus === "Inactive") return rawStatus;
    return "Unknown";
  }

  const installDate = new Date(installDateStr);
  if (isNaN(installDate.getTime())) return "Unknown";

  const period = periodMonths || 3;
  const expiryDate = new Date(installDate);
  expiryDate.setMonth(expiryDate.getMonth() + period);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  // Expiry in past -> Inactive (Non Active)
  if (today > expiryDate) return "Inactive";

  // AMC due within 14 days -> AMC Due Soon
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays >= 0 && diffDays <= 14) return "AMC Due Soon";

  return "Active";
}

export default function CustomerMapPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect non-admins or unauthenticated users to login page
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (!isAdminEmail(user.email)) {
        router.push("/");
      }
    }
  }, [user, authLoading, router]);

  // Main state
  const [allCustomers, setAllCustomers] = useState<CustomerMapItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Status Filter State (All | Active | Inactive | AMC Due Soon | Unknown)
  const [selectedStatus, setSelectedStatus] = useState<MapStatusFilter>("All");

  // Fetch all customers from Supabase
  const fetchCustomers = async () => {
    setIsLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("customer_name", { ascending: true });

      if (error) throw error;

      const formatted: CustomerMapItem[] = (data || []).map((item: any) => {
        const computedStatus = computeCustomerStatus(
          item.installation_date,
          item.maintenance_period,
          item.status
        );
        const lat = item.latitude !== null && item.latitude !== undefined && item.latitude !== "" ? Number(item.latitude) : null;
        const lng = item.longitude !== null && item.longitude !== undefined && item.longitude !== "" ? Number(item.longitude) : null;

        return {
          id: item.id,
          customer_name: item.customer_name || "Unknown",
          phone_number: item.phone_number || "",
          place: item.place || "",
          latitude: isNaN(lat!) ? null : lat,
          longitude: isNaN(lng!) ? null : lng,
          installation_date: item.installation_date || "",
          product_name: item.product_name || "",
          status: computedStatus,
          maintenance_period: item.maintenance_period || 3,
          remark: item.remark || null,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });

      setAllCustomers(formatted);
    } catch (err: any) {
      console.error("Error fetching customers for map:", err);
      setDbError(err.message || "Failed to load customer records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdminEmail(user.email)) {
      fetchCustomers();
    }
  }, [user]);

  // Filter customer list EXCLUSIVELY by status
  const filteredCustomers = useMemo(() => {
    if (selectedStatus === "All") return allCustomers;
    return allCustomers.filter((c) => c.status === selectedStatus);
  }, [allCustomers, selectedStatus]);

  if (authLoading || (!user && typeof window !== "undefined")) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Authenticating Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-600" />
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Location Map</h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Visualize customer locations filtered by Active, Non Active, or AMC Due Status.
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            disabled={isLoading}
            className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Map</span>
          </button>
        </div>

        {/* Database Error Alert */}
        {dbError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-md text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{dbError}</span>
          </div>
        )}

        {/* Full-width Interactive Leaflet Map with Floating Filter Overlay */}
        <div className="relative w-full h-[720px] rounded-lg overflow-hidden border border-slate-200/80 shadow-md">
          {/* Floating Map Filter Overlay */}
          <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-auto z-20 pointer-events-auto">
            <MapFilters
              status={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>

          <CustomerMapContainer
            customers={filteredCustomers}
            selectedCustomerId={selectedCustomerId}
          />
        </div>
      </main>
    </div>
  );
}
