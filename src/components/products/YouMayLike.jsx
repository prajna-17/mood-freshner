"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

export default function YouMayLike() {
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
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          You May Also Like{" "}
        </h2>

        <Link href="/products" className="text-orange-500 underline text-sm">
          See All
        </Link>
      </div>

      {/* Slider */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {items.map((item, index) => (
          <div
            key={index}
            className="min-w-[160px] sm:min-w-[300px] border rounded-2xl p-2 bg-white"
          >
            {/* Tag */}
            <span className="inline-block bg-orange-200 text-orange-700 text-xs px-3 py-1 rounded-full mb-2">
              {item.tag}
            </span>

            {/* Content */}
            <div className="flex items-center gap-3">
              {/* Image */}
              <div className="w-6 h-12 relative">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-blue-500 font-md">{item.name}</p>

                <p className="text-gray-400 line-through text-sm">₹98/gram</p>

                <p className="text-lg font-semibold text-gray-900">
                  ₹98 / gram
                </p>

                {/* Rating */}
                <div className="flex text-orange-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
