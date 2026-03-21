"use client";

import { ShoppingCart, Bell, Search, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
export default function HomeTopSection() {
  const router = useRouter();

  return (
    <div className="px-4 pt-4 space-y-4">
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div>
          <p
            className="text-orange-500 text-sm font-medium"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Good morning, Rahul
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
            className="bg-blue-100 p-3 rounded-xl cursor-pointer"
          >
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
