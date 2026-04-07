"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserIdFromToken } from "@/utils/auth";
import { ShoppingBag } from "lucide-react";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";

export default function RecentlyPurchased() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const orders = data.data || [];

        // 👉 Extract products from orders
        const products = orders.flatMap((order) => order.products || []);

        // 👉 Optional: remove duplicates (based on title)
        const unique = [];
        const seen = new Set();

        for (let p of products) {
          if (!seen.has(p.title)) {
            seen.add(p.title);
            unique.push(p);
          }
        }

        setItems(unique);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Recently Purchased
        </h2>

        {items.length > 0 && (
          <button
            onClick={() => setItems([])}
            className="text-orange-500 underline text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3">
            <ShoppingBag size={28} className="text-blue-400" />
          </div>
          <p className="text-gray-600 font-medium">No purchases yet</p>
          <p className="text-gray-400 text-sm">
            Your bought items will appear here 🛍️
          </p>
        </div>
      )}

      {/* Cards */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-2xl p-3 flex flex-col items-center text-center bg-white"
            >
              {/* Image */}
              <div className="w-12 h-12 relative mb-2">
                <Image
                  src={item.images?.[0] || "/img/placeholder.jpeg"}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Name */}
              <p className="text-blue-700 font-medium text-sm">{item.title}</p>

              {/* Price */}
              <p className="text-gray-900 text-sm font-medium">
                ₹{item.price} / gram
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
