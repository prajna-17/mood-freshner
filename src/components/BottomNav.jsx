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
          height: 50,
          boxShadow: "0 -6px 25px rgba(0,0,0,0.3)",
        }}
      >
        <div className="flex justify-around items-center h-full relative">
          {NAV_ITEMS.map(({ href, icon: Icon }, index) => {
            const active = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className="flex-1 flex justify-center relative"
              >
                {/* CURVED NOTCH */}
                {active && (
                  <>
                    {/* White curve */}
                    <div
                      className="absolute -top-5"
                      style={{
                        width: 50,
                        height: 30,
                        background: "#fff",
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                        zIndex: 1,
                      }}
                    />

                    {/* Circle */}
                    <div
                      className="absolute flex items-center justify-center -top-10"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "#3b82f6", // 🔵 blue circle
                        border: "4px solid white",
                        zIndex: 2,
                      }}
                    >
                      <Icon color="white" size={18} strokeWidth={2.5} />{" "}
                      {/* 🤍 white icon */}
                    </div>
                  </>
                )}

                {/* Normal icons */}
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
