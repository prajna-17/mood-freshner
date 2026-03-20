"use client";

import Image from "next/image";

const DATA = [
  {
    title: "100% Grass Fed",
    desc: "No hormones, no antibiotics",
    icon: "/img/leaf.png", // your icon
  },
  {
    title: "Cold Chain Delivery",
    desc: "Guaranteed Freshness",
    icon: "/img/cold.png",
  },
  {
    title: "Eco Packaging",
    desc: "100% recyclable, BPA free bottles",
    icon: "/img/sustainable.png",
  },
];

export default function ProductHighlights() {
  return (
    <div className="px-4 mt-4 space-y-3">
      {DATA.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-gray-200 rounded-xl p-3 shadow-sm"
        >
          {/* Icon */}
          <div className="w-10 h-10 flex items-center justify-center">
            <Image src={item.icon} alt={item.title} width={28} height={28} />
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-medium text-black">{item.title}</p>
            <p className="text-xs text-gray-600">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
