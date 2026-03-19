"use client";

import {
  MapPin,
  ChevronDown,
  Clock,
  Zap,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { useState } from "react";

const ADDRESSES = [
  { id: 1, label: "Home", address: "A 503, Sector 6, Noida", minutes: "12" },
  {
    id: 2,
    label: "Work",
    address: "B 12, Cyber City, Gurugram",
    minutes: "28",
  },
  {
    id: 3,
    label: "Parents",
    address: "204, DLF Phase 2, Delhi",
    minutes: "35",
  },
];

export default function DeliveryCard() {
  const [selected, setSelected] = useState(ADDRESSES[0]);
  const [open, setOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  function choose(addr) {
    setSelected(addr);
    setOpen(false);
    setAnimKey((k) => k + 1); // re-trigger entrance animation
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bricolage+Grotesque:wght@600;700&display=swap');
        .dc-root { font-family: 'DM Sans', sans-serif; }

        @keyframes dcSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dcDropdown {
          from { opacity: 0; transform: translateY(-6px) scaleY(0.95); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @keyframes dcPing {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(2); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes dcAddressIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .dc-card-anim  { animation: dcSlideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        .dc-dropdown   { animation: dcDropdown 0.22s cubic-bezier(.22,1,.36,1) both; transform-origin: top; }
        .dc-ping       { animation: dcPing 1.6s ease-in-out infinite; }
        .dc-addr-anim  { animation: dcAddressIn 0.3s cubic-bezier(.22,1,.36,1) both; }
        .dc-change-btn { transition: color 0.15s, background 0.15s, transform 0.15s; }
        .dc-change-btn:active { transform: scale(0.93); }
        .dc-row        { transition: background 0.15s; }
        .dc-row:active { background: rgba(255,255,255,0.07) !important; }
        .dc-chevron    { transition: transform 0.25s cubic-bezier(.22,1,.36,1); }
        .dc-chevron.open { transform: rotate(180deg); }
      `}</style>

      <div className="dc-root px-4 mt-6">
        <div className="relative">
          {/* ── Main Card ── */}
          <div
            className="dc-card-anim rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0f2a52 0%, #1a3f7a 50%, #0e2247 100%)",
              boxShadow:
                "0 8px 32px rgba(15,42,82,0.38), 0 2px 8px rgba(0,0,0,0.18)",
            }}
          >
            {/* Decorative top-right glow */}
            <div
              className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />

            {/* Express badge */}
            <div className="flex items-center justify-between px-4 pt-3 pb-0">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
                <Zap
                  className="w-3 h-3 text-yellow-300"
                  fill="#fde047"
                  strokeWidth={0}
                />
                <span
                  className="text-yellow-200 text-[11px] font-semibold tracking-wide uppercase"
                  style={{ letterSpacing: "0.07em" }}
                >
                  Express Delivery
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-300 text-[11px] font-medium">
                <Clock className="w-3 h-3" strokeWidth={2.5} />
                <span>{selected.minutes} mins</span>
              </div>
            </div>

            {/* Main row — tap to open */}
            <button
              className="dc-row w-full flex items-center gap-3 px-4 py-3.5 text-left"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {/* Pin with live ping */}
              <div className="relative flex-shrink-0">
                <span className="dc-ping absolute inset-0 rounded-full bg-blue-400 opacity-60" />
                <div
                  className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)",
                    boxShadow: "0 2px 10px rgba(59,130,246,0.4)",
                  }}
                >
                  <MapPin
                    className="w-4.5 h-4.5 text-white"
                    style={{ width: 18, height: 18 }}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {/* Address text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-blue-200/80 text-[11px] font-medium mb-0.5 uppercase tracking-widest"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Delivering to · {selected.label}
                </p>
                <p
                  key={animKey}
                  className="dc-addr-anim text-white font-semibold text-[14.5px] truncate"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selected.address}
                </p>
              </div>

              {/* Chevron */}
              <ChevronDown
                className={`dc-chevron flex-shrink-0 text-blue-300 ${open ? "open" : ""}`}
                style={{ width: 18, height: 18 }}
                strokeWidth={2.5}
              />
            </button>

            {/* Divider */}
            <div className="mx-4 h-px bg-white/10" />

            {/* Bottom row */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-1.5 text-blue-300/70 text-xs">
                <Navigation className="w-3 h-3" strokeWidth={2} />
                <span>GPS location detected</span>
              </div>
              <button
                className="dc-change-btn text-[12.5px] font-semibold text-orange-400 bg-orange-400/10 hover:bg-orange-400/20 rounded-full px-3 py-1"
                onClick={() => setOpen((v) => !v)}
              >
                Change
              </button>
            </div>
          </div>

          {/* ── Dropdown ── */}
          {open && (
            <div
              className="dc-dropdown absolute left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
              style={{
                background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(16px)",
                boxShadow:
                  "0 16px 48px rgba(15,42,82,0.22), 0 4px 12px rgba(0,0,0,0.1)",
                border: "1.5px solid rgba(219,234,254,0.7)",
              }}
            >
              <p
                className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400 px-4 pt-3 pb-1"
                style={{ letterSpacing: "0.1em" }}
              >
                Saved Addresses
              </p>
              {ADDRESSES.map((addr, i) => (
                <button
                  key={addr.id}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50/80 transition-colors"
                  style={{ borderTop: i > 0 ? "1px solid #f0f4ff" : "none" }}
                  onClick={() => choose(addr)}
                >
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{
                      background:
                        selected.id === addr.id
                          ? "linear-gradient(135deg,#3b82f6,#0ea5e9)"
                          : "#eff6ff",
                    }}
                  >
                    <MapPin
                      style={{
                        width: 16,
                        height: 16,
                        color: selected.id === addr.id ? "#fff" : "#3b82f6",
                      }}
                      strokeWidth={2.2}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-semibold text-gray-800 truncate"
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                      }}
                    >
                      {addr.label}
                    </p>
                    <p className="text-[11.5px] text-gray-500 truncate mt-0.5">
                      {addr.address}
                    </p>
                  </div>

                  {/* Time + check */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[11px] text-blue-500 font-medium bg-blue-50 rounded-full px-2 py-0.5">
                      {addr.minutes} min
                    </span>
                    {selected.id === addr.id && (
                      <CheckCircle2
                        style={{ width: 16, height: 16, color: "#22c55e" }}
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                </button>
              ))}

              {/* Add new */}
              <div className="px-4 py-3 border-t border-blue-50">
                <button className="w-full flex items-center justify-center gap-2 text-[12.5px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl py-2.5 transition-colors">
                  <Navigation className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Add new address
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
