"use client";

import { BadgePercent, Scissors } from "lucide-react";

export default function CouponCard() {
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
          <button className="border border-[#2f6fb3] text-[#2f6fb3] px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
            APPLY COUPON
          </button>
        </div>
      </div>
    </div>
  );
}
