"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";

export default function CategoriesSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((data) => {
        const cats = data?.data || data || [];
        setCategories(cats);
      })
      .catch(() => console.log("Categories fetch failed ❌"));
  }, []);

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
          href="/products"
          className="text-sm font-md"
          style={{ color: "#E8900A", textDecoration: "none" }}
        >
          See All
        </Link>
      </div>

      {/* Scroll */}
      <div
        className="flex gap-3 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {categories.map((item) => (
          <Link key={item._id} href={`/products?category=${item._id}`}>
            <div
              style={{
                minWidth: "80px",
                height: "100px",
                borderRadius: "18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #D0E4F7",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#EAF3FD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "8px",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={32}
                  height={32}
                  style={{ objectFit: "contain" }}
                />
              </div>

              {/* Name */}
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "400",
                  color: "#2F7EE8",
                  margin: 0,
                  fontFamily: "sans-serif",
                }}
              >
                {item.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
