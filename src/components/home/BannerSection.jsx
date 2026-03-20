"use client";

import Image from "next/image";

export default function BannerSection() {
  return (
    <div className="w-full p-1 flex flex-col gap-4 mt-10">
      {/* TOP BANNER */}
      <div className="w-full overflow-hidden">
        <Image
          src="/img/b4.png"
          alt="banner"
          width={600}
          height={250}
          className="w-full h-auto"
        />
      </div>

      {/* OFFERS SLIDER */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-3">
        {["/img/b1.png", "/img/b3.png", "/img/b2.png"].map((img, i) => (
          <div
            key={i}
            className="min-w-[80px] flex-shrink-0 rounded-2xl overflow-hidden"
          >
            <Image
              src={img}
              alt="offer"
              width={100}
              height={120}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
