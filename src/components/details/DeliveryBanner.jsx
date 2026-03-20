"use client";

import { Truck } from "lucide-react";

export default function DeliveryBanner() {
  return (
    <div className="px-4 mt-7">
      <div className="bg-[#2b6cb0] rounded-xl p-8 flex items-center justify-between shadow-sm">
        {/* TEXT */}
        <div>
          <p className="text-white font-semibold text-sm">
            Free Express Delivery
          </p>

          <p className="text-blue-100 text-xs mt-1">
            Order before{" "}
            <span className="text-yellow-300 font-medium">2:00 PM</span> for
            same-day delivery
          </p>
        </div>

        {/* ICON */}
        <div className="bg-yellow-400 p-2 rounded-lg">
          <Truck size={20} className="text-blue-900" />
        </div>
      </div>
    </div>
  );
}
