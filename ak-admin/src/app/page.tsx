"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, isAdminEmail } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  LogOut,
  Package,
  Users,
  Wrench,
  Home,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Database
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

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
      // 1. Fetch total products count
      const { count: prodCount, error: prodErr } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (prodErr) throw prodErr;
      setTotalProducts(prodCount || 0);

      // 2. Fetch total customers count
      const { count: custCount, error: custErr } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      if (custErr) throw custErr;
      setTotalCustomers(custCount || 0);

      // 3. Fetch active & inactive breakdown
      const { count: activeCount, error: activeErr } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", "Active");

      if (activeErr) throw activeErr;
      setActiveCustomers(activeCount || 0);

      const { count: inactiveCount, error: inactiveErr } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("status", "Inactive");

      if (inactiveErr) throw inactiveErr;
      setInactiveCustomers(inactiveCount || 0);

      // 4. Fetch all customers to calculate urgent upcoming expiries (due in <= 3 days)
      const { data: custData, error: dataErr } = await supabase
        .from("customers")
        .select("installation_date, maintenance_period, status");

      if (dataErr) throw dataErr;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const threeDaysFromNow = new Date(today);
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      let urgentCount = 0;
      (custData || []).forEach((customer) => {
        if (customer.status !== "Active") return;
        const installDate = new Date(customer.installation_date);
        const expiryDate = new Date(installDate);
        expiryDate.setMonth(expiryDate.getMonth() + customer.maintenance_period);
        expiryDate.setHours(0, 0, 0, 0);

        if (expiryDate >= today && expiryDate <= threeDaysFromNow) {
          urgentCount++;
        }
      });

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

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

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
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-rose-100">
                AK
              </div>
              <div>
                <h1 className="font-serif text-lg font-black text-slate-900 tracking-tight leading-none">
                  AK Admin
                </h1>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">
                  Overview Dashboard
                </p>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-4 border-l border-slate-200 pl-5 h-8">
              <Link href="/" className="text-xs font-bold uppercase tracking-wider text-rose-600 border-b-2 border-rose-600 pb-1">
                Dashboard
              </Link>
              <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-950 transition-colors">
                Products
              </Link>
              <Link href="/customers" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-950 transition-colors">
                Customers
              </Link>
              <Link href="/service" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-950 transition-colors">
                Service
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Authorized Admin</span>
              <span className="text-xs font-semibold text-slate-950">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 h-10 border border-slate-200/80 hover:border-red-100 hover:bg-red-55 text-slate-650 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Title */}
        <section className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">Admin Console Dashboard</h2>
          <p className="text-slate-500 text-xs mt-1">Quick statistics and management panels for AK Batteries business directories.</p>
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
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Register and track client details, location coordinates, and periods.</p>
              
              <div className="mt-6 flex items-baseline gap-2">
                {statsLoading ? (
                  <div className="w-16 h-8 bg-slate-100 animate-pulse rounded-lg"></div>
                ) : (
                  <span className="text-4xl font-black text-slate-900 select-all">{totalCustomers}</span>
                )}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Registered</span>
              </div>

              {/* Status Breakdowns */}
              {!statsLoading && (
                <div className="mt-3 flex gap-4 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {activeCustomers} Active
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {inactiveCustomers} Inactive
                  </span>
                </div>
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
