import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WorkContent } from "@/components/WorkContent";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // ISR cache revalidation hourly

export const metadata: Metadata = {
  title: "Products & Pricing | AK Batteries & RO Solutions",
  description: "Browse our premium product catalog including Exide, Amaron, and Luminous batteries and inverters, alongside Aquaguard, purosis, and Aqua Era RO water purifiers with transparent pricing.",
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
