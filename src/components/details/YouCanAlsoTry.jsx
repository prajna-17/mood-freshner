"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";
import Link from "next/link";
export default function YouCanAlsoTry({ product }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!product) return;

    fetch(`${API}/products`)
      .then((r) => r.json())
      .then((data) => {
        let prods = Array.isArray(data) ? data : data.data || [];

        // ❌ remove current product
        prods = prods.filter((p) => p._id !== product._id);

        // 👉 shuffle (optional)
        prods = prods.sort(() => 0.5 - Math.random());

        setItems(prods.slice(0, 6));
      })
      .catch(() => console.log("YouCanAlsoTry fetch failed ❌"));
  }, [product]);

  return (
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          You Can Also Try
        </h2>

        <button className="text-orange-500 underline text-sm">Clear All</button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <Link key={item._id} href={`/details/${item._id}`}>
            <div className="border border-blue-200 rounded-2xl p-3 flex flex-col items-center text-center bg-white cursor-pointer">
              {/* Image */}
              <div className="w-12 h-12 relative mb-2">
                <Image
                  src={item.images?.[0] || "/img/placeholder.jpg"}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Name */}
              <p className="text-blue-700 font-medium text-sm">{item.title}</p>

              {/* Old Price */}
              {item.oldPrice && (
                <p className="text-gray-400 text-xs line-through">
                  ₹{item.oldPrice}
                </p>
              )}

              {/* New Price */}
              <p className="text-gray-900 text-sm font-medium">₹{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
