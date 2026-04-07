"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCart } from "@/utils/cart";
export default function CheckoutSection() {
  const router = useRouter();
  const [hasItems, setHasItems] = useState(false);

  useEffect(() => {
    const checkCart = () => {
      const cart = getCart();
      setHasItems(cart.length > 0);
    };

    checkCart();

    window.addEventListener("cart-updated", checkCart);

    return () => {
      window.removeEventListener("cart-updated", checkCart);
    };
  }, []);

  return (
    <div className="px-4 mt-6 mb-6">
      <button
        onClick={() => router.push("/checkout")}
        disabled={!hasItems}
        className={`w-full py-3 rounded-xl text-sm font-semibold shadow-md transition
    ${
      !hasItems
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-orange-500 text-white active:scale-95"
    }`}
      >
        {hasItems ? "Proceed to Checkout" : "Cart is Empty"}
      </button>
    </div>
  );
}
