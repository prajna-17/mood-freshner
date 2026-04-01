"use client";

import { ShoppingCart, Bell, Search, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart } from "@/utils/cart";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";

export default function HomeTopSection() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(total);
    };
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  // Fetch notification count for badge
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setNotifCount(data.data.length);
      } catch (e) {}
    };
    fetchCount();
  }, []);

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p
            className="text-orange-500 text-sm font-medium"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Good morning, {user?.name || "Guest"}
          </p>
          <h1
            className="text-2xl font-medium text-gray-900 leading-tight mt-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            What would you <br /> like today?
          </h1>
        </div>

        <div className="flex gap-3">
          {/* Cart */}
          <div
            onClick={() => router.push("/cart")}
            className="bg-blue-100 p-3 rounded-xl cursor-pointer relative"
          >
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
            <ShoppingCart className="w-5 h-5 text-blue-700" />
          </div>

          {/* Bell — navigates to /notifications */}
          <div
            onClick={() => router.push("/notifications")}
            className="bg-blue-100 p-3 rounded-xl cursor-pointer relative"
          >
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
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
