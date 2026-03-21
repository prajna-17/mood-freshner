"use client";

import { BadgePercent } from "lucide-react";

export default function OrderSummary() {
  return (
    <div className="px-5 mt-10">
      {/* TITLE */}
      <h2
        className="text-2xl font-md text-gray-900"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Order Summary
      </h2>

      {/* DETAILS */}
      <div className="space-y-3 text-sm mt-5">
        <div className="flex justify-between text-gray-700">
          <span>Sub Total</span>
          <span>₹ 200</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Product Discount</span>
          <span className="text-green-500">- ₹ 40</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Delivery Charge</span>
          <span>FREE</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Coupon Applied</span>
          <span className="text-green-500">₹ 40</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>GST</span>
          <span>₹ 20</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#2f6fb3] mt-5 mb-4"></div>

      {/* TOTAL */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium text-gray-900">Total Amount</span>
        <span className="text-xl font-semibold text-gray-900">₹ 180</span>
      </div>

      {/* SAVINGS BOX */}
      <div className="mt-5 bg-[#dfe7f5] rounded-xl px-4 py-3 flex items-center gap-2 text-[#2f6fb3] text-sm font-medium">
        <BadgePercent size={18} />
        <span>Yay! You save Rs. 50</span>
      </div>
    </div>
  );
}
