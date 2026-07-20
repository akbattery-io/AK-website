import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WorkContent } from "@/components/WorkContent";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // ISR cache revalidation hourly

export const metadata: Metadata = {
  title: "RO Water Purifiers | AK Batteries & RO Solutions",
  description: "Browse our premium RO water purifiers, including Aquaguard, purosis, and Aqua Era water purifiers with door-step installation and services.",
};

export default async function WaterPurifierPage() {
  let products: any[] = [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "water purifier")
      .order("created_at", { ascending: false });

    if (error) throw error;
    products = data || [];
  } catch (err) {
    console.error("Failed to load water purifiers on server side:", err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <WorkContent initialProducts={products} showFilters={false} />
      </main>
      <Footer />
    </div>
  );
}
