import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Live server-rendered product pages

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProductData(idParam: string) {
  const decodedParam = decodeURIComponent(idParam);

  try {
    // 1. Try matching by UUID/numeric ID if valid
    let { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", idParam)
      .maybeSingle();

    // 2. If not found by ID, try matching by brandname
    if (!product) {
      const { data: byBrand } = await supabase
        .from("products")
        .select("*")
        .ilike("brandname", decodedParam)
        .maybeSingle();

      product = byBrand;
    }

    if (!product) return null;

    // 3. Fetch related products in the same category
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id)
      .limit(3);

    return {
      product,
      relatedProducts: related || []
    };
  } catch (err) {
    console.error("Error fetching product page data:", err);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getProductData(id);

  if (!data || !data.product) {
    return {
      title: "Product Not Found | AK Batteries & RO Solutions",
    };
  }

  const { product } = data;

  return {
    title: `${product.brandname} | AK Batteries & RO Solutions`,
    description: product.description
      ? `${product.brandname}: ${product.description.slice(0, 150)}...`
      : `Buy ${product.brandname} with doorstep delivery and warranty support across Kannamangalam and Vellore.`,
    alternates: {
      canonical: `https://ak-website-ashen.vercel.app/product/${encodeURIComponent(id)}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const data = await getProductData(id);

  if (!data || !data.product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ProductDetailClient
          product={data.product}
          relatedProducts={data.relatedProducts}
        />
      </main>
      <Footer />
    </div>
  );
}
