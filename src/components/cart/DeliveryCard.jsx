"use client";

import { MapPin } from "lucide-react";

export default function DeliveryCard() {
  return (
    <div className="px-4 mt-10">
      <div className="border-2 border-dashed border-[#bcd0ea] rounded-2xl p-4 flex items-center justify-between bg-white">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <MapPin className="text-red-500" size={20} />

          <p className="text-sm text-gray-800">Delivery at Delhi – 444111</p>
        </div>

        {/* BUTTON */}
        <button className="border border-[#2f6fb3] text-[#2f6fb3] px-4 py-2 rounded-lg text-sm font-medium">
          CHANGE
        </button>
      </div>
    </div>
  );
}
