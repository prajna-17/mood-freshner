"use client";

import { useEffect, useState } from "react";
import { Zap, Flame, Tag, ArrowRight, Sparkles } from "lucide-react";

function useCountdown(initial = 4 * 60 * 60) {
  const [time, setTime] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setTime((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: String(Math.floor(time / 3600)).padStart(2, "0"),
    m: String(Math.floor((time % 3600) / 60)).padStart(2, "0"),
    s: String(time % 60).padStart(2, "0"),
  };
}

function TimeBox({ value, label, accent }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      setPrev(value);
      const t = setTimeout(() => setFlip(false), 320);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl"
      style={{
        width: 62,
        height: 62,
        background: "rgba(255,255,255,0.13)",
        backdropFilter: "blur(10px)",
        border: "1.5px solid rgba(255,255,255,0.22)",
        boxShadow:
          "0 4px 14px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.18)",
      }}
    >
      <span
        className="tabular-nums font-extrabold leading-none"
        style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: 22,
          color: accent || "#fff",
          transform: flip ? "translateY(-3px)" : "translateY(0)",
          opacity: flip ? 0.6 : 1,
          transition:
            "transform 0.18s cubic-bezier(.22,1,.36,1), opacity 0.18s",
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </span>
      <span
        className="text-[9.5px] font-semibold uppercase mt-0.5"
        style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em" }}
      >
        {label}
      </span>
    </div>
  );
}

const deals = [
  { label: "Paneer", off: "30% OFF", color: "#fb923c" },
  { label: "Butter", off: "35% OFF", color: "#facc15" },
  { label: "Yogurt", off: "25% OFF", color: "#4ade80" },
  { label: "Cheese", off: "20% OFF", color: "#c084fc" },
];

export default function FlashSale() {
  const { h, m, s } = useCountdown(4 * 60 * 60);
  const [pulse, setPulse] = useState(true);

  // Pulse the zap badge every 2.5s
  useEffect(() => {
    const t = setInterval(() => {
      setPulse(false);
      setTimeout(() => setPulse(true), 100);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .fs-root { font-family: 'DM Sans', sans-serif; }

        @keyframes fsSlideIn  { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes fsShine    { from{transform:translateX(-100%) skewX(-14deg)} to{transform:translateX(260%) skewX(-14deg)} }
        @keyframes fsPulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes fsFlicker  { 0%,100%{opacity:1} 45%{opacity:0.6} 55%{opacity:1} }
        @keyframes fsTagIn    { 0%{opacity:0;transform:translateX(-6px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes fsDotPing  { 0%{transform:scale(1);opacity:0.7} 70%{transform:scale(2.2);opacity:0} 100%{transform:scale(1);opacity:0} }
        @keyframes fsChipIn   { 0%{opacity:0;transform:scale(0.8)} 70%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }

        .fs-card   { animation: fsSlideIn 0.55s cubic-bezier(.22,1,.36,1) both; }
        .fs-shine::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,0.18) 50%,transparent 64%);
          animation: fsShine 3s cubic-bezier(.22,1,.36,1) infinite; animation-delay:1.2s;
          border-radius:inherit; pointer-events:none;
        }
        .fs-zap-pulse { animation: fsPulse 0.45s cubic-bezier(.22,1,.36,1); }
        .fs-flicker   { animation: fsFlicker 1.8s ease-in-out infinite; }
        .fs-dot-ping  { animation: fsDotPing 1.6s ease-in-out infinite; }
        .fs-tag       { animation: fsTagIn 0.45s cubic-bezier(.22,1,.36,1) both; }
        .fs-tag-0 { animation-delay:0.45s }
        .fs-tag-1 { animation-delay:0.52s }
        .fs-tag-2 { animation-delay:0.59s }
        .fs-tag-3 { animation-delay:0.66s }
        .fs-chip    { animation: fsChipIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        .fs-chip-0  { animation-delay:0.38s }
        .fs-chip-1  { animation-delay:0.46s }
        .fs-chip-2  { animation-delay:0.54s }
        .fs-chip-3  { animation-delay:0.62s }

        .fs-cta { transition: transform 0.17s cubic-bezier(.22,1,.36,1), box-shadow 0.17s; }
        .fs-cta:active { transform: scale(0.91); }
      `}</style>

      <div className="fs-root px-4 mt-6">
        <div
          className="fs-card fs-shine relative rounded-[28px] overflow-hidden p-5"
          style={{
            background:
              "linear-gradient(135deg, #0c1e50 0%, #1a3a8a 45%, #0f2655 100%)",
            boxShadow:
              "0 10px 40px rgba(12,30,80,0.45), 0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Glow blobs */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(99,179,237,0.18) 0%, transparent 70%)",
              transform: "translate(30%,-30%)",
            }}
          />
          <div
            className="absolute bottom-0 left-10 w-28 h-28 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)",
              transform: "translateY(40%)",
            }}
          />

          {/* ── Row 1: Badge + Ends in ── */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            {/* Flash Sale badge */}
            <div className="flex items-center gap-2">
              {/* Live ping dot */}
              <div className="relative w-3 h-3 flex-shrink-0">
                <span className="fs-dot-ping absolute inset-0 rounded-full bg-orange-400" />
                <span className="absolute inset-0.5 rounded-full bg-orange-400" />
              </div>

              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  background: "linear-gradient(135deg,#f97316,#fb923c)",
                  boxShadow: "0 3px 12px rgba(249,115,22,0.45)",
                }}
              >
                <Zap
                  className={pulse ? "fs-zap-pulse" : ""}
                  style={{ width: 13, height: 13, color: "#fff" }}
                  strokeWidth={0}
                  fill="#fff"
                />
                <span
                  className="text-white text-[12px] font-bold uppercase"
                  style={{ letterSpacing: "0.07em" }}
                >
                  Flash Sale
                </span>
                <Flame
                  className="fs-flicker"
                  style={{ width: 12, height: 12 }}
                  strokeWidth={0}
                  fill="#fde68a"
                />
              </div>
            </div>

            {/* Ends in label */}
            <div className="flex items-center gap-1 text-white/60 text-[11.5px] font-medium">
              <Sparkles
                style={{
                  width: 11,
                  height: 11,
                  color: "rgba(255,255,255,0.5)",
                }}
                strokeWidth={2}
              />
              Ends in
            </div>
          </div>

          {/* ── Row 2: Title + Timer ── */}
          <div className="flex items-end justify-between relative z-10 mb-4">
            {/* Title */}
            <div>
              <h2
                className="text-white leading-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  textShadow: "0 2px 14px rgba(0,0,0,0.25)",
                }}
              >
                Today's
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#fde68a,#fb923c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Hot Deals
                </span>
              </h2>
              <p className="text-white/55 text-[12px] mt-1.5 font-medium">
                Up to 35% off · Select items
              </p>
            </div>

            {/* Timer boxes */}
            <div className="flex items-center gap-1.5">
              <TimeBox value={h} label="HRS" />
              <span
                className="text-white/50 font-bold text-lg mb-1"
                style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}
              >
                :
              </span>
              <TimeBox value={m} label="MIN" />
              <span
                className="text-white/50 font-bold text-lg mb-1"
                style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}
              >
                :
              </span>
              <TimeBox value={s} label="SEC" accent="#fb923c" />
            </div>
          </div>

          {/* ── Row 3: Deal chips ── */}
          <div className="flex gap-2 flex-wrap relative z-10 mb-4">
            {deals.map((d, i) => (
              <div
                key={d.label}
                className={`fs-chip fs-chip-${i} flex items-center gap-1.5 rounded-full px-3 py-1.5`}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: `1px solid ${d.color}55`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <Tag
                  style={{ width: 10, height: 10, color: d.color }}
                  strokeWidth={2.5}
                />
                <span className="text-[11.5px] font-semibold text-white/90">
                  {d.label}
                </span>
                <span
                  className="text-[10px] font-bold rounded-full px-1.5 py-0.5"
                  style={{ background: `${d.color}28`, color: d.color }}
                >
                  {d.off}
                </span>
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <button
            className="fs-cta w-full flex items-center justify-center gap-2 rounded-2xl py-3 relative z-10"
            style={{
              background: "linear-gradient(135deg,#f97316,#fb923c)",
              boxShadow: "0 5px 20px rgba(249,115,22,0.45)",
            }}
          >
            <Zap
              style={{ width: 14, height: 14, color: "#fff" }}
              strokeWidth={0}
              fill="#fff"
            />
            <span
              className="text-white font-bold text-[14px]"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Shop Flash Deals
            </span>
            <ArrowRight
              style={{ width: 14, height: 14, color: "rgba(255,255,255,0.8)" }}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    </>
  );
}
