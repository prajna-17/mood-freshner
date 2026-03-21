"use client";

import CartItemCard from "./CartItemCard";

const items = [{ img: "/img/milk1.png" }, { img: "/img/milk2.png" }];

export default function CartList() {
  return (
    <div className="px-4 mt-4">
      {items.map((item, index) => (
        <CartItemCard key={index} item={item} />
      ))}
    </div>
  );
}
