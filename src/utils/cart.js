// utils/cart.js
import getDiscount from "./getDiscount";
import { getUserIdFromToken } from "./auth";

// NOTE: Multi-user testing requires production email domain.
// Logic is userId-based and production-safe.

const getCartKey = () => {
  const userId = getUserIdFromToken();
  return userId ? `cart_${userId}` : "cart_guest";
};

export const getCart = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(getCartKey())) || [];
};

export const addToCart = (product) => {
  const cart = getCart();

  const color = product.color || "Default";
  const size = product.size || "Free";

  const variantId = `${product.productId || product.id}-${color}-${size}`;

  const oldPrice = product.oldPrice; // ✅ FROM DB
  const price = product.price;

  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const existing = cart.find((item) => item.variantId === variantId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      variantId,

      productId: product.productId || product.id, // 🔥 REQUIRED FIX

      title: product.title,
      image: product.image || product.images?.[0],

      price,
      oldPrice,
      discount,

      color: product.color,
      size: product.size,

      qty: 1,
    });
  }

  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
};

export const updateQty = (variantId, qty) => {
  const cart = getCart().map((item) =>
    item.variantId === variantId ? { ...item, qty } : item,
  );

  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
};

export const removeFromCart = (variantId) => {
  const cart = getCart().filter((item) => item.variantId !== variantId);

  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
};

export const clearCart = () => {
  localStorage.removeItem(getCartKey());
  window.dispatchEvent(new Event("cart-updated"));
};
