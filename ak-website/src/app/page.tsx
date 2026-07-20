import * as React from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FAQ } from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
      </main>

      <Footer />
    </div>
  );
}

