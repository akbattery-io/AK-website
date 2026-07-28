import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WorkContent } from "@/components/WorkContent";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Real-time Vercel page updates without CDN cache delay

export const metadata: Metadata = {
  title: "Inverter Batteries & UPS Sales in Kannamangalam | AK Batteries",
  description: "Buy genuine Exide, Amaron & Luminous Inverter Batteries & Home UPS in Kannamangalam, Tamil Nadu. Best prices, free doorstep delivery & installation in Kannamangalam, Arani & Vellore.",
  keywords: ["Inverter Battery Kannamangalam", "UPS Battery Kannamangalam", "Amaron Battery Kannamangalam", "Exide Battery Kannamangalam", "Inverter Installation Kannamangalam"],
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
