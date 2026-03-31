"use client";

import Image from "next/image";
import { Heart, Star, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/utils/cart";
import LoginModal from "@/components/LoginModal";
export default function ProductCard({ item }) {
  const [openLogin, setOpenLogin] = useState(false);
  const [added, setAdded] = useState(false);

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };
  return (
    <Link href={`/details/${item._id}`}>
      <div className="bg-white rounded-3xl gap-3 shadow-md overflow-hidden border border-gray-100 w-full cursor-pointer">
        {" "}
        {/* IMAGE SECTION */}
        <div className="relative h-[140px] w-full overflow-hidden">
          {/* Tag */}
          <span className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
            {item.productSellingCategory || "best-selling"}
          </span>

          {/* Heart */}
          {/* <button className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform">
            <Heart size={13} className="text-gray-400" />
          </button> */}

          {/* Image */}
          <Image
            src={item.images?.[0] || "/img/placeholder.jpg"}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
        {/* DETAILS */}
        <div className="p-3 pt-3">
          <h3 className="text-sm font-bold text-gray-800 leading-tight mb-0.5">
            {item.title}
          </h3>

          <p className="text-[11px] text-gray-400 mb-2">
            {item.quantity || 1} unit
          </p>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-2.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className="fill-amber-400 text-amber-400"
              />
            ))}
            <span className="text-[10px] text-blue-500 ml-1 font-medium">
              ({item.reviews?.length || 246})
            </span>
          </div>

          {/* Price + Button */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900">
                  ₹{item.price}
                </span>
                {item.oldPrice && (
                  <span className="text-[11px] text-gray-400 line-through">
                    ₹{item.oldPrice}
                  </span>
                )}
              </div>
              {item.oldPrice && (
                <span className="text-[11px] font-semibold text-emerald-500">
                  {Math.round(
                    ((item.oldPrice - item.price) / item.oldPrice) * 100,
                  )}
                  % off
                </span>
              )}
            </div>

            {/* Add Button */}
            <button
              onClick={(e) => {
                e.preventDefault(); // 🔥 stop navigation

                if (!isLoggedIn()) {
                  setOpenLogin(true);
                  return;
                }

                addToCart({
                  ...item,
                  id: item._id,
                  availableQty: item.quantity, // 🔥 for stock check
                });

                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white w-9 h-9 flex items-center justify-center rounded-xl shadow-md shadow-orange-200"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
        {added && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full text-sm z-[2000]">
            Added to cart
          </div>
        )}
      </div>
    </Link>
  );
}
