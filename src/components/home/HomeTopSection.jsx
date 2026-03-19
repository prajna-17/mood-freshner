"use client";

import { ShoppingCart, Bell, Search, Mic, Sparkles } from "lucide-react";
import { useState } from "react";

export default function HomeTopSection() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [activeChip, setActiveChip] = useState("🥛 Dairy");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .hts-root * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .hts-heading { font-family: 'Bricolage Grotesque', sans-serif; }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.65); }
          65%  { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes badgePop {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.35); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.45); }
          50%       { box-shadow: 0 0 0 9px rgba(37,99,235,0); }
        }
        @keyframes floatDot {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes waveBlob {
          0%, 100% { border-radius: 60% 40% 55% 45% / 50% 55% 45% 50%; }
          33%       { border-radius: 50% 50% 40% 60% / 60% 40% 55% 45%; }
          66%       { border-radius: 45% 55% 60% 40% / 45% 60% 40% 55%; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .hts-greeting  { animation: fadeSlideDown 0.55s cubic-bezier(.22,1,.36,1) both 0.05s; }
        .hts-head-anim { animation: fadeSlideDown 0.60s cubic-bezier(.22,1,.36,1) both 0.16s; }
        .hts-icon-cart { animation: popIn 0.48s cubic-bezier(.22,1,.36,1) both 0.32s; }
        .hts-icon-bell { animation: popIn 0.48s cubic-bezier(.22,1,.36,1) both 0.44s; }
        .hts-badge     { animation: badgePop 0.38s cubic-bezier(.22,1,.36,1) both 0.92s; }
        .hts-search    { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both 0.52s; }
        .hts-chips     { animation: fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both 0.68s; }

        .shimmer-blue {
          background: linear-gradient(90deg, #1d4ed8 0%, #3b82f6 35%, #93c5fd 55%, #3b82f6 75%, #1d4ed8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite 1s;
        }

        .icon-btn { position: relative; transition: transform 0.18s cubic-bezier(.22,1,.36,1); cursor: pointer; }
        .icon-btn:hover  { transform: scale(1.08); }
        .icon-btn:active { transform: scale(0.90); }

        .search-box {
          transition: box-shadow 0.28s cubic-bezier(.22,1,.36,1), background 0.28s, border-color 0.28s;
        }

        .chip { transition: background 0.18s, transform 0.16s, box-shadow 0.18s, color 0.18s; }
        .chip:hover  { transform: translateY(-2px); }
        .chip:active { transform: scale(0.91); }

        .mic-btn { transition: transform 0.18s cubic-bezier(.22,1,.36,1), background 0.2s; border: none; }
        .mic-btn:active { transform: scale(0.87); }
        .mic-pulse { animation: micPulse 1s ease-in-out infinite; }

        .dot-1 { animation: floatDot 2.8s ease-in-out infinite 0s; }
        .dot-2 { animation: floatDot 2.3s ease-in-out infinite 0.5s; }
        .dot-3 { animation: floatDot 3.2s ease-in-out infinite 1s; }

        .blob { animation: waveBlob 7s ease-in-out infinite; }

        .ring-dot {
          position: relative;
          width: 10px; height: 10px;
        }
        .ring-dot::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 1.5px solid #3b82f6;
          animation: ringPulse 1.8s ease-out infinite;
        }
        .ring-dot::after {
          content: '';
          position: absolute; inset: 1.5px;
          border-radius: 50%;
          background: #3b82f6;
          border: 1.5px solid #fff;
        }
      `}</style>

      <div
        className="hts-root relative overflow-hidden rounded-b-[2.8rem] px-5 pt-12 pb-6 space-y-5"
        style={{
          background:
            "linear-gradient(155deg, #f0f7ff 0%, #dbeafe 50%, #bfdbfe 100%)",
          minHeight: 220,
        }}
      >
        {/* BG blobs */}
        <div
          className="blob absolute -top-10 -right-10 w-56 h-56 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(147,197,253,0.5) 0%, rgba(219,234,254,0.25) 55%, transparent 75%)",
          }}
        />
        <div
          className="blob absolute -bottom-14 -left-10 w-44 h-44 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 60% 60%, rgba(96,165,250,0.18) 0%, rgba(191,219,254,0.1) 55%, transparent 80%)",
            animationDelay: "3.5s",
          }}
        />

        {/* Floating dots */}
        <span
          className="dot-1 absolute top-10 right-24 w-2 h-2 rounded-full pointer-events-none"
          style={{ background: "#93c5fd", opacity: 0.7 }}
        />
        <span
          className="dot-2 absolute top-20 right-10 w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ background: "#60a5fa", opacity: 0.55 }}
        />
        <span
          className="dot-3 absolute bottom-14 left-6 w-2.5 h-2.5 rounded-full pointer-events-none"
          style={{ background: "#bfdbfe", opacity: 0.8 }}
        />

        {/* ── Top Row ── */}
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1.5">
            <div className="hts-greeting flex items-center gap-1.5">
              <Sparkles
                strokeWidth={2.5}
                style={{ width: 13, height: 13, color: "#3b82f6" }}
              />
              <p
                className="shimmer-blue text-[12.5px] font-semibold uppercase"
                style={{ letterSpacing: "0.09em" }}
              >
                Good morning, Rahul
              </p>
            </div>

            <h1
              className="hts-heading hts-head-anim text-[27px] font-extrabold leading-[1.17]"
              style={{ letterSpacing: "-0.025em", color: "#0f172a" }}
            >
              What would you
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(130deg, #1d4ed8 0%, #2563eb 45%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                like today?
              </span>
            </h1>
          </div>

          {/* Icons */}
        </div>

        {/* ── Search Bar ── */}
        <div className="hts-search relative z-10">
          <div
            className="search-box flex items-center rounded-2xl px-4 py-3.5 gap-3"
            style={{
              background: searchFocused ? "#ffffff" : "rgba(255,255,255,0.68)",
              backdropFilter: "blur(16px)",
              boxShadow: searchFocused
                ? "0 0 0 2.5px #2563eb, 0 8px 32px rgba(37,99,235,0.15)"
                : "0 2px 20px rgba(59,130,246,0.13), inset 0 1px 0 rgba(255,255,255,0.95)",
              border: searchFocused
                ? "1.5px solid #93c5fd"
                : "1.5px solid rgba(255,255,255,0.65)",
            }}
          >
            <Search
              strokeWidth={2.2}
              style={{
                width: 18,
                height: 18,
                flexShrink: 0,
                color: searchFocused ? "#2563eb" : "#60a5fa",
                transition: "color 0.2s",
              }}
            />
            <input
              type="text"
              placeholder="Search milk, eggs, cheese…"
              className="bg-transparent outline-none flex-1 text-gray-700"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button
              className={`mic-btn flex-shrink-0 p-1.5 rounded-xl cursor-pointer ${micActive ? "mic-pulse" : ""}`}
              style={{
                background: micActive
                  ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                  : "linear-gradient(135deg, #dbeafe, #eff6ff)",
              }}
              onClick={() => setMicActive((v) => !v)}
            >
              <Mic
                strokeWidth={2.2}
                style={{
                  width: 16,
                  height: 16,
                  color: micActive ? "#fff" : "#3b82f6",
                  transition: "color 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Chips ── */}
        {/* <div
          className="hts-chips flex gap-2 overflow-x-auto pb-0.5 -mx-1 px-1 relative z-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[
            "🥛 Dairy",
            "🥦 Veggies",
            "🍞 Bakery",
            "🧃 Drinks",
            "🧁 Snacks",
          ].map((label) => {
            const isActive = activeChip === label;
            return (
              <button
                key={label}
                className="chip flex-shrink-0 text-[12.5px] font-medium px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.01em",
                  border: isActive
                    ? "none"
                    : "1.5px solid rgba(147,197,253,0.6)",
                  background: isActive
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : "rgba(255,255,255,0.78)",
                  color: isActive ? "#fff" : "#1d4ed8",
                  boxShadow: isActive
                    ? "0 4px 14px rgba(29,78,216,0.35)"
                    : "0 1px 6px rgba(59,130,246,0.1)",
                }}
                onClick={() => setActiveChip(label)}
              >
                {label}
              </button>
            );
          })}
        </div> */}
      </div>
    </>
  );
}
