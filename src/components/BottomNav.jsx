"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Store, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getCart } from "@/utils/cart";
import LoginModal from "@/components/LoginModal";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Shop", href: "/products", icon: Store },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [openLogin, setOpenLogin] = useState(false);
  const [ripples, setRipples] = useState({});
  const rippleCounter = useRef(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      setCount(total);
    };
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  const spawnRipple = (href, x, y) => {
    const id = rippleCounter.current++;
    setRipples((prev) => ({
      ...prev,
      [href]: [...(prev[href] || []), { id, x, y }],
    }));
    setTimeout(() => {
      setRipples((prev) => ({
        ...prev,
        [href]: (prev[href] || []).filter((r) => r.id !== id),
      }));
    }, 550);
  };

  return (
    <>
      <style>{`
        @keyframes bn-ripple {
          to { transform: scale(4); opacity: 0; }
        }
        @keyframes bn-badge-pop {
          0%   { transform: scale(0) rotate(-20deg); }
          60%  { transform: scale(1.35) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes bn-label-in {
          from { transform: translateX(-50%) scale(0) translateY(4px); opacity: 0; }
          to   { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        }
        .bn-item {
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bn-item:active { transform: scale(0.86); }
        .bn-bubble {
          transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.22s ease;
        }
        .bn-idle {
          transition: opacity 0.2s ease,
                      transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bn-ripple-dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.32);
          width: 44px;
          height: 44px;
          margin-left: -22px;
          margin-top: -22px;
          transform: scale(0);
          animation: bn-ripple 0.55s ease-out forwards;
          pointer-events: none;
        }
      `}</style>

      <div style={{ height: 80 }} />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "#3b82f6",
          height: 64,
          boxShadow: "0 -6px 30px rgba(59,130,246,0.35)",
        }}
      >
        <div className="flex justify-around items-center h-full relative">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  spawnRipple(
                    href,
                    e.clientX - rect.left,
                    e.clientY - rect.top,
                  );
                  if (href === "/profile" && !isLoggedIn()) {
                    e.preventDefault();
                    setOpenLogin(true);
                  }
                }}
                className="bn-item flex-1 flex justify-center items-center relative overflow-hidden"
                style={{ height: "100%" }}
              >
                {/* Ripples */}
                {(ripples[href] || []).map((r) => (
                  <span
                    key={r.id}
                    className="bn-ripple-dot"
                    style={{ left: r.x, top: r.y }}
                  />
                ))}

                {/* Cart badge */}
                {href === "/cart" && count > 0 && (
                  <span
                    key={count}
                    style={{
                      position: "absolute",
                      top: 5,
                      right: "calc(50% - 22px)",
                      background: "#ef4444",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 700,
                      minWidth: 16,
                      height: 16,
                      lineHeight: "16px",
                      textAlign: "center",
                      borderRadius: 999,
                      padding: "0 4px",
                      border: "2px solid #3b82f6",
                      zIndex: 10,
                      animation:
                        "bn-badge-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
                    }}
                  >
                    {count}
                  </span>
                )}

                {/* Active state */}
                {active && (
                  <>
                    {/* Notch */}
                    <div
                      style={{
                        position: "absolute",
                        top: -2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 72,
                        height: 32,
                        background: "white",
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                        zIndex: 1,
                        pointerEvents: "none",
                      }}
                    >
                      {/* Left corner fill */}
                      <span
                        style={{
                          position: "absolute",
                          right: "100%",
                          top: 0,
                          width: 12,
                          height: 12,
                          borderTopRightRadius: 12,
                          boxShadow: "4px 0 0 0 white",
                          background: "transparent",
                        }}
                      />
                      {/* Right corner fill */}
                      <span
                        style={{
                          position: "absolute",
                          left: "100%",
                          top: 0,
                          width: 12,
                          height: 12,
                          borderTopLeftRadius: 12,
                          boxShadow: "-4px 0 0 0 white",
                          background: "transparent",
                        }}
                      />
                    </div>

                    {/* Floating bubble */}
                    <div
                      className="bn-bubble absolute flex items-center justify-center"
                      style={{
                        top: -36,
                        left: "50%",
                        transform: "translateX(-50%) scale(1)",
                        opacity: 1,
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        background: "#3b82f6",
                        border: "4px solid white",
                        zIndex: 2,
                      }}
                    >
                      <Icon color="white" size={22} strokeWidth={2.5} />
                    </div>

                    {/* Label pill */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: -20,
                        left: "50%",
                        fontSize: 9,
                        fontWeight: 700,
                        background: "white",
                        color: "#3b82f6",
                        padding: "2px 8px",
                        borderRadius: 999,
                        letterSpacing: "0.4px",
                        whiteSpace: "nowrap",
                        animation:
                          "bn-label-in 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.05s both",
                        pointerEvents: "none",
                      }}
                    >
                      {label}
                    </span>
                  </>
                )}

                {/* Idle icon */}
                {!active && (
                  <Icon
                    className="bn-idle"
                    size={22}
                    color="#dbeafe"
                    strokeWidth={1.8}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
}
