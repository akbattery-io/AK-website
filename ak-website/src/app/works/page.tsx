import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WorkContent } from "@/components/WorkContent";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Real-time Vercel page updates without CDN cache delay

export const metadata: Metadata = {
  title: "Products & Pricing in Kannamangalam | AK Batteries & RO",
  description: "Browse our complete catalog of Inverter Batteries, Home UPS & RO Water Purifiers in Kannamangalam, Tamil Nadu. Transparent prices, doorstep delivery & installation.",
  keywords: ["Products Kannamangalam", "Battery Pricing Kannamangalam", "RO Price List Kannamangalam", "Exide Battery Price Kannamangalam"],
};

export default async function WorksPage() {
  // Fetch live products catalog on the server
  let products: any[] = [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    products = data || [];
  } catch (err) {
    console.error("Failed to load products on the server side:", err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <WorkContent initialProducts={products} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
