"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Flame,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";

const products = [
  {
    id: 1,
    img: "/img/3milk.jpeg",
    name: "Full Cream Milk",
    unit: "1 Litre",
    price: 68,
    mrp: 98,
    rating: 4.8,
    reviews: 428,
    badge: "Bestseller",
    badgeColor: "#f97316",
  },
  {
    id: 2,
    img: "/img/panner.jpeg",
    name: "Fresh Paneer",
    unit: "200g",
    price: 85,
    mrp: 110,
    rating: 4.6,
    reviews: 312,
    badge: "Fresh",
    badgeColor: "#22c55e",
  },
  {
    id: 3,
    img: "/img/berriescurd.jpeg",
    name: "Berries Curd",
    unit: "400g",
    price: 55,
    mrp: 75,
    rating: 4.9,
    reviews: 196,
    badge: "New",
    badgeColor: "#8b5cf6",
  },
  {
    id: 4,
    img: "/img/yogurt.jpeg",
    name: "Greek Yogurt",
    unit: "500g",
    price: 120,
    mrp: 150,
    rating: 4.7,
    reviews: 543,
    badge: "Popular",
    badgeColor: "#3b82f6",
  },
];

function ProductCard({ item, index }) {
  const [qty, setQty] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [addAnim, setAddAnim] = useState(false);
  const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);

  function handleAdd() {
    setQty(1);
    setAddAnim(true);
    setTimeout(() => setAddAnim(false), 400);
  }

  return (
    <div
      className={`bs-item bs-item-${index} relative bg-white rounded-3xl overflow-hidden flex flex-col`}
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1.5px solid #f1f5f9",
      }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ height: 148 }}>
        <Image
          src={item.img}
          alt={item.name}
          fill
          className="object-cover"
          style={{ transition: "transform 0.4s cubic-bezier(.22,1,.36,1)" }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 55%)",
          }}
        />

        {/* Badge */}
        <div
          className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full px-2.5 py-1"
          style={{
            background: item.badgeColor,
            boxShadow: `0 2px 8px ${item.badgeColor}55`,
          }}
        >
          <Flame className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
          <span className="text-[10px] font-bold text-white tracking-wide">
            {item.badge}
          </span>
        </div>

        {/* Discount chip */}
        <div
          className="absolute top-2.5 right-2.5 rounded-xl px-2 py-0.5"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span className="text-[10px] font-bold text-emerald-300">
            {discount}% OFF
          </span>
        </div>

        {/* Wishlist */}
        <button
          className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
          style={{
            background: wishlist ? "#ef4444" : "rgba(255,255,255,0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "background 0.2s, transform 0.15s",
            transform: wishlist ? "scale(1.15)" : "scale(1)",
          }}
          onClick={() => setWishlist((v) => !v)}
        >
          <Star
            style={{
              width: 13,
              height: 13,
              color: wishlist ? "#fff" : "#94a3b8",
            }}
            fill={wishlist ? "#fff" : "none"}
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Name */}
        <p
          className="text-[13.5px] font-bold text-gray-900 leading-tight"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {item.name}
        </p>

        {/* Unit + verified */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-gray-400 font-medium">
            {item.unit}
          </span>
          <BadgeCheck className="w-3 h-3 text-blue-400" strokeWidth={2.5} />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              style={{
                width: 11,
                height: 11,
                color: s <= Math.round(item.rating) ? "#f97316" : "#e2e8f0",
                fill: s <= Math.round(item.rating) ? "#f97316" : "#e2e8f0",
              }}
              strokeWidth={0}
            />
          ))}
          <span className="text-[10.5px] text-gray-400 ml-1">
            {item.rating} ({item.reviews})
          </span>
        </div>

        {/* Price + Add/Qty */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <p className="text-[11px] text-gray-300 line-through leading-none">
              ₹{item.mrp}
            </p>
            <p
              className="text-[17px] font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              ₹{item.price}
            </p>
          </div>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 ${addAnim ? "bs-pop" : ""}`}
              style={{
                background: "linear-gradient(135deg,#3b82f6,#0ea5e9)",
                boxShadow: "0 3px 12px rgba(59,130,246,0.35)",
                transition: "transform 0.15s",
              }}
            >
              <Plus
                style={{ width: 13, height: 13, color: "#fff" }}
                strokeWidth={3}
              />
              <span className="text-[12px] font-bold text-white">Add</span>
            </button>
          ) : (
            <div
              className="flex items-center gap-2 rounded-xl px-2 py-1"
              style={{
                background: "linear-gradient(135deg,#3b82f6,#0ea5e9)",
                boxShadow: "0 3px 12px rgba(59,130,246,0.35)",
              }}
            >
              <button onClick={() => setQty((q) => Math.max(0, q - 1))}>
                <Minus
                  style={{ width: 13, height: 13, color: "#fff" }}
                  strokeWidth={3}
                />
              </button>
              <span className="text-[13px] font-bold text-white min-w-[14px] text-center">
                {qty}
              </span>
              <button onClick={() => setQty((q) => q + 1)}>
                <Plus
                  style={{ width: 13, height: 13, color: "#fff" }}
                  strokeWidth={3}
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart flash on add */}
      {addAnim && (
        <div className="absolute inset-0 rounded-3xl pointer-events-none bs-flash" />
      )}
    </div>
  );
}

export default function BestSellers() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bricolage+Grotesque:wght@600;700;800&display=swap');
        .bs-root { font-family: 'DM Sans', sans-serif; }

        @keyframes bsSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bsCardPop {
          0%   { opacity: 0; transform: translateY(18px) scale(0.96); }
          70%  { transform: translateY(-3px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bsPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.88); }
          80%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes bsFlash {
          0%   { background: rgba(59,130,246,0.12); }
          100% { background: transparent; }
        }

        .bs-header { animation: bsSlideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        .bs-item   { animation: bsCardPop 0.5s cubic-bezier(.22,1,.36,1) both; }
        .bs-item-0 { animation-delay: 0.08s; }
        .bs-item-1 { animation-delay: 0.16s; }
        .bs-item-2 { animation-delay: 0.24s; }
        .bs-item-3 { animation-delay: 0.32s; }

        .bs-pop  { animation: bsPop 0.38s cubic-bezier(.22,1,.36,1); }
        .bs-flash { animation: bsFlash 0.4s ease-out forwards; }

        .bs-seeall { transition: gap 0.18s; }
        .bs-seeall:hover { gap: 6px; }
      `}</style>

      <div className="bs-root px-4 mt-7 space-y-4">
        {/* Header */}
        <div className="bs-header flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Flame
                className="w-3.5 h-3.5 text-orange-500"
                fill="#f97316"
                strokeWidth={0}
              />
              <span
                className="text-[10.5px] font-semibold uppercase tracking-widest text-orange-400"
                style={{ letterSpacing: "0.1em" }}
              >
                Trending now
              </span>
            </div>
            <h2
              className="text-[22px] font-extrabold text-gray-900 leading-tight"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Best Sellers
            </h2>
          </div>

          <Link
            href="/products"
            className="bs-seeall flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 bg-blue-50 rounded-full px-3 py-1.5"
          >
            See All <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>

        {/* 2-col Grid */}
        <div className="grid grid-cols-2 gap-3">
          {products.map((item, i) => (
            <ProductCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
