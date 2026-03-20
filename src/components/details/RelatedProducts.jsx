"use client";

import Image from "next/image";
import { Star, Plus } from "lucide-react";
import Link from "next/link";

export default function RelatedProducts() {
  const items = [
    {
      name: "Fresh Butter",
      img: "/img/butter.jpeg",
      tag: "35% OFF",
    },
    {
      name: "Fresh Cheese",
      img: "/img/cheese.jpeg",
      tag: "BUY 2 GET 1",
    },
    {
      name: "Fresh Curd",
      img: "/img/curd.jpeg",
      tag: "20% OFF",
    },
  ];

  return (
    <div className="px-4 mt-8 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-black">Related Products</h2>

        <Link href="/products" className="text-orange-500 text-sm font-medium">
          See All
        </Link>
      </div>

      {/* SLIDER */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="min-w-[160px] bg-white rounded-xl p-3 shadow-sm relative"
          >
            {/* ADD BUTTON */}
            <div className="absolute top-2 right-2 bg-orange-100 p-1.5 rounded-md">
              <Plus size={14} className="text-orange-600" />
            </div>

            {/* TAG */}
            <span className="inline-block bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full mb-2">
              {item.tag}
            </span>

            {/* IMAGE */}
            <div className="w-full h-24 relative mb-2">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>

            {/* NAME */}
            <p className="text-sm font-medium text-black leading-tight">
              {item.name}
            </p>

            {/* PRICE */}
            <p className="text-gray-400 line-through text-xs">₹120</p>

            <p className="text-sm font-semibold text-black">₹98 / gram</p>

            {/* RATING */}
            <div className="flex gap-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#f97316" stroke="#f97316" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
