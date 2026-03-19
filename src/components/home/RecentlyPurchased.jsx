"use client";

import Image from "next/image";
import {
  History,
  ShoppingCart,
  Plus,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Rainbow Icecream",
    img: "/img/rainbowcone.jpeg",
    price: 75,
    mrp: 110,
    unit: "1 scoop",
    bg: "#fdf2f8",
  },
  {
    id: 2,
    name: "Fresh Cheese",
    img: "/img/cheese.jpeg",
    price: 89,
    mrp: 120,
    unit: "200g",
    color: "#eab308",
    bg: "#fefce8",
  },
  {
    id: 3,
    name: "Farm Butter",
    img: "/img/butter.jpeg",
    price: 64,
    mrp: 98,
    unit: "500g",
    color: "#f97316",
    bg: "#fff7ed",
  },
];

export default function RecentlyPurchased() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [added, setAdded] = useState({});
  const [removed, setRemoved] = useState({});
  const [clearing, setClearing] = useState(false);

  function removeItem(id) {
    setRemoved((r) => ({ ...r, [id]: true }));
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 380);
  }

  function reAddAll() {
    setClearing(false);
    setItems(INITIAL_ITEMS);
    setRemoved({});
  }

  function clearAll() {
    setClearing(true);
    INITIAL_ITEMS.forEach((item, i) => {
      setTimeout(() => {
        setRemoved((r) => ({ ...r, [item.id]: true }));
      }, i * 100);
    });
    setTimeout(() => setItems([]), 500);
  }

  function handleAdd(id) {
    setAdded((a) => ({ ...a, [id]: true }));
    setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 1600);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .rp-root { font-family: 'DM Sans', sans-serif; }

        @keyframes rpSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rpCardIn  { 0%{opacity:0;transform:scale(0.85) translateY(8px)} 65%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
        @keyframes rpCardOut { 0%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.82) translateY(6px)} }
        @keyframes rpBtnPop  { 0%{transform:scale(1)} 40%{transform:scale(1.25)} 100%{transform:scale(1)} }
        @keyframes rpCheckIn { 0%{opacity:0;transform:scale(0.5)} 65%{transform:scale(1.2)} 100%{opacity:1;transform:scale(1)} }
        @keyframes rpXPop    { 0%{opacity:0;transform:scale(0.5) rotate(-90deg)} 100%{opacity:1;transform:scale(1) rotate(0)} }
        @keyframes rpEmptyIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }

        .rp-header { animation: rpSlideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        .rp-card   { animation: rpCardIn 0.42s cubic-bezier(.22,1,.36,1) both; }
        .rp-card-0 { animation-delay:0.07s }
        .rp-card-1 { animation-delay:0.14s }
        .rp-card-2 { animation-delay:0.21s }
        .rp-out    { animation: rpCardOut 0.32s cubic-bezier(.22,1,.36,1) forwards; }
        .rp-add-bump { animation: rpBtnPop 0.3s cubic-bezier(.22,1,.36,1); }
        .rp-check-in { animation: rpCheckIn 0.3s cubic-bezier(.22,1,.36,1); }
        .rp-x-in     { animation: rpXPop 0.25s cubic-bezier(.22,1,.36,1); }
        .rp-empty-in { animation: rpEmptyIn 0.5s cubic-bezier(.22,1,.36,1) both; }

        .rp-card-inner { transition: box-shadow 0.18s cubic-bezier(.22,1,.36,1); }
        .rp-add-btn    { transition: transform 0.17s cubic-bezier(.22,1,.36,1), box-shadow 0.17s; }
        .rp-add-btn:active { transform: scale(0.88) !important; }
        .rp-x-btn { transition: transform 0.15s, background 0.15s; }
        .rp-x-btn:active { transform: scale(0.85); }
        .rp-clear-btn { transition: transform 0.15s, color 0.15s; }
        .rp-clear-btn:active { transform: scale(0.92); }
      `}</style>

      <div className="rp-root px-4 mt-8 space-y-4">
        {/* ── Header ── */}
        <div className="rp-header flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <History
                className="w-3.5 h-3.5 text-blue-500"
                strokeWidth={2.5}
              />
              <span
                className="text-[10.5px] font-bold uppercase tracking-widest text-blue-500"
                style={{ letterSpacing: "0.1em" }}
              >
                Buy Again
              </span>
            </div>
            <h2
              className="text-[22px] font-extrabold text-gray-900 leading-tight"
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Recently Purchased
            </h2>
          </div>

          {items.length > 0 ? (
            <button
              className="rp-clear-btn flex items-center gap-1 text-[12px] font-semibold text-red-400 bg-red-50 rounded-full px-3 py-1.5"
              onClick={clearAll}
            >
              <X className="w-3 h-3" strokeWidth={2.5} />
              Clear All
            </button>
          ) : (
            <button
              className="rp-clear-btn flex items-center gap-1 text-[12px] font-semibold text-blue-500 bg-blue-50 rounded-full px-3 py-1.5"
              onClick={reAddAll}
            >
              <RotateCcw className="w-3 h-3" strokeWidth={2.5} />
              Restore
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {items.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {items.map((item, i) => {
              const isOut = removed[item.id];
              const isAdded = added[item.id];
              const disc = Math.round(
                ((item.mrp - item.price) / item.mrp) * 100,
              );

              return (
                <div
                  key={item.id}
                  className={`rp-card rp-card-${i} ${isOut ? "rp-out" : ""}`}
                >
                  <div
                    className="rp-card-inner relative rounded-3xl overflow-hidden flex flex-col items-center text-center pt-3 pb-3 px-2"
                    style={{
                      background: "#fff",
                      border: `1.5px solid ${item.color}22`,
                      boxShadow: `0 4px 18px ${item.color}14, 0 1px 4px rgba(0,0,0,0.05)`,
                    }}
                  >
                    {/* Dismiss X */}
                    <button
                      className="rp-x-btn rp-x-in absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "#f1f5f9" }}
                      onClick={() => removeItem(item.id)}
                    >
                      <X
                        style={{ width: 10, height: 10, color: "#94a3b8" }}
                        strokeWidth={2.5}
                      />
                    </button>

                    {/* Discount badge */}
                    <span
                      className="absolute top-2 left-2 text-[9px] font-bold rounded-full px-1.5 py-0.5"
                      style={{ background: item.bg, color: item.color }}
                    >
                      -{disc}%
                    </span>

                    {/* Image bubble */}
                    <div
                      className="relative rounded-2xl mb-2 mt-1 overflow-hidden"
                      style={{ width: 60, height: 60, background: item.bg }}
                    >
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Name */}
                    <p
                      className="text-[12px] font-bold text-gray-800 leading-tight truncate w-full px-1"
                      style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}
                    >
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {item.unit}
                    </p>

                    {/* Prices */}
                    <div className="flex items-baseline gap-1 mt-1">
                      <span
                        className="text-[14px] font-extrabold"
                        style={{
                          color: item.color,
                          fontFamily: "'Bricolage Grotesque',sans-serif",
                        }}
                      >
                        ₹{item.price}
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        ₹{item.mrp}
                      </span>
                    </div>

                    {/* Add button */}
                    {/* <button
                      className={`rp-add-btn ${isAdded ? "rp-add-bump" : ""} w-full flex items-center justify-center gap-1 rounded-xl py-1.5 mt-2`}
                      style={{
                        background: isAdded
                          ? "linear-gradient(135deg,#22c55e,#4ade80)"
                          : `linear-gradient(135deg,${item.color},${item.color}cc)`,
                        boxShadow: isAdded
                          ? "0 3px 10px rgba(34,197,94,0.35)"
                          : `0 3px 10px ${item.color}40`,
                        transition: "background 0.28s, box-shadow 0.28s",
                      }}
                      onClick={() => handleAdd(item.id)}
                    > */}
                    {/* {isAdded ? (
                        <span className="rp-check-in flex items-center gap-1">
                          <CheckCircle2
                            style={{ width: 12, height: 12, color: "#fff" }}
                            strokeWidth={2.5}
                          />
                          <span className="text-white text-[11px] font-semibold">
                            Added
                          </span>
                        </span>
                      ) : (
                        <>
                          <Plus
                            style={{ width: 11, height: 11, color: "#fff" }}
                            strokeWidth={2.8}
                          />
                          <span className="text-white text-[11px] font-semibold">
                            Add
                          </span>
                        </>
                      )} */}
                    {/* </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Empty state ── */
          <div
            className="rp-empty-in flex flex-col items-center justify-center py-10 rounded-3xl gap-3"
            style={{ background: "#f8faff", border: "1.5px dashed #cbd5e1" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)" }}
            >
              <ShoppingCart className="w-6 h-6 text-blue-400" strokeWidth={2} />
            </div>
            <div className="text-center">
              <p
                className="text-[14px] font-bold text-gray-700"
                style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}
              >
                No recent purchases
              </p>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Tap restore to bring them back
              </p>
            </div>
            <button
              className="flex items-center gap-1.5 text-[12.5px] font-semibold text-blue-600 bg-blue-50 rounded-full px-4 py-2 mt-1"
              style={{ transition: "transform 0.15s" }}
              onClick={reAddAll}
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} />
              Restore Items
            </button>
          </div>
        )}

        {/* ── Reorder all CTA ── */}
        {/* {items.length > 0 && (
          <button
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3"
            style={{
              background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              boxShadow: "0 5px 18px rgba(29,78,216,0.3)",
              transition: "transform 0.17s cubic-bezier(.22,1,.36,1)",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.97)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <RotateCcw
              style={{ width: 14, height: 14, color: "#fff" }}
              strokeWidth={2.5}
            />
            <span
              className="text-white font-bold text-[13.5px]"
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Reorder All Items
            </span>
            <Sparkles
              style={{ width: 13, height: 13, color: "rgba(255,255,255,0.7)" }}
              strokeWidth={2}
            />
          </button>
        )} */}
      </div>
    </>
  );
}
