import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WorkContent } from "@/components/WorkContent";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600; // ISR cache revalidation hourly

export const metadata: Metadata = {
  title: "Inverter Batteries & UPS | AK Batteries & RO Solutions",
  description: "Explore our premium range of genuine Exide, Amaron, and Luminous batteries and home power backup systems with transparent pricing.",
};

export default async function BatteriesInvertersPage() {
  let products: any[] = [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", "ups inventer & batteries")
      .order("created_at", { ascending: false });

    if (error) throw error;
    products = data || [];
  } catch (err) {
    console.error("Failed to load batteries and inverters on server side:", err);
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
