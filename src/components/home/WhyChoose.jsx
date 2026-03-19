"use client";

import {
  Gem,
  Wheat,
  Truck,
  ShieldCheck,
  Leaf,
  Clock,
  Star,
  ArrowRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

//

const TRUST = [
  { icon: ShieldCheck, label: "FSSAI Certified", color: "#2563eb" },
  { icon: Leaf, label: "Eco Packaging", color: "#16a34a" },
  { icon: Clock, label: "30-Min Delivery", color: "#f97316" },
  { icon: Star, label: "4.9 ★ Rated", color: "#eab308" },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
  bg,
  border,
  glow,
  index,
  visible,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`rw-card rw-card-${index}`}
      style={{
        animationDelay: `${0.08 + index * 0.1}s`,
        opacity: visible ? undefined : 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-3xl p-4 flex flex-col items-center text-center gap-3 overflow-hidden"
        style={{
          background: bg,
          border: `1.5px solid ${border}`,
          boxShadow: hovered
            ? `0 8px 28px ${glow}, 0 2px 8px rgba(0,0,0,0.07)`
            : `0 3px 14px ${glow}, 0 1px 4px rgba(0,0,0,0.04)`,
          transform: hovered
            ? "translateY(-3px) scale(1.03)"
            : "translateY(0) scale(1)",
          transition:
            "transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s",
        }}
      >
        {/* Shine sweep */}
        <div className="rw-shine absolute inset-0 rounded-3xl pointer-events-none" />

        {/* Icon ring */}
        <div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${color}18`,
            boxShadow: `0 4px 16px ${color}28`,
            border: `1.5px solid ${color}22`,
          }}
        >
          <Icon
            className={hovered ? "rw-icon-bounce" : ""}
            style={{ width: 26, height: 26, color }}
            strokeWidth={1.8}
          />
        </div>

        {/* Text */}
        <div>
          <p
            className="font-extrabold text-[14px] text-gray-900 leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </p>
          <p className="text-[11px] text-gray-500 mt-1 leading-snug">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function WhyChoose() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .rw-root { font-family:'DM Sans',sans-serif; }

        @keyframes rwSlideIn  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rwCardIn   { 0%{opacity:0;transform:translateY(18px) scale(0.92)} 65%{transform:scale(1.04)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes rwIconBounce{ 0%{transform:translateY(0) rotate(0)} 30%{transform:translateY(-7px) rotate(-8deg)} 60%{transform:translateY(-2px) rotate(4deg)} 100%{transform:translateY(0) rotate(0)} }
        @keyframes rwShine    { from{transform:translateX(-100%) skewX(-12deg)} to{transform:translateX(260%) skewX(-12deg)} }
        @keyframes rwTrustIn  { 0%{opacity:0;transform:scale(0.8)} 65%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes rwGradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .rw-header  { animation: rwSlideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        .rw-card    { animation: rwCardIn  0.5s cubic-bezier(.22,1,.36,1) both; }
        .rw-card-0  { animation-delay:0.08s }
        .rw-card-1  { animation-delay:0.18s }
        .rw-card-2  { animation-delay:0.28s }
        .rw-icon-bounce { animation: rwIconBounce 0.55s cubic-bezier(.22,1,.36,1); }
        .rw-shine::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,0.45) 50%,transparent 64%);
          animation: rwShine 3.2s cubic-bezier(.22,1,.36,1) infinite; animation-delay:0.8s;
          border-radius:inherit;
        }
        .rw-trust-0 { animation: rwTrustIn 0.4s cubic-bezier(.22,1,.36,1) both 0.32s }
        .rw-trust-1 { animation: rwTrustIn 0.4s cubic-bezier(.22,1,.36,1) both 0.40s }
        .rw-trust-2 { animation: rwTrustIn 0.4s cubic-bezier(.22,1,.36,1) both 0.48s }
        .rw-trust-3 { animation: rwTrustIn 0.4s cubic-bezier(.22,1,.36,1) both 0.56s }
        .rw-cta-btn { transition: transform 0.17s cubic-bezier(.22,1,.36,1), box-shadow 0.17s; }
        .rw-cta-btn:active { transform: scale(0.93); }
        .rw-grad-text {
          background: linear-gradient(90deg,#1d4ed8,#0ea5e9,#1d4ed8);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rwGradMove 3s linear infinite;
        }
      `}</style>

      <div className="rw-root px-4 mt-10 space-y-5" ref={ref}>
        {/* ── Header ── */}
        <div className={`rw-header text-center ${visible ? "" : "opacity-0"}`}>
          <p
            className="text-[10.5px] font-bold uppercase tracking-widest text-orange-500 mb-1"
            style={{ letterSpacing: "0.1em" }}
          >
            Our Promise
          </p>
          <h2
            className="text-[23px] font-extrabold leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Why Choose <span className="rw-grad-text">Mood Fresh?</span>
          </h2>
          <p className="text-gray-500 text-[12.5px] mt-1.5">
            Quality you can taste. Trust you can count on.
          </p>
        </div>

        {/* ── Feature Cards ── */}
        {/* {visible && (
          <div className="grid grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} visible={visible} />
            ))}
          </div>
        )} */}

        {/* ── Trust strip ── */}
        {visible && (
          <div
            className="rounded-3xl px-4 py-3.5 flex items-center justify-between gap-2"
            style={{
              background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
              boxShadow: "0 8px 28px rgba(15,23,42,0.28)",
            }}
          >
            {TRUST.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.label}
                  className={`rw-trust-${i} flex flex-col items-center gap-1`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${t.color}28`,
                      border: `1px solid ${t.color}44`,
                    }}
                  >
                    <Icon
                      style={{ width: 16, height: 16, color: t.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <span
                    className="text-[9.5px] font-semibold text-white/70 text-center leading-tight"
                    style={{ maxWidth: 52 }}
                  >
                    {t.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CTA ── */}
        {visible && (
          <button
            className="rw-cta-btn w-full flex items-center justify-center gap-2 rounded-2xl py-3.5"
            style={{
              background: "linear-gradient(135deg,#f97316,#fb923c)",
              boxShadow: "0 6px 22px rgba(249,115,22,0.38)",
            }}
          >
            <Gem
              style={{ width: 15, height: 15, color: "#fff" }}
              strokeWidth={2}
            />
            <span
              className="text-white font-bold text-[14px]"
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              Shop Mood Fresh
            </span>
            <ArrowRight
              style={{ width: 14, height: 14, color: "rgba(255,255,255,0.8)" }}
              strokeWidth={2.5}
            />
          </button>
        )}
      </div>
    </>
  );
}
