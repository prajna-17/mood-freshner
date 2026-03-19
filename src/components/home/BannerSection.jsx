"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Tag } from "lucide-react";

const OFFERS = [
  { src: "/img/b1.png" },
  { src: "/img/b2.png" },
  { src: "/img/b3.png" },
];

export default function BannerSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroPop, setHeroPop] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll offers every 3.5s
  useEffect(() => {
    const t = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % OFFERS.length;
        scrollRef.current?.children[next]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
        return next;
      });
    }, 3500);
    return () => clearInterval(t);
  }, []);

  // Track manual scroll to update dots
  function onScroll() {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const idx = Math.round(
      (el.scrollLeft / el.offsetWidth) * (OFFERS.length / 0.78),
    );
    setActiveSlide(Math.min(Math.max(idx, 0), OFFERS.length - 1));
  }

  function goTo(dir) {
    const next = (activeSlide + dir + OFFERS.length) % OFFERS.length;
    scrollRef.current?.children[next]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setActiveSlide(next);
  }

  // Hero pop on mount
  useEffect(() => {
    setHeroPop(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .bs-root { font-family:'DM Sans',sans-serif; }

        @keyframes bsHeroPop  { 0%{opacity:0;transform:scale(0.95) translateY(10px)} 65%{transform:scale(1.02)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes bsSlideIn  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bsShine    { from{transform:translateX(-100%) skewX(-12deg)} to{transform:translateX(260%) skewX(-12deg)} }
        @keyframes bsDotIn    { 0%{transform:scale(0)} 65%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes bsArrowPop { 0%{transform:scale(1)} 40%{transform:scale(1.22)} 100%{transform:scale(1)} }
        @keyframes bsLabelIn  { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }

        .bs-hero    { animation: bsHeroPop 0.6s cubic-bezier(.22,1,.36,1) both 0.05s; }
        .bs-slider  { animation: bsSlideIn 0.55s cubic-bezier(.22,1,.36,1) both 0.2s; }
        .bs-header  { animation: bsSlideIn 0.5s  cubic-bezier(.22,1,.36,1) both 0.15s; }

        .bs-shine::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,0.22) 50%,transparent 64%);
          animation: bsShine 3s cubic-bezier(.22,1,.36,1) infinite; animation-delay:1s;
          border-radius:inherit; pointer-events:none;
        }

        .bs-dot { animation: bsDotIn 0.35s cubic-bezier(.22,1,.36,1) both; }
        .bs-arrow { transition: transform 0.17s cubic-bezier(.22,1,.36,1), box-shadow 0.17s; }
        .bs-arrow:active { animation: bsArrowPop 0.25s cubic-bezier(.22,1,.36,1); }
        .bs-label { animation: bsLabelIn 0.4s cubic-bezier(.22,1,.36,1) both 0.3s; }

        .bs-slide-item { scroll-snap-align: center; }
        .bs-scroll     { scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
      `}</style>

      <div className="bs-root px-4 space-y-5 mt-8">
        {/* ── Section label ── */}
        <div className="bs-header flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" strokeWidth={2.5} />
          <span
            className="text-[10.5px] font-bold uppercase tracking-widest text-orange-500"
            style={{ letterSpacing: "0.1em" }}
          >
            Featured
          </span>
        </div>

        {/* ── Hero Banner ── */}
        <div
          className={`bs-hero bs-shine relative w-full rounded-3xl overflow-hidden ${heroPop ? "" : "opacity-0"}`}
          style={{
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Image
            src="/img/b4.png"
            alt="Main Banner"
            width={800}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
          {/* Bottom gradient overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.28), transparent)",
            }}
          />
          {/* Badge */}
          <div
            className="bs-label absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <Tag
              style={{ width: 11, height: 11, color: "#fff" }}
              strokeWidth={2.5}
            />
            <span
              className="text-white text-[11px] font-semibold"
              style={{ fontFamily: "'DM Sans',sans-serif" }}
            >
              Exclusive Deals
            </span>
          </div>
        </div>

        {/* ── Offers Slider ── */}
      </div>
    </>
  );
}
