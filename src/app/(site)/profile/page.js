"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  MapPin,
  ClipboardList,
  Gift,
  Star,
  Bell,
  LogOut,
  Edit3,
  Package,
  Zap,
  Award,
  Check,
  X,
  ShieldCheck,
  Settings,
  Coins,
} from "lucide-react";
import { getUserIdFromToken } from "@/utils/auth";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
};

// ── Address Modal (unchanged) ─────────────────────────────────────────────────
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
          {initial?.addressLine ? "Edit Address" : "Add Address"}
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

// ── Buy Coins Modal ───────────────────────────────────────────────────────────
function BuyCoinsModal({ onClose, onSuccess }) {
  const PACKAGES = [
    { coins: 500, price: 500, tag: null },
    { coins: 1000, price: 1000, tag: "Popular" },
    { coins: 2000, price: 2000, tag: null },
    { coins: 5000, price: 5000, tag: "Best Value" },
  ];

  const [selected, setSelected] = useState(PACKAGES[1]);
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = useCustom ? Number(custom) : selected.coins;

  const handleSubmit = async () => {
    if (!finalAmount || finalAmount < 100) {
      setError("Minimum purchase is ₹100 (= 100 coins)");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // Submit coin request to backend — admin will approve after receiving payment
      const res = await fetch(`${API_BASE}/users/coins/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");

      onSuccess(finalAmount);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-10 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.3" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="white"
              >
                ₿
              </text>
            </svg>
          </div>
          <div>
            <p className="text-base font-black text-gray-900">Buy Coins</p>
            <p className="text-xs text-gray-400 font-medium">
              1 Coin = ₹1 · Use at checkout
            </p>
          </div>
        </div>

        {/* How it works */}
        <div
          className="mt-4 mb-5 px-4 py-3 rounded-2xl"
          style={{ background: "#fffbeb", border: "1px solid #fde68a" }}
        >
          <p className="text-xs font-bold text-amber-700 mb-1">How it works</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            Select a package → Submit request → Pay the amount directly to the
            admin → Admin credits your coins. You'll see coins in your profile
            once approved.
          </p>
        </div>

        {/* Packages */}
        <p className="text-sm font-black text-gray-700 mb-3">Choose Package</p>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.coins}
              onClick={() => {
                setSelected(pkg);
                setUseCustom(false);
              }}
              className="relative rounded-2xl p-3.5 text-left transition-all active:scale-95"
              style={{
                border:
                  !useCustom && selected.coins === pkg.coins
                    ? "2px solid #f59e0b"
                    : "2px solid #f1f5f9",
                background:
                  !useCustom && selected.coins === pkg.coins
                    ? "#fffbeb"
                    : "white",
              }}
            >
              {pkg.tag && (
                <span
                  className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                  style={{
                    background:
                      pkg.tag === "Best Value" ? "#f97316" : "#0ea5e9",
                  }}
                >
                  {pkg.tag}
                </span>
              )}
              <p className="text-lg font-black text-gray-800">
                {pkg.coins.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-gray-400">coins</p>
              <p
                className="text-sm font-black mt-1"
                style={{ color: "#f59e0b" }}
              >
                ₹{pkg.price}
              </p>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <button
          onClick={() => setUseCustom(!useCustom)}
          className="w-full py-3 rounded-2xl text-sm font-bold mb-3 transition-all"
          style={{
            border: useCustom ? "2px solid #f59e0b" : "2px dashed #e2e8f0",
            background: useCustom ? "#fffbeb" : "transparent",
            color: useCustom ? "#b45309" : "#94a3b8",
          }}
        >
          {useCustom ? "Custom Amount" : "+ Enter Custom Amount"}
        </button>

        {useCustom && (
          <div className="mb-4">
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-3"
              style={{ background: "#f8fafc", border: "2px solid #e2e8f0" }}
            >
              <span className="text-lg font-black text-gray-400">₹</span>
              <input
                type="number"
                placeholder="Enter amount (min ₹100)"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                className="flex-1 text-base font-black text-gray-800 bg-transparent outline-none"
                style={{ fontFamily: "Nunito, sans-serif" }}
                min={100}
              />
            </div>
            {custom && Number(custom) >= 100 && (
              <p className="text-xs text-green-600 font-bold mt-1.5 pl-1">
                = {Number(custom).toLocaleString()} coins will be added
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        <div
          className="rounded-2xl px-4 py-3 mb-4"
          style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-sky-700">You get</span>
            <span className="text-lg font-black text-sky-600">
              {finalAmount ? Number(finalAmount).toLocaleString() : "—"} coins
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-bold text-sky-700">Pay to admin</span>
            <span className="text-base font-black text-gray-800">
              ₹{finalAmount ? Number(finalAmount).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 font-bold mb-3 px-1">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting || !finalAmount || finalAmount < 100}
          className="w-full py-4 rounded-2xl font-black text-white text-sm transition-all active:scale-95 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
        >
          {submitting
            ? "Submitting..."
            : `Request ${finalAmount ? Number(finalAmount).toLocaleString() : ""} Coins`}
        </button>
      </div>
    </div>
  );
}

// ── Success Modal ─────────────────────────────────────────────────────────────
function CoinsRequestedModal({ amount, onClose }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Request Sent!</h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-1">
          Your request for{" "}
          <span className="font-black text-amber-500">
            {Number(amount).toLocaleString()} coins
          </span>{" "}
          has been sent to the admin.
        </p>
        <p className="text-xs text-gray-400 font-medium mb-6">
          Pay{" "}
          <span className="font-black">₹{Number(amount).toLocaleString()}</span>{" "}
          to the admin. Coins will appear in your account once approved.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-black text-white text-sm"
          style={{ background: "linear-gradient(135deg,#f59e0b,#f97316)" }}
        >
          Got It
        </button>
      </div>
    </div>
  );
}

// ── Subscriptions data (unchanged) ───────────────────────────────────────────
const subscriptions = [
  {
    id: 1,
    name: "Full Cream Milk",
    qty: "1 L",
    schedule: "Daily Morning",
    bg: "#f59e0b",
    img: "/img/yogurt.jpeg",
  },
  {
    id: 2,
    name: "Fresh Curd",
    qty: "250g",
    schedule: "Alt Days",
    bg: "#1e3a5f",
    img: "/img/curd.jpeg",
  },
  {
    id: 3,
    name: "Fresh Paneer",
    qty: "250g",
    schedule: "Every Sunday",
    bg: "#0ea5e9",
    img: "/img/panner.jpeg",
  },
];

// ── Profile Page ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orderCount, setOrderCount] = useState(0);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  // ── NEW: Coins state ──────────────────────────────────────────────────────
  const [coins, setCoins] = useState(0);
  const [showBuyCoins, setShowBuyCoins] = useState(false);
  const [showCoinsSuccess, setShowCoinsSuccess] = useState(false);
  const [coinsRequestedAmount, setCoinsRequestedAmount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userId = getUserIdFromToken();
    const guestAddr = localStorage.getItem("address_guest");
    if (guestAddr && userId) {
      const userAddrKey = `address_${userId}`;
      if (!localStorage.getItem(userAddrKey))
        localStorage.setItem(userAddrKey, guestAddr);
    }
    if (!userId) {
      router.push("/login");
      return;
    }

    // Show stored user immediately
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) {
        setUser(stored);
        setNameInput(stored.name || "");
      }
    } catch {}

    // Load address
    try {
      const addr = JSON.parse(localStorage.getItem(`address_${userId}`));
      if (addr) setAddress(addr);
    } catch {}

    // Fetch order count
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (res.ok) setOrderCount((data.data || []).length);
        } catch {}
      } catch {}
    };

    // ── NEW: Fetch coin balance from backend ──────────────────────────────
    const fetchCoins = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${userId}/coins`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCoins(data.data?.coins || 0);
          // Keep localStorage in sync for checkout page
          localStorage.setItem("userCoins", String(data.data?.coins || 0));
        }
      } catch {}
    };

    fetchOrders();
    fetchCoins();
    setLoading(false);
  }, []);

  // ── Save address (unchanged) ─────────────────────────────────────────────
  const handleSaveAddress = (newAddr) => {
    const userId = getUserIdFromToken();
    if (userId)
      localStorage.setItem(`address_${userId}`, JSON.stringify(newAddr));
    localStorage.setItem("pincode", newAddr.postalCode);
    setAddress(newAddr);
    setShowAddressModal(false);
    window.dispatchEvent(new Event("addressUpdated"));
  };

  // ── Save name (unchanged) ────────────────────────────────────────────────
  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = { ...user, name: nameInput.trim() };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setEditingName(false);
  };

  // ── Logout (unchanged) ───────────────────────────────────────────────────
  const handleLogout = () => {
    const userId = getUserIdFromToken();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (userId) localStorage.removeItem(`cart_${userId}`);
    localStorage.removeItem("cart_guest");
    if (userId) localStorage.removeItem(`address_${userId}`);
    localStorage.removeItem("pincode");
    localStorage.removeItem("userCoins");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  // ── NEW: Handle coins request success ────────────────────────────────────
  const handleCoinsRequestSuccess = (amount) => {
    setCoinsRequestedAmount(amount);
    setShowBuyCoins(false);
    setShowCoinsSuccess(true);
  };

  // ── Derived (unchanged) ──────────────────────────────────────────────────
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const isAdmin =
    user?.isAdmin === true || String(user?.role).toUpperCase() === "ADMIN";

  // ── UPDATED: Replace "Points" with "Coins" using live data ───────────────
  const stats = [
    { label: "Orders", value: String(orderCount), Icon: Package },
    { label: "Active Sub", value: "3", Icon: Zap },
    {
      label: "Coins",
      value: coins >= 1000 ? `${(coins / 1000).toFixed(1)}k` : String(coins),
      Icon: Award,
    },
  ];

  const accountItems = [
    {
      Icon: ClipboardList,
      label: "Order History",
      sub: `${orderCount} order${orderCount !== 1 ? "s" : ""} placed`,
      iconBg: "#fff7ed",
      iconColor: "#f97316",
      href: "/order-his",
    },
    {
      Icon: Gift,
      label: "Refer & Earn",
      sub: "Get Rs.50 per referral",
      iconBg: "#fdf4ff",
      iconColor: "#a855f7",
      href: "/profile/refer",
    },
    {
      Icon: Bell,
      label: "Notifications",
      sub: "Manage your alerts",
      iconBg: "#fff1f2",
      iconColor: "#f43f5e",
      href: "/notifications",
    },
    {
      Icon: Settings,
      label: "Settings",
      sub: "App preferences",
      iconBg: "#f8fafc",
      iconColor: "#64748b",
      href: "/profile/settings",
    },
  ];

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] max-w-md mx-auto flex flex-col">
        <div
          className="h-56 animate-pulse"
          style={{
            background:
              "linear-gradient(160deg,#1a4f9c 0%,#1565c0 50%,#0d47a1 100%)",
          }}
        />
        <div className="px-4 -mt-1 pb-2">
          <div className="h-24 rounded-3xl bg-gray-200 animate-pulse" />
        </div>
        <div className="px-4 pt-4 space-y-4">
          <div className="h-20 rounded-3xl bg-gray-200 animate-pulse" />
          <div className="h-48 rounded-3xl bg-gray-200 animate-pulse" />
          <div className="h-64 rounded-3xl bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] max-w-md mx-auto relative flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *, body { font-family: 'Nunito', system-ui, sans-serif; }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn { 0%{opacity:0;transform:scale(0.85)} 70%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:-300px 0} 100%{background-position:300px 0} }
        @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 rgba(251,191,36,0.5)} 70%{box-shadow:0 0 0 10px rgba(251,191,36,0)} 100%{box-shadow:0 0 0 0 rgba(251,191,36,0)} }
        @keyframes coinShine { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .fade-up{animation:fadeSlideUp 0.45s ease both} .fade-up-1{animation:fadeSlideUp 0.45s 0.06s ease both} .fade-up-2{animation:fadeSlideUp 0.45s 0.12s ease both} .fade-up-3{animation:fadeSlideUp 0.45s 0.18s ease both} .fade-up-4{animation:fadeSlideUp 0.45s 0.24s ease both} .fade-up-5{animation:fadeSlideUp 0.45s 0.30s ease both} .fade-up-6{animation:fadeSlideUp 0.45s 0.36s ease both}
        .pop-in{animation:popIn 0.5s cubic-bezier(.36,.07,.19,.97) both}
        .avatar-ring{animation:pulse-ring 2.5s ease infinite}
        .stat-card{transition:transform 0.2s,box-shadow 0.2s} .stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(14,165,233,0.15)}
        .sub-card{transition:transform 0.2s,box-shadow 0.2s;flex-shrink:0} .sub-card:hover{transform:translateY(-4px) scale(1.02)}
        .account-row{transition:background 0.18s,transform 0.18s} .account-row:hover{background:#f0f9ff !important;transform:translateX(3px)} .account-row:active{transform:scale(0.98)}
        .membership-badge{background:linear-gradient(90deg,#fff 0%,#fef9c3 40%,#fff 60%,#fff 100%);background-size:300px 100%;animation:shimmer 2.5s linear infinite}
        .sub-scroll::-webkit-scrollbar{display:none} .sub-scroll{-ms-overflow-style:none;scrollbar-width:none}
        .leaf-decoration{position:absolute;opacity:0.12;pointer-events:none}
        .sub-img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
        .name-input{background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.4);border-radius:12px;color:white;font-family:'Nunito',sans-serif;font-weight:800;font-size:1.2rem;text-align:center;outline:none;padding:4px 12px;width:180px}
        .name-input::placeholder{color:rgba(255,255,255,0.5)}
        .coins-card{background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 50%,#fffbeb 100%);border:1.5px solid #fde68a;transition:transform 0.2s,box-shadow 0.2s}
        .coins-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(245,158,11,0.2)}
        .buy-btn{background:linear-gradient(135deg,#f59e0b,#f97316);transition:all 0.2s} .buy-btn:hover{opacity:0.9;transform:scale(1.03)} .buy-btn:active{transform:scale(0.97)}
      `}</style>

      {/* ── Hero (unchanged) ── */}
      <div
        className="relative overflow-hidden px-5 pt-12 pb-8"
        style={{
          background:
            "linear-gradient(160deg,#1a4f9c 0%,#1565c0 50%,#0d47a1 100%)",
        }}
      >
        <div
          className="leaf-decoration"
          style={{ top: -10, left: -20, width: 100, height: 100 }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <ellipse
              cx="60"
              cy="40"
              rx="45"
              ry="30"
              fill="white"
              transform="rotate(-30 60 40)"
            />
            <ellipse
              cx="40"
              cy="60"
              rx="35"
              ry="20"
              fill="white"
              transform="rotate(-30 40 60)"
            />
          </svg>
        </div>
        <div
          className="leaf-decoration"
          style={{ top: 20, right: -15, width: 80, height: 80 }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <ellipse
              cx="40"
              cy="40"
              rx="40"
              ry="25"
              fill="white"
              transform="rotate(30 40 40)"
            />
          </svg>
        </div>

        <div className="flex justify-between items-center mb-4 relative z-10">
          {isAdmin ? (
            <Link href="/admin">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                style={{
                  background: "rgba(245,158,11,0.25)",
                  border: "1.5px solid rgba(245,158,11,0.6)",
                  color: "#fbbf24",
                }}
              >
                <ShieldCheck size={13} strokeWidth={2.5} /> Admin Panel
              </button>
            </Link>
          ) : (
            <div />
          )}

          {!editingName ? (
            <button
              onClick={() => {
                setNameInput(user?.name || "");
                setEditingName(true);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Edit3 size={14} color="white" strokeWidth={2.2} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveName}
                disabled={savingName}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#22c55e", border: "1.5px solid #16a34a" }}
              >
                <Check size={14} color="white" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <X size={14} color="white" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center relative z-10">
          <div className="pop-in relative mb-3">
            <div
              className="avatar-ring w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
              style={{
                background: "white",
                border: "3px solid #f59e0b",
                color: "#1565c0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              {initials}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#f59e0b", border: "2px solid white" }}
            >
              <Star size={11} fill="white" color="white" strokeWidth={0} />
            </div>
          </div>
          {editingName ? (
            <input
              className="name-input fade-up mt-1"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              autoFocus
              placeholder="Your name"
            />
          ) : (
            <h1 className="fade-up text-xl font-black text-white mt-1">
              {user?.name || "User"}
            </h1>
          )}
          <p
            className="fade-up-1 text-sm font-semibold mt-0.5"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {user?.email || ""}
          </p>
          <div className="fade-up-2 mt-3">
            <div
              className="membership-badge px-5 py-2 rounded-full flex items-center gap-2"
              style={{ boxShadow: "0 2px 12px rgba(245,158,11,0.3)" }}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-black" style={{ color: "#b45309" }}>
                Gold Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats (Coins replaces Points, now live) ── */}
      <div className="fade-up-2 px-4 -mt-1 pb-2">
        <div
          className="grid grid-cols-3 gap-3 bg-white rounded-3xl p-4"
          style={{
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #e0f2fe",
          }}
        >
          {stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="stat-card flex flex-col items-center py-2 rounded-2xl"
              style={{ background: label === "Coins" ? "#fffbeb" : "#f0f7ff" }}
            >
              <Icon
                size={16}
                color={label === "Coins" ? "#f59e0b" : "#0ea5e9"}
                strokeWidth={2.2}
                className="mb-1"
              />
              <span className="text-lg font-black text-gray-800 leading-tight">
                {value}
              </span>
              <span
                className="text-[11px] font-bold mt-0.5"
                style={{ color: label === "Coins" ? "#f59e0b" : "#0ea5e9" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scrollable ── */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-5">
        {/* ── NEW: Coins Card ── */}
        <div className="fade-up-2">
          <div
            className="coins-card rounded-3xl px-4 py-4"
            style={{ boxShadow: "0 2px 16px rgba(245,158,11,0.1)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#f97316)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="white"
                      fillOpacity="0.25"
                    />
                    <text
                      x="12"
                      y="16.5"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="white"
                    >
                      ₿
                    </text>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-bold">
                    Available Coins
                  </p>
                  <p className="text-2xl font-black text-amber-800 leading-tight">
                    {coins.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBuyCoins(true)}
                className="buy-btn px-4 py-2.5 rounded-xl text-white text-xs font-black"
              >
                + Buy Coins
              </button>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(245,158,11,0.1)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-[11px] font-bold text-amber-600">
                1 coin = ₹1 off at checkout · Use while placing orders
              </p>
            </div>
          </div>
        </div>

        {/* ── Address Card (unchanged) ── */}
        <div className="fade-up-2">
          <div
            className="bg-white rounded-3xl px-4 py-4 flex items-center gap-3"
            style={{
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              border: "1px solid #fff7ed",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#fff7ed", border: "1.5px solid #fdba74" }}
            >
              <MapPin size={18} strokeWidth={2.2} color="#f97316" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-bold">
                Delivery Address
              </p>
              {address ? (
                <>
                  <p className="text-sm font-black text-gray-800 truncate">
                    {address.addressLine}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 truncate">
                    {address.city}, {address.state} — {address.postalCode}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">No address saved</p>
              )}
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              className="text-xs font-black transition-transform hover:scale-105"
              style={{ color: "#f59e0b" }}
            >
              {address ? "Change" : "Add"}
            </button>
          </div>
        </div>

        {/* ── Subscriptions (unchanged) ── */}
        <div className="fade-up-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-gray-800">Subscriptions</h2>
            <button className="text-sm font-black" style={{ color: "#f59e0b" }}>
              Manage
            </button>
          </div>
          <div className="sub-scroll flex gap-3 overflow-x-auto pb-2">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="sub-card relative rounded-2xl overflow-hidden"
                style={{
                  background: sub.bg,
                  minWidth: 140,
                  height: 160,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black text-white z-10"
                  style={{ background: "#22c55e" }}
                >
                  Active
                </div>
                <div
                  className="absolute top-3 left-3 w-12 h-12 rounded-xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sub.img} alt={sub.name} className="sub-img" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white/80 text-[11px] font-bold">
                    {sub.name}
                  </p>
                  <p className="text-white text-lg font-black leading-tight">
                    {sub.qty}
                  </p>
                  <p className="text-white/70 text-[10px] font-semibold mt-0.5">
                    {sub.schedule}
                  </p>
                </div>
              </div>
            ))}
            <div
              className="sub-card flex flex-col items-center justify-center rounded-2xl cursor-pointer"
              style={{
                minWidth: 100,
                height: 160,
                background: "white",
                border: "2px dashed #bae6fd",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                style={{ background: "#e0f2fe" }}
              >
                <Zap size={18} color="#0ea5e9" strokeWidth={2.2} />
              </div>
              <p className="text-[11px] font-black text-sky-500 text-center leading-tight px-2">
                Add New
              </p>
            </div>
          </div>
        </div>

        {/* ── Account (unchanged) ── */}
        <div className="fade-up-4">
          <h2 className="text-xl font-black text-gray-800 mb-3">Account</h2>
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            {accountItems.map((item, i) => (
              <Link href={item.href} key={item.label}>
                <div
                  className="account-row flex items-center gap-4 px-4 py-4 bg-white"
                  style={{
                    borderBottom:
                      i < accountItems.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.iconBg }}
                  >
                    <item.Icon
                      size={18}
                      color={item.iconColor}
                      strokeWidth={2.2}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800">
                      {item.label}
                    </p>
                    <p
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: "#64748b" }}
                    >
                      {item.sub}
                    </p>
                  </div>
                  <ChevronRight size={16} color="#cbd5e1" strokeWidth={2.5} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Logout (unchanged) ── */}
        <div className="fade-up-5">
          <button
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-97"
            style={{
              background: "#fff1f2",
              color: "#f43f5e",
              border: "1.5px solid #fecdd3",
            }}
          >
            <LogOut size={17} strokeWidth={2.5} /> Log Out
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAddressModal && (
        <AddressModal
          initial={address}
          onSave={handleSaveAddress}
          onClose={() => setShowAddressModal(false)}
        />
      )}
      {showBuyCoins && (
        <BuyCoinsModal
          onClose={() => setShowBuyCoins(false)}
          onSuccess={handleCoinsRequestSuccess}
        />
      )}
      {showCoinsSuccess && (
        <CoinsRequestedModal
          amount={coinsRequestedAmount}
          onClose={() => setShowCoinsSuccess(false)}
        />
      )}
    </div>
  );
}
