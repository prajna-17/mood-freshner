export default function getDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return "New";
  return Math.round(((oldPrice - price) / oldPrice) * 100) + "%";
}
