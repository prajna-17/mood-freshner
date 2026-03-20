"use client";

import Image from "next/image";

export default function PromoBanner() {
  return (
    <div className="px-4 mt-10">
      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden">
        {/* Background Image */}
        <Image
          src="/img/blueproducts.jpeg" // your image (blue bg + products)
          alt="Promo"
          fill
          className="object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 -mt-20">
          <h3 className="text-white text-lg font-semibold leading-tight">
            20% Off on all Dairy Products
          </h3>

          <p className="text-white/80 text-sm mt-1">Use code : DAIRY20</p>

          <p className="text-white/80 text-sm">Today Only</p>
        </div>
      </div>
    </div>
  );
}
