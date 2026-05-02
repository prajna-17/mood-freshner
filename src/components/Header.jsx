"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Bell, User, Wifi, Download, Menu, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const [bellShake, setBellShake] = useState(false);
  const [time, setTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { install, isInstallable, isInstalled } = usePWAInstall();
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
          {/* ── Left: Menu Icon ── */}
          <div className="absolute left-4 flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="hdr-icon-btn text-white p-1 -ml-1"
              title="Open Menu"
            >
              <Menu size={26} />
            </button>
          </div>

          {/* ── Center: Logo ── */}
          <div className="hdr-logo">
            <Image
              src="/img/logo7.png"
              alt="MoodFresh"
              width={scrolled ? 120 : 140}
              height={scrolled ? 34 : 38}
              className="object-contain"
              style={{ transition: "width 0.3s, height 0.3s" }}
              priority
            />
          </div>
          {/* ── Right: Icons ── */}
          <div className="absolute right-4 flex items-center gap-3">
            {!isInstalled && (
              <button
                onClick={install}
                className="hdr-icon-btn text-white flex items-center gap-2"
                title="Install App"
              >
               <div className="flex flex-col text-center leading-tight">
                 <span className="text-[10px] sm:text-sm font-medium">Download</span>
                 <span className="text-[10px] sm:text-sm font-medium">our app</span>
               </div>
               <Download size={20} className="w-5 h-5 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>{" "}
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

      {/* ── Mobile Menu Drawer ── */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <span className="text-xl font-bold text-[#0c1a4c]">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="py-4 px-2 overflow-y-auto h-[calc(100%-73px)]">
          {[
            { name: "About Us", href: "/about" },
            { name: "Our Farm", href: "/farm" },
            { name: "Products", href: "/products" },
            { name: "Blogs", href: "/blogs" },
            { name: "Contact Us", href: "/contact" },
            { name: "Feedback", href: "/feedback" },
            { name: "Customer Reviews", href: "/reviews" },
            { name: "Business Opportunity", href: "/business" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors font-medium text-sm mb-1"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
