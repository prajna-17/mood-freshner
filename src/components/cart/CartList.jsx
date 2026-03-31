"use client";

import { useEffect, useState } from "react";
import CartItemCard from "./CartItemCard";
import { getCart } from "@/utils/cart";

export default function CartList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());

    const handleUpdate = () => {
      setItems(getCart());
    };

    window.addEventListener("cart-updated", handleUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleUpdate);
    };
  }, []);

  return (
    <div className="px-4 mt-4">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">Cart is empty 🥲</p>
      ) : (
        items.map((item) => <CartItemCard key={item.variantId} item={item} />)
      )}
    </div>
  );
}
