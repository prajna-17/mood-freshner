"use client";

import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";
import LoginModal from "@/components/LoginModal";
import { addToCart } from "@/utils/cart";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);
  const [added, setAdded] = useState(false);

  const fetchProducts = () => {
    const pincode = localStorage.getItem("pincode");

    // 🔥 No pincode → fetch ALL best sellers (no filter)
    const url = pincode
      ? `${API}/products?productSellingCategory=best-selling&pincode=${pincode}`
      : `${API}/products?productSellingCategory=best-selling`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const prods = Array.isArray(data) ? data : data.data || [];
        setProducts(prods.slice(0, 4));
      })
      .catch(() => console.log("Best sellers fetch failed ❌"));
  };

  useEffect(() => {
    fetchProducts();

    // 🔥 Re-fetch when pincode is set/changed
    window.addEventListener("pincodeUpdated", fetchProducts);
    return () => window.removeEventListener("pincodeUpdated", fetchProducts);
  }, []);

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  return (
    <div className="px-4 mt-10 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Best Sellers
        </h2>
        <Link href="/products" className="text-orange-500 underline text-sm">
          See All
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((item) => (
          <Link key={item._id} href={`/details/${item._id}`}>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden cursor-pointer">
              <div className="relative">
                <Image
                  src={item.images?.[0] || "/img/placeholder.jpg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-[140px] object-cover"
                />
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                  {item.productSellingCategory || "Fresh"}
                </span>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoggedIn()) {
                      setOpenLogin(true);
                      return;
                    }
                    addToCart({
                      ...item,
                      id: item._id,
                      availableQty: item.quantity,
                      availablePincodes: item.availablePincodes,
                    });
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1500);
                  }}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-gray-700" />
                </div>
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity || 1} unit
                </p>
                <div className="flex items-center gap-1 text-orange-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-orange-400" />
                  ))}
                  <span className="text-gray-500 ml-1">(120)</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    {item.oldPrice && (
                      <p className="text-xs text-gray-400 line-through">
                        ₹{item.oldPrice}
                      </p>
                    )}
                    <p className="text-base font-semibold text-gray-900">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
      {added && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full text-sm z-[2000]">
          Added to cart
        </div>
      )}
    </div>
  );
}
