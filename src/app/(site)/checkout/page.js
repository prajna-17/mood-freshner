"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCart, clearCart } from "@/utils/cart";
import { getUserIdFromToken } from "@/utils/auth";
import { Suspense } from "react";

const DELIVERY_FEE = 99;
const API_BASE = "https://mood-freshner-backend.onrender.com/api";
console.log("API_BASE:", API_BASE);

// ─── Address helpers (per-user, localStorage) — UNCHANGED ────────────────────
const getAddressKey = () => {
  const userId = getUserIdFromToken();
  return userId ? `address_${userId}` : "address_guest";
};

const getSavedAddress = () => {
  if (typeof window === "undefined") return null;
  const key = getAddressKey();
  if (!key) return null;
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch {
    return null;
  }
};

const saveAddressToStorage = (address) => {
  const key = getAddressKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(address));
};

// ─── Empty address form — UNCHANGED ──────────────────────────────────────────
const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
};

// ─── Address Modal — UNCHANGED ────────────────────────────────────────────────
function AddressModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_ADDRESS);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
    if (!form.addressLine.trim()) e.addressLine = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(form.postalCode))
      e.postalCode = "Enter valid 6-digit PIN";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    saveAddressToStorage(form);
    localStorage.setItem("pincode", form.postalCode);
    window.dispatchEvent(new Event("addressUpdated"));
    onSave(form);
  };

  const field = (label, key, placeholder, type = "text") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-sky-700">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => {
          setForm((f) => ({ ...f, [key]: e.target.value }));
          setErrors((err) => ({ ...err, [key]: undefined }));
        }}
        placeholder={placeholder}
        className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors[key] ? "border-red-400 bg-red-50" : "border-sky-200 bg-sky-50 focus:border-sky-400"}`}
      />
      {errors[key] && (
        <span className="text-xs text-red-500">{errors[key]}</span>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-8 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-1">
          <div className="w-10 h-1 rounded-full bg-sky-200" />
        </div>
        <p className="text-base font-bold text-sky-800">
          {initial ? "Edit Address" : "Add Address"}
        </p>
        {field("Full Name", "fullName", "John Doe")}
        {field("Phone Number", "phone", "10-digit mobile number", "tel")}
        {field("Address Line", "addressLine", "House no, Street, Area")}
        {field("Landmark (optional)", "landmark", "Near landmark")}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-sky-700">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => {
                setForm((f) => ({ ...f, city: e.target.value }));
                setErrors((err) => ({ ...err, city: undefined }));
              }}
              placeholder="Bengaluru"
              className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors.city ? "border-red-400 bg-red-50" : "border-sky-200 bg-sky-50 focus:border-sky-400"}`}
            />
            {errors.city && (
              <span className="text-xs text-red-500">{errors.city}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-sky-700">State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => {
                setForm((f) => ({ ...f, state: e.target.value }));
                setErrors((err) => ({ ...err, state: undefined }));
              }}
              placeholder="Karnataka"
              className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors.state ? "border-red-400 bg-red-50" : "border-sky-200 bg-sky-50 focus:border-sky-400"}`}
            />
            {errors.state && (
              <span className="text-xs text-red-500">{errors.state}</span>
            )}
          </div>
        </div>
        {field("PIN Code", "postalCode", "560001", "tel")}
        <button
          onClick={handleSave}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3.5 rounded-2xl text-sm transition active:scale-95"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // All existing state — UNCHANGED
  const [cartItems, setCartItems] = useState([]);
  const [payment, setPayment] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [address, setAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [discount, setDiscount] = useState(0);

  // ── NEW: Coins state ────────────────────────────────────────────────────────
  const [availableCoins, setAvailableCoins] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  // On mount: load items + saved address — UNCHANGED + coins load
  useEffect(() => {
    const storedItem = localStorage.getItem("checkoutItem");
    if (storedItem) {
      setCartItems([JSON.parse(storedItem)]);
      localStorage.removeItem("checkoutItem");
    } else {
      setCartItems(getCart());
    }
    setAddress(getSavedAddress());
    const coupon = JSON.parse(localStorage.getItem("coupon"));
    if (coupon) setDiscount(coupon.discount);

    // ── NEW: Load coin balance (from localStorage, synced by profile page) ──
    const userId = getUserIdFromToken();
    if (userId) {
      // Try backend first for freshest balance
      const token = localStorage.getItem("token");
      fetch(`${API_BASE}/users/${userId}/coins`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "success") {
            const c = data.data?.coins || 0;
            setAvailableCoins(c);
            localStorage.setItem("userCoins", String(c));
          }
        })
        .catch(() => {
          // Fallback to localStorage cache
          const cached = Number(localStorage.getItem("userCoins") || "0");
          setAvailableCoins(cached);
        });
    }
  }, []);

  // ── Price calculations — UPDATED to include coins deduction ────────────────
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  // Coins that can be applied: max = subtotal (never deduct delivery fee)
  const maxApplicable = subtotal - discountAmount + DELIVERY_FEE;

  const coinsToApply = useCoins ? Math.min(availableCoins, maxApplicable) : 0;

  const total = subtotal - discountAmount + DELIVERY_FEE - coinsToApply;

  const isFullyPaidByCoins = total === 0;

  // ── Place Order — UPDATED to deduct coins if used ──────────────────────────
  const handlePlaceOrder = async () => {
    if (!address) {
      setOrderError("Please add your delivery address to continue");
      setShowModal(true); // optional: auto open form
      return;
    }
    const userPincode = address?.postalCode;
    const invalidItems = cartItems.filter(
      (item) =>
        !item.availablePincodes ||
        !item.availablePincodes.includes(userPincode),
    );
    if (invalidItems.length > 0) {
      setOrderError(`"${invalidItems[0].title}" is not available in your area`);
      return;
    }

    setPlacing(true);
    setOrderError("");

    try {
      const token = localStorage.getItem("token");

      // ── NEW: Deduct coins from backend BEFORE placing order ────────────────
      if (useCoins && coinsToApply > 0) {
        const deductRes = await fetch(`${API_BASE}/users/coins/deduct`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: coinsToApply }),
        });
        const deductData = await deductRes.json();
        if (!deductRes.ok)
          throw new Error(deductData.message || "Failed to apply coins");

        // Update local cache
        const newBalance =
          deductData.data?.remainingCoins ?? availableCoins - coinsToApply;
        localStorage.setItem("userCoins", String(newBalance));
        setAvailableCoins(newBalance);
      }

      // ── Existing order placement logic — UNCHANGED ─────────────────────────
      const endpoint = isFullyPaidByCoins
        ? `${API_BASE}/orders/create-cod`
        : payment === "cod"
          ? `${API_BASE}/orders/create-cod`
          : `${API_BASE}/orders/create-pending`;

      const products = cartItems.map((item) => ({
        product: item.productId,
        quantity: item.qty,
        color: item.color,
        size: item.size,
      }));

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products, shippingAddress: address }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      const isBuyNow = !!searchParams.get("item");
      if (!isBuyNow) clearCart();

      const orderId = data.data?.orderId;
      router.push(`/order-confirm?orderId=${orderId}`);
    } catch (err) {
      let msg = err.message || "";

      if (msg.includes("shippingAddress")) {
        msg = "Please fill all required address details (Name, Phone, Address)";
      }

      setOrderError(msg);
    } finally {
      setPlacing(false);
    }
  };

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col max-w-md mx-auto relative overflow-x-hidden">
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(14,165,233,0.4)} 70%{box-shadow:0 0 0 10px rgba(14,165,233,0)} 100%{box-shadow:0 0 0 0 rgba(14,165,233,0)} }
        @keyframes spin-check { 0%{transform:scale(0) rotate(-90deg);opacity:0} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes coinPop { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        .slide-down{animation:slideDown 0.5s cubic-bezier(.4,0,.2,1) both}
        .item-row{animation:fadeUp 0.45s cubic-bezier(.4,0,.2,1) both}
        .item-row:nth-child(1){animation-delay:0.05s} .item-row:nth-child(2){animation-delay:0.15s} .item-row:nth-child(3){animation-delay:0.25s}
        .summary-block{animation:fadeUp 0.5s 0.3s cubic-bezier(.4,0,.2,1) both}
        .pay-block{animation:fadeUp 0.5s 0.45s cubic-bezier(.4,0,.2,1) both}
        .btn-block{animation:fadeUp 0.5s 0.6s cubic-bezier(.4,0,.2,1) both}
        .coins-block{animation:fadeUp 0.5s 0.38s cubic-bezier(.4,0,.2,1) both}
        .pay-card{transition:all 0.3s cubic-bezier(.4,0,.2,1);cursor:pointer;position:relative;overflow:hidden}
        .pay-card::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 70% 50%,rgba(14,165,233,0.08),transparent 70%);opacity:0;transition:opacity 0.3s}
        .pay-card:hover::after{opacity:1}
        .pay-card.selected{border-color:#0ea5e9;background:#f0f9ff;animation:pulse-ring 1.2s ease-out}
        .check-icon{animation:spin-check 0.35s cubic-bezier(.36,.07,.19,.97) both}
        .place-btn{transition:all 0.25s ease;position:relative;overflow:hidden}
        .place-btn:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(14,165,233,0.4)}
        .place-btn:not(:disabled):active{transform:scale(0.97)}
        .loading-dots span{display:inline-block;animation:bounce 0.8s infinite}
        .loading-dots span:nth-child(2){animation-delay:0.15s} .loading-dots span:nth-child(3){animation-delay:0.3s}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)}}
        .img-card{transition:transform 0.3s ease} .img-card:hover{transform:scale(1.06) rotate(-1deg)}
        .divider-dot{width:4px;height:4px;border-radius:50%;background:#bae6fd;display:inline-block}
        .coins-toggle{transition:all 0.25s ease}
        .coins-toggle-active{background:linear-gradient(135deg,#fffbeb,#fef3c7);border-color:#f59e0b}
        .coin-saving{animation:coinPop 0.4s cubic-bezier(.36,.07,.19,.97) both}
      `}</style>

      {/* ── Header — UNCHANGED ── */}
      <div className="slide-down sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-sky-100 px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-sky-800 tracking-tight flex-1">
          Checkout
        </h1>
        <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full font-medium">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 pt-5 space-y-4">
        {/* ── Order Summary Card — UNCHANGED ── */}
        <div className="slide-down bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2">
            <span className="text-base font-bold text-sky-800">
              Order Summary
            </span>
            <div className="flex-1 h-px bg-sky-50 ml-2" />
            <span className="text-xs text-sky-400 font-medium">Review</span>
          </div>
          <div className="px-4 pb-4 space-y-3">
            {cartItems.length === 0 ? (
              <p className="text-sm text-sky-400 text-center py-4">
                No items found
              </p>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={item.variantId || idx}
                  className="item-row flex items-center gap-3 p-2 rounded-2xl hover:bg-sky-50/60 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image || "/img/placeholder.jpeg"}
                      alt={item.title}
                      className="img-card w-16 h-16 rounded-xl object-cover shadow-sm"
                    />
                    {item.qty > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                        {item.qty}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sky-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-sky-400 mt-0.5">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-sky-700">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                    {item.qty > 1 && (
                      <p className="text-xs text-sky-300">₹{item.price} each</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mx-4 flex items-center gap-1.5 py-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="divider-dot" />
            ))}
          </div>

          {/* Price breakdown — UPDATED with coins line */}
          <div className="summary-block px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm text-sky-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-sky-600">
              <span>Delivery</span>
              <span className="text-emerald-500 font-medium">
                ₹{DELIVERY_FEE}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Coupon ({discount}%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            {/* ── NEW: Coins deduction row ── */}
            {useCoins && coinsToApply > 0 && (
              <div
                className="coin-saving flex justify-between text-sm font-bold"
                style={{ color: "#f59e0b" }}
              >
                <span className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#f59e0b" />
                    <text
                      x="12"
                      y="16"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="white"
                    >
                      ₿
                    </text>
                  </svg>
                  Coins Applied
                </span>
                <span>-₹{coinsToApply.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-sky-800 pt-2 border-t border-sky-50">
              <span>Total</span>
              <span className="text-sky-600">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ── NEW: Use Coins Card — shown only if user has coins ── */}
        {availableCoins > 0 && (
          <div className="coins-block">
            <button
              onClick={() => setUseCoins((v) => !v)}
              className={`coins-toggle w-full rounded-3xl shadow-sm border px-5 py-4 flex items-center gap-3 text-left ${useCoins ? "coins-toggle-active border-amber-300" : "bg-white border-sky-100"}`}
            >
              {/* Coin icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: useCoins
                    ? "linear-gradient(135deg,#f59e0b,#f97316)"
                    : "#fffbeb",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill={useCoins ? "white" : "#f59e0b"}
                    fillOpacity={useCoins ? "0.3" : "1"}
                  />
                  <text
                    x="12"
                    y="16.5"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={useCoins ? "white" : "white"}
                  >
                    ₿
                  </text>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-black ${useCoins ? "text-amber-800" : "text-gray-800"}`}
                >
                  {useCoins
                    ? `Saving ₹${coinsToApply.toLocaleString()} with coins!`
                    : "Use Your Coins"}
                </p>
                <p
                  className={`text-xs font-semibold mt-0.5 ${useCoins ? "text-amber-600" : "text-gray-400"}`}
                >
                  {availableCoins.toLocaleString()} coins available · worth ₹
                  {availableCoins.toLocaleString()}
                </p>
              </div>

              {/* Toggle switch */}
              <div
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300"
                style={{ background: useCoins ? "#f59e0b" : "#e2e8f0" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300"
                  style={{ left: useCoins ? "calc(100% - 20px)" : "4px" }}
                />
              </div>
            </button>
          </div>
        )}

        {/* ── Payment Method — UNCHANGED ── */}
        <div className="pay-block bg-white rounded-3xl shadow-sm border border-sky-100 p-5">
          <p className="text-base font-bold text-sky-800 mb-4">
            Payment Method
          </p>
          <div className="space-y-3">
            <div
              className={`pay-card flex items-center gap-4 p-4 rounded-2xl border-2 ${payment === "online" ? "selected border-sky-400 bg-sky-50" : "border-sky-100 bg-white"} ${isFullyPaidByCoins ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => !isFullyPaidByCoins && setPayment("online")}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${payment === "online" ? "bg-sky-500" : "bg-sky-50"}`}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={payment === "online" ? "#fff" : "#38bdf8"}
                  strokeWidth="2"
                >
                  <rect x="2" y="5" width="20" height="14" rx="3" />
                  <path d="M2 10h20" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold transition-colors ${payment === "online" ? "text-sky-700" : "text-sky-900"}`}
                >
                  Online Payment
                </p>
                <p className="text-xs text-sky-400 mt-0.5">
                  UPI · Card · Netbanking
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payment === "online" ? "border-sky-500 bg-sky-500" : "border-sky-200"}`}
              >
                {payment === "online" && (
                  <svg
                    className="check-icon"
                    width="11"
                    height="11"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>

            <div
              className={`pay-card flex items-center gap-4 p-4 rounded-2xl border-2 ${payment === "cod" ? "selected border-sky-400 bg-sky-50" : "border-sky-100 bg-white"} ${isFullyPaidByCoins ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => !isFullyPaidByCoins && setPayment("cod")}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${payment === "cod" ? "bg-sky-500" : "bg-sky-50"}`}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={payment === "cod" ? "#fff" : "#38bdf8"}
                  strokeWidth="2"
                >
                  <path
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2"
                    strokeLinecap="round"
                  />
                  <rect x="9" y="11" width="12" height="8" rx="2" />
                  <circle
                    cx="15"
                    cy="15"
                    r="1.5"
                    fill={payment === "cod" ? "#fff" : "#38bdf8"}
                    stroke="none"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold transition-colors ${payment === "cod" ? "text-sky-700" : "text-sky-900"}`}
                >
                  Cash on Delivery
                </p>
                <p className="text-xs text-sky-400 mt-0.5">
                  Pay when you receive
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${payment === "cod" ? "border-sky-500 bg-sky-500" : "border-sky-200"}`}
              >
                {payment === "cod" && (
                  <svg
                    className="check-icon"
                    width="11"
                    height="11"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Delivery Address — UNCHANGED ── */}
        <div className="summary-block bg-white rounded-3xl shadow-sm border border-sky-100 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#38bdf8"
              strokeWidth="2"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-sky-400 font-medium">Delivering to</p>
            {address ? (
              <p className="text-sm font-semibold text-sky-800 truncate">
                {address.addressLine}, {address.city} — {address.postalCode}
              </p>
            ) : (
              <p className="text-sm text-sky-400 italic">
                No address added yet
              </p>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-sky-500 font-semibold hover:text-sky-700 transition-colors whitespace-nowrap"
          >
            {address ? "Change" : "Add"}
          </button>
        </div>

        {/* ── Error message — UNCHANGED ── */}
        {orderError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-medium">
            {orderError}
          </div>
        )}

        {/* ── Place Order Button — UNCHANGED logic, updated label ── */}
        <div className="px-1 pt-4 pb-6">
          <button
            onClick={handlePlaceOrder}
            disabled={!address || placing || cartItems.length === 0}
            className="place-btn w-full bg-sky-500 text-white font-semibold text-base py-4 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placing ? (
              <span className="loading-dots flex items-center justify-center gap-1">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </span>
            ) : !address ? (
              "Add Address to Continue"
            ) : isFullyPaidByCoins ? (
              "Place Order (Paid via Coins)"
            ) : (
              `Place Order · ₹${total.toLocaleString()}`
            )}
          </button>
        </div>
      </div>

      {/* ── Address Modal — UNCHANGED ── */}
      {showModal && (
        <AddressModal
          initial={address}
          onSave={(addr) => {
            setAddress(addr);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
