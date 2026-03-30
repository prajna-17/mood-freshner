"use client";

import Image from "next/image";
import Link from "next/link";

export default function BannerSection() {
  return (
    <div className="w-full p-1 flex flex-col gap-4 mt-10">
      {/* TOP BANNER */}
      <Link href="/products">
        <div className="w-full overflow-hidden cursor-pointer">
          <Image
            src="/img/b4.png"
            alt="banner"
            width={600}
            height={250}
            className="w-full h-auto"
          />
        </div>
      </Link>

      {/* OFFERS SLIDER */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar px-3">
        {["/img/b1.png", "/img/b3.png", "/img/b2.png"].map((img, i) => (
          <Link key={i} href="/products">
            <div className="min-w-[80px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer">
              <Image
                src={img}
                alt="offer"
                width={100}
                height={120}
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
