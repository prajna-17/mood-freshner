// utils/wishlist.js
import { getUserIdFromToken } from "./auth";
// NOTE: Multi-user testing requires production email domain.
// Logic is userId-based and production-safe.

const getWishlistKey = () => {
  const userId = getUserIdFromToken();
  return userId ? `wishlist_${userId}` : "wishlist_guest";
};

export const getWishlist = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(getWishlistKey())) || [];
};

export const addToWishlistIfNotExists = (item) => {
  const wishlist = getWishlist();

  if (wishlist.some((w) => w.variantId === item.variantId)) return;

  wishlist.push(item);
  localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
  window.dispatchEvent(new Event("wishlist-updated"));
};

export const removeFromWishlist = (variantId) => {
  const wishlist = getWishlist().filter((item) => item.variantId !== variantId);

  localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
  window.dispatchEvent(new Event("wishlist-updated"));
};

export const toggleWishlist = (item) => {
  const wishlist = getWishlist();

  const color = item.color || "Default";
  const size = item.size || "Free";

  const variantId =
    item.variantId || `${item.productId || item.id}-${color}-${size}`;

  const index = wishlist.findIndex((w) => w.variantId === variantId);

  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push({
      variantId,
      productId: item.productId || item.id,

      title: item.title,
      image: item.image,

      price: item.price,
      oldPrice: item.oldPrice,
      discount: item.discount,

      color,
      size,
    });
  }

  localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
  window.dispatchEvent(new Event("wishlist-updated"));
};

export const isInWishlist = (variantId) => {
  return getWishlist().some((item) => item.variantId === variantId);
};

export const clearWishlist = () => {
  localStorage.removeItem(getWishlistKey());
  window.dispatchEvent(new Event("wishlist-updated"));
};
