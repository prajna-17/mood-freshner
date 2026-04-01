"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import { addToCart, clearCart } from "@/utils/cart";
function CopyLinkBtn({ url }) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handle}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        minWidth: 60,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: copied ? "#dcfce7" : "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
      >
        {copied ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        style={{
          fontSize: 11,
          color: copied ? "#16a34a" : "#64748b",
          fontWeight: 600,
          transition: "color 0.2s",
        }}
      >
        {copied ? "Copied!" : "Copy Link"}
      </span>
    </button>
  );
}
export default function ProductTop({ product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [showFull, setShowFull] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [added, setAdded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const increase = () => {
    if (qty < product.quantity) {
      setQty((q) => q + 1);
    }
  };
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  if (!product) return null;
  const BEVERAGE_ID = "69ca70a80971faee317396f7";

  const isBeverage =
    typeof product.superCategory === "object"
      ? product.superCategory._id === BEVERAGE_ID
      : product.superCategory === BEVERAGE_ID;

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  // ✅ Add to cart
  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      setOpenLogin(true);
      return;
    }

    addToCart({
      ...product,
      id: product._id,
      availableQty: product.quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // ✅ Buy now
  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      setOpenLogin(true);
      return;
    }

    // 🔥 STORE ONLY THIS PRODUCT FOR CHECKOUT
    localStorage.setItem(
      "checkoutItem",
      JSON.stringify({
        ...product,
        id: product._id,
        qty: qty, // 🔥 VERY IMPORTANT (use selected qty)
        image: product.images?.[0],
        availableQty: product.quantity,
      }),
    );

    router.push("/checkout");
  };
  return (
    <div className="bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => router.back()} className="text-lg">
          ←
        </button>{" "}
      </div>

      {/* IMAGE SECTION */}
      <div className="relative w-full h-64 overflow-hidden bg-[#2f6fad]">
        <Image
          src={product.images?.[0] || "/img/placeholder.jpg"}
          alt={product.title}
          fill
          priority
          className="object-cover"
        />

        <span className="absolute top-3 left-3 bg-yellow-400 text-xs px-2 py-1 rounded z-10">
          {product.productSellingCategory || "Best Seller"}
        </span>

        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {/* inside the absolute top-3 right-3 div — replace the Share2 icon div */}
          <div
            className="bg-white p-2 rounded-full cursor-pointer"
            onClick={() => setShareOpen(true)}
          >
            <Share2 size={16} />
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4">
        {/* TITLE */}
        <h2 className="font-medium text-[18px] text-black leading-tight">
          {product.title}
        </h2>

        {/* STARS */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#facc15" stroke="#facc15" />
          ))}
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews?.length || 256} reviews)
          </span>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2 mt-3">
          <p className="text-[18px] font-semibold text-black">
            ₹{product.price}
          </p>

          {product.oldPrice && (
            <p className="text-gray-400 line-through text-sm">
              ₹{product.oldPrice}
            </p>
          )}

          {product.oldPrice && (
            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
              )}
              % OFF
            </span>
          )}
        </div>

        {/* VOLUME (STATIC UI KEEP) */}
        {isBeverage && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">VOLUME</p>
            <div className="flex gap-2 flex-wrap">
              <button className="px-3 py-1 border rounded bg-blue-100 text-blue-600 text-sm">
                500 ml
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                1 Litre
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                2 Litres
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                + More
              </button>
            </div>
          </div>
        )}

        {/* QUANTITY + STOCK */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 border rounded px-2 py-1">
            <button onClick={decrease} className="text-lg px-2">
              -
            </button>
            <span className="font-medium text-black">{qty}</span>
            <button
              onClick={increase}
              disabled={qty >= product.quantity}
              className="text-lg px-2 disabled:opacity-30"
            >
              {" "}
              +
            </button>
          </div>

          <span
            className={`text-sm font-medium ${
              qty <= product.quantity ? "text-green-600" : "text-red-500"
            }`}
          >
            {qty <= product.quantity
              ? `In Stock (${product.quantity} available)`
              : "Only limited stock available"}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleBuyNow}
            className="flex-1 border border-orange-500 text-orange-500 py-2 rounded font-medium"
          >
            Buy Now
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-orange-500 text-white py-2 rounded font-medium"
          >
            Add to Cart
          </button>
        </div>

        {/* NUTRITION (kept static UI) */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-2">NUTRITION (PER 100ML)</p>

          <div className="bg-gray-200 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-4 text-center gap-2">
              <div>
                <p className="font-semibold text-black">61</p>
                <p className="text-xs text-gray-600">Calories</p>
              </div>

              <div>
                <p className="font-semibold text-black">3.2g</p>
                <p className="text-xs text-gray-600">Protein</p>
              </div>

              <div>
                <p className="font-semibold text-black">3.5g</p>
                <p className="text-xs text-gray-600">Fat</p>
              </div>

              <div>
                <p className="font-semibold text-black">4.7g</p>
                <p className="text-xs text-gray-600">Carbs</p>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-6">
          <p className="text-xs text-gray-900 b-1">ABOUT</p>
          <p
            className={`text-sm text-gray-700 leading-relaxed ${
              showFull ? "" : "line-clamp-5"
            }`}
          >
            {product.description}
          </p>
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-orange-500 text-sm mt-1 font-medium"
          >
            {showFull ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
      <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
      {added && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full text-sm z-[2000]">
          Added to cart
        </div>
      )}
      {/* ── Share Modal ── */}
      {shareOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[1000]"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setShareOpen(false)}
          />

          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-[1001] bg-white"
            style={{
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 36px",
              maxWidth: 480,
              margin: "0 auto",
              animation: "slideUp 0.28s ease",
            }}
          >
            {/* Handle */}
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: "#e2e8f0",
                margin: "0 auto 20px",
              }}
            />

            <p
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#1e293b",
                marginBottom: 20,
              }}
            >
              Share this product
            </p>

            {/* Share options */}
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "flex-start",
                marginBottom: 24,
                overflowX: "auto",
                paddingBottom: 4,
              }}
            >
              {/* WhatsApp */}
              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent(
                    `Check out ${product.title} at ₹${product.price}! 🛒`,
                  );
                  window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#25D366" />
                    <path
                      d="M22.5 9.5A9.1 9.1 0 0 0 7.1 20.3L6 26l5.9-1.5a9.1 9.1 0 0 0 10.6-15zm-6.5 14a7.6 7.6 0 0 1-3.9-1.1l-.3-.2-3.5.9.9-3.4-.2-.3a7.6 7.6 0 1 1 7 4.1zm4.2-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.8c-.1.1-.3.2-.5.1a6.4 6.4 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3a3.3 3.3 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.1 1.6-.1.5-.3.9-.8 1-1.3.1-.3.1-.6-.1-.8z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span
                  style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}
                >
                  WhatsApp
                </span>
              </button>

              {/* Instagram (copy + open) */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${product.title} — ₹${product.price}\n${window.location.href}`,
                  );
                  window.open("https://www.instagram.com/", "_blank");
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: "#fce7f3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                    <defs>
                      <radialGradient id="ig" cx="30%" cy="107%" r="150%">
                        <stop offset="0%" stopColor="#ffd600" />
                        <stop offset="50%" stopColor="#ff0069" />
                        <stop offset="100%" stopColor="#d300c5" />
                      </radialGradient>
                    </defs>
                    <rect width="32" height="32" rx="8" fill="url(#ig)" />
                    <rect
                      x="8"
                      y="8"
                      width="16"
                      height="16"
                      rx="4.5"
                      stroke="white"
                      strokeWidth="1.8"
                      fill="none"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="3.8"
                      stroke="white"
                      strokeWidth="1.8"
                      fill="none"
                    />
                    <circle cx="21" cy="11" r="1" fill="white" />
                  </svg>
                </div>
                <span
                  style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}
                >
                  Instagram
                </span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const text = encodeURIComponent(
                    `Check out ${product.title} at ₹${product.price}!`,
                  );
                  window.open(
                    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                    "_blank",
                  );
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="6" fill="#000" />
                    <path
                      d="M13.5 10.6L18.3 5h-1.1l-4.1 4.7L9.6 5H5.5l5.1 7.3L5.5 19h1.2l4.4-5.1 3.5 5.1H18L13.5 10.6zm-1.5 1.8l-.5-.7-4-5.7h1.7l3.2 4.6.5.7 4.2 6h-1.7l-3.4-5z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span
                  style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}
                >
                  X / Twitter
                </span>
              </button>

              {/* Copy Link */}
              <CopyLinkBtn url={window.location.href} />
            </div>

            {/* Link preview strip */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1e293b",
                    marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {product.title}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {typeof window !== "undefined" ? window.location.href : ""}
                </p>
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#f97316",
                  flexShrink: 0,
                }}
              >
                ₹{product.price}
              </span>
            </div>
          </div>

          <style>{`
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
    `}</style>
        </>
      )}
    </div>
  );
}
