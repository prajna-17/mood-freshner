"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Star } from "lucide-react";

export default function ProductTop() {
  const [qty, setQty] = useState(1);

  const increase = () => setQty((q) => q + 1);
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button className="text-lg">←</button>
        <h1 className="font-medium text-black">Cream Milk</h1>
        <button className="text-orange-500 text-lg font-bold">×</button>
      </div>

      {/* BLUE SECTION */}
      <div className="bg-[#2f6fad] relative px-4 py-6">
        <span className="absolute top-3 left-3 bg-yellow-400 text-xs px-2 py-1 rounded">
          Best Seller
        </span>

        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-white p-2 rounded-full">
            <Heart size={16} />
          </div>
          <div className="bg-white p-2 rounded-full">
            <Share2 size={16} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Image
            src="/img/3milk.jpeg"
            alt="milk"
            width={170}
            height={170}
            priority
          />
        </div>
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4">
        {/* TITLE */}
        <h2 className="font-medium text-[18px] text-black leading-tight">
          Premium <br /> Full Cream Milk
        </h2>

        {/* STARS */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#facc15" stroke="#facc15" />
          ))}
          <span className="text-sm text-gray-500 ml-2">4.8 (2.3k reviews)</span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-3">
          <p className="text-[18px] font-semibold text-black">₹68</p>

          <p className="text-gray-400 line-through text-sm">₹85</p>

          <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">
            20% OFF
          </span>
        </div>

        {/* VOLUME */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">VOLUME</p>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 border rounded bg-blue-100 text-blue-600 text-sm">
              500 ml
            </button>
            <button className="px-3 py-1 border rounded text-sm">
              1 Litre
            </button>
            <button className="px-3 py-1 border rounded text-sm">
              2 Litres
            </button>
            <button className="px-3 py-1 border rounded text-sm">+ More</button>
          </div>
        </div>

        {/* QUANTITY + STOCK */}
        <div className="flex items-center justify-between mt-4">
          {/* Quantity */}
          <div className="flex items-center gap-3 border rounded px-2 py-1">
            <button onClick={decrease} className="text-lg px-2">
              -
            </button>
            <span className="font-medium text-black">{qty}</span>
            <button onClick={increase} className="text-lg px-2">
              +
            </button>
          </div>

          {/* Stock */}
          <span className="text-green-600 text-sm font-medium">In Stock</span>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-5">
          <button className="flex-1 border border-orange-500 text-orange-500 py-2 rounded font-medium">
            Buy Now
          </button>
          <button className="flex-1 bg-orange-500 text-white py-2 rounded font-medium">
            Add to Cart
          </button>
        </div>
        {/* NUTRITION */}
        <div className="mt-6">
          {/* Heading OUTSIDE */}
          <p className="text-xs text-gray-500 mb-2">NUTRITION (PER 100ML)</p>

          {/* Card */}
          <div className="bg-gray-200 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-4 text-center gap-2">
              <div>
                <p className="font-semibold text-black">61</p>
                <p className="text-xs text-gray-600">Calories</p>
              </div>

              <div>
                <p className="font-semibold text-black">3.2g</p>
                <p className="text-xs text-gray-600">Protein</p>
              </div>

              <div>
                <p className="font-semibold text-black">3.5g</p>
                <p className="text-xs text-gray-600">Fat</p>
              </div>

              <div>
                <p className="font-semibold text-black">4.7g</p>
                <p className="text-xs text-gray-600">Carbs</p>
              </div>
            </div>
          </div>
        </div>
        {/* ABOUT */}
        <div className="mt-6">
          <p className="text-xs text-gray-900 b-1">ABOUT</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget
            sodales lorem. Vivamus molestie diam quis lorem ipsum.
          </p>
          <button className="text-orange-500 text-sm mt-1 font-medium">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}
