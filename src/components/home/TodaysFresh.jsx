"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Leaf,
  ArrowRight,
  Plus,
  CheckCircle2,
  Flame,
  Clock3,
} from "lucide-react";
import { useState } from "react";

const items = [
  {
    name: "Fresh Butter",
    subtitle: "Amul Gold · 500g",
    img: "/img/butter.jpeg",
    tag: "35% OFF",
    tagType: "deal",
    price: 64,
    mrp: 98,
    rating: 4.8,
    reviews: 312,
    color: "#f97316",
    lightBg: "#fff7ed",
  },
  {
    name: "Fresh Cheese",
    subtitle: "Britannia · 200g",
    img: "/img/cheese.jpeg",
    tag: "BUY 2 GET 1",
    tagType: "bogo",
    price: 89,
    mrp: 130,
    rating: 4.9,
    reviews: 204,
    color: "#eab308",
    lightBg: "#fefce8",
  },
  {
    name: "Fresh Curd",
    subtitle: "Mother Dairy · 400g",
    img: "/img/curd.jpeg",
    tag: "20% OFF",
    tagType: "deal",
    price: 44,
    mrp: 55,
    rating: 4.7,
    reviews: 178,
    color: "#8b5cf6",
    lightBg: "#f5f3ff",
  },
];

const TAG_STYLES = {
  deal: { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  bogo: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
};

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{
            width: 11,
            height: 11,
            color: s <= Math.round(rating) ? "#fb923c" : "#e5e7eb",
            fill: s <= Math.round(rating) ? "#fb923c" : "#e5e7eb",
          }}
          strokeWidth={0}
        />
      ))}
      <span className="text-[10.5px] text-gray-400 ml-1 font-medium">
        {rating}
      </span>
    </div>
  );
}

export default function TodaysFresh() {
  const [added, setAdded] = useState({});

  function handleAdd(i) {
    setAdded((a) => ({ ...a, [i]: true }));
    setTimeout(() => setAdded((a) => ({ ...a, [i]: false })), 1800);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .tf-root { font-family: 'DM Sans', sans-serif; }

        @keyframes tfSlideIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tfCardIn   { 0%{opacity:0;transform:translateX(22px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes tfShine    { from{transform:translateX(-100%) skewX(-12deg)} to{transform:translateX(260%) skewX(-12deg)} }
        @keyframes tfBtnPop   { 0%{transform:scale(1)} 40%{transform:scale(1.22)} 100%{transform:scale(1)} }
        @keyframes tfCheckIn  { 0%{opacity:0;transform:scale(0.5)} 65%{transform:scale(1.2)} 100%{opacity:1;transform:scale(1)} }
        @keyframes tfLeafBob  { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
        @keyframes tfPricePop { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

        .tf-header  { animation: tfSlideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        .tf-card    { animation: tfCardIn  0.48s cubic-bezier(.22,1,.36,1) both; }
        .tf-card-0  { animation-delay:0.06s }
        .tf-card-1  { animation-delay:0.14s }
        .tf-card-2  { animation-delay:0.22s }

        .tf-shine::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.32) 50%,transparent 62%);
          animation: tfShine 2.6s cubic-bezier(.22,1,.36,1) infinite;
          animation-delay:1s; border-radius:inherit; pointer-events:none;
        }

        .tf-add-btn { transition: transform 0.17s cubic-bezier(.22,1,.36,1), box-shadow 0.17s; }
        .tf-add-btn:active { transform: scale(0.87) !important; }
        .tf-add-bump { animation: tfBtnPop 0.3s cubic-bezier(.22,1,.36,1); }
        .tf-check-in { animation: tfCheckIn 0.32s cubic-bezier(.22,1,.36,1); }

        .tf-leaf { animation: tfLeafBob 2.4s ease-in-out infinite; }
        .tf-price { animation: tfPricePop 0.35s cubic-bezier(.22,1,.36,1) both; }
        .tf-seeall { transition: transform 0.15s; }
        .tf-seeall:active { transform: scale(0.93); }
      `}</style>

      <div className="tf-root px-4 mt-6 space-y-4">
        {/* ── Header ── */}
        <div className="tf-header flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Leaf
                className="tf-leaf w-3.5 h-3.5 text-green-500"
                strokeWidth={2.5}
              />
              <span
                className="text-[10.5px] font-bold uppercase tracking-widest text-green-600"
                style={{ letterSpacing: "0.1em" }}
              >
                Daily Picks
              </span>
            </div>
            <h2
              className="text-[22px] font-extrabold text-gray-900 leading-tight"
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Today's Fresh
            </h2>
          </div>

          <Link
            href="/products"
            className="tf-seeall flex items-center gap-1 text-[12.5px] font-semibold text-blue-600 bg-blue-50 rounded-full px-3 py-1.5"
          >
            See All <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── Horizontal Slider ── */}
        <div
          className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item, i) => {
            const tagSty = TAG_STYLES[item.tagType];
            const isAdded = added[i];

            return (
              <div
                key={i}
                className={`tf-card tf-card-${i} tf-shine flex-shrink-0 relative rounded-3xl overflow-hidden`}
                style={{
                  width: "78vw",
                  maxWidth: 300,
                  background: "#fff",
                  boxShadow: `0 6px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)`,
                  border: `1.5px solid ${item.color}18`,
                }}
              >
                {/* Color accent bar at top */}
                <div
                  className="h-1 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                  }}
                />

                <div className="p-4">
                  {/* Tag row */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: tagSty.bg,
                        color: tagSty.color,
                        border: `1px solid ${tagSty.border}`,
                      }}
                    >
                      {item.tagType === "deal" ? (
                        <span className="flex items-center gap-1">
                          <Flame
                            style={{ width: 10, height: 10, display: "inline" }}
                            strokeWidth={0}
                            fill="currentColor"
                          />{" "}
                          {item.tag}
                        </span>
                      ) : (
                        item.tag
                      )}
                    </span>

                    {/* <div className="flex items-center gap-1 text-[10.5px] text-gray-400">
                      <Clock3
                        style={{ width: 11, height: 11 }}
                        strokeWidth={2}
                      />
                      <span>Ends today</span>
                    </div> */}
                  </div>

                  {/* Main content row */}
                  <div className="flex items-center gap-3">
                    {/* Image bubble */}
                    <div
                      className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                      style={{
                        width: 80,
                        height: 80,
                        background: item.lightBg,
                      }}
                    >
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[14.5px] font-bold text-gray-900 truncate leading-tight"
                        style={{
                          fontFamily: "'Bricolage Grotesque',sans-serif",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 mb-1.5">
                        {item.subtitle}
                      </p>

                      <StarRow rating={item.rating} />

                      {/* Price row */}
                      <div className="flex items-end gap-1.5 mt-2">
                        <span
                          className="tf-price text-[17px] font-extrabold"
                          style={{
                            color: item.color,
                            fontFamily: "'Bricolage Grotesque',sans-serif",
                          }}
                        >
                          ₹{item.price}
                        </span>
                        <span className="text-[11px] text-gray-400 line-through mb-0.5">
                          ₹{item.mrp}
                        </span>
                        <span
                          className="text-[10px] font-semibold rounded-full px-1.5 py-0.5 mb-0.5"
                          style={{ background: tagSty.bg, color: tagSty.color }}
                        >
                          {Math.round(
                            ((item.mrp - item.price) / item.mrp) * 100,
                          )}
                          % off
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to cart button */}
                  <button
                    className={`tf-add-btn ${isAdded ? "tf-add-bump" : ""} w-full flex items-center justify-center gap-2 rounded-2xl py-2.5 mt-3`}
                    style={{
                      background: isAdded
                        ? "linear-gradient(135deg,#22c55e,#4ade80)"
                        : `linear-gradient(135deg,${item.color},${item.color}cc)`,
                      boxShadow: isAdded
                        ? "0 4px 14px rgba(34,197,94,0.35)"
                        : `0 4px 14px ${item.color}44`,
                      transition: "background 0.3s, box-shadow 0.3s",
                    }}
                    onClick={() => handleAdd(i)}
                  >
                    {isAdded ? (
                      <span className="tf-check-in flex items-center gap-1.5">
                        <CheckCircle2
                          style={{ width: 15, height: 15, color: "#fff" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-white text-[13px] font-semibold">
                          Added!
                        </span>
                      </span>
                    ) : (
                      <>
                        <ShoppingCart
                          style={{ width: 14, height: 14, color: "#fff" }}
                          strokeWidth={2.5}
                        />
                        <span className="text-white text-[13px] font-semibold">
                          Add to Cart
                        </span>
                        <Plus
                          style={{
                            width: 13,
                            height: 13,
                            color: "rgba(255,255,255,0.7)",
                          }}
                          strokeWidth={2.5}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 pt-0.5">
          {items.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === 0 ? 18 : 6,
                height: 6,
                background: i === 0 ? "#3b82f6" : "#e2e8f0",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
