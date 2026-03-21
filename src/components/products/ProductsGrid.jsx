"use client";

import ProductCard from "./ProductCard";

const products = [
  { name: "Full Cream Milk", img: "/img/milk.jpeg", tag: "Fresh" },
  { name: "Organic Milk", img: "/img/milk2.png", tag: "Best Seller" },
  { name: "Strawberry Milk", img: "/img/milk3.png", tag: "Flavoured" },
  { name: "Skimmed Milk", img: "/img/milk4.png", tag: "Fresh" },
  { name: "Full Cream Milk", img: "/img/milk5.png", tag: "Fresh" },
  { name: "Full Cream Milk", img: "/img/milk6.png", tag: "Fresh" },
];

export default function ProductsGrid() {
  return (
    <div className="px-4 mt-5">
      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((item, index) => (
          <ProductCard key={index} item={item} />
        ))}
      </div>

      {/* SHOW MORE BUTTON */}
      <div className="flex justify-center mt-6">
        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium">
          Show More
        </button>
      </div>
    </div>
  );
}
