"use client";

import { useEffect, useState } from "react";
import { BadgePercent } from "lucide-react";
import { getCart } from "@/utils/cart";

export default function OrderSummary() {
  const [summary, setSummary] = useState({
    subtotal: 0,
    discount: 0,
    gst: 0,
    total: 0,
    savings: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const cart = getCart();

      let subtotal = 0;
      let discount = 0;

      cart.forEach((item) => {
        subtotal += item.price * item.qty;

        if (item.oldPrice) {
          discount += (item.oldPrice - item.price) * item.qty;
        }
      });

      const gst = Math.round(subtotal * 0.05); // 5% GST
      const total = subtotal + gst;
      const savings = discount;

      setSummary({
        subtotal,
        discount,
        gst,
        total,
        savings,
      });
    };

    calculate();

    window.addEventListener("cart-updated", calculate);

    return () => {
      window.removeEventListener("cart-updated", calculate);
    };
  }, []);

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
          <span>₹ {summary.subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Product Discount</span>
          <span className="text-green-500">- ₹ {summary.discount}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Delivery Charge</span>
          <span>FREE</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>GST (5%)</span>
          <span>₹ {summary.gst}</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#2f6fb3] mt-5 mb-4"></div>

      {/* TOTAL */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium text-gray-900">Total Amount</span>
        <span className="text-xl font-semibold text-gray-900">
          ₹ {summary.total}
        </span>
      </div>

      {/* SAVINGS BOX */}
      <div className="mt-5 bg-[#dfe7f5] rounded-xl px-4 py-3 flex items-center gap-2 text-[#2f6fb3] text-sm font-medium">
        <BadgePercent size={18} />
        <span>Yay! You save ₹ {summary.savings}</span>
      </div>
    </div>
  );
}
