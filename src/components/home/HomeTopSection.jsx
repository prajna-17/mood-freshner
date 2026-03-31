"use client";

import { ShoppingCart, Bell, Search, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart } from "@/utils/cart";
export default function HomeTopSection() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      setCount(total);
    };

    updateCount();

    window.addEventListener("cart-updated", updateCount);

    return () => {
      window.removeEventListener("cart-updated", updateCount);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    }
  }, []);
  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div>
          <p
            className="text-orange-500 text-sm font-medium"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Good morning, {user?.name || "Guest"}{" "}
          </p>

          <h1
            className="text-2xl font-medium text-gray-900 leading-tight mt-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            What would you <br /> like today?
          </h1>
        </div>

        {/* Icons */}
        <div className="flex gap-3">
          <div
            onClick={() => router.push("/cart")}
            className="bg-blue-100 p-3 rounded-xl cursor-pointer relative"
          >
            {/* 🔥 BADGE */}
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {count > 9 ? "9+" : count}
              </span>
            )}

            <ShoppingCart className="w-5 h-5 text-blue-700" />
          </div>

          <div className="bg-blue-100 p-3 rounded-xl">
            <Bell className="w-5 h-5 text-blue-700" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-blue-100 rounded-xl px-3 py-3">
        <Search className="w-5 h-5 text-blue-600 mr-2" />

        <input
          type="text"
          placeholder="Search milk, cheese, etc."
          className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder:text-blue-400"
        />

        <Mic className="w-5 h-5 text-blue-600" />
      </div>
    </div>
  );
}
