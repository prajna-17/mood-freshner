"use client";

import { useState } from "react";
import HeaderSection from "@/components/products/HeaderSection";
import CategoryTabs from "@/components/products/CategoryTabs";
import ResultsBar from "@/components/products/ResultsBar";
import DealBanner from "@/components/products/DealBanner";
import ProductsGrid from "@/components/products/ProductsGrid";
import YouMayLike from "@/components/products/YouMayLike";
import { Suspense } from "react";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  return (
    <div className="bg-white min-h-screen">
      <HeaderSection />

      <CategoryTabs />

      {/* ✅ PASS COUNT */}
      <ResultsBar count={products.length} />

      <DealBanner />

      {/* ✅ PASS SETTER */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsGrid setProducts={setProducts} />
      </Suspense>
      <YouMayLike />
    </div>
  );
}
