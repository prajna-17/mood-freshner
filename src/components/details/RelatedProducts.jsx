"use client";

import Image from "next/image";
import { Star, Plus, PackageSearch } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";

export default function RelatedProducts({ product }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!product?.category) return;

    const pincode = localStorage.getItem("pincode");
    if (!pincode) return;

    const categoryId =
      typeof product.category === "object"
        ? product.category._id
        : product.category;

    fetch(`${API}/products?category=${categoryId}&pincode=${pincode}`)
      .then((r) => r.json())
      .then((data) => {
        let prods = Array.isArray(data) ? data : data.data || [];

        prods = prods.filter((p) => p._id !== product._id);

        setItems(prods);
      })
      .catch(() => console.log("Related products fetch failed ❌"));
  }, [product]);
  return (
    <div className="px-4 mt-8 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-black">Related Products</h2>

        <Link href="/products" className="text-orange-500 text-sm font-medium">
          See All
        </Link>
      </div>

      {/* SLIDER */}
      {items.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {items.map((item) => {
            const randomTag = ["20% OFF", "BUY 2 GET 1", "35% OFF"][
              Math.floor(Math.random() * 3)
            ];

            return (
              <Link key={item._id} href={`/details/${item._id}`}>
                <div className="min-w-[160px] bg-white rounded-xl p-3 shadow-sm relative">
                  {/* ADD BUTTON */}
                  <div className="absolute top-2 right-2 bg-orange-100 p-1.5 rounded-md">
                    <Plus size={14} className="text-orange-600" />
                  </div>

                  {/* TAG */}
                  <span className="inline-block bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full mb-2">
                    {randomTag}
                  </span>

                  {/* IMAGE */}
                  <div className="w-full h-24 relative mb-2">
                    <Image
                      src={item.images?.[0] || "/img/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* NAME */}
                  <p className="text-sm font-medium text-black leading-tight">
                    {item.title}
                  </p>

                  {/* PRICE */}
                  {item.oldPrice && (
                    <p className="text-gray-400 line-through text-xs">
                      ₹{item.oldPrice}
                    </p>
                  )}

                  <p className="text-sm font-semibold text-black">
                    ₹{item.price}
                  </p>

                  {/* RATING */}
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#f97316" stroke="#f97316" />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <PackageSearch size={40} className="text-orange-200" />
          <p className="text-gray-600 font-medium text-sm">
            No related products found
          </p>
          <p className="text-gray-400 text-xs text-center">
            We couldn't find anything similar right now
          </p>
        </div>
      )}
    </div>
  );
}
