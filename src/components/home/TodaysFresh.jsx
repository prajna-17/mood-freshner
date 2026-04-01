"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";

export default function TodaysFresh() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const pincode = localStorage.getItem("pincode");
    if (!pincode) return;

    fetch(`${API}/products?pincode=${pincode}`)
      .then((r) => r.json())
      .then((data) => {
        const prods = Array.isArray(data) ? data : data.data || [];
        setItems(prods);
      })
      .catch(() => console.log("Today's fresh fetch failed ❌"));
  }, []);

  return (
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Today’s Fresh
        </h2>

        <Link href="/products" className="text-orange-500 underline text-sm">
          See All
        </Link>
      </div>

      {/* Slider */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.map((item) => {
          const randomTag = ["20% OFF", "BUY 2 GET 1", "35% OFF"][
            Math.floor(Math.random() * 3)
          ];

          return (
            <Link key={item._id} href={`/details/${item._id}`}>
              <div className="min-w-[160px] sm:min-w-[300px] border rounded-2xl p-2 bg-white cursor-pointer">
                {/* Tag */}
                <span className="inline-block bg-orange-200 text-orange-700 text-xs px-3 py-1 rounded-full mb-2">
                  {randomTag}
                </span>

                {/* Content */}
                <div className="flex items-center gap-3">
                  {/* Image */}
                  <div className="w-12 h-12 relative">
                    <Image
                      src={item.images?.[0] || "/img/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p className="text-blue-500 font-md">{item.title}</p>

                    {item.oldPrice && (
                      <p className="text-gray-400 line-through text-sm">
                        ₹{item.oldPrice}
                      </p>
                    )}

                    <p className="text-lg font-semibold text-gray-900">
                      ₹{item.price}
                    </p>

                    {/* Rating (random) */}
                    <div className="flex text-orange-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-orange-400" />
                      ))}
                    </div>
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
