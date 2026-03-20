"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

export default function BestSellers() {
  const products = [
    { img: "/img/3milk.jpeg", name: "Full Cream Milk" },
    { img: "/img/panner.jpeg", name: "Full Cream Milk" },
    { img: "/img/berriescurd.jpeg", name: "Full Cream Milk" },
    { img: "/img/yogurt.jpeg", name: "Full Cream Milk" },
  ];

  return (
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Best Sellers
        </h2>

        <Link href="/products" className="text-orange-500 underline text-sm">
          See All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border overflow-hidden"
          >
            {/* Image */}
            <div className="relative">
              <Image
                src={item.img}
                alt={item.name}
                width={300}
                height={200}
                className="w-full h-[140px] object-cover"
              />

              {/* Fresh badge */}
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                Fresh
              </span>

              {/* Cart icon (top right) */}
              <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                <ShoppingCart className="w-4 h-4 text-gray-700" />
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-1">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>

              <p className="text-xs text-gray-500">1 Litre</p>

              {/* Rating */}
              <div className="flex items-center gap-1 text-orange-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-orange-400" />
                ))}
                <span className="text-gray-500 ml-1">(428)</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="text-xs text-gray-400 line-through">₹98</p>
                  <p className="text-base font-semibold text-gray-900">₹68</p>
                </div>

                {/* Add button */}
                <button className="border rounded-lg px-2 py-1 text-lg text-orange-500">
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
