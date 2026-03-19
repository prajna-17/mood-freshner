"use client";

import Image from "next/image";
import {
  Leaf,
  ShieldCheck,
  Recycle,
  Play,
  ChevronRight,
  Star,
  Heart,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// const STATS = [
//   { value: "500+", label: "Happy Farms" },
//   { value: "50K+", label: "Customers" },
//   { value: "100%", label: "Natural" },
// ];

export default function OurStory() {
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
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
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .os-root { font-family: 'DM Sans', sans-serif; }

        @keyframes osIn      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes osFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes osImgPop  { 0%{opacity:0;transform:scale(0.88)} 65%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
        @keyframes osShine   { from{transform:translateX(-100%) skewX(-12deg)} to{transform:translateX(260%) skewX(-12deg)} }
        @keyframes osPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes osLeaf    { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(10deg)} }
        @keyframes osCountUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes osPing    { 0%{transform:scale(1);opacity:0.7} 70%{transform:scale(2.2);opacity:0} 100%{} }
        @keyframes osHeartPop{ 0%{transform:scale(1)} 40%{transform:scale(1.4)} 100%{transform:scale(1)} }

        .os-section-in  { animation: osIn 0.6s cubic-bezier(.22,1,.36,1) both; }
        .os-img-pop     { animation: osImgPop 0.65s cubic-bezier(.22,1,.36,1) both 0.1s; }
        .os-title-in    { animation: osIn 0.55s cubic-bezier(.22,1,.36,1) both 0.05s; }
        .os-sub-in      { animation: osIn 0.55s cubic-bezier(.22,1,.36,1) both 0.12s; }
        .os-desc-in     { animation: osIn 0.55s cubic-bezier(.22,1,.36,1) both 0.2s; }
        .os-badge-0     { animation: osIn 0.5s cubic-bezier(.22,1,.36,1) both 0.26s; }
        .os-badge-1     { animation: osIn 0.5s cubic-bezier(.22,1,.36,1) both 0.34s; }
        .os-stat-0      { animation: osCountUp 0.5s cubic-bezier(.22,1,.36,1) both 0.22s; }
        .os-stat-1      { animation: osCountUp 0.5s cubic-bezier(.22,1,.36,1) both 0.3s; }
        .os-stat-2      { animation: osCountUp 0.5s cubic-bezier(.22,1,.36,1) both 0.38s; }
        .os-video-in    { animation: osIn 0.6s cubic-bezier(.22,1,.36,1) both 0.42s; }

        .os-shine::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(105deg,transparent 36%,rgba(255,255,255,0.28) 50%,transparent 64%);
          animation: osShine 2.8s cubic-bezier(.22,1,.36,1) infinite; animation-delay:1s;
          border-radius:inherit; pointer-events:none;
        }
        .os-leaf  { animation: osLeaf 2.5s ease-in-out infinite; }
        .os-pulse { animation: osPulse 1.8s ease-in-out infinite; }
        .os-ping  { animation: osPing 1.7s ease-in-out infinite; }
        .os-heart-pop { animation: osHeartPop 0.35s cubic-bezier(.22,1,.36,1); }

        .os-play-btn { transition: transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.18s; }
        .os-play-btn:active { transform: scale(0.88); }
        .os-badge-btn { transition: transform 0.16s cubic-bezier(.22,1,.36,1), box-shadow 0.16s; }
        .os-badge-btn:active { transform: scale(0.93); }
        .os-like-btn { transition: transform 0.16s; }
        .os-like-btn:active { transform: scale(0.88); }
      `}</style>

      <div className="os-root px-4 mt-8 pb-2" ref={ref}>
        {visible && (
          <div className="space-y-5">
            {/* ── Header ── */}
            <div className="os-title-in text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles
                  className="w-3.5 h-3.5 text-green-500"
                  strokeWidth={2.5}
                />
                <span
                  className="text-[10.5px] font-bold uppercase tracking-widest text-green-600"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Who We Are
                </span>
              </div>
              <h2
                className="text-[24px] font-extrabold text-gray-900 leading-tight"
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Our Story
              </h2>
            </div>

            {/* ── Hero Image ── */}
            <div className="os-img-pop flex justify-center">
              <div
                className="relative rounded-3xl overflow-hidden p-5"
                style={{
                  background:
                    "linear-gradient(135deg,#f0fdf4 0%,#ecfeff 50%,#eff6ff 100%)",
                  boxShadow:
                    "0 8px 32px rgba(34,197,94,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                  border: "1.5px solid rgba(34,197,94,0.15)",
                }}
              >
                {/* Leaf accent */}
                <div className="absolute top-3 right-3">
                  <Leaf
                    className="os-leaf w-5 h-5 text-green-400"
                    strokeWidth={2}
                  />
                </div>

                <Image
                  src="/img/wooden1.png"
                  alt="Story"
                  width={200}
                  height={200}
                  className="object-contain relative z-10"
                />
              </div>
            </div>

            {/* ── Stats Row ── */}
            {/* <div className="flex justify-center gap-3">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`os-stat-${i} flex flex-col items-center px-4 py-2.5 rounded-2xl`}
                  style={{
                    background: "#f8faff",
                    border: "1.5px solid #e0e7ff",
                    minWidth: 76,
                  }}
                >
                  <span
                    className="font-extrabold text-[17px] text-blue-700 leading-tight"
                    style={{ fontFamily: "'Bricolage Grotesque',sans-serif" }}
                  >
                    {s.value}
                  </span>
                  <span className="text-[10.5px] text-gray-500 font-medium mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </div> */}

            {/* ── Subtitle + Description ── */}
            <div className="os-sub-in text-center space-y-2">
              <h3
                className="text-[17px] font-bold leading-snug"
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.01em",
                }}
              >
                Straight From Happy Farms
              </h3>
            </div>

            <p className="os-desc-in text-gray-500 text-[13.5px] leading-relaxed text-center px-2">
              We partner with local farmers who love their animals and their
              land. Every drop of milk travels from farm to your door within{" "}
              <span className="text-gray-800 font-semibold">24 hours</span>,
              keeping all the natural goodness intact — no preservatives, no
              shortcuts.
            </p>

            {/* ── Trust Badges ── */}
            <div className="flex gap-3 justify-center flex-wrap">
              {[
                {
                  img: "/img/checkmark.png",
                  label: "FSSAI Certified",
                  icon: ShieldCheck,
                  color: "#2563eb",
                  bg: "#eff6ff",
                  border: "#bfdbfe",
                  cls: "os-badge-0",
                },
                {
                  img: "/img/sustainable.png",
                  label: "Eco Packaging",
                  icon: Recycle,
                  color: "#16a34a",
                  bg: "#f0fdf4",
                  border: "#bbf7d0",
                  cls: "os-badge-1",
                },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className={`${b.cls} os-badge-btn flex items-center gap-2 rounded-2xl px-4 py-2.5`}
                    style={{
                      background: b.bg,
                      border: `1.5px solid ${b.border}`,
                      boxShadow: `0 2px 10px ${b.color}18`,
                    }}
                  >
                    <div className="relative w-5 h-5 flex-shrink-0">
                      <Image
                        src={b.img}
                        alt={b.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span
                      className="text-[12.5px] font-semibold"
                      style={{
                        color: b.color,
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── Video / Factory Banner ── */}
            <div
              className="os-video-in os-shine relative w-full rounded-3xl overflow-hidden"
              style={{
                height: 210,
                boxShadow:
                  "0 10px 36px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Image */}
              <Image
                src="/img/factory.jpeg"
                alt="Farm Video"
                fill
                className="object-cover"
                style={{ transform: "scale(1.04)" }}
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg,rgba(0,0,0,0.12) 0%,rgba(10,20,60,0.72) 100%)",
                }}
              />

              {/* Like button */}
              {/* <button
                className={`os-like-btn absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center ${liked ? "os-heart-pop" : ""}`}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
                onClick={() => setLiked((v) => !v)}
              > */}
              {/* <Heart
                  style={{
                    width: 15,
                    height: 15,
                    color: liked ? "#fb7185" : "#fff",
                    fill: liked ? "#fb7185" : "transparent",
                    transition: "fill 0.2s, color 0.2s",
                  }}
                  strokeWidth={2}
                /> */}
              {/* </button> */}

              {/* Stars top-left */}
              {/* <div className="absolute top-3.5 left-3.5 flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Star
                  style={{
                    width: 11,
                    height: 11,
                    fill: "#fde047",
                    color: "#fde047",
                  }}
                  strokeWidth={0}
                /> */}
              {/* <span className="text-white text-[11px] font-semibold">
                  Farm Fresh
                </span> */}
              {/* </div> */}

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <p
                  className="text-white text-center leading-snug px-6"
                  style={{
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                  }}
                >
                  Discover the taste of
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(90deg,#fde68a,#fb923c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    milky-rich goodness
                  </span>
                </p>

                {/* Play button */}
                <button
                  className="os-play-btn relative flex items-center justify-center"
                  onClick={() => setPlaying((v) => !v)}
                  style={{ width: 54, height: 54 }}
                >
                  {/* Ping ring */}
                  {!playing && (
                    <span
                      className="os-ping absolute inset-0 rounded-full"
                      style={{ background: "rgba(255,255,255,0.35)" }}
                    />
                  )}
                  <div
                    className="os-pulse relative w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      background: playing
                        ? "linear-gradient(135deg,#f97316,#fb923c)"
                        : "rgba(255,255,255,0.92)",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
                    }}
                  >
                    <Image
                      src="/img/play.png"
                      alt="Play"
                      width={22}
                      height={22}
                      className="object-contain"
                      style={{
                        marginLeft: 2,
                        filter: playing ? "brightness(10)" : "none",
                      }}
                    />
                  </div>
                </button>
              </div>

              {/* Bottom bar */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2.5"
                style={{
                  background: "rgba(0,0,0,0.28)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span className="text-white/80 text-[11px] font-medium">
                  Watch our farm story
                </span>
                <div className="flex items-center gap-1 text-white/70 text-[11px]">
                  <span>2:34</span>
                  <ChevronRight
                    style={{ width: 12, height: 12 }}
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
