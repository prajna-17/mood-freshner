const PAYMENT_METHOD_LABELS = {
  COD: "Cash on Delivery",
  ONLINE: "Online Payment",
  COINS: "Coins",
  COINS_AND_COD: "Coins + COD",
  COINS_AND_ONLINE: "Coins + Online",
};

const PAYMENT_METHOD_SHORT = {
  COD: "COD",
  ONLINE: "Online",
  COINS: "Coins",
  COINS_AND_COD: "Coins + COD",
  COINS_AND_ONLINE: "Coins + Online",
};

export function normalizePaymentMethod(method) {
  const value = String(method || "").toUpperCase();
  return PAYMENT_METHOD_LABELS[value] ? value : "ONLINE";
}

export function getPaymentMethodLabel(method) {
  const normalized = normalizePaymentMethod(method);
  return PAYMENT_METHOD_LABELS[normalized] || normalized;
}

export function getPaymentMethodShort(method) {
  const normalized = normalizePaymentMethod(method);
  return PAYMENT_METHOD_SHORT[normalized] || normalized;
}

export function getPaymentStatusLabel(status) {
  const normalized = String(status || "PENDING").toUpperCase();
  if (normalized === "SUCCESS" || normalized === "PAID") return "Success";
  if (normalized === "FAILED") return "Failed";
  return "Pending";
}

export function isPaymentSuccessful(status) {
  const normalized = String(status || "").toUpperCase();
  return normalized === "SUCCESS" || normalized === "PAID";
}
