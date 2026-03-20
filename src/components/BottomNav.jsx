"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Settings, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <div style={{ height: 80 }} />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "#3b82f6",
          height: 60,
          boxShadow: "0 -6px 25px rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex justify-around items-center h-full relative">
          {NAV_ITEMS.map(({ href, icon: Icon }) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex justify-center items-center relative"
                style={{ height: "100%" }}
              >
                {active && (
                  <>
                    {/* SVG smooth concave notch */}
                    <svg
                      width="90"
                      height="60"
                      viewBox="0 0 90 60"
                      className="absolute"
                      style={{
                        top: -28,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1,
                        display: "block",
                        overflow: "visible",
                      }}
                    >
                      {/* Page bg color fills the notch shape */}
                      <path
                        d="M0,28 Q18,28 23,20 Q30,8 45,8 Q60,8 67,20 Q72,28 90,28 L90,0 L0,0 Z"
                        fill="white" // ← change to your page bg color
                      />
                      {/* Blue fill under the arch gap */}
                      <path
                        d="M23,20 Q30,8 45,8 Q60,8 67,20 Q72,28 90,28 L90,60 L0,60 L0,28 Q18,28 23,20 Z"
                        fill="#3b82f6"
                      />
                    </svg>

                    {/* Circle */}
                    <div
                      className="absolute flex items-center justify-center"
                      style={{
                        top: -38,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: "#3b82f6",
                        border: "4px solid white",
                        zIndex: 2,
                      }}
                    >
                      <Icon color="white" size={22} strokeWidth={2.5} />
                    </div>
                  </>
                )}

                {!active && (
                  <Icon size={22} color="#dbeafe" strokeWidth={1.8} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
