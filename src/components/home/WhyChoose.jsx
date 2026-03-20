"use client";

import { Gem, Wheat, Truck } from "lucide-react";

export default function WhyChoose() {
  return (
    <div className="px-4 mt-10 text-center space-y-6">
      {/* Title */}
      <h2
        className="text-2xl font-md text-gray-900"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Why Choose Mood Fresh?
      </h2>

      {/* Items */}
      <div className="grid grid-cols-3 gap-4">
        {/* Item 1 */}
        <div className="flex flex-col items-center space-y-2">
          <Gem className="w-8 h-8 text-orange-500" />
          <p className="text-blue-700 font-medium text-sm text-center">
            100% <br /> Pure
          </p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center space-y-2">
          <Wheat className="w-8 h-8 text-orange-500" />
          <p className="text-blue-700 font-medium text-sm text-center">
            Farm <br /> Fresh
          </p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center space-y-2">
          <Truck className="w-8 h-8 text-orange-500" />
          <p className="text-blue-700 font-medium text-sm text-center">
            Fast <br /> Delivery
          </p>
        </div>
      </div>
    </div>
  );
}
