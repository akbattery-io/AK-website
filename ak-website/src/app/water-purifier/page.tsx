import * as React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WorkContent } from "@/components/WorkContent";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Real-time Vercel page updates without CDN cache delay

export const metadata: Metadata = {
  title: "RO Water Purifier Sales & Service in Kannamangalam | AK Solutions",
  description: "Best RO Water Purifier sales, filter service & repair in Kannamangalam, Tamil Nadu. Authorized dealer for Purosis, Finpure, Aquaguard with free installation & doorstep technician support.",
  keywords: ["RO Water Purifier Kannamangalam", "RO Service Kannamangalam", "Water Filter Repair Kannamangalam", "Purosis RO Kannamangalam", "RO Technician Kannamangalam"],
  alternates: {
    canonical: "https://ak-website-ashen.vercel.app/water-purifier",
  },
  openGraph: {
    title: "RO Water Purifier Sales & Service in Kannamangalam | AK Solutions",
    description: "Best RO Water Purifier sales, filter service & repair in Kannamangalam, Tamil Nadu.",
    url: "https://ak-website-ashen.vercel.app/water-purifier",
    type: "website",
  },
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
        <WorkContent
          initialProducts={products}
          showFilters={false}
          pageTitle="RO Water Purifier Sales, Service & Filter Repair in Kannamangalam"
          pageSubtitle="Discover advanced multi-stage RO+UV+UF+Alkaline purification systems with free doorstep installation and expert filter maintenance."
        />
      </main>
      <Footer />
    </div>
  );
}
