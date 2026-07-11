"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Upload,
  X,
  PlusCircle,
  Database,
  Inbox,
  LayoutGrid,
  ListFilter
} from "lucide-react";

interface Product {
  id: string;
  created_at: string;
  image: string;
  category: string;
  brandname: string;
  location: string;
  date: string;
  price: string;
  description?: string;
}

// Helper to extract Cloudinary public ID from secure URL
const getPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  const parts = url.split("/image/upload/");
  if (parts.length < 2) return null;

  // Take the path part after /image/upload/
  let path = parts[1];

  // Remove version segment (e.g. v12345678/) if it exists
  const versionRegex = /^v\d+\//;
  path = path.replace(versionRegex, "");

  // Remove the file extension (e.g. .jpg, .png, etc.)
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    path = path.substring(0, lastDotIndex);
  }

  return path;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("Battery Backup");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch products on load
  const fetchProducts = async () => {
    setProductsLoading(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error("Error fetching products from Supabase:", err);
      setDbError(err.message || "Failed to fetch products from Supabase.");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.email === "akbattery.ro@gmail.com") {
      fetchProducts();
    }
  }, [user]);

  // Set today's date formatted nicely for default input
  const getTodayFormatted = () => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  // Reset form helper
  const resetForm = () => {
    setBrandName("");
    setCategory("Battery Backup");
    setLocation("");
    setPrice("");
    setDateStr(getTodayFormatted());
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl("");
    setFormError(null);
  };

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary via server route
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to upload image to Cloudinary");
    }

    const data = await res.json();
    return data.url;
  };

  // Create/Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    if (!brandName || !location || !price || !dateStr) {
      setFormError("All text fields are required.");
      setFormSubmitting(false);
      return;
    }

    if (!imageFile) {
      setFormError("Product image is required.");
      setFormSubmitting(false);
      return;
    }

    try {
      // 1. Upload file to Cloudinary
      const uploadedUrl = await uploadImage(imageFile);

      // 2. Save details into Supabase
      const { error } = await supabase.from("products").insert([
        {
          brandname: brandName,
          category,
          location,
          price,
          date: dateStr,
          image: uploadedUrl,
          description,
        },
      ]);

      if (error) throw error;

      // Reset, close and refresh
      resetForm();
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Error creating product:", err);
      setFormError(err.message || "An unexpected error occurred while saving the product.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setBrandName(product.brandname);
    setCategory(product.category);
    setLocation(product.location);
    setPrice(product.price);
    setDateStr(product.date);
    setDescription(product.description || "");
    setExistingImageUrl(product.image);
    setImagePreview(product.image);
    setIsEditModalOpen(true);
  };

  // Edit/Update Product
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setFormSubmitting(true);
    setFormError(null);

    try {
      let finalImageUrl = existingImageUrl;

      // 1. If a new file is uploaded, send it to Cloudinary
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      // 2. Update Supabase record
      const { error } = await supabase
        .from("products")
        .update({
          brandname: brandName,
          category,
          location,
          price,
          date: dateStr,
          image: finalImageUrl,
          description,
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      // Reset, close and refresh
      resetForm();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      console.error("Error updating product:", err);
      setFormError(err.message || "An unexpected error occurred while updating.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      // Find product in local state first to get the Cloudinary image URL
      const productToDelete = products.find((p) => p.id === id);
      const imageUrl = productToDelete?.image;

      // 1. Delete product from Supabase
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      // 2. If it is a Cloudinary image URL, delete the image from Cloudinary
      if (imageUrl && imageUrl.includes("cloudinary.com")) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          try {
            const res = await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              console.error("Failed to delete image from Cloudinary API");
            }
          } catch (cloudinaryErr) {
            console.error("Error calling Cloudinary delete API:", cloudinaryErr);
          }
        }
      }

      fetchProducts();
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(err.message || "Failed to delete product.");
    }
  };

  // Memoized filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      const matchesSearch = p.brandname
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  // Statistics
  const statistics = useMemo(() => {
    const total = products.length;
    const batteries = products.filter((p) => p.category === "Battery Backup").length;
    const purifiers = products.filter((p) => p.category === "Water Purification").length;
    return { total, batteries, purifiers };
  }, [products]);

  // Handle Logout redirect
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Render loading skeleton
  if (loading || (user && user.email !== "akbattery.ro@gmail.com")) {
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-rose-100">
              AK
            </div>
            <div>
              <h1 className="font-serif text-lg font-black text-slate-900 tracking-tight leading-none">
                AK Admin
              </h1>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">
                Product Catalog Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Authorized Admin</span>
              <span className="text-xs font-semibold text-slate-950">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 h-10 border border-slate-200/80 hover:border-red-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total Products</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{statistics.total}</h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-700">
              <Database className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">Battery Backups</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{statistics.batteries}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">Water Purification</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{statistics.purifiers}</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center justify-center">
              <ListFilter className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Filter and Control Bar */}
        <section className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Battery Backup", "Water Purification"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${categoryFilter === cat
                  ? "bg-slate-900 text-white border-transparent"
                  : "bg-slate-50 text-slate-600 border-slate-200/50 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {cat === "All" ? "All Products" : cat === "Battery Backup" ? "Battery Backups" : "Water Purification"}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-xl">
            {/* Search Box */}
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by brand name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 transition-all bg-white"
              />
            </div>

            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="h-11 px-5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md shadow-rose-200"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add Product</span>
            </button>
          </div>
        </section>

        {/* Database Error State */}
        {dbError && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs font-semibold leading-relaxed">
            {dbError}
          </div>
        )}

        {/* Catalog Table */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {productsLoading ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-xs font-semibold">Loading product database...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 px-4 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
                No products found
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                We couldn't find any products in your catalog matching the filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("All");
                }}
                className="px-4 py-2 border border-slate-200/80 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Product Visual</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Brand Partner</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Price (M.R.P.)</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Location & Date</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="bg-slate-50 border border-slate-100/50 rounded-2xl h-18 w-24 overflow-hidden shrink-0">
                          <img
                            src={product.image}
                            alt={product.brandname}
                            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-serif text-base font-black text-slate-900 tracking-tight select-all">
                            {product.brandname}
                          </div>
                          {product.description && (
                            <p className="text-[11px] text-slate-400 font-semibold line-clamp-1 max-w-[200px] mt-0.5" title={product.description}>
                              {product.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${product.category === "Battery Backup"
                          ? "bg-amber-50 text-amber-700 border-amber-100/70"
                          : "bg-rose-50 text-rose-700 border-rose-100/70"
                          }`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-black text-slate-900 select-all group-hover:text-rose-600 transition-colors">
                          {product.price}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{product.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{product.date}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="w-9 h-9 border border-slate-200/80 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all flex items-center justify-center"
                            title="Edit details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="w-9 h-9 border border-slate-200/80 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-all flex items-center justify-center"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="font-serif text-2xl font-black text-slate-900 tracking-tight">Add New Product</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Publish to public catalog</p>
            </div>

            {formError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-semibold leading-relaxed">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 bg-white"
                  >
                    <option value="Battery Backup">Battery Backup</option>
                    <option value="Water Purification">Water Purification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Brand Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Exide, Luminous"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Price (M.R.P.)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹14,499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. June 15, 2026"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Installation/Customer Location</label>
                <input
                  type="text"
                  placeholder="e.g. Dwarka Sector 12, Delhi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Description</label>
                <textarea
                  placeholder="Describe the product or installation details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Image (Cloudinary)</label>
                <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-6 text-center hover:border-rose-300 transition-colors flex flex-col items-center bg-slate-50/50">
                  {imagePreview ? (
                    <div className="relative group rounded-xl overflow-hidden h-32 w-32 border border-slate-100 flex items-center justify-center p-2 bg-white">
                      <img src={imagePreview} alt="Preview" className="object-contain max-h-full max-w-full" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2.5" />
                      <p className="text-xs text-slate-500 font-semibold mb-1">Click to select an image</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">PNG, JPG, JPEG up to 10MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full hidden"
                    id="fileUpload"
                  />
                  {!imagePreview && (
                    <button
                      type="button"
                      onClick={() => document.getElementById("fileUpload")?.click()}
                      className="mt-3.5 h-8 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all"
                    >
                      Browse Files
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-11 px-5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="h-11 px-6 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-200 flex items-center justify-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4.5 h-4.5" />
                      <span>Save Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="font-serif text-2xl font-black text-slate-900 tracking-tight">Edit Product Details</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Update database record</p>
            </div>

            {formError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-semibold leading-relaxed">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditProduct} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 bg-white"
                  >
                    <option value="Battery Backup">Battery Backup</option>
                    <option value="Water Purification">Water Purification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Brand Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Exide, Luminous"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Price (M.R.P.)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹14,499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                  <input
                    type="text"
                    placeholder="e.g. June 15, 2026"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Installation/Customer Location</label>
                <input
                  type="text"
                  placeholder="e.g. Dwarka Sector 12, Delhi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Description</label>
                <textarea
                  placeholder="Describe the product or installation details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Image (Cloudinary)</label>
                <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-6 text-center hover:border-rose-300 transition-colors flex flex-col items-center bg-slate-50/50">
                  {imagePreview ? (
                    <div className="relative group rounded-xl overflow-hidden h-32 w-32 border border-slate-100 flex items-center justify-center p-2 bg-white">
                      <img src={imagePreview} alt="Preview" className="object-contain max-h-full max-w-full" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          // Restore back to original if they clear
                          setImagePreview(existingImageUrl);
                        }}
                        className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                      >
                        Reset Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2.5" />
                      <p className="text-xs text-slate-500 font-semibold mb-1">Click to select an image</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">PNG, JPG, JPEG up to 10MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full hidden"
                    id="editFileUpload"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("editFileUpload")?.click()}
                    className="mt-3.5 h-8 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="h-11 px-5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
