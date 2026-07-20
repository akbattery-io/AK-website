"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { LogOut, Bell } from "lucide-react";
import { toast } from "react-toastify";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, inactiveCount } = useAuth();

  const handleNotificationClick = () => {
    if (inactiveCount > 0) {
      router.push("/service");
    } else {
      toast.info("All caught up! No services scheduled for today!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Determine active tab and subtitle based on current route
  let activeTab = "dashboard";
  let subtitle = "Dashboard Overview";

  if (pathname === "/products") {
    activeTab = "products";
    subtitle = "Product Catalog Management";
  } else if (pathname === "/customers") {
    activeTab = "customers";
    subtitle = "Customer Register Management";
  } else if (pathname === "/service") {
    activeTab = "service";
    subtitle = "AMC Service Management";
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100/80 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image
              src="/logo.svg"
              alt="AK Admin Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-xl"
              priority
            />
            <div>
              <h1 className="font-serif text-lg font-black text-slate-900 tracking-tight leading-none">
                Admin Pannel
              </h1>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-4 border-l border-slate-200 pl-5 h-8">
            <Link
              href="/"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === "dashboard"
                ? "text-rose-600  border-rose-600"
                : "text-slate-400 hover:text-slate-950"
                }`}
            >
              Dashboard
            </Link>
            <Link
              href="/products"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === "products"
                ? "text-rose-600  border-rose-600"
                : "text-slate-400 hover:text-slate-955"
                }`}
            >
              Products
            </Link>
            <Link
              href="/customers"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === "customers"
                ? "text-rose-600  border-rose-600"
                : "text-slate-400 hover:text-slate-955"
                }`}
            >
              Customers
            </Link>
            <Link
              href="/service"
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === "service"
                ? "text-rose-600  border-rose-600"
                : "text-slate-400 hover:text-slate-955"
                }`}
            >
              Service
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button
            onClick={handleNotificationClick}
            className="relative focus:outline-none"
            title={`${inactiveCount} inactive customer accounts needing service`}
          >
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${inactiveCount > 0
                ? "bg-rose-50 border-rose-100 text-rose-600 shadow-md shadow-rose-100/50 cursor-pointer"
                : "bg-white border-slate-200/80 text-slate-400 cursor-pointer"
                }`}
            >
              <Bell className={`w-5 h-5 ${inactiveCount > 0 ? "animate-pulse" : ""}`} />
              {inactiveCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                  {inactiveCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 h-10 border border-slate-200/80 hover:border-red-100 hover:bg-red-55 text-slate-655 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
