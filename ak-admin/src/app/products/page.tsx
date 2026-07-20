"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, isAdminEmail } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import {
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
  ListFilter,
  Package,
  Users,
  Wrench,
  Home
} from "lucide-react";

interface Product {
  id: string;
  created_at: string;
  image: string; // legacy support
  images?: string[]; // new list of images
  category: string;
  brandname: string;
  location?: string; // legacy support (optional since column is removed)
  date?: string; // legacy support (optional since column is removed)
  price: string; // legacy support (populated with selling_price)
  mrp?: string;
  selling_price?: string;
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

export default function ProductsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Search input debounce logic (600ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when search query or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, categoryFilter]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("ups inventer & batteries");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [description, setDescription] = useState("");

  // Multiple files upload state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

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
    if (user && isAdminEmail(user.email)) {
      fetchProducts();
    }
  }, [user]);

  // Reset form helper
  const resetForm = () => {
    setBrandName("");
    setCategory("ups inventer & batteries");
    setMrp("");
    setSellingPrice("");
    setDescription("");
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImageUrls([]);
    setFormError(null);
  };

  // Multiple files change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...selectedFiles]);

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePendingImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
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

    if (!brandName || !mrp || !sellingPrice) {
      setFormError("All fields (except description) are required.");
      setFormSubmitting(false);
      return;
    }

    if (imageFiles.length === 0) {
      setFormError("At least one product image is required.");
      setFormSubmitting(false);
      return;
    }

    try {
      // 1. Upload all files to Cloudinary in parallel
      const uploadedUrls = await Promise.all(
        imageFiles.map((file) => uploadImage(file))
      );

      // 2. Save details into Supabase
      const { error } = await supabase.from("products").insert([
        {
          brandname: brandName,
          category,
          price: sellingPrice, // legacy support (populated with selling price)
          mrp,
          selling_price: sellingPrice,
          image: uploadedUrls[0] || "", // legacy support (first image URL)
          images: uploadedUrls,
          description,
        },
      ]);

      if (error) throw error;

      toast.success("Product created successfully!");
      // Reset, close and refresh
      resetForm();
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Error creating product:", err);
      toast.error(err.message || "Failed to save the product.");
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
    setMrp(product.mrp || "");
    setSellingPrice(product.selling_price || product.price || "");
    setDescription(product.description || "");

    // Existing images can be retrieved from images array or single fallback image URL
    const imgs = product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
    setExistingImageUrls(imgs);
    setImageFiles([]);
    setImagePreviews([]);
    setIsEditModalOpen(true);
  };

  // Edit/Update Product
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setFormSubmitting(true);
    setFormError(null);

    if (!brandName || !mrp || !sellingPrice) {
      setFormError("All fields (except description) are required.");
      setFormSubmitting(false);
      return;
    }

    if (existingImageUrls.length === 0 && imageFiles.length === 0) {
      setFormError("At least one product image is required.");
      setFormSubmitting(false);
      return;
    }

    try {
      // 1. Upload new files if added
      const newUploadedUrls = await Promise.all(
        imageFiles.map((file) => uploadImage(file))
      );

      // Combine existing remaining images with newly uploaded images
      const finalImageUrls = [...existingImageUrls, ...newUploadedUrls];

      // 2. Update Supabase record
      const { error } = await supabase
        .from("products")
        .update({
          brandname: brandName,
          category,
          price: sellingPrice, // legacy support (populated with selling price)
          mrp,
          selling_price: sellingPrice,
          image: finalImageUrls[0] || "", // legacy support
          images: finalImageUrls,
          description,
        })
        .eq("id", selectedProduct.id);

      if (error) throw error;

      toast.success("Product updated successfully!");
      // Reset, close and refresh
      resetForm();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      console.error("Error updating product:", err);
      toast.error(err.message || "Failed to update product.");
      setFormError(err.message || "An unexpected error occurred while updating.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      // Find product in local state first to get all Cloudinary image URLs
      const productToDelete = products.find((p) => p.id === id);
      const imageUrls = productToDelete?.images && productToDelete.images.length > 0
        ? productToDelete.images
        : productToDelete?.image
          ? [productToDelete.image]
          : [];

      // 1. Delete product from Supabase
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      // 2. Delete all related images from Cloudinary
      for (const imageUrl of imageUrls) {
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
      }

      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (err: any) {
      console.error("Error deleting product:", err);
      toast.error(err.message || "Failed to delete product.");
    }
  };

  // Memoized filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      const matchesSearch = p.brandname
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, debouncedSearchQuery]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / pageSize) || 1;
  }, [filteredProducts, pageSize]);

  const displayedProducts = useMemo(() => {
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize;
    return filteredProducts.slice(from, to);
  }, [filteredProducts, currentPage, pageSize]);

  // Statistics
  const statistics = useMemo(() => {
    const total = products.length;
    const batteries = products.filter((p) => p.category === "ups inventer & batteries").length;
    const purifiers = products.filter((p) => p.category === "water purifier").length;
    return { total, batteries, purifiers };
  }, [products]);



  // Render loading skeleton
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
              <p className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">UPS Inverters & Batteries</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{statistics.batteries}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">Water Purifiers</p>
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
            {["All", "ups inventer & batteries", "water purifier"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${categoryFilter === cat
                  ? "bg-slate-900 text-white border-transparent"
                  : "bg-slate-50 text-slate-650 border-slate-200/50 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                {cat === "All" ? "All Products" : cat === "ups inventer & batteries" ? "UPS Inverters & Batteries" : "Water Purifiers"}
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
                placeholder="Search by brand name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-805 transition-all bg-white"
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
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Product Visuals</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Brand Partner</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">M.R.P.</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Selling Price</th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedProducts.map((product) => {
                    const productImages = product.images && product.images.length > 0
                      ? product.images
                      : product.image
                        ? [product.image]
                        : [];

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="bg-slate-50 border border-slate-100/50 rounded-2xl h-18 w-24 overflow-hidden shrink-0 relative flex items-center justify-center bg-white p-1">
                            {productImages[0] ? (
                              <Image
                                src={productImages[0]}
                                alt={product.brandname}
                                fill
                                sizes="96px"
                                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-400">No Image</span>
                            )}
                            {productImages.length > 1 && (
                              <span className="absolute bottom-1 right-1 bg-slate-900/70 text-white text-[9px] font-extrabold px-1 rounded">
                                +{productImages.length - 1}
                              </span>
                            )}
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
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${product.category === "ups inventer & batteries"
                            ? "bg-amber-50 text-amber-700 border-amber-100/70"
                            : "bg-rose-50 text-rose-700 border-rose-100/70"
                            }`}>
                            {product.category === "ups inventer & batteries" ? "UPS Inverters" : "Water Purifier"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-semibold text-slate-400 line-through">
                            {product.mrp || "—"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-lg font-black text-slate-900 select-all group-hover:text-rose-600 transition-colors">
                            {product.selling_price || product.price}
                          </span>
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
                              className="w-9 h-9 border border-slate-200/80 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-xl transition-all flex items-center justify-center"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {!productsLoading && filteredProducts.length > 0 && (
            <div className="px-6 py-4.5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-9 px-3 border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500"
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
                    className="h-9 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="h-9 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-955/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-2.5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-950 transition-colors w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-4 sm:mb-6 shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Product</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Publish to public catalog</p>
            </div>

            {formError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-semibold leading-relaxed shrink-0">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-4 sm:space-y-5 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 bg-white"
                  >
                    <option value="ups inventer & batteries">UPS Inverter & Batteries</option>
                    <option value="water purifier">Water Purifier</option>
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
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">M.R.P. (Original Price)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹14499"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Selling Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12999"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Description</label>
                <textarea
                  placeholder="Describe should seperated by commas"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Images (Cloudinary)</label>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden h-24 border border-slate-100 flex items-center justify-center p-2 bg-white">
                        <img src={preview} alt={`Preview ${index + 1}`} className="object-contain max-h-full max-w-full" />
                        <button
                          type="button"
                          onClick={() => removePendingImage(index)}
                          className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-6 text-center hover:border-rose-300 transition-colors flex flex-col items-center bg-slate-50/50 relative">
                  <Upload className="w-8 h-8 text-slate-400 mb-2.5 pointer-events-none" />
                  <p className="text-xs text-slate-500 font-semibold mb-1">Click to select files</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Multiple images supported</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    id="fileUpload"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-11 px-5 border border-slate-200 text-slate-655 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-5 sm:p-8 shadow-2xl relative max-h-[calc(100vh-2.5rem)] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedProduct(null);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-955 transition-colors w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 z-50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 sm:mb-6 shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Product Details</h2>
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider mt-1">Update database record</p>
            </div>

            {formError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-semibold leading-relaxed shrink-0">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditProduct} className="space-y-4 sm:space-y-5 overflow-y-auto flex-1 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 bg-white"
                  >
                    <option value="ups inventer & batteries">UPS Inverter & Batteries</option>
                    <option value="water purifier">Water Purifier</option>
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
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">M.R.P. (Original Price)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹14,499"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-805"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Selling Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12,999"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Description</label>
                <textarea
                  placeholder="Describe the product or installation details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 p-3.5 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-805 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Product Images (Cloudinary)</label>

                {(existingImageUrls.length > 0 || imagePreviews.length > 0) && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {/* Existing Images */}
                    {existingImageUrls.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group rounded-xl overflow-hidden h-20 border border-slate-100 flex items-center justify-center p-2 bg-white">
                        <img src={url} alt={`Saved Visual ${index + 1}`} className="object-contain max-h-full max-w-full" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold"
                        >
                          Delete
                        </button>
                        <span className="absolute top-0.5 left-0.5 bg-emerald-500 text-white text-[8px] font-extrabold px-1 rounded">Saved</span>
                      </div>
                    ))}
                    {/* Newly Selected Previews */}
                    {imagePreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden h-20 border border-slate-100 flex items-center justify-center p-2 bg-white">
                        <img src={preview} alt={`New Preview ${index + 1}`} className="object-contain max-h-full max-w-full" />
                        <button
                          type="button"
                          onClick={() => removePendingImage(index)}
                          className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold"
                        >
                          Remove
                        </button>
                        <span className="absolute top-0.5 left-0.5 bg-blue-500 text-white text-[8px] font-extrabold px-1 rounded">New</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-6 text-center hover:border-rose-300 transition-colors flex flex-col items-center bg-slate-50/50 relative">
                  <Upload className="w-8 h-8 text-slate-400 mb-2.5 pointer-events-none" />
                  <p className="text-xs text-slate-500 font-semibold mb-1">Click to select files</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    id="editFileUpload"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="h-11 px-5 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
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

      {/* Mobile Bottom Navigation Bar (Instagram style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 h-16 shadow-lg z-50 px-6 flex items-center justify-around pb-safe">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-950 transition-colors">
          <Home className="w-5 h-5 text-slate-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Dashboard</span>
        </Link>
        <Link href="/products" className="flex flex-col items-center gap-1 text-rose-600">
          <Package className="w-5 h-5 text-rose-600" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider">Products</span>
        </Link>
        <Link href="/customers" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-955 transition-colors">
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
