"use client";

import { useRouter } from "next/navigation";

export default function CheckoutSection() {
  const router = useRouter();

  return (
    <div className="px-4 mt-6 mb-6">
      <button
        onClick={() => router.push("/checkout")}
        className="w-full bg-orange-500 text-white py-3 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
