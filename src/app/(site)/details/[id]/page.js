"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API } from "@/utils/api";

import ProductTop from "@/components/details/ProductTop";
import ProductHightlights from "@/components/details/ProductHighlights";
import RelatedProducts from "@/components/details/RelatedProducts";
import DeliveryBanner from "@/components/details/DeliveryBanner";
import YouCanAlsoTry from "@/components/details/YouCanAlsoTry";
import ReviewsSlider from "@/components/details/ReviewsSlider";

export default function Page() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => console.log("Product fetch failed ❌"));
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <ProductTop product={product} />

      <ProductHightlights product={product} />

      <RelatedProducts product={product} />

      <DeliveryBanner />

      <YouCanAlsoTry product={product} />

      <ReviewsSlider product={product} />
    </div>
  );
}
