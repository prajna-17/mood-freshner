"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Store, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Settings", href: "/products", icon: Store },
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
                    <div
                      className="absolute"
                      style={{
                        top: -3,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 70,
                        height: 30,
                        background: "white",
                        borderBottomLeftRadius: 40,
                        borderBottomRightRadius: 40,
                        zIndex: 1,
                      }}
                    />
                    {/* Circle */}
                    <div
                      className="absolute flex items-center justify-center"
                      style={{
                        top: -32,
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
