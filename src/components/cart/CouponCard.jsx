"use client";

import { BadgePercent, Scissors } from "lucide-react";
import { getCart } from "@/utils/cart";
import { useState, useEffect } from "react";
export default function CouponCard() {
  const [applied, setApplied] = useState(false);
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    const cart = getCart();
    setHasItems(cart.length > 0);
  }, []);
  return (
    <div className="px-4 mt-10">
      <div className="relative bg-[#fff7ed] rounded-2xl p-4 border-2 border-dashed border-orange-300">
        {/* TOP CONTENT */}
        <div className="flex gap-3">
          {/* ICON */}
          <div className="bg-orange-100 p-2 rounded-full">
            <BadgePercent className="text-orange-500" size={20} />
          </div>

          {/* TEXT */}
          <p className="text-sm text-gray-700 leading-snug max-w-[220px]">
            Get 10% on first order. Apply code on checkout
          </p>
        </div>

        {/* BOTTOM ROW */}
        <div className="flex items-center justify-between mt-5">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <Scissors size={16} className="text-gray-400" />
            <div className="bg-[#dfe7f5] px-4 py-2 rounded-lg text-sm font-medium text-gray-700">
              ABD15
            </div>
          </div>

          {/* RIGHT BUTTON */}
          <button
            onClick={() => {
              if (!hasItems) return;

              localStorage.setItem(
                "coupon",
                JSON.stringify({
                  code: "ABD15",
                  discount: 10,
                }),
              );

              setApplied(true);

              // 🔥 notify other components
              window.dispatchEvent(new Event("coupon-applied"));
            }}
            disabled={!hasItems || applied}
            className={`px-4 py-2 rounded-lg text-sm font-medium
    ${
      !hasItems
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : applied
          ? "bg-green-100 text-green-600"
          : "border border-[#2f6fb3] text-[#2f6fb3]"
    }`}
          >
            {!hasItems ? "No Items" : applied ? "Applied ✓" : "APPLY COUPON"}
          </button>
        </div>
      </div>
    </div>
  );
}
