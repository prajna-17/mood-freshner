"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
export default function ProductTop({ product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showFull, setShowFull] = useState(false);
  const increase = () => {
    if (qty < product.quantity) {
      setQty((q) => q + 1);
    }
  };
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  if (!product) return null;
  const BEVERAGE_ID = "69ca70a80971faee317396f7";

  const isBeverage =
    typeof product.superCategory === "object"
      ? product.superCategory._id === BEVERAGE_ID
      : product.superCategory === BEVERAGE_ID;
  return (
    <div className="bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => router.back()} className="text-lg">
          ←
        </button>{" "}
      </div>

      {/* IMAGE SECTION */}
      <div className="relative w-full h-64 overflow-hidden bg-[#2f6fad]">
        <Image
          src={product.images?.[0] || "/img/placeholder.jpg"}
          alt={product.title}
          fill
          priority
          className="object-cover"
        />

        <span className="absolute top-3 left-3 bg-yellow-400 text-xs px-2 py-1 rounded z-10">
          {product.productSellingCategory || "Best Seller"}
        </span>

        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <div className="bg-white p-2 rounded-full">
            <Heart size={16} />
          </div>
          <div className="bg-white p-2 rounded-full">
            <Share2 size={16} />
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4">
        {/* TITLE */}
        <h2 className="font-medium text-[18px] text-black leading-tight">
          {product.title}
        </h2>

        {/* STARS */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#facc15" stroke="#facc15" />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews?.length || 256} reviews)
          </span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-3">
          <p className="text-[18px] font-semibold text-black">
            ₹{product.price}
          </p>

          {product.oldPrice && (
            <p className="text-gray-400 line-through text-sm">
              ₹{product.oldPrice}
            </p>
          )}

          {product.oldPrice && (
            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
              )}
              % OFF
            </span>
          )}
        </div>

        {/* VOLUME (STATIC UI KEEP) */}
        {isBeverage && (
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
              <button className="px-3 py-1 border rounded text-sm">
                + More
              </button>
            </div>
          </div>
        )}

        {/* QUANTITY + STOCK */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 border rounded px-2 py-1">
            <button onClick={decrease} className="text-lg px-2">
              -
            </button>
            <span className="font-medium text-black">{qty}</span>
            <button
              onClick={increase}
              disabled={qty >= product.quantity}
              className="text-lg px-2 disabled:opacity-30"
            >
              {" "}
              +
            </button>
          </div>

          <span
            className={`text-sm font-medium ${
              qty <= product.quantity ? "text-green-600" : "text-red-500"
            }`}
          >
            {qty <= product.quantity
              ? `In Stock (${product.quantity} available)`
              : "Only limited stock available"}
          </span>
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

        {/* NUTRITION (kept static UI) */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-2">NUTRITION (PER 100ML)</p>

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
          <p
            className={`text-sm text-gray-700 leading-relaxed ${
              showFull ? "" : "line-clamp-5"
            }`}
          >
            {product.description}
          </p>
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-orange-500 text-sm mt-1 font-medium"
          >
            {showFull ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
    </div>
  );
}
