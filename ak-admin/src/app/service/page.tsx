"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, isAdminEmail } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../../components/Header";
import {
  Search,
  Edit,
  Trash2,
  MapPin,
  X,
  Inbox,
  Eye,
  ExternalLink,
  Navigation,
  Phone,
  Package,
  Users,
  Wrench,
  Home
} from "lucide-react";

interface Customer {
  id: string;
  customer_name: string;
  phone_number: string;
  place: string;
  latitude: number | null;
  longitude: number | null;
  installation_date: string;
  product_name: string;
  status: "Active" | "Inactive";
  maintenance_period: number;
  remark: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to format date string to "Month Name, Date and Year"
export const formatInstallationDate = (dateStr: string): string => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
};

// WhatsApp icon SVG component (Using reliable FontAwesome paths)
const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

// Format clean phone number link for WhatsApp API
const getWhatsAppLink = (phone: string) => {
  const clean = phone.replace(/[^0-9]/g, "");
  const withCountryCode = clean.length === 10 ? `91${clean}` : clean;
  return `https://wa.me/${withCountryCode}`;
};

const roTasks = [
  "Water flow checked",
  "TDS checked",
  "Filters cleaned/replaced",
  "Tank clean",
  "Leak checked",
  "Pump working",
  "Output water quality verified"
];

const batteryTasks = [
  "Battery Water Level Checked",
  "Distilled Water Added",
  "Terminal Cleaned",
  "Voltage Tested",
  "Charging Status Verified",
  "Backup Time Tested",
  "Wiring Inspected"
];

export default function ServicePage() {
  const router = useRouter();
  const { user, loading, refetchInactiveCount } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Customers data states
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<"urgent" | "all">("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals open states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Service Completion Modal States
  const [detectedCategory, setDetectedCategory] = useState<"RO" | "Battery">("RO");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Form field states for Edit Modal
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [place, setPlace] = useState("");
  const [productName, setProductName] = useState("");
  const [installationDate, setInstallationDate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [maintenancePeriod, setMaintenancePeriod] = useState<3 | 6 | 9 | 12>(3);
  const [remark, setRemark] = useState("");

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Geolocation states
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Search input debounce logic (600ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [serviceFilter]);

  // Fetch customers directly from the customers table on load/refresh
  const fetchDueCustomers = async () => {
    if (!user) return;
    setCustomersLoading(true);
    setDbError(null);

    try {
      // Query main customers table directly
      let { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("installation_date", { ascending: true }); // Sort by installation date oldest first

      if (error) throw error;
      setAllCustomers(data || []);
    } catch (err: any) {
      console.error("Error fetching due services from Supabase:", err);
      setDbError(err.message || "Failed to load service due directory.");
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    fetchDueCustomers();
  }, [user]);

  // Compute filtered list locally to avoid database waterfalls on search/filter changes
  const filteredCustomers = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    return allCustomers.filter((customer) => {
      // 1. Check Search Match (if search has at least 3 characters)
      if (debouncedSearchQuery.trim().length >= 3) {
        const cleanSearch = debouncedSearchQuery.trim().toLowerCase();
        const matchName = customer.customer_name.toLowerCase().includes(cleanSearch);
        const matchPhone = customer.phone_number.toLowerCase().includes(cleanSearch);
        const matchPlace = customer.place.toLowerCase().includes(cleanSearch);
        if (!matchName && !matchPhone && !matchPlace) return false;
      }

      // 2. Check Expiry Date Range
      const installDate = new Date(customer.installation_date);
      const expiryDate = new Date(installDate);
      expiryDate.setMonth(expiryDate.getMonth() + customer.maintenance_period);
      expiryDate.setHours(0, 0, 0, 0);

      if (serviceFilter === "urgent") {
        // Only show Active customers due to expire within the next 3 days
        return customer.status === "Active" && expiryDate >= today && expiryDate <= threeDaysFromNow;
      }

      // Under 'all' filter, return only those who have already expired (Inactive)
      return customer.status === "Inactive" || expiryDate < today;
    });
  }, [allCustomers, debouncedSearchQuery, serviceFilter]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCustomers.length / pageSize) || 1;
  }, [filteredCustomers, pageSize]);

  // Compute display slice for current page
  const displayedCustomers = useMemo(() => {
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize;
    return filteredCustomers.slice(from, to);
  }, [filteredCustomers, currentPage, pageSize]);



  const openEditModal = (customer: Customer) => {
    setFormError(null);
    setLocationError(null);
    setSelectedCustomer(customer);
    setCustomerName(customer.customer_name);
    setPhoneNumber(customer.phone_number);
    setPlace(customer.place);
    setProductName(customer.product_name);
    setInstallationDate(customer.installation_date);
    setLatitude(customer.latitude !== null ? customer.latitude.toString() : "");
    setLongitude(customer.longitude !== null ? customer.longitude.toString() : "");
    setMaintenancePeriod((customer.maintenance_period as 3 | 6 | 9 | 12) || 3);
    setRemark(customer.remark || "");
    setIsEditModalOpen(true);
  };

  const openViewModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  // Retrieve current location via browser Geolocation API
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please allow permission in browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location coordinates unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location retrieval timed out.");
            break;
          default:
            setLocationError("An unknown error occurred while retrieving location.");
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Validate form inputs
  const validateForm = () => {
    if (!customerName.trim()) throw new Error("Customer Name is required");

    const phoneTrim = phoneNumber.trim();
    if (!phoneTrim) throw new Error("Phone Number is required");
    const phoneRegex = /^[0-9\s\-+()]{10,15}$/;
    if (!phoneRegex.test(phoneTrim)) {
      throw new Error("Phone Number must be a valid number (at least 10 digits)");
    }

    if (!place.trim()) throw new Error("Place is required");
    if (!productName.trim()) throw new Error("Product Name is required");
    if (!installationDate) throw new Error("Installation Date is required");

    if (latitude.trim() && isNaN(Number(latitude.trim()))) {
      throw new Error("Latitude must be a valid decimal number");
    }
    if (longitude.trim() && isNaN(Number(longitude.trim()))) {
      throw new Error("Longitude must be a valid decimal number");
    }
  };

  // Helper to calculate status dynamically based on installation date and period
  const getCalculatedStatus = (installDateStr: string, periodMonths: number): "Active" | "Inactive" => {
    if (!installDateStr) return "Inactive";
    const installDate = new Date(installDateStr);
    const expiryDate = new Date(installDate);
    expiryDate.setMonth(expiryDate.getMonth() + periodMonths);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    return today > expiryDate ? "Inactive" : "Active";
  };

  // Submit editing customer
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setFormSubmitting(true);
    setFormError(null);

    try {
      validateForm();

      const calculatedStatus = getCalculatedStatus(installationDate, maintenancePeriod);

      const updatedFields = {
        customer_name: customerName.trim(),
        phone_number: phoneNumber.trim(),
        place: place.trim(),
        product_name: productName.trim(),
        installation_date: installationDate,
        latitude: latitude.trim() ? parseFloat(latitude.trim()) : null,
        longitude: longitude.trim() ? parseFloat(longitude.trim()) : null,
        status: calculatedStatus,
        maintenance_period: maintenancePeriod,
        remark: remark.trim() || null,
      };

      const { error } = await supabase
        .from("customers")
        .update(updatedFields)
        .eq("id", selectedCustomer.id);

      if (error) throw error;

      setIsEditModalOpen(false);
      fetchDueCustomers();
      refetchInactiveCount();
    } catch (err: any) {
      console.error("Error updating customer:", err);
      setFormError(err.message || "Failed to update customer details.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Submit deletion
  const handleDeleteCustomer = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}" registration? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
      fetchDueCustomers();
    } catch (err: any) {
      console.error("Error deleting customer:", err);
      alert(err.message || "Failed to delete customer registration.");
    }
  };

  // Complete Service Modal Handlers
  const openCompleteServiceModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    const prodName = (customer.product_name || "").toLowerCase();
    const isBattery =
      prodName.includes("battery") ||
      prodName.includes("inverter") ||
      prodName.includes("ups") ||
      prodName.includes("exide") ||
      prodName.includes("luminous") ||
      prodName.includes("amaron");

    setDetectedCategory(isBattery ? "Battery" : "RO");
    setSelectedTasks([]);
    setOtherText("");
    setIsOtherSelected(false);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setFormSubmitting(true);
    setFormError(null);

    try {
      const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      let tasks = [...selectedTasks];
      if (isOtherSelected && otherText.trim()) {
        tasks.push(`Other: ${otherText.trim()}`);
      }

      if (tasks.length === 0) {
        throw new Error("Please select at least one service task completed.");
      }

      const serviceLog = `${todayStr} / Work done: ${tasks.join(", ")}.`;

      let finalRemark = serviceLog;
      if (selectedCustomer.remark && selectedCustomer.remark.trim()) {
        finalRemark = `${selectedCustomer.remark.trim()}\n---\n${serviceLog}`;
      }

      const { error } = await supabase
        .from("customers")
        .update({
          installation_date: todayStr,
          remark: finalRemark,
        })
        .eq("id", selectedCustomer.id);

      if (error) throw error;

      setIsCompleteModalOpen(false);
      fetchDueCustomers();
      refetchInactiveCount();
    } catch (err: any) {
      console.error("Error completing service record:", err);
      alert(err.message || "Failed to record service completion.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Render loading state for the page auth check
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
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight">Service Directory</h2>
            <p className="text-xs text-slate-500 mt-1">Monitor active service periods, identify urgent upcoming expirations, and record completed maintenance visits.</p>
          </div>
        </section>
        {/* Filter and Search Bar */}
        <section className="bg-white rounded-md p-5 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as "urgent" | "all")}
              className="w-full md:w-56 h-10 px-3 pr-10 rounded-md border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 appearance-none cursor-pointer"
            >
              <option value="all">Inactive Profiles</option>
              <option value="urgent">Urgent Expiry {"<"} 3 Days</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>

          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by Name, Place, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Database Action Status Alerts */}
        {dbError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-md text-xs font-semibold leading-relaxed">
            {dbError}
          </div>
        )}

        {/* Customer Table / Grid List */}
        <section className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden">
          {customersLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs font-semibold">Loading due registers...</p>
            </div>
          ) : displayedCustomers.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-700 font-extrabold text-xs">
                ✓
              </div>
              <div>
                <h4 className="font-serif text-sm font-black text-slate-900">All Caught Up!</h4>
                <p className="text-slate-400 text-xs mt-1">No customers have expired service contracts in the last 3 days.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Responsive Table for large screens */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-4.5 px-6">Customer Name</th>
                      <th className="py-4.5 px-6">Phone Number</th>
                      <th className="py-4.5 px-6">Place</th>
                      <th className="py-4.5 px-6">Product Name</th>
                      <th className="py-4.5 px-6">Installation Date</th>
                      <th className="py-4.5 px-6">Maintenance</th>
                      <th className="py-4.5 px-6">Status</th>
                      <th className="py-4.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {displayedCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">{customer.customer_name}</td>
                        <td className="py-4 px-6 font-semibold text-slate-600">{customer.phone_number}</td>
                        <td className="py-4 px-6 font-semibold">{customer.place}</td>
                        <td className="py-4 px-6 font-medium text-slate-500">{customer.product_name}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{formatInstallationDate(customer.installation_date)}</td>
                        <td className="py-4 px-6 text-slate-500 font-semibold">{customer.maintenance_period} Months</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border bg-slate-50 border-slate-200 text-slate-500">
                            {customer.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openCompleteServiceModal(customer)}
                              title="Attend & Complete Maintenance"
                              className="h-9 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm shadow-rose-50 mr-1"
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Attend</span>
                            </button>
                            <a
                              href={`tel:${customer.phone_number}`}
                              title="Call Customer"
                              className="w-9 h-9 border border-slate-150 hover:border-emerald-250 hover:bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-all"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <a
                              href={getWhatsAppLink(customer.phone_number)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="WhatsApp Message"
                              className="w-9 h-9 border border-slate-150 hover:border-green-300 hover:bg-green-50 rounded-lg flex items-center justify-center text-green-600 hover:text-green-700 transition-all"
                            >
                              <WhatsAppIcon className="w-4.5 h-4.5" />
                            </a>
                            {customer.latitude && customer.longitude ? (
                              <a
                                href={`https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Open in Google Maps"
                                className="w-9 h-9 border border-slate-150 hover:border-amber-250 hover:bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 hover:text-amber-700 transition-all"
                              >
                                <MapPin className="w-4 h-4" />
                              </a>
                            ) : (
                              <button
                                disabled
                                title="Location Coordinates Not Available"
                                className="w-9 h-9 border border-slate-100 rounded-lg flex items-center justify-center text-slate-200 cursor-not-allowed"
                              >
                                <MapPin className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view for mobile/tablet screens */}
              <div className="block lg:hidden divide-y divide-slate-100">
                {displayedCustomers.map((customer) => (
                  <div key={customer.id} className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{customer.customer_name}</h4>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">{customer.product_name}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border bg-slate-50 border-slate-200 text-slate-500">
                        {customer.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-50 py-3">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Phone Number</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{customer.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Place</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{customer.place}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Maintenance</p>
                        <p className="font-semibold text-slate-700 mt-0.5">{customer.maintenance_period} Months</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Install Date</p>
                        <p className="font-semibold text-slate-500 mt-0.5">{formatInstallationDate(customer.installation_date)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <button
                        onClick={() => openCompleteServiceModal(customer)}
                        className="h-9 w-full bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Attend</span>
                      </button>
                      <a
                        href={`tel:${customer.phone_number}`}
                        className="h-9 w-full border border-emerald-100 hover:border-emerald-250 bg-emerald-50/20 text-emerald-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                      <a
                        href={getWhatsAppLink(customer.phone_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 w-full border border-green-150 hover:border-green-300 bg-green-50/20 text-green-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                      {customer.latitude && customer.longitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 w-full bg-amber-50 hover:bg-amber-100/80 border border-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Location</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="h-9 w-full border border-slate-100 text-slate-350 bg-slate-50/50 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>No Maps</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="px-6 py-4.5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3 border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500"
                  >
                    <option value={10}>10</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                  </select>
                  <span>Entries</span>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-4">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="h-9 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-semibold">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="h-9 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </main>      {/* ================= EDIT CUSTOMER MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-955/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md border border-slate-100 max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-2.5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-950 transition-colors w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 sm:mb-6 shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Customer Details</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Modify registered AMC credentials</p>
            </div>

            {formError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-700 rounded-md text-xs font-semibold leading-relaxed shrink-0">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-5 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Customer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Place / Location Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rohini, Sector 5"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Exide 150AH + Luminous UPS"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Installation Date *</label>
                  <input
                    type="date"
                    value={installationDate}
                    onChange={(e) => setInstallationDate(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 bg-white"
                    required
                  />
                </div>
              </div>

              {/* Coordinates Section */}
              <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-extrabold text-slate-650 uppercase tracking-wider">Coordinates (Location)</span>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="h-8 px-3.5 bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {gettingLocation ? (
                      <>
                        <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Acquiring...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3 h-3" />
                        <span>Get Current Location</span>
                      </>
                    )}
                  </button>
                </div>

                {locationError && (
                  <div className="p-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-md text-[11px] font-semibold leading-relaxed flex items-start gap-2">
                    <span>⚠️</span>
                    <span>{locationError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Latitude</label>
                    <input
                      type="text"
                      placeholder="e.g. 28.7041"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Longitude</label>
                    <input
                      type="text"
                      placeholder="e.g. 77.1025"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Maintenance Period (Months) *</label>
                <select
                  value={maintenancePeriod}
                  onChange={(e) => setMaintenancePeriod(Number(e.target.value) as 3 | 6 | 9 | 12)}
                  className="w-full h-11 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 bg-white"
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={9}>9 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>



              <div className="pt-2 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-11 px-5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-md text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="h-11 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-4.5 h-4.5" />
                      <span>Update Record</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW DETAILS MODAL ================= */}
      {isViewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md border border-slate-100 max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-2.5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 sm:mb-6 shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">AMC Customer Details</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Full service registry profile</p>
            </div>

            <div className="space-y-4 sm:space-y-5 text-sm overflow-y-auto flex-1 pr-1">
              <div className="bg-slate-50/50 p-5 border border-slate-100 rounded-md space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Customer Name</span>
                  <span className="text-slate-900 font-bold text-base mt-0.5 block">{selectedCustomer.customer_name}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Phone Number</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{selectedCustomer.phone_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Place / Location</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">{selectedCustomer.place}</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-md p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Product Registered</span>
                    <span className="text-slate-700 font-semibold mt-0.5 block">{selectedCustomer.product_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Installation Date</span>
                    <span className="text-slate-700 font-semibold mt-0.5 block">{formatInstallationDate(selectedCustomer.installation_date)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-50">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Maintenance</span>
                    <span className="text-slate-700 font-semibold mt-0.5 block">{selectedCustomer.maintenance_period} Months</span>
                  </div>
                </div>
              </div>

              {selectedCustomer.remark && (
                <div className="border border-slate-100 rounded-md p-5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Remark / Notes</span>
                  <p className="text-slate-650 leading-relaxed text-xs whitespace-pre-wrap">{selectedCustomer.remark}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3.5">
                {selectedCustomer.latitude && selectedCustomer.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedCustomer.latitude},${selectedCustomer.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-5 bg-amber-50 hover:bg-amber-100/80 border border-amber-100 text-amber-700 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-amber-50"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= COMPLETE SERVICE CHECKLIST MODAL ================= */}
      {isCompleteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md border border-slate-100 max-w-md w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-2.5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsCompleteModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 sm:mb-6 shrink-0">
              <h2 className="font-serif text-lg sm:text-xl font-black text-slate-900 tracking-tight">Record Maintenance</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Select completed service checklists</p>
              <div className="mt-3 bg-slate-50 border border-slate-100/50 rounded-md p-3 text-xs space-y-1">
                <div>
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider block">Customer</span>
                  <span className="text-slate-800 font-bold">{selectedCustomer.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider block">Product Registered</span>
                  <span className="text-slate-650 font-semibold">{selectedCustomer.product_name}</span>
                </div>
              </div>
            </div>

            {/* Category Dropdown Select */}
            <div className="mb-5 shrink-0">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Select Product Category</label>
              <select
                value={detectedCategory}
                onChange={(e) => {
                  setDetectedCategory(e.target.value as "RO" | "Battery");
                  setSelectedTasks([]);
                  setIsOtherSelected(false);
                }}
                className="w-full h-11 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 bg-white font-semibold cursor-pointer"
              >
                <option value="RO">Water Purifier (RO)</option>
                <option value="Battery">Battery / Inverter</option>
              </select>
            </div>

            <form onSubmit={handleCompleteServiceSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-1 mb-5 space-y-2.5 max-h-[40vh]">
                {(detectedCategory === "RO" ? roTasks : batteryTasks).map((task) => {
                  const isChecked = selectedTasks.includes(task);
                  return (
                    <label
                      key={task}
                      className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer select-none transition-all ${isChecked
                        ? "bg-emerald-50/50 border-emerald-200 text-emerald-950 font-semibold"
                        : "bg-white border-slate-100 hover:bg-slate-50/50 text-slate-650"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedTasks(prev => prev.filter(t => t !== task));
                          } else {
                            setSelectedTasks(prev => [...prev, task]);
                          }
                        }}
                        className="w-4 h-4 rounded text-emerald-600 border-slate-205 focus:ring-emerald-500/20 focus:ring-offset-0"
                      />
                      <span className="text-xs">{task}</span>
                    </label>
                  );
                })}

                {/* Other Checklist Item */}
                <label
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer select-none transition-all ${isOtherSelected
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-955 font-semibold"
                    : "bg-white border-slate-100 hover:bg-slate-50/50 text-slate-650"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isOtherSelected}
                    onChange={() => setIsOtherSelected(prev => !prev)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-205 focus:ring-emerald-500/20 focus:ring-offset-0"
                  />
                  <span className="text-xs">Other</span>
                </label>

                {/* If Other is checked, show text field */}
                {isOtherSelected && (
                  <div className="pt-1.5 animate-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      placeholder="Specify custom service details..."
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs text-slate-800"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCompleteModalOpen(false)}
                  className="h-11 px-5 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-md text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="h-11 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Completion</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Instagram style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 h-16 shadow-lg z-50 px-6 flex items-center justify-around pb-safe">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-950 transition-colors">
          <Home className="w-5 h-5 text-slate-400" />
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
        <Link href="/service" className="flex flex-col items-center gap-1 text-rose-600">
          <Wrench className="w-5 h-5 text-rose-600" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Service</span>
        </Link>
      </div>
    </div>
  );
}
