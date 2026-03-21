"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";

export default function ProductCard({ item }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* IMAGE SECTION */}
      <div className="bg-[#dfe7f5] p-4 relative">
        {/* Tag */}
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          {item.tag}
        </span>

        {/* Heart */}
        <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm">
          <Heart size={14} />
        </div>

        {/* Image */}
        <div className="flex justify-center items-center h-[110px]">
          <Image
            src={item.img}
            alt={item.name}
            width={90}
            height={110}
            className="object-contain"
          />
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">
          {item.name}
        </h3>

        <p className="text-xs text-gray-400 mb-1">1 Litre / 3.5% fat</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className="fill-orange-400 text-orange-400"
            />
          ))}
          <span className="text-xs text-[#2f6fb3] ml-1">(428)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-gray-800">
              ₹ 68{" "}
              <span className="text-xs text-gray-400 line-through ml-1">
                ₹ 98
              </span>
            </p>
            <p className="text-green-500 text-xs">20% off</p>
          </div>
          {/* Add Button */}
          <button className="bg-orange-500 text-white w-8 h-8 flex items-center justify-center rounded-lg">
            +
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
