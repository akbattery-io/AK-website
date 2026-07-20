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
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
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
        <section className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Dashboard</h2>
        </section>

        {dbError && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-semibold leading-relaxed">
            {dbError}
          </div>
        )}

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Products Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200/50 transition-all duration-300 relative overflow-hidden group min-h-[250px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50/50 rounded-bl-full flex items-center justify-center text-rose-500 pointer-events-none group-hover:scale-105 transition-transform duration-300">
              <Package className="w-8 h-8 opacity-80" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Inventory Status</span>
              <h3 className="text-xl font-bold font-serif text-slate-900 mt-2">Products Catalog</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Publish, update, and manage inverters, batteries, and water purifiers.</p>

              <div className="mt-6 flex items-baseline gap-2">
                {statsLoading ? (
                  <div className="w-16 h-8 bg-slate-100 animate-pulse rounded-lg"></div>
                ) : (
                  <span className="text-4xl font-black text-slate-900 select-all">{totalProducts}</span>
                )}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Items</span>
              </div>
            </div>
            <Link
              href="/products"
              className="mt-8 h-11 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-slate-100"
            >
              <span>Manage Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Customers Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200/50 transition-all duration-300 relative overflow-hidden group min-h-[250px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full flex items-center justify-center text-blue-500 pointer-events-none group-hover:scale-105 transition-transform duration-300">
              <Users className="w-8 h-8 opacity-80" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">AMC Registers</span>
              <h3 className="text-xl font-bold font-serif text-slate-900 mt-2">Customer Profiles</h3>

              {statsLoading ? (
                <div className="mt-6 flex items-center gap-6 h-[110px]">
                  <div className="w-[110px] h-[110px] rounded-full border-4 border-slate-100 border-t-slate-350 animate-spin shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse w-3/4"></div>
                    <div className="h-3.5 bg-slate-100 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ) : (
                (() => {
                  const chartTotal = activeCustomers + inactiveCustomers;
                  const activePercent = chartTotal > 0 ? (activeCustomers / chartTotal) * 100 : 0;
                  const inactivePercent = chartTotal > 0 ? (inactiveCustomers / chartTotal) * 100 : 0;
                  const r = 40;
                  const circumference = 2 * Math.PI * r;
                  const activeOffset = chartTotal > 0 ? circumference - (activeCustomers / chartTotal) * circumference : circumference;

                  return (
                    <div className="mt-6 flex items-center gap-6">
                      {/* Donut Chart SVG */}
                      <div className="relative w-[110px] h-[110px] shrink-0">
                        <svg
                          width="110"
                          height="110"
                          viewBox="0 0 110 110"
                          style={{ transform: "rotate(-90deg)" }}
                          className="w-full h-full"
                        >
                          {/* Background (Inactive / Total base) */}
                          <circle
                            cx="55"
                            cy="55"
                            r={r}
                            fill="transparent"
                            stroke="#e2e8f0"
                            strokeWidth="10"
                          />
                          {/* Active Segment */}
                          <circle
                            cx="55"
                            cy="55"
                            r={r}
                            fill="transparent"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray={circumference}
                            strokeDashoffset={activeOffset}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.5s ease" }}
                          />
                        </svg>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-2xl font-black text-slate-900 leading-none">{totalCustomers}</span>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">Total</span>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status</span>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                              <span className="text-slate-500 truncate">Active</span>
                            </div>
                            <span className="text-slate-800 ml-2">
                              {activeCustomers} <span className="text-[10px] text-slate-400 font-medium">({activePercent.toFixed(0)}%)</span>
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span>
                              <span className="text-slate-500 truncate">Inactive</span>
                            </div>
                            <span className="text-slate-800 ml-2">
                              {inactiveCustomers} <span className="text-[10px] text-slate-400 font-medium">({inactivePercent.toFixed(0)}%)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
            <Link
              href="/customers"
              className="mt-8 h-11 w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-slate-100"
            >
              <span>Manage Customers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-200/50 transition-all duration-300 relative overflow-hidden group min-h-[250px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/50 rounded-bl-full flex items-center justify-center text-amber-655 pointer-events-none group-hover:scale-105 transition-transform duration-300">
              <Wrench className="w-8 h-8 opacity-80" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Maintenance Schedule</span>
              <h3 className="text-xl font-bold font-serif text-slate-900 mt-2">Service Directory</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Identify inactive profiles or track upcoming contracts due for service.</p>

              <div className="mt-6 flex items-baseline gap-2">
                {statsLoading ? (
                  <div className="w-16 h-8 bg-slate-100 animate-pulse rounded-lg"></div>
                ) : (
                  <span className="text-4xl font-black text-rose-650 select-all">{urgentServices}</span>
                )}
                <span className="text-xs font-bold text-rose-655 uppercase tracking-wide">Due within 3 Days</span>
              </div>

              {!statsLoading && (
                <div className="mt-3 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  Total {inactiveCustomers} Inactive profiles recorded
                </div>
              )}
            </div>
            <Link
              href="/service"
              className="mt-8 h-11 w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-100"
            >
              <span>View Service Directory</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </section>
      </main>

      {/* Mobile Bottom Navigation Bar (Instagram style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 h-16 shadow-lg z-50 px-6 flex items-center justify-around pb-safe">
        <Link href="/" className="flex flex-col items-center gap-1 text-rose-600">
          <Home className="w-5 h-5 text-rose-600" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Dashboard</span>
        </Link>
        <Link href="/products" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-950 transition-colors">
          <Package className="w-5 h-5 text-slate-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Products</span>
        </Link>
        <Link href="/customers" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-950 transition-colors">
          <Users className="w-5 h-5 text-slate-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Customers</span>
        </Link>
        <Link href="/service" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-950 transition-colors">
          <Wrench className="w-5 h-5 text-slate-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Service</span>
        </Link>
      </div>
    </div>
  );
}
