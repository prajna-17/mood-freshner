"use client";

import Image from "next/image";
import Link from "next/link";

export default function CategoriesSection() {
  const categories = [
    { name: "Milk", img: "/img/3milk.jpeg", active: true },
    { name: "Butter", img: "/img/butter.jpeg" },
    { name: "Cheese", img: "/img/cheese.jpeg" },
    { name: "Curd", img: "/img/curd.jpeg" },
  ];

  return (
    <div className="px-4 mt-6 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Categories
        </h2>
        <Link
          href="/categories"
          className="text-sm font-md"
          style={{ color: "#E8900A", textDecoration: "none" }}
        >
          See All
        </Link>
      </div>

      {/* Horizontal Scroll Row */}
      <div
        className="flex gap-3 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {categories.map((item, index) => (
          <div
            key={index}
            style={{
              minWidth: "80px",
              height: "100px",
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              backgroundColor: item.active ? "#2F7EE8" : "#FFFFFF",
              border: item.active ? "none" : "1.5px solid #D0E4F7",
              boxShadow: item.active ? "none" : "0px 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: item.active
                  ? "rgba(255,255,255,0.22)"
                  : "#EAF3FD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <Image
                src={item.img}
                alt={item.name}
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Label */}
            <p
              style={{
                fontSize: "13px",
                fontWeight: "400",
                color: item.active ? "#FFFFFF" : "#2F7EE8",
                margin: 0,
                fontFamily: "sans-serif",
              }}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
