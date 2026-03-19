"use client";

import Image from "next/image";

export default function BannerSection() {
  const offers = [
    { src: "/img/logo3.png" },
    { src: "/img/offer2.png" },
    { src: "/img/offer3.png" },
  ];

  return (
    <div className="px-4 space-y-4 mt-10">
      {/* 🔥 MAIN HERO (full width) */}
      <div className="w-full rounded-2xl overflow-hidden">
        <Image
          src="/img/logo3.png" // your main banner
          alt="Main Banner"
          width={800}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* 🎯 OFFERS SLIDER */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide mt-10">
        {offers.map((item, index) => (
          <div
            key={index}
            className="min-w-[75%] sm:min-w-[300px] rounded-2xl overflow-hidden"
          >
            <Image
              src={item.src}
              alt="Offer"
              width={300}
              height={200}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
