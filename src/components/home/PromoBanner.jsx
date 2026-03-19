"use client";

import Image from "next/image";
import { Timer, Copy, CheckCheck, Zap, Tag, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

function useCountdown(targetHours = 8) {
  const [time, setTime] = useState({ h: targetHours, m: 47, s: 23 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

function Pad({ v }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg text-white font-bold text-[13px] tabular-nums"
      style={{
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(6px)",
        width: 30,
        height: 26,
        fontFamily: "'Bricolage Grotesque', sans-serif",
        letterSpacing: "-0.02em",
      }}
    >
      {String(v).padStart(2, "0")}
    </span>
  );
}

export default function PromoBanner() {
  const [copied, setCopied] = useState(false);
  const time = useCountdown(8);

  function copyCode() {
    navigator.clipboard?.writeText("DAIRY20").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .pb-root { font-family: 'DM Sans', sans-serif; }

        @keyframes pbSlideIn {
          from { opacity:0; transform:translateY(16px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes pbShine {
          from { transform: translateX(-100%) skewX(-15deg); }
          to   { transform: translateX(260%) skewX(-15deg); }
        }
        @keyframes pbPulse {
          0%,100% { opacity:1; }
          50%     { opacity:0.55; }
        }
        @keyframes pbZap {
          0%,100% { transform: rotate(-8deg) scale(1); }
          50%     { transform: rotate(8deg) scale(1.2); }
        }
        @keyframes pbCopyPop {
          0%  { transform: scale(0.7); opacity:0; }
          65% { transform: scale(1.15); }
          100%{ transform: scale(1); opacity:1; }
        }
        @keyframes pbTagSlide {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes pbCountTick {
          0%  { transform: translateY(-6px); opacity:0; }
          100%{ transform: translateY(0);    opacity:1; }
        }

        .pb-banner { animation: pbSlideIn 0.55s cubic-bezier(.22,1,.36,1) both; }
        .pb-shine::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%);
          animation: pbShine 2.8s cubic-bezier(.22,1,.36,1) infinite;
          animation-delay: 0.8s;
          border-radius:inherit; pointer-events:none;
        }
        .pb-dot   { animation: pbPulse 1.5s ease-in-out infinite; }
        .pb-zap   { animation: pbZap 1.8s ease-in-out infinite; }
        .pb-tag   { animation: pbTagSlide 0.5s cubic-bezier(.22,1,.36,1) both 0.3s; }
        .pb-copy  { animation: pbCopyPop 0.32s cubic-bezier(.22,1,.36,1); }

        .pb-code-btn { transition: transform 0.17s cubic-bezier(.22,1,.36,1), background 0.17s; }
        .pb-code-btn:active { transform: scale(0.91); }
        .pb-cta-btn  { transition: transform 0.17s cubic-bezier(.22,1,.36,1), box-shadow 0.17s; }
        .pb-cta-btn:active { transform: scale(0.92); }

        .pb-num { animation: pbCountTick 0.2s cubic-bezier(.22,1,.36,1); }
      `}</style>

      <div className="pb-root px-4 mt-6">
        <div
          className="pb-banner pb-shine relative w-full rounded-3xl overflow-hidden"
          style={{
            height: 168,
            boxShadow:
              "0 8px 32px rgba(30,58,138,0.28), 0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {/* Background image */}
          <Image
            src="/img/blueproducts.jpeg"
            alt="Promo"
            fill
            className="object-cover"
            style={{ transform: "scale(1.04)" }}
          />

          {/* Dark-to-transparent overlay so text is legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(10,30,80,0.82) 0%, rgba(15,40,100,0.65) 55%, rgba(0,0,0,0.1) 100%)",
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between px-4 py-3.5">
            {/* Top row — live badge + timer */}
            <div className="flex items-center justify-between">
              {/* LIVE pill */}
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="pb-dot w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                <span
                  className="text-white text-[10.5px] font-semibold uppercase tracking-widest"
                  style={{ letterSpacing: "0.09em" }}
                >
                  Live Deal
                </span>
                <Zap
                  className="pb-zap w-3 h-3 text-yellow-300"
                  strokeWidth={0}
                  fill="#fde047"
                />
              </div>

              {/* Countdown */}
              <div className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-white/70" strokeWidth={2} />
                <div className="flex items-center gap-0.5">
                  <Pad v={time.h} />
                  <span className="text-white/70 text-[11px] font-bold">:</span>
                  <Pad v={time.m} />
                  <span className="text-white/70 text-[11px] font-bold">:</span>
                  <Pad v={time.s} />
                </div>
              </div>
            </div>

            {/* Middle — headline */}
            <div>
              <div className="pb-tag flex items-center gap-1.5 mb-1">
                <Tag className="w-3 h-3 text-orange-300" strokeWidth={2.5} />
                <span
                  className="text-orange-300 text-[11px] font-semibold uppercase tracking-wide"
                  style={{ letterSpacing: "0.07em" }}
                >
                  Today Only
                </span>
              </div>

              <h3
                className="text-white leading-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                20% Off on all
                <br />
                <span
                  style={{
                    background: "linear-gradient(90deg,#fde68a,#fb923c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Dairy Products
                </span>
              </h3>
            </div>

            {/* Bottom row — code + CTA */}
            <div className="flex items-center justify-between gap-2">
              {/* Copy code pill */}
              <button
                className="pb-code-btn flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(8px)",
                  border: "1px dashed rgba(255,255,255,0.4)",
                }}
                onClick={copyCode}
              >
                <span
                  className="text-white text-[12.5px] font-bold tracking-widest"
                  style={{
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  DAIRY20
                </span>
                <span className="pb-copy" key={String(copied)}>
                  {copied ? (
                    <CheckCheck
                      className="w-3.5 h-3.5 text-green-300"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Copy
                      className="w-3.5 h-3.5 text-white/70"
                      strokeWidth={2}
                    />
                  )}
                </span>
              </button>

              {/* Shop Now CTA */}
              <button
                className="pb-cta-btn flex items-center gap-1 rounded-xl px-4 py-2"
                style={{
                  background: "linear-gradient(135deg,#f97316,#fb923c)",
                  boxShadow: "0 4px 16px rgba(249,115,22,0.45)",
                }}
              >
                <span
                  className="text-white text-[12.5px] font-semibold"
                  style={{ fontFamily: "'DM Sans',sans-serif" }}
                >
                  Shop Now
                </span>
                <ChevronRight
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
