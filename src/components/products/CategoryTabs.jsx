"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { API } from "@/utils/api";

export default function CategoryTabs() {
  const [tabs, setTabs] = useState([]);
  const [active, setActive] = useState("All");

  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get("category");
  const subCategoryId = searchParams.get("subCategory");

  useEffect(() => {
    if (!categoryId) return;

    fetch(`${API}/sub-categories?category=${categoryId}`)
      .then((r) => r.json())
      .then((data) => {
        const subs = data?.data || data || [];
        setTabs(subs);
      })
      .catch(() => console.log("Subcategory fetch failed ❌"));
  }, [categoryId]);

  const handleClick = (tab) => {
    if (tab === "All") {
      setActive("All");
      router.push(`/products?category=${categoryId}`);
    } else {
      setActive(tab._id);
      router.push(`/products?category=${categoryId}&subCategory=${tab._id}`);
    }
  };

  return (
    <div className="px-4 mt-3">
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {/* ALL TAB */}
        <button
          onClick={() => handleClick("All")}
          className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
            ${
              active === "All"
                ? "bg-[#2f6fb3] text-white"
                : "bg-[#dfe7f5] text-[#2f6fb3]"
            }`}
        >
          All
        </button>

        {/* DYNAMIC TABS */}
        {tabs.map((tab) => (
          <button
            key={tab._id}
            onClick={() => handleClick(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${
                active === tab._id
                  ? "bg-[#2f6fb3] text-white"
                  : "bg-[#dfe7f5] text-[#2f6fb3]"
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
}
