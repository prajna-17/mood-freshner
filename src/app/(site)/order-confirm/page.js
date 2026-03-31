"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  Check,
  Package,
  Truck,
  Home,
  MapPin,
  SunMedium,
  ShoppingBag,
  Download,
  ArrowRight,
  CalendarDays,
  Mail,
  HeadphonesIcon,
} from "lucide-react";
import { getUserIdFromToken } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
// ─── Status → tracker step index ─────────────────────────────────────────────
const STATUS_INDEX = {
  PLACED: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: 0,
};

// ─── Estimated delivery: today + 5 days ──────────────────────────────────────
const getEstimatedDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// ─── Address from localStorage (same key as checkout) ────────────────────────
const getSavedAddress = () => {
  if (typeof window === "undefined") return null;
  const userId = getUserIdFromToken();
  if (!userId) return null;
  try {
    return JSON.parse(localStorage.getItem(`address_${userId}`)) || null;
  } catch {
    return null;
  }
};

// ─── Confetti ─────────────────────────────────────────────────────────────────
function useConfetti(n = 60) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2.2,
    dur: 2.4 + Math.random() * 1.8,
    size: 7 + Math.random() * 8,
    color: [
      "#f59e0b",
      "#10b981",
      "#0ea5e9",
      "#f43f5e",
      "#a78bfa",
      "#fb923c",
      "#34d399",
      "#38bdf8",
      "#fbbf24",
      "#f472b6",
    ][i % 10],
    shape: i % 3,
    rot: Math.random() * 360,
  }));
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  const go = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      onClick={go}
      className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl transition-all active:scale-95"
      style={{
        background: copied ? "#dcfce7" : "#f0fdf4",
        color: copied ? "#16a34a" : "#6b7280",
        border: `1px solid ${copied ? "#86efac" : "#d1fae5"}`,
      }}
    >
      {copied ? (
        <>
          <Check size={11} strokeWidth={3} color="#16a34a" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={11} strokeWidth={2} />
          Copy
        </>
      )}
    </button>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ height = "h-28" }) {
  return (
    <div className={`${height} rounded-3xl bg-gray-100 animate-pulse mb-4`} />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function OrderConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [show, setShow] = useState(false);
  const [cards, setCards] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [address, setAddress] = useState(null);

  const confetti = useConfetti(60);
  const estimatedDate = getEstimatedDate();

  // Fetch order details
  useEffect(() => {
    if (!orderId) {
      setError("No order ID found.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/orders/order-details/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch order");
        setOrder(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    setAddress(getSavedAddress());
  }, [orderId]);

  // Staggered reveal (same timing as original)
  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 80);
    const t2 = setTimeout(() => setCards(true), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ── Derive tracker steps from orderStatus ──────────────────────────────────
  const currentStep = order ? (STATUS_INDEX[order.orderStatus] ?? 0) : 0;
  const isCancelled = order?.orderStatus === "CANCELLED";

  const steps = [
    {
      label: "Confirmed",
      Icon: Check,
      color: "#10b981",
      light: "#dcfce7",
      border: "#86efac",
    },
    {
      label: "Packed",
      Icon: Package,
      color: "#0ea5e9",
      light: "#e0f2fe",
      border: "#7dd3fc",
    },
    {
      label: "Shipped",
      Icon: Truck,
      color: "#f97316",
      light: "#fff7ed",
      border: "#fdba74",
    },
    {
      label: "Delivered",
      Icon: Home,
      color: "#a78bfa",
      light: "#f5f3ff",
      border: "#c4b5fd",
    },
  ].map((s, i) => ({ ...s, done: !isCancelled && i <= currentStep }));

  const total = order ? order.totalAmount + 99 : 0;

  // ── Invoice download ───────────────────────────────────────────────────────
  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/orders/invoice/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to download invoice");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Friendly order ID ──────────────────────────────────────────────────────
  // Backend _id is a mongo ObjectId — show last 8 chars prefixed nicely
  const displayOrderId = order
    ? `ORD-${order._id.slice(-8).toUpperCase()}`
    : orderId
      ? `ORD-${orderId.slice(-8).toUpperCase()}`
      : "—";

  // ── Error state ────────────────────────────────────────────────────────────
  if (!loading && error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 gap-4">
        <p className="text-2xl">😕</p>
        <p className="text-gray-600 font-semibold text-center">{error}</p>
        <Link href="/">
          <button className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold text-sm">
            Go Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *, body { font-family: 'Nunito', system-ui, sans-serif; }

        @keyframes cfFall {
          0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
          88%  { opacity:1; }
          100% { transform:translateY(105vh) rotate(600deg); opacity:0; }
        }
        .cf {
          position:absolute; top:-16px;
          animation:cfFall linear both;
          pointer-events:none; z-index:40;
        }

        @keyframes ringIn {
          0%  { transform:scale(0.15); opacity:0; }
          65% { transform:scale(1.1); }
          100%{ transform:scale(1); opacity:1; }
        }
        @keyframes ringPulse {
          0%,100%{ box-shadow:0 0 0 0 rgba(16,185,129,0.4),0 8px 32px rgba(16,185,129,0.25); }
          55%    { box-shadow:0 0 0 18px rgba(16,185,129,0),0 8px 32px rgba(16,185,129,0.25); }
        }
        .ring-in    { animation:ringIn 0.6s cubic-bezier(.36,.07,.19,.97) both; }
        .ring-pulse { animation:ringPulse 2.4s ease infinite; }

        @keyframes checkDraw {
          from { stroke-dashoffset:60; opacity:0; }
          to   { stroke-dashoffset:0;  opacity:1; }
        }
        .chk-path {
          stroke-dasharray:60; stroke-dashoffset:60;
          animation:checkDraw 0.45s 0.65s ease forwards;
        }

        @keyframes rayOut {
          0%  { transform:scaleY(0); opacity:1; }
          70% { opacity:0.8; }
          100%{ transform:scaleY(1); opacity:0; }
        }
        .ray {
          position:absolute; width:3px; border-radius:3px;
          transform-origin:bottom center;
          animation:rayOut 0.5s 0.7s ease-out both;
        }

        @keyframes headIn {
          0%  { opacity:0; transform:translateY(16px) scale(0.9); }
          70% { transform:translateY(-3px) scale(1.03); }
          100%{ opacity:1; transform:translateY(0) scale(1); }
        }
        .head-in { animation:headIn 0.5s 0.92s ease both; }

        @keyframes floatUp {
          0%,100%{ transform:translateY(0); }
          50%    { transform:translateY(-5px); }
        }
        .float { animation:floatUp 3s ease-in-out infinite; }

        @keyframes slideUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .su  { animation:slideUp 0.42s ease both; }
        .su1 { animation:slideUp 0.42s 0.05s ease both; }
        .su2 { animation:slideUp 0.42s 0.12s ease both; }
        .su3 { animation:slideUp 0.42s 0.20s ease both; }
        .su4 { animation:slideUp 0.42s 0.28s ease both; }
        .su5 { animation:slideUp 0.42s 0.36s ease both; }
        .su6 { animation:slideUp 0.42s 0.44s ease both; }

        @keyframes lineFill { from{width:0} to{width:100%} }
        .lf { animation:lineFill 0.85s 0.15s ease both; }

        @keyframes dotPop {
          0%  { transform:scale(0) rotate(-30deg); }
          70% { transform:scale(1.3) rotate(5deg); }
          100%{ transform:scale(1) rotate(0); }
        }
        .dp { animation:dotPop 0.35s ease both; }

        @keyframes sparkPop {
          0%,100%{ opacity:0; transform:scale(0.4) rotate(0deg); }
          50%    { opacity:1; transform:scale(1.2) rotate(180deg); }
        }
        .sp { animation:sparkPop ease-in-out infinite; }

        .icard { transition:transform 0.2s, box-shadow 0.2s; }
        .icard:hover { transform:translateX(4px); }

        .btn-action {
          transition:transform 0.2s, box-shadow 0.2s;
          position:relative; overflow:hidden;
        }
        .btn-action::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent 60%);
          opacity:0; transition:opacity 0.25s;
        }
        .btn-action:hover::after { opacity:1; }
        .btn-action:hover  { transform:translateY(-2px); }
        .btn-action:active { transform:scale(0.97); }
      `}</style>

      {/* ── Confetti ── */}
      {show &&
        confetti.map((p) => (
          <div
            key={p.id}
            className="cf"
            style={{
              left: `${p.x}%`,
              width: p.shape === 0 ? p.size : p.size * 0.55,
              height:
                p.shape === 0
                  ? p.size
                  : p.shape === 1
                    ? p.size * 0.55
                    : p.size * 1.1,
              borderRadius: p.shape === 0 ? "50%" : "2px",
              background: p.color,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}

      {/* ── Pastel blob header ── */}
      <div
        className="absolute top-0 left-0 right-0 h-80 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(160deg, #e0f2fe 0%, #dcfce7 45%, #fef9c3 75%, #fff 100%)",
          borderRadius: "0 0 60% 60% / 0 0 40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col px-5 pt-12 pb-14">
        {/* ── Top badge ── */}
        <div className="flex justify-end mb-2">
          <div
            className="float bg-white text-emerald-600 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5"
            style={{
              boxShadow: "0 2px 12px rgba(16,185,129,0.2)",
              border: "1.5px solid #86efac",
            }}
          >
            <CheckCircle2 size={13} strokeWidth={2.5} />
            Order Confirmed
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="flex flex-col items-center pt-2 pb-7">
          {/* Check circle + rays */}
          <div className="relative flex items-center justify-center mb-5">
            {show &&
              Array.from({ length: 10 }, (_, i) => {
                const a = (i / 10) * 360;
                const r = (a * Math.PI) / 180;
                const d = 60;
                return (
                  <div
                    key={i}
                    className="ray"
                    style={{
                      height: 14 + (i % 3) * 5,
                      background: `hsl(${90 + i * 26},75%,52%)`,
                      left: `calc(50% + ${Math.sin(r) * d}px - 1.5px)`,
                      top: `${d - Math.cos(r) * d - 7}px`,
                      transform: `rotate(${a}deg)`,
                    }}
                  />
                );
              })}

            <div
              className="ring-in ring-pulse w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#059669,#34d399)" }}
            >
              <svg width="38" height="38" viewBox="0 0 44 44" fill="none">
                <path
                  className="chk-path"
                  d="M10 22l9 9 16-16"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {[
              {
                top: "-10px",
                right: "-2px",
                dur: "1.9s",
                delay: "0.3s",
                col: "#fbbf24",
              },
              {
                top: "6px",
                left: "-12px",
                dur: "2.3s",
                delay: "0.65s",
                col: "#f472b6",
              },
              {
                bottom: "-6px",
                right: "-10px",
                dur: "1.7s",
                delay: "1s",
                col: "#38bdf8",
              },
              {
                bottom: "2px",
                left: "-4px",
                dur: "2.1s",
                delay: "0.5s",
                col: "#a78bfa",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="sp absolute w-2.5 h-2.5 rounded-sm"
                style={{
                  ...s,
                  background: s.col,
                  animationDuration: s.dur,
                  animationDelay: s.delay,
                }}
              />
            ))}
          </div>

          {/* Headline */}
          <div className="head-in text-center">
            <h1 className="text-3xl font-black text-gray-800 leading-tight">
              Order Confirmed!
            </h1>
            <p className="text-gray-500 text-sm font-semibold mt-1.5">
              Woohoo! Your goodies are on the way
            </p>
          </div>

          {/* Order ID strip */}
          {show && (
            <div
              className="su mt-5 bg-white rounded-2xl px-4 py-3 flex items-center justify-between w-full"
              style={{
                boxShadow: "0 2px 16px rgba(14,165,233,0.1)",
                border: "1.5px solid #bae6fd",
              }}
            >
              <div>
                <p className="text-xs text-gray-400 font-bold mb-0.5">
                  Order ID
                </p>
                <p className="text-sm font-black text-sky-600 tracking-wider">
                  {loading ? "Loading…" : displayOrderId}
                </p>
              </div>
              {!loading && <CopyBtn value={displayOrderId} />}
            </div>
          )}
        </div>

        {/* ── Skeleton while loading ── */}
        {loading && (
          <>
            <SkeletonCard height="h-28" />
            <SkeletonCard height="h-44" />
            <SkeletonCard height="h-16" />
          </>
        )}

        {/* ── Delivery Tracker ── */}
        {cards && !loading && (
          <div
            className="su1 bg-white rounded-3xl p-5 mb-4"
            style={{
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              border: "1.5px solid #f0fdf4",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-black text-gray-800">
                Delivery Tracker
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                style={{
                  background: "#fff7ed",
                  color: "#f97316",
                  border: "1.5px solid #fed7aa",
                }}
              >
                <CalendarDays size={11} strokeWidth={2.5} />
                {estimatedDate}
              </span>
            </div>

            <div className="flex items-start">
              {steps.map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center flex-1 relative"
                >
                  {i < steps.length - 1 && (
                    <div
                      className="absolute top-4 left-1/2 w-full h-1 rounded-full z-0"
                      style={{ background: "#f1f5f9" }}
                    >
                      {/* Fill the connector between done steps */}
                      {steps[i].done && steps[i + 1].done && (
                        <div
                          className="lf h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg,${s.color},${steps[i + 1].color})`,
                          }}
                        />
                      )}
                      {/* Partial fill: current step done but next not */}
                      {steps[i].done && !steps[i + 1].done && (
                        <div
                          className="lf h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg,${s.color},${steps[i + 1].color})`,
                            width: "50%",
                          }}
                        />
                      )}
                    </div>
                  )}
                  <div
                    className="dp relative z-10 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: s.done
                        ? `linear-gradient(135deg,${s.color},${s.color}cc)`
                        : s.light,
                      border: `2px solid ${s.done ? s.color : s.border}`,
                      boxShadow: s.done ? `0 4px 14px ${s.color}40` : "none",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <s.Icon
                      size={14}
                      strokeWidth={2.5}
                      color={s.done ? "white" : s.color}
                    />
                  </div>
                  <p
                    className="text-center mt-2 text-[10px] font-black leading-tight"
                    style={{ color: s.done ? s.color : "#94a3b8" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Cancelled banner */}
            {isCancelled && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 text-center text-sm font-bold text-red-500">
                This order was cancelled
              </div>
            )}
          </div>
        )}

        {/* ── Items ── */}
        {cards && !loading && order && (
          <div
            className="su2 bg-white rounded-3xl p-5 mb-4"
            style={{
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              border: "1.5px solid #eff6ff",
            }}
          >
            <p className="text-sm font-black text-gray-800 mb-4">
              Items in this Order
            </p>
            <div className="space-y-2.5">
              {order.products.map((item, idx) => (
                <div
                  key={idx}
                  className={`icard flex items-center gap-3 p-2.5 rounded-2xl su${idx + 2}`}
                  style={{ background: "#f8fafc" }}
                >
                  <img
                    src={item.images?.[0] || "/img/placeholder.jpeg"}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-black text-sky-600 flex-shrink-0">
                    ₹{item.subtotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold">
                Total paid (incl. delivery)
              </span>
              <span className="text-base font-black text-gray-800">
                ₹{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* ── Delivery Address ── */}
        {cards && !loading && (
          <div
            className="su3 bg-white rounded-3xl px-4 py-4 mb-5 flex items-center gap-3"
            style={{
              boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
              border: "1.5px solid #fff7ed",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#fff7ed", border: "1.5px solid #fdba74" }}
            >
              <MapPin
                size={16}
                strokeWidth={2.2}
                color="#f97316"
                fill="#ffedd5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-bold">Delivering to</p>
              {order?.shippingAddress ? (
                <p className="text-sm font-bold text-gray-700 truncate">
                  {order.shippingAddress.addressLine},{" "}
                  {order.shippingAddress.city} —{" "}
                  {order.shippingAddress.postalCode}
                </p>
              ) : address ? (
                <p className="text-sm font-bold text-gray-700 truncate">
                  {address.addressLine}, {address.city} — {address.postalCode}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Address not available
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── CTAs ── */}
        {cards && !loading && (
          <div className="su4 space-y-3">
            <button
              onClick={() => router.push("/profile")}
              className="btn-action w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
                boxShadow: "0 6px 22px rgba(14,165,233,0.32)",
              }}
            >
              <SunMedium size={18} strokeWidth={2.2} />
              Track My Order
            </button>

            <Link href="/" className="block">
              <button
                className="btn-action w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg,#10b981,#34d399)",
                  boxShadow: "0 6px 22px rgba(16,185,129,0.28)",
                }}
              >
                <ShoppingBag size={18} strokeWidth={2.2} />
                Continue Shopping
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </Link>

            <button
              onClick={handleDownloadInvoice}
              className="btn-action w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: "#f8fafc",
                color: "#64748b",
                border: "1.5px solid #e2e8f0",
              }}
            >
              <Download size={16} strokeWidth={2.2} color="#94a3b8" />
              Download Invoice
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        {cards && !loading && (
          <p className="su5 text-center text-xs text-gray-400 font-semibold mt-7 leading-relaxed flex flex-col items-center gap-1">
            <span className="flex items-center gap-1.5">
              <Mail size={12} strokeWidth={2} />
              Confirmation sent to your registered email
            </span>
            <span className="flex items-center gap-1 text-sky-500 underline underline-offset-2 cursor-pointer">
              <HeadphonesIcon size={12} strokeWidth={2} />
              Need help? Contact support
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
export default function OrderConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmContent />
    </Suspense>
  );
}
