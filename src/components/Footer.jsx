"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Building2,
  Leaf,
  Phone,
  ArrowUpRight,
  Instagram,
  Twitter,
  Facebook,
  MapPin,
  Mail,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const SHOP_LINKS = [
  { label: "Milk & Cream", href: "/category/milk" },
  { label: "Butter & Ghee", href: "/category/butter" },
  { label: "Cheese", href: "/category/cheese" },
  { label: "Yogurt & Curd", href: "/category/yogurt" },
  { label: "Eggs", href: "/category/eggs" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Farms", href: "/farms" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const SOCIALS = [
  { Icon: Facebook, href: "#", color: "#4267B2", label: "Facebook" },
  { Icon: Twitter, href: "#", color: "#1DA1F2", label: "Twitter" },
  { Icon: Instagram, href: "#", color: "#E1306C", label: "Instagram" },
];

const LEGAL = ["Privacy Policy", "Terms of Service", "Refund Policy"];

function AccordionSection({ icon: Icon, title, links, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3.5"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: `${color}28` }}
          >
            <Icon style={{ width: 14, height: 14, color }} strokeWidth={2.2} />
          </div>
          <span
            className="text-[13px] font-bold uppercase tracking-widest text-white/90"
            style={{
              letterSpacing: "0.09em",
              fontFamily: "'Bricolage Grotesque',sans-serif",
            }}
          >
            {title}
          </span>
        </div>
        <ChevronDown
          style={{
            width: 16,
            height: 16,
            color: "rgba(255,255,255,0.4)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s cubic-bezier(.22,1,.36,1)",
          }}
          strokeWidth={2.5}
        />
      </button>

      <div
        style={{
          maxHeight: open ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div className="px-4 pb-4 pt-1 space-y-2.5">
          {links.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="flex items-center justify-between group"
            >
              <span className="text-[13px] text-white/55 group-hover:text-white transition-colors font-medium">
                {link.label}
              </span>
              <ArrowUpRight
                style={{
                  width: 12,
                  height: 12,
                  color: "rgba(255,255,255,0.25)",
                }}
                strokeWidth={2}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .ft-root { font-family: 'DM Sans', sans-serif; }

        @keyframes ftSlideIn  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ftPop      { 0%{opacity:0;transform:scale(0.8)} 65%{transform:scale(1.07)} 100%{opacity:1;transform:scale(1)} }
        @keyframes ftHeartBeat{ 0%,100%{transform:scale(1)} 14%{transform:scale(1.3)} 28%{transform:scale(1)} 42%{transform:scale(1.3)} 70%{transform:scale(1)} }
        @keyframes ftGlow     { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        @keyframes ftShimmer  { from{background-position:-200% center} to{background-position:200% center} }

        .ft-in-0  { animation: ftSlideIn 0.5s cubic-bezier(.22,1,.36,1) both 0.05s }
        .ft-in-1  { animation: ftSlideIn 0.5s cubic-bezier(.22,1,.36,1) both 0.12s }
        .ft-in-2  { animation: ftSlideIn 0.5s cubic-bezier(.22,1,.36,1) both 0.19s }
        .ft-in-3  { animation: ftSlideIn 0.5s cubic-bezier(.22,1,.36,1) both 0.26s }
        .ft-in-4  { animation: ftSlideIn 0.5s cubic-bezier(.22,1,.36,1) both 0.33s }
        .ft-in-5  { animation: ftSlideIn 0.5s cubic-bezier(.22,1,.36,1) both 0.40s }

        .ft-social { transition: transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.18s; }
        .ft-social:active { transform: scale(0.88) !important; }
        .ft-social:hover  { transform: scale(1.1) translateY(-2px); }

        .ft-heart { animation: ftHeartBeat 2.4s ease-in-out infinite; }
        .ft-glow  { animation: ftGlow 2.5s ease-in-out infinite; }

        .ft-pop-0 { animation: ftPop 0.42s cubic-bezier(.22,1,.36,1) both 0.35s }
        .ft-pop-1 { animation: ftPop 0.42s cubic-bezier(.22,1,.36,1) both 0.43s }
        .ft-pop-2 { animation: ftPop 0.42s cubic-bezier(.22,1,.36,1) both 0.51s }

        .ft-brand-text {
          background: linear-gradient(90deg, #f5c842, #fb923c, #f5c842);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ftShimmer 3s linear infinite;
        }
        .ft-legal-link { transition: color 0.15s; }
        .ft-legal-link:active { transform: scale(0.95); }
      `}</style>

      <footer
        className="ft-root relative overflow-hidden"
        style={{
          background:
            "linear-gradient(170deg, #0f1f3d 0%, #1a3a6e 50%, #0c1a38 100%)",
        }}
      >
        {/* Glow blobs */}
        <div
          className="ft-glow absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(245,200,66,0.12) 0%, transparent 70%)",
            transform: "translate(-40%,-40%)",
          }}
        />
        <div
          className="ft-glow absolute bottom-0 right-0 w-56 h-56 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            transform: "translate(30%,30%)",
            animationDelay: "1.2s",
          }}
        />

        {/* Wave */}
        <div className="w-full overflow-hidden leading-none -mt-px">
          <svg
            viewBox="0 0 390 48"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: 40, display: "block", fill: "#f8faff" }}
          >
            <path d="M0,32 C80,52 160,12 240,32 C300,48 350,16 390,28 L390,0 L0,0 Z" />
          </svg>
        </div>

        <div className="px-4 pt-4 pb-8 space-y-5 relative z-10">
          {/* ── Brand Block ── */}
          <div
            className="ft-in-0 flex flex-col items-center text-center gap-3 py-4 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Image
              src="/img/logo1.png"
              alt="MoodFresh"
              width={130}
              height={46}
              className="object-contain"
            />
            <p className="text-white/55 text-[13px] leading-relaxed max-w-[260px]">
              Pure, natural dairy — straight from happy farms to your doorstep.
            </p>

            {/* Contact pills */}
            <div className="flex gap-2 flex-wrap justify-center">
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <MapPin
                  style={{ width: 12, height: 12, color: "#f5c842" }}
                  strokeWidth={2.5}
                />
                <span className="text-white/60 text-[11px] font-medium">
                  Noida, India
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Mail
                  style={{ width: 12, height: 12, color: "#f5c842" }}
                  strokeWidth={2.5}
                />
                <span className="text-white/60 text-[11px] font-medium">
                  hello@moodfresh.in
                </span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              {SOCIALS.map(({ Icon, href, color, label }, i) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`ft-social ft-pop-${i} w-10 h-10 rounded-2xl flex items-center justify-center`}
                  style={{
                    background: `${color}22`,
                    border: `1.5px solid ${color}44`,
                    boxShadow: `0 4px 14px ${color}22`,
                  }}
                >
                  <Icon
                    style={{ width: 16, height: 16, color }}
                    strokeWidth={2}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ── Accordion nav ── */}
          <div className="ft-in-1 space-y-2.5">
            <AccordionSection
              icon={ShoppingBag}
              title="Shop"
              links={SHOP_LINKS}
              color="#f5c842"
            />
            <AccordionSection
              icon={Building2}
              title="Company"
              links={COMPANY_LINKS}
              color="#60a5fa"
            />
          </div>

          {/* ── App store badges (placeholder buttons) ── */}

          {/* ── Legal strip ── */}
          <div className="ft-in-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 pt-1">
            {LEGAL.map((l) => (
              <Link
                key={l}
                href="#"
                className="ft-legal-link text-[11px] text-white/30 hover:text-white/60"
              >
                {l}
              </Link>
            ))}
          </div>

          {/* ── Copyright ── */}
          <div className="ft-in-4 text-center">
            <p className="text-white/30 text-[11.5px] leading-relaxed">
              © 2025 <span className="ft-brand-text font-bold">MoodFresh</span>.
              All rights reserved.
            </p>
            <p className="text-white/25 text-[11px] mt-1 flex items-center justify-center gap-1">
              Made with{" "}
              <Heart
                className="ft-heart inline-block"
                style={{
                  width: 11,
                  height: 11,
                  color: "#fb7185",
                  fill: "#fb7185",
                }}
                strokeWidth={0}
              />{" "}
              & 🧀 in India
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
