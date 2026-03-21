"use client";

import { ArrowLeft } from "lucide-react";

export default function CartHeader() {
  return (
    <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-100">
      <div className="flex items-center justify-between relative">
        {/* Back Button */}
        <div className="bg-[#dfe7f5] p-3 rounded-xl">
          <ArrowLeft size={20} className="text-[#2f6fb3]" />
        </div>

        {/* Title */}
        <h1 className="cart-title absolute left-1/2 -translate-x-1/2 text-3xl text-gray-800">
          My Cart
        </h1>

        {/* Empty right space (to balance center) */}
        <div className="w-[44px]" />
      </div>
    </div>
  );
}
