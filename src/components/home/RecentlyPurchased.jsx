"use client";

import Image from "next/image";

export default function RecentlyPurchased() {
  const items = [
    { name: "Icecream", img: "/img/rainbowcone.jpeg" },
    { name: "Cheese", img: "/img/cheese.jpeg" },
    { name: "Butter", img: "/img/butter.jpeg" },
  ];

  return (
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {" "}
          Recently Purchased
        </h2>

        <button className="text-orange-500 underline text-sm">Clear All</button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-2xl p-3 flex flex-col items-center text-center bg-white"
          >
            {/* Image */}
            <div className="w-12 h-12 relative mb-2">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Name */}
            <p className="text-blue-700 font-medium text-sm">{item.name}</p>

            {/* Old Price */}
            <p className="text-gray-400 text-xs line-through">₹98/gram</p>

            {/* New Price */}
            <p className="text-gray-900 text-sm font-medium">₹98 / gram</p>
          </div>
        ))}
      </div>
    </div>
  );
}
