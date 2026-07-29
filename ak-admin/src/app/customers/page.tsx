"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, isAdminEmail } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "../../components/Header";
import { parseCoordinates } from "@/types/customerMap";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  X,
  PlusCircle,
  Database,
  Inbox,
  Eye,
  ExternalLink,
  Navigation,
  Package,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Phone,
  PhoneCall,
  MessageSquare,
  Home
} from "lucide-react";

interface Customer {
  id: string;
  customer_name: string;
  phone_number: string;
  place: string;
  latitude?: number | null;
  longitude?: number | null;
  location?: any;
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

export default function CustomersPage() {
  const router = useRouter();
  const { user, loading, refetchInactiveCount } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Customers data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Checkbox selection state
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Modals open states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [contactCustomer, setContactCustomer] = useState<Customer | null>(null);
  const [whatsappMsg, setWhatsappMsg] = useState("");

  const openContactModal = (customer: Customer) => {
    setContactCustomer(customer);
    const formattedDate = formatInstallationDate(customer.installation_date);
    const defaultMsg = `Hi ${customer.customer_name}
This is AK Batteries. Your ${customer.product_name}, installed on ${formattedDate}, is due for maintenance service. 
Please let us know a convenient date and time for the service. 
Thank you!`;
    setWhatsappMsg(defaultMsg);
    setIsContactModalOpen(true);
  };

  const handleWhatsAppClick = () => {
    if (!contactCustomer) return;
    const rawDigits = contactCustomer.phone_number.replace(/[^0-9]/g, "");
    const formattedPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(url, "_blank");
  };

  const handleCallClick = () => {
    if (!contactCustomer) return;
    window.location.href = `tel:${contactCustomer.phone_number.trim()}`;
  };

  // Form field states
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

  // Reset page and selection when search or filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedCustomerIds([]);
  }, [debouncedSearchQuery, statusFilter]);

  // Fetch customers from Supabase
  const fetchCustomers = async () => {
    if (!user) return;
    setCustomersLoading(true);
    setDbError(null);

    try {
      let query = supabase
        .from("customers")
        .select("*", { count: "exact" });

      // Search filters (start matching after 3 characters)
      if (debouncedSearchQuery.trim().length >= 3) {
        const cleanSearch = debouncedSearchQuery.trim();
        query = query.or(
          `customer_name.ilike.%${cleanSearch}%,phone_number.ilike.%${cleanSearch}%,place.ilike.%${cleanSearch}%`
        );
      }

      // Status filter
      if (statusFilter !== "All") {
        query = query.eq("status", statusFilter);
      }

      // Range offset
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query.order("installation_date", { ascending: true }).range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setCustomers(data || []);
      setTotalPages(count ? Math.ceil(count / pageSize) : 1);
    } catch (err: any) {
      console.error("Error fetching customers from Supabase:", err);
      setDbError(err.message || "Failed to load customers.");
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [user, debouncedSearchQuery, statusFilter, currentPage, pageSize]);



  // Open modals
  const openAddModal = () => {
    setFormError(null);
    setLocationError(null);
    setCustomerName("");
    setPhoneNumber("");
    setPlace("");
    setProductName("");
    setInstallationDate("");
    setLatitude("");
    setLongitude("");
    setMaintenancePeriod(3);
    setRemark("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setFormError(null);
    setLocationError(null);
    setSelectedCustomer(customer);
    setCustomerName(customer.customer_name);
    setPhoneNumber(customer.phone_number);
    setPlace(customer.place);
    setProductName(customer.product_name);
    setInstallationDate(customer.installation_date);
    setLatitude(customer.latitude !== null && customer.latitude !== undefined ? customer.latitude.toString() : "");
    setLongitude(customer.longitude !== null && customer.longitude !== undefined ? customer.longitude.toString() : "");
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

  // Submit adding customer
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      validateForm();

      const calculatedStatus = getCalculatedStatus(installationDate, maintenancePeriod);

      const newCustomer = {
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

      const { error } = await supabase.from("customers").insert([newCustomer]);

      if (error) throw error;

      setIsAddModalOpen(false);
      fetchCustomers();
      refetchInactiveCount();
    } catch (err: any) {
      console.error("Error creating customer:", err);
      setFormError(err.message || "Failed to save customer registration.");
    } finally {
      setFormSubmitting(false);
    }
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
      fetchCustomers();
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
      setSelectedCustomerIds((prev) => prev.filter((item) => item !== id));
      fetchCustomers();
      refetchInactiveCount();
    } catch (err: any) {
      console.error("Error deleting customer:", err);
      alert(err.message || "Failed to delete customer registration.");
    }
  };

  // Selection handlers
  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageIds = customers.map((c) => c.id);
    const allSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedCustomerIds.includes(id));

    if (allSelected) {
      setSelectedCustomerIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedCustomerIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    if (selectedCustomerIds.length === 0) return;
    const count = selectedCustomerIds.length;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${count} selected customer registration${count > 1 ? "s" : ""}? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("customers").delete().in("id", selectedCustomerIds);
      if (error) throw error;
      setSelectedCustomerIds([]);
      fetchCustomers();
      refetchInactiveCount();
    } catch (err: any) {
      console.error("Error deleting selected customers:", err);
      alert(err.message || "Failed to delete selected customers.");
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

        {/* Title Section */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-serif tracking-tight">Customer Registrations</h2>
            <p className="text-xs text-slate-500 mt-1">Register new client accounts, manage contact information, update statuses, and view map coordinates.</p>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="bg-white rounded-md p-5 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 h-10 px-3 pr-10 rounded-md border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Status</option>
              <option value="Inactive">Inactive Status</option>
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

        {/* Selected Customers Action Bar */}
        {selectedCustomerIds.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 flex items-center justify-between animate-in fade-in duration-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
              <span className="text-xs font-bold text-rose-900">
                {selectedCustomerIds.length} customer{selectedCustomerIds.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <button
              onClick={handleBulkDelete}
              className="h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shadow-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedCustomerIds.length})</span>
            </button>
          </div>
        )}

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
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-md animate-spin"></div>
              <p className="text-slate-400 text-xs font-semibold">Loading customers directory...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-black text-slate-900">No Customers Found</h4>
                <p className="text-slate-400 text-xs mt-1">Try refining search query or add a new customer.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table View for all screen sizes */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[780px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-4.5 px-4 text-center w-12">
                        <input
                          type="checkbox"
                          checked={customers.length > 0 && customers.every((c) => selectedCustomerIds.includes(c.id))}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                          title="Select All"
                        />
                      </th>
                      <th className="py-4.5 px-6 text-center">Customer Name</th>
                      <th className="py-4.5 px-6 text-center">Phone Number</th>
                      <th className="py-4.5 px-6 text-center">Place</th>
                      <th className="py-4.5 px-6 text-center">Product Name</th>
                      <th className="py-4.5 px-6 text-center">Installation Date</th>
                      <th className="py-4.5 px-6 text-center">Status</th>
                      <th className="py-4.5 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {customers.map((customer) => {
                      const isInactive = customer.status === "Inactive";
                      const isSelected = selectedCustomerIds.includes(customer.id);
                      return (
                        <tr
                          key={customer.id}
                          className={`transition-colors ${isSelected
                            ? "bg-rose-50/50 hover:bg-rose-50/70"
                            : isInactive
                              ? "bg-slate-50/70 text-slate-505 hover:bg-slate-100/50"
                              : "hover:bg-slate-50/30"
                            }`}
                        >
                          <td className="py-4 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectCustomer(customer.id)}
                              className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer accent-rose-600"
                            />
                          </td>
                          <td className={`py-4 px-6 font-bold ${isInactive ? "text-slate-700" : "text-slate-900"}`}>{customer.customer_name}</td>
                          <td className="py-4 px-6 font-semibold">
                            <button
                              type="button"
                              onClick={() => openContactModal(customer)}
                              className={`inline-flex items-center gap-1.5 font-semibold group transition-colors underline-offset-2 hover:underline cursor-pointer ${isInactive ? "text-slate-500 hover:text-rose-600" : "text-slate-700 hover:text-rose-600"
                                }`}
                              title="Click to Call or WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5 text-rose-500 opacity-75 group-hover:opacity-100 transition-opacity shrink-0" />
                              <span>{customer.phone_number}</span>
                            </button>
                          </td>
                          <td className="py-4 px-6 font-semibold">
                            {customer.place ? (
                              <a
                                href={
                                  customer.latitude !== null && customer.latitude !== undefined && customer.longitude !== null && customer.longitude !== undefined
                                    ? `https://www.google.com/maps?q=${customer.latitude},${customer.longitude}`
                                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.place)}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-slate-800 hover:text-rose-600 font-semibold group transition-colors underline-offset-2 hover:underline"
                                title="Open place in Google Maps"
                              >
                                <span>{customer.place}</span>
                              </a>
                            ) : (
                              "―"
                            )}
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-550">{customer.product_name}</td>
                          <td className="py-4 px-6 font-semibold">{formatInstallationDate(customer.installation_date)}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${isInactive
                                ? "bg-rose-50 border-rose-100 text-rose-700"
                                : "bg-emerald-50 border-emerald-100 text-emerald-700"
                                }`}
                            >
                              {customer.status}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-right">
                            <div className="inline-flex items-center gap-2 justify-end">
                              <button
                                onClick={() => openViewModal(customer)}
                                title="View Details"
                                className="h-8 px-3 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md flex items-center gap-1.5 text-xs font-bold transition-all bg-white"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => openEditModal(customer)}
                                title="Edit Customer"
                                className="h-8 px-3 border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/40 rounded-md flex items-center gap-1.5 text-xs font-bold transition-all bg-white"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit</span>
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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

                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="h-9 px-4 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                    <span>Previous</span>
                  </button>
                  <span className="text-xs font-semibold text-slate-600 min-w-[90px] text-center">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="h-9 px-4 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* ================= ADD CUSTOMER MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-20 sm:pb-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md border border-slate-100 max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-md border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-3 sm:mb-4 shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New AMC Customer</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Register customer service record</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-md text-xs font-semibold leading-relaxed shrink-0">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="space-y-4 sm:space-y-5 overflow-y-auto flex-1 pr-1 pb-4">
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
                          <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-md animate-spin"></div>
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
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Latitude</label>
                      <input
                        type="text"
                        placeholder="e.g. 13.0827"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Longitude</label>
                      <input
                        type="text"
                        placeholder="e.g. 80.2707"
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
              </div>

              {/* Fixed Action Footer */}
              <div className="pt-3 border-t border-slate-100 bg-white flex items-center justify-end gap-3.5 shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-md animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4.5 h-4.5" />
                      <span>Save Record</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT CUSTOMER MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-20 sm:pb-6 bg-slate-955/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md border border-slate-100 max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-md border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-3 sm:mb-4 shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Customer Details</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Modify registered AMC credentials</p>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-md text-xs font-semibold leading-relaxed shrink-0">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="space-y-4 sm:space-y-5 overflow-y-auto flex-1 pr-1 pb-4">
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
                          <div className="w-3 h-3 border-2 border-rose-600 border-t-transparent rounded-md animate-spin"></div>
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
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Latitude</label>
                      <input
                        type="text"
                        placeholder="e.g. 13.0827"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Longitude</label>
                      <input
                        type="text"
                        placeholder="e.g. 80.2707"
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
              </div>

              {/* Fixed Action Footer */}
              <div className="pt-3 border-t border-slate-100 bg-white flex items-center justify-end gap-3.5 shrink-0 z-10">
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
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-md animate-spin"></div>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-955/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md border border-slate-100 max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-2.5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-md border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 sm:mb-6 shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">AMC Customer Details</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Full service registry profile</p>
            </div>

            <div className="space-y-4 sm:space-y-5 text-sm overflow-y-auto flex-1 pr-1">
              <div className="bg-slate-50/50 p-5 border border-slate-100 rounded-md space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Customer Name</span>
                    <span className="text-slate-900 font-bold text-base mt-0.5 block">{selectedCustomer.customer_name}</span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide border shrink-0 ${selectedCustomer.status === "Inactive"
                      ? "bg-rose-50 border-rose-100 text-rose-700"
                      : "bg-emerald-50 border-emerald-100 text-emerald-700"
                      }`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Phone Number</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        openContactModal(selectedCustomer);
                      }}
                      className="text-slate-800 hover:text-rose-600 font-semibold mt-0.5 inline-flex items-center gap-1.5 group transition-colors underline-offset-2 hover:underline cursor-pointer"
                      title="Click to Call or WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5 text-rose-500 opacity-75 group-hover:opacity-100 transition-opacity shrink-0" />
                      <span>{selectedCustomer.phone_number}</span>
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Place / Location</span>
                    {selectedCustomer.place ? (
                      <a
                        href={
                          selectedCustomer.latitude !== null && selectedCustomer.latitude !== undefined && selectedCustomer.longitude !== null && selectedCustomer.longitude !== undefined
                            ? `https://www.google.com/maps?q=${selectedCustomer.latitude},${selectedCustomer.longitude}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCustomer.place)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-800 hover:text-rose-600 font-semibold mt-0.5 inline-flex items-center gap-1.5 group transition-colors underline-offset-2 hover:underline"
                        title="Open place in Google Maps"
                      >
                        <span>{selectedCustomer.place}</span>
                        <MapPin className="w-3.5 h-3.5 text-rose-500 opacity-75 group-hover:opacity-100 transition-opacity shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-800 font-semibold mt-0.5 block">―</span>
                    )}
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

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Maintenance Period</span>
                    <span className="text-slate-700 font-semibold mt-0.5 block">{selectedCustomer.maintenance_period} Months</span>
                  </div>
                  {selectedCustomer.latitude && selectedCustomer.longitude && (
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Coordinates</span>
                      <span className="text-slate-700 font-semibold mt-0.5 block text-xs">{selectedCustomer.latitude}, {selectedCustomer.longitude}</span>
                    </div>
                  )}
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

      {/* ================= CONTACT CUSTOMER MODAL ================= */}
      {isContactModalOpen && contactCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-md border border-slate-100 max-w-md w-full p-5 sm:p-7 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-md border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5 shrink-0">
              <h2 className="font-serif text-xl font-black text-slate-900 tracking-tight">Contact Customer</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">
                {contactCustomer.customer_name} • {contactCustomer.phone_number}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              {/* Direct Phone Call Button */}
              <button
                onClick={handleCallClick}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-md shadow-slate-200"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call ({contactCustomer.phone_number})</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">OR WHATSAPP</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Editable Maintenance WhatsApp Message */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                  Maintenance WhatsApp Message
                </label>
                <textarea
                  rows={4}
                  value={whatsappMsg}
                  onChange={(e) => setWhatsappMsg(e.target.value)}
                  className="w-full p-3 rounded-md border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed bg-slate-50/50"
                ></textarea>
              </div>

              {/* Send WhatsApp Message Button */}
              <button
                onClick={handleWhatsAppClick}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-200"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span>Send WhatsApp Message</span>
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Floating Add Customer Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 z-[60] h-14 w-14 lg:h-14 lg:w-auto lg:px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 hover:scale-105"
        title="Add new customer"
      >
        <Plus className="w-5 h-5 shrink-0" />
        <span className="hidden lg:inline">Add Customer</span>
      </button>
    </div>
  );
}
