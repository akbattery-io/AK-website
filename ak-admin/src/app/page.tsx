"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, isAdminEmail } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../components/Header";
import {
  Package,
  Users,
  Wrench,
  Home,
  ChevronRight
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Statistics states
  const [statsLoading, setStatsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [inactiveCustomers, setInactiveCustomers] = useState(0);
  const [urgentServices, setUrgentServices] = useState(0);
  const [dbError, setDbError] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const fetchStats = async () => {
    if (!user) return;
    setStatsLoading(true);
    setDbError(null);

    try {
      // Execute database queries concurrently to eliminate network round-trip waterfalls
      const [productsRes, customersRes] = await Promise.all([
        supabase
          .from("products")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("customers")
          .select("installation_date, maintenance_period, status")
      ]);

      if (productsRes.error) throw productsRes.error;
      if (customersRes.error) throw customersRes.error;

      setTotalProducts(productsRes.count || 0);

      const custData = customersRes.data || [];
      const totalCust = custData.length;

      // Compute status breakdown and upcoming services locally in a single pass
      let activeCount = 0;
      let inactiveCount = 0;
      let urgentCount = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      custData.forEach((customer) => {
        if (customer.status === "Active") {
          activeCount++;

          const installDate = new Date(customer.installation_date);
          const expiryDate = new Date(installDate);
          expiryDate.setMonth(expiryDate.getMonth() + customer.maintenance_period);
          expiryDate.setHours(0, 0, 0, 0);

          if (expiryDate >= today && expiryDate <= threeDaysFromNow) {
            urgentCount++;
          }
        } else {
          inactiveCount++;
        }
      });

      setTotalCustomers(totalCust);
      setActiveCustomers(activeCount);
      setInactiveCustomers(inactiveCount);
      setUrgentServices(urgentCount);
    } catch (err: any) {
      console.error("Error fetching stats from Supabase:", err);
      setDbError(err.message || "Failed to load dashboard metrics.");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdminEmail(user.email)) {
      fetchStats();
    }
  }, [user]);



  if (loading || (user && !isAdminEmail(user.email))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh-gradient">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-md animate-spin"></div>
          <p className="text-slate-500 text-sm font-semibold">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-gradient pb-24">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Title */}
        <section className="mb-8 sm:text-left">
          <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Quick overview of inventory, customer directory, and upcoming service schedules.</p>
        </section>

        {dbError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-md text-xs font-semibold leading-relaxed">
            {dbError}
          </div>
        )}

        {/* Dashboard Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

          {/* Products Summary Card */}
          <Link
            href="/products"
            className="bg-white rounded-md border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col justify-between group min-h-[160px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-md flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="mt-4">
              {statsLoading ? (
                <div className="w-12 h-6 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-2xl font-black text-slate-900 leading-none">{totalProducts}</h3>
              )}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">Products</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1 leading-normal">Manage inventory items, categories, and prices.</p>
            </div>
          </Link>

          {/* Customers Summary Card */}
          <Link
            href="/customers"
            className="bg-white rounded-md border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col justify-between group min-h-[160px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-md flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="mt-4">
              {statsLoading ? (
                <div className="w-12 h-6 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-2xl font-black text-slate-900 leading-none">{totalCustomers}</h3>
              )}
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1.5">Total Customers</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1 leading-normal">Register client profiles, statuses, and service contracts.</p>
            </div>
          </Link>

          {/* Service Directory Card */}
          <Link
            href="/service"
            className="bg-white rounded-md border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col justify-between group min-h-[160px] col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-md flex items-center justify-center text-amber-550 group-hover:scale-110 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="mt-4">
              {statsLoading ? (
                <div className="w-12 h-6 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-2xl font-black text-rose-600 leading-none">{urgentServices}</h3>
              )}
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mt-1.5">Upcomming Due Services (3 Days)</p>
              <p className="text-[11px] text-slate-400 font-semibold mt-1 leading-normal">Track upcoming maintenance visits due within three days.</p>
            </div>
          </Link>

        </section>
      </main>
    </div>
  );
}
