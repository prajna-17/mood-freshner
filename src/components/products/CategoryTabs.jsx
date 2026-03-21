"use client";

import { useState } from "react";

const tabs = ["All", "Full Cream", "Toned", "Organic", "Skimmed", "Flavoured"];

export default function CategoryTabs() {
  const [active, setActive] = useState("All");

  return (
    <div className="px-4 mt-3">
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              
              ${
                active === tab
                  ? "bg-[#2f6fb3] text-white"
                  : "bg-[#dfe7f5] text-[#2f6fb3]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
