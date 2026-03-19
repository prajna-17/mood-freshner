"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Settings, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Cart", href: "/cart", icon: ShoppingCart, badge: 3 },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .bn-root { font-family: 'DM Sans', sans-serif; }

        @keyframes bnSlideUp  { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes bnActivePop{ 0%{transform:translateY(0) scale(1)} 40%{transform:translateY(-6px) scale(1.18)} 100%{transform:translateY(-4px) scale(1)} }
        @keyframes bnBadgePop { 0%{transform:scale(0)} 65%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes bnLabelIn  { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bnPillIn   { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }

        .bn-wrap     { animation: bnSlideUp 0.5s cubic-bezier(.22,1,.36,1) both 0.1s; }
        .bn-active-icon { animation: bnActivePop 0.38s cubic-bezier(.22,1,.36,1) forwards; }
        .bn-badge    { animation: bnBadgePop 0.35s cubic-bezier(.22,1,.36,1) both; }
        .bn-label-in { animation: bnLabelIn  0.25s cubic-bezier(.22,1,.36,1) both; }
        .bn-pill-in  { animation: bnPillIn   0.3s  cubic-bezier(.22,1,.36,1) both; transform-origin: center; }

        .bn-btn { transition: transform 0.16s cubic-bezier(.22,1,.36,1); -webkit-tap-highlight-color: transparent; }
        .bn-btn:active { transform: scale(0.88); }
      `}</style>

      {/* Spacer so page content isn't hidden behind nav */}
      <div style={{ height: 72 }} />

      <nav
        className="bn-root bn-wrap fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.09)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-end justify-around px-2 pt-2 pb-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon, badge }) => {
            const active = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className="bn-btn flex flex-col items-center justify-end gap-0.5 flex-1 py-1 relative"
                aria-label={label}
              >
                {/* Active pill indicator */}
                {active && (
                  <span
                    className="bn-pill-in absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-6 rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                    }}
                  />
                )}

                {/* Icon container */}
                <div
                  className={`relative flex items-center justify-center rounded-2xl ${active ? "bn-active-icon" : ""}`}
                  style={{
                    width: 44,
                    height: 44,
                    background: active
                      ? "linear-gradient(135deg,#eff6ff,#dbeafe)"
                      : "transparent",
                    boxShadow: active
                      ? "0 4px 14px rgba(37,99,235,0.15)"
                      : "none",
                    transition: "background 0.22s, box-shadow 0.22s",
                  }}
                >
                  <Icon
                    style={{
                      width: 21,
                      height: 21,
                      color: active ? "#2563eb" : "#94a3b8",
                      transition: "color 0.2s",
                      strokeWidth: active ? 2.4 : 1.8,
                    }}
                  />

                  {/* Badge */}
                  {badge && (
                    <span
                      className="bn-badge absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full flex items-center justify-center text-[9.5px] font-bold text-white px-1"
                      style={{
                        background: "linear-gradient(135deg,#f97316,#ef4444)",
                        boxShadow: "0 2px 6px rgba(239,68,68,0.45)",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={active ? "bn-label-in" : ""}
                  style={{
                    fontSize: 10.5,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#2563eb" : "#94a3b8",
                    letterSpacing: active ? "0.01em" : "0.005em",
                    transition: "color 0.2s, font-weight 0.2s",
                    lineHeight: 1,
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
