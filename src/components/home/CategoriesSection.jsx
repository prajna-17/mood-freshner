"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    name: "Milk",
    img: "/img/3milk.jpeg",
    color: "#3b82f6",
    bg: "#eff6ff",
    activeBg: "linear-gradient(145deg,#3b82f6,#0ea5e9)",
  },
  {
    name: "Butter",
    img: "/img/butter.jpeg",
    color: "#f97316",
    bg: "#fff7ed",
    activeBg: "linear-gradient(145deg,#f97316,#fb923c)",
  },
  {
    name: "Cheese",
    img: "/img/cheese.jpeg",
    color: "#eab308",
    bg: "#fefce8",
    activeBg: "linear-gradient(145deg,#ca8a04,#eab308)",
  },
  {
    name: "Curd",
    img: "/img/curd.jpeg",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    activeBg: "linear-gradient(145deg,#8b5cf6,#a78bfa)",
  },
];

export default function CategoriesSection() {
  const [active, setActive] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Bricolage+Grotesque:wght@700;800&display=swap');
        .cs2-root { font-family: 'DM Sans', sans-serif; }

        @keyframes cs2Pop {
          0%   { opacity:0; transform: scale(0.78) translateY(10px); }
          65%  { transform: scale(1.05) translateY(-2px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes cs2ImgFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50%     { transform: translateY(-5px) scale(1.04); }
        }
        @keyframes cs2Shine {
          from { transform: translateX(-120%) skewX(-15deg); }
          to   { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes cs2FadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes cs2DotPulse {
          0%,100% { transform: scale(1); opacity:0.8; }
          50%     { transform: scale(1.5); opacity:1; }
        }

        .cs2-card { animation: cs2Pop 0.44s cubic-bezier(.22,1,.36,1) both; }
        .cs2-card-0 { animation-delay:0.06s }
        .cs2-card-1 { animation-delay:0.13s }
        .cs2-card-2 { animation-delay:0.20s }
        .cs2-card-3 { animation-delay:0.27s }

        .cs2-header { animation: cs2FadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }

        .cs2-img-float { animation: cs2ImgFloat 3s ease-in-out infinite; }

        .cs2-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%);
          animation: cs2Shine 0.8s cubic-bezier(.22,1,.36,1) forwards;
          border-radius: inherit;
          pointer-events: none;
        }

        .cs2-btn { transition: transform 0.2s cubic-bezier(.22,1,.36,1), box-shadow 0.2s; }
        .cs2-btn:active { transform: scale(0.9) !important; }

        .cs2-dot { animation: cs2DotPulse 1.4s ease-in-out infinite; }

        .cs2-pill-tag { animation: cs2FadeUp 0.3s cubic-bezier(.22,1,.36,1) both; }

        .cs2-seeall { transition: gap 0.15s, background 0.15s; }
        .cs2-seeall:active { transform: scale(0.94); }
      `}</style>

      <div className="cs2-root px-4 mt-6 space-y-4">
        {/* ── Header ── */}
        <div className="cs2-header flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-3 h-3 text-orange-400" strokeWidth={2.5} />
              <span
                className="text-[10px] font-bold uppercase text-orange-400"
                style={{ letterSpacing: "0.11em" }}
              >
                Shop by
              </span>
            </div>
            <h2
              className="text-[22px] font-extrabold text-gray-900 leading-none"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Categories
            </h2>
          </div>

          <Link
            href="/categories"
            className="cs2-seeall flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full px-3.5 py-1.5"
          >
            See All
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>

        {/* ── Cards Row ── */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, i) => {
            const isActive = active === i;
            return (
              <button
                key={cat.name}
                onClick={() => setActive(i)}
                className={`cs2-btn cs2-card cs2-card-${i} relative flex-shrink-0 flex flex-col items-center justify-end overflow-hidden rounded-3xl`}
                style={{
                  width: 100,
                  height: 118,
                  background: isActive ? cat.activeBg : cat.bg,
                  boxShadow: isActive
                    ? `0 8px 28px ${cat.color}50, 0 2px 8px ${cat.color}28`
                    : `0 2px 10px rgba(0,0,0,0.06)`,
                  border: isActive ? "none" : `1.5px solid ${cat.color}25`,
                  transform: isActive ? "scale(1.07)" : "scale(1)",
                  transition:
                    "transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s",
                  paddingBottom: 12,
                }}
              >
                {/* Shine sweep on active */}
                {isActive && (
                  <span className="cs2-shine absolute inset-0 rounded-3xl" />
                )}

                {/* Top glow blob */}
                {isActive && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full pointer-events-none"
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      filter: "blur(10px)",
                      top: -8,
                    }}
                  />
                )}

                {/* Image */}
                <div
                  className={`relative mb-2 ${isActive ? "cs2-img-float" : ""}`}
                  style={{ width: 58, height: 58 }}
                >
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    className="object-contain drop-shadow-md"
                    style={{
                      filter: isActive
                        ? "drop-shadow(0 4px 12px rgba(0,0,0,0.25))"
                        : "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  className="text-[13px] font-semibold leading-none relative z-10"
                  style={{
                    color: isActive ? "#fff" : cat.color,
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cat.name}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <span
                    className="cs2-dot absolute bottom-2 w-1.5 h-1.5 rounded-full bg-white"
                    style={{ opacity: 0.85 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Active filter tag ── */}
        <div
          key={active}
          className="cs2-pill-tag flex items-center gap-2 px-3.5 py-2 rounded-2xl"
          style={{
            background: `${categories[active].color}10`,
            border: `1px solid ${categories[active].color}20`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: categories[active].color }}
          />
          <span
            className="text-[12px] font-medium"
            style={{ color: categories[active].color }}
          >
            Browsing{" "}
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
              }}
            >
              {categories[active].name}
            </span>{" "}
            — fresh stock available
          </span>
        </div>
      </div>
    </>
  );
}
