"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { API } from "@/utils/api";
import { ShoppingBasket, SearchX, Frown } from "lucide-react";

export default function ProductsGrid({ setProducts: setParentProducts }) {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const subCategoryId = searchParams.get("subCategory");

  const fetchProducts = async () => {
    try {
      const pincode = localStorage.getItem("pincode");

      // 🔥 No pincode → fetch all (no pincode filter)
      let url = pincode
        ? `${API}/products?pincode=${pincode}`
        : `${API}/products`;

      if (categoryId && subCategoryId) {
        url += `&category=${categoryId}&subCategory=${subCategoryId}`;
      } else if (categoryId) {
        url += `&category=${categoryId}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      const prods = Array.isArray(data) ? data : data.data || [];

      setProducts(prods);
      if (setParentProducts) setParentProducts(prods);
      setVisibleCount(8);
    } catch (err) {
      console.log("Product fetch failed ❌", err);
    }
  };

  useEffect(() => {
    fetchProducts();

    // 🔥 Re-fetch when pincode is set/changed
    window.addEventListener("pincodeUpdated", fetchProducts);
    return () => window.removeEventListener("pincodeUpdated", fetchProducts);
  }, [categoryId, subCategoryId]);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="px-3 mt-5">
      <div className="grid grid-cols-2 gap-3">
        {products.length > 0 ? (
          visibleProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 gap-3">
            <div className="relative">
              <ShoppingBasket size={52} className="text-orange-200" />
              <SearchX
                size={22}
                className="text-orange-400 absolute -bottom-1 -right-2"
              />
            </div>
            <p className="text-gray-700 font-semibold text-base">
              Nothing here yet!
            </p>
            <p className="text-gray-400 text-sm text-center leading-snug">
              Looks like this shelf is empty. <br /> Try a different category?
            </p>
            <Frown size={18} className="text-gray-300 mt-1" />
          </div>
        )}
      </div>

      {products.length > 8 && visibleCount < products.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
