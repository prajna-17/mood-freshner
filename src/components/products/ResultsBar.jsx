"use client";

import { SlidersHorizontal } from "lucide-react";

export default function ResultsBar({ count = 0 }) {
  return (
    <div className="flex items-center justify-between px-4 mt-5">
      {/* Text */}
      <p className="text-sm text-gray-400">
        Showing <span className="text-[#2f6fb3] font-semibold">{count}</span>{" "}
        result
        {count !== 1 && "s"}
      </p>

      {/* Filter Button */}
      <div className="bg-[#dfe7f5] p-3 rounded-xl cursor-pointer">
        <SlidersHorizontal size={18} className="text-[#2f6fb3]" />
      </div>
    </div>
  );
}
