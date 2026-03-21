"use client";

import { ArrowLeft, Search, ShoppingCart } from "lucide-react";

export default function HeaderSection() {
  return (
    <div className="bg-[#eef1f7] px-4 pt-4 pb-5">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Back Button */}
        <div className="bg-[#dfe7f5] p-2 rounded-lg">
          <ArrowLeft size={18} className="text-gray-700" />
        </div>

        {/* Title */}
        <h1 className="text-base font-semibold text-gray-800">Milk</h1>

        {/* Cart Button */}
        <div className="bg-orange-500 p-2 rounded-lg">
          <ShoppingCart size={18} className="text-white" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-[#dfe7f5] rounded-lg px-3 py-2">
        <Search size={16} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search in Milk"
          className="bg-transparent w-full outline-none text-sm text-gray-700 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}
