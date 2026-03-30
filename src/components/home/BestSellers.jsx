"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";

export default function BestSellers() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API}/products?productSellingCategory=best-selling`)
      .then((r) => r.json())
      .then((data) => {
        const prods = Array.isArray(data) ? data : data.data || [];
        setProducts(prods.slice(0, 4)); // show only 4 like before
      })
      .catch(() => console.log("Best sellers fetch failed ❌"));
  }, []);

  return (
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Best Sellers
        </h2>

        <Link href="/products" className="text-orange-500 underline text-sm">
          See All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((item) => {
          const randomRating = (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
          const randomCount = Math.floor(Math.random() * 500);

          return (
            <Link key={item._id} href={`/details/${item._id}`}>
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer">
                {/* Image */}
                <div className="relative">
                  <Image
                    src={item.images?.[0] || "/img/placeholder.jpg"}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-[140px] object-cover"
                  />

                  {/* Fresh badge */}
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                    {item.productSellingCategory || "Fresh"}
                  </span>

                  {/* Cart icon */}
                  <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                    <ShoppingCart className="w-4 h-4 text-gray-700" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {item.quantity || 1} unit
                  </p>

                  {/* Rating (random) */}
                  <div className="flex items-center gap-1 text-orange-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-orange-400" />
                    ))}
                    <span className="text-gray-500 ml-1">({randomCount})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {item.oldPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{item.oldPrice}
                        </p>
                      )}
                      <p className="text-base font-semibold text-gray-900">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="border rounded-lg px-2 py-1 text-lg text-orange-500"
                    >
                      {" "}
                      +
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
