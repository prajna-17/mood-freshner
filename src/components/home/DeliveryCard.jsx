"use client";

import { MapPin } from "lucide-react";

export default function DeliveryCard() {
  return (
    <div className="px-4 mt-10">
      <div className="bg-gradient-to-r from-[#2b6cb0] to-[#1e3a8a] rounded-2xl p-4 flex items-center justify-between shadow-md">
        {/* LEFT */}
        <div className="flex items-start gap-2">
          <MapPin className="text-blue-200 w-5 h-5 mt-1" />

          <div>
            <p className="text-blue-200 text-sm">Delivering to</p>

            <p className="text-white font-medium text-base mt-1">
              A 503, Sector 6, Noida
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <button className="text-orange-400 font-medium underline text-sm">
          Change
        </button>
      </div>
    </div>
  );
}
