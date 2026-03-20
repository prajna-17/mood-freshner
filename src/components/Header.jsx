"use client";

import Image from "next/image";
import { ShoppingCart, Bell, User, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [bellShake, setBellShake] = useState(false);
  const [time, setTime] = useState("");

  // Shrink on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-trigger bell shake every 8s
  useEffect(() => {
    const t = setInterval(() => {
      setBellShake(true);
      setTimeout(() => setBellShake(false), 700);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  function handleCartClick() {
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .hdr-root { font-family: 'DM Sans', sans-serif; }

        @keyframes hdrSlideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes hdrLogoPop   { 0%{opacity:0;transform:scale(0.8)} 65%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes hdrCartBump  { 0%{transform:scale(1)} 35%{transform:scale(1.3) rotate(-12deg)} 65%{transform:scale(0.95) rotate(4deg)} 100%{transform:scale(1) rotate(0)} }
        @keyframes hdrBellShake { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-18deg)} 40%{transform:rotate(18deg)} 60%{transform:rotate(-10deg)} 80%{transform:rotate(10deg)} }
        @keyframes hdrBadgePop  { 0%{transform:scale(0)} 65%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes hdrDotPing   { 0%{transform:scale(1);opacity:0.7} 70%{transform:scale(2);opacity:0} 100%{} }
        @keyframes hdrShimmer   { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes hdrIconIn    { 0%{opacity:0;transform:scale(0.6)} 65%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }

        .hdr-slide     { animation: hdrSlideDown 0.55s cubic-bezier(.22,1,.36,1) both; }
        .hdr-logo      { animation: hdrLogoPop   0.6s  cubic-bezier(.22,1,.36,1) both 0.15s; }
        .hdr-icon-0    { animation: hdrIconIn    0.45s cubic-bezier(.22,1,.36,1) both 0.28s; }
        .hdr-icon-1    { animation: hdrIconIn    0.45s cubic-bezier(.22,1,.36,1) both 0.36s; }
        .hdr-icon-2    { animation: hdrIconIn    0.45s cubic-bezier(.22,1,.36,1) both 0.44s; }
        .hdr-badge     { animation: hdrBadgePop  0.4s  cubic-bezier(.22,1,.36,1) both 0.7s; }
        .hdr-cart-bump { animation: hdrCartBump  0.38s cubic-bezier(.22,1,.36,1); }
        .hdr-bell-shake{ animation: hdrBellShake 0.6s  cubic-bezier(.22,1,.36,1); }
        .hdr-dot-ping  { animation: hdrDotPing   1.8s  ease-in-out infinite; }

        .hdr-icon-btn { transition: transform 0.17s cubic-bezier(.22,1,.36,1); }
        .hdr-icon-btn:active { transform: scale(0.85) !important; }

        .hdr-status {
          background: linear-gradient(90deg,#f5c842,#fb923c,#f5c842);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: hdrShimmer 2.8s linear infinite;
        }
      `}</style>

      <header
        className="hdr-root hdr-slide sticky top-0 z-50 w-full"
        style={{
          background: scrolled
            ? "rgba(12,26,76,0.97)"
            : "linear-gradient(135deg, #0c1a4c 0%, #1a3a8a 50%, #0e2260 100%)",
          backdropFilter: "blur(16px)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.3)"
            : "0 2px 16px rgba(12,26,76,0.4)",
          transition: "background 0.3s, box-shadow 0.3s",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        {/* Subtle top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(245,200,66,0.6),transparent)",
          }}
        />

        {/* Glow blob */}
        <div
          className="absolute top-0 left-1/2 w-40 h-16 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)",
            transform: "translateX(-50%) translateY(-30%)",
          }}
        />

        <div
          className="relative flex items-center justify-center px-4"
          style={{
            height: scrolled ? 52 : 60,
            transition: "height 0.3s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* ── Left: Logo ── */}
          <div className="hdr-logo">
            <Image
              src="/img/logo1.png"
              alt="MoodFresh"
              width={scrolled ? 120 : 140}
              height={scrolled ? 34 : 38}
              className="object-contain"
              style={{ transition: "width 0.3s, height 0.3s" }}
              priority
            />
          </div>

          {/* ── Right: Icons ── */}
        </div>
        {/* Bottom border glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(245,200,66,0.35),rgba(59,130,246,0.25),transparent)",
          }}
        />
      </header>
    </>
  );
}
