"use client";

import Image from "next/image";
import { Trash2, Star, Truck } from "lucide-react";
import { updateQty, removeFromCart } from "@/utils/cart";
export default function CartItemCard({ item }) {
  const isAvailable = item.qty <= item.availableQty;
  return (
    <div className="bg-white rounded-2xl border border-[#e3e8f2] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] mb-4">
      {/* TOP CONTENT */}
      <div className="p-4 flex gap-4 relative">
        {/* IMAGE */}
        <div className="bg-[#dfe7f5] rounded-xl p-3 w-[90px] h-[90px] flex items-center justify-center relative">
          {/* Tag */}
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
            Fresh
          </span>

          <Image
            src={item.image}
            alt="milk"
            width={60}
            height={70}
            className="object-contain"
          />
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          {/* Title + Delete */}
          <div className="flex justify-between">
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">
              {item.title}{" "}
            </h3>
            <Trash2
              size={18}
              className="text-gray-400 cursor-pointer"
              onClick={() => removeFromCart(item.variantId)}
            />{" "}
          </div>

          <span className="text-gray-800 font-medium">{item.qty}</span>
          {/* Stars */}
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className="fill-orange-400 text-orange-400"
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-400">
              MRP <span className="line-through ml-1">₹ {item.oldPrice}</span>
            </p>

            <p className="text-lg font-semibold text-gray-800">
              ₹ {item.price}
            </p>

            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
              20% off
            </span>
          </div>
        </div>
      </div>

      {/* QUANTITY */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-[#cfd8ea] rounded-lg px-3 py-1 gap-6 text-lg">
            <button
              onClick={() =>
                item.qty > 1
                  ? updateQty(item.variantId, item.qty - 1)
                  : removeFromCart(item.variantId)
              }
            >
              −
            </button>

            <span className="text-gray-800 font-medium">{item.qty}</span>

            <button onClick={() => updateQty(item.variantId, item.qty + 1)}>
              +
            </button>
          </div>

          {/* 🔥 STOCK STATUS */}
          <span
            className={`text-xs font-medium ${
              isAvailable ? "text-green-600" : "text-red-500"
            }`}
          >
            {isAvailable
              ? `In Stock (${item.availableQty} available)`
              : `Only ${item.availableQty} available`}
          </span>
        </div>
      </div>

      {/* DELIVERY */}
      <div className="border-t border-[#e3e8f2] px-4 py-3 flex items-center gap-2 text-[#2f6fb3] text-sm">
        <Truck size={18} />
        <span>Delivers Today by 7–9 PM</span>
      </div>
    </div>
  );
}
