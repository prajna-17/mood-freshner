"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";

export default function TodaysFresh() {
  const [items, setItems] = useState([]);

  const fetchProducts = () => {
    const pincode = localStorage.getItem("pincode");

    // 🔥 No pincode → show all products
    const url = pincode
      ? `${API}/products?pincode=${pincode}`
      : `${API}/products`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const prods = Array.isArray(data) ? data : data.data || [];
        setItems(prods);
      })
      .catch(() => console.log("Today's fresh fetch failed ❌"));
  };

  useEffect(() => {
    fetchProducts();

    // 🔥 Re-fetch when pincode is set/changed
    window.addEventListener("pincodeUpdated", fetchProducts);
    return () => window.removeEventListener("pincodeUpdated", fetchProducts);
  }, []);

  const TAGS = ["20% OFF", "BUY 2 GET 1", "35% OFF"];

  return (
    <div className="px-4 mt-10 space-y-4">
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Today's Fresh
        </h2>
        <Link href="/products" className="text-orange-500 underline text-sm">
          See All
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.map((item, idx) => (
          <Link key={item._id} href={`/details/${item._id}`}>
            <div className="min-w-[160px] sm:min-w-[300px] border rounded-2xl p-2 bg-white cursor-pointer">
              <span className="inline-block bg-orange-200 text-orange-700 text-xs px-3 py-1 rounded-full mb-2">
                {TAGS[idx % TAGS.length]}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative">
                  <Image
                    src={item.images?.[0] || "/img/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-blue-500 font-md truncate max-w-[120px]">
                    {item.title}
                  </p>{" "}
                  {item.oldPrice && (
                    <p className="text-gray-400 line-through text-sm">
                      ₹{item.oldPrice}
                    </p>
                  )}
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{item.price}
                  </p>
                  <div className="flex text-orange-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
