"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  Home,
  Check,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  Download,
  Copy,
  CheckCircle2,
  CalendarDays,
  Banknote,
  RefreshCcw,
} from "lucide-react";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";
// ── Tracker steps ─────────────────────────────────────────────────────────────
const STATUS_INDEX = {
  PLACED: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: 0,
};

const TRACKER_STEPS = [
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
    color: "#8b5cf6",
    light: "#f5f3ff",
    border: "#c4b5fd",
  },
];

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PLACED: {
    label: "Placed",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    Icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#86efac",
    Icon: CheckCircle2,
  },
  SHIPPED: {
    label: "Shipped",
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#7dd3fc",
    Icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    Icon: Home,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#f43f5e",
    bg: "#fff1f2",
    border: "#fecdd3",
    Icon: XCircle,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateShort = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {}
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-all active:scale-95"
      style={{
        background: copied ? "#dcfce7" : "#f0fdf4",
        color: copied ? "#16a34a" : "#6b7280",
        border: `1px solid ${copied ? "#86efac" : "#d1fae5"}`,
      }}
    >
      {copied ? (
        <>
          <Check size={11} strokeWidth={3} color="#16a34a" /> Copied!
        </>
      ) : (
        <>
          <Copy size={11} strokeWidth={2} /> Copy
        </>
      )}
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-3xl p-5 ${className}`}
      style={{
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        border: "1px solid #f1f5f9",
      }}
    >
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

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
  }, [orderId]);

  // ── Invoice download ─────────────────────────────────────────────────────
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

  // ── Derived ──────────────────────────────────────────────────────────────
  const statusKey = order?.orderStatus || "PLACED";
  const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.PLACED;
  const StatusIcon = statusCfg.Icon;

  const isCancelled = statusKey === "CANCELLED";
  const currentStep = STATUS_INDEX[statusKey] ?? 0;

  const trackerSteps = TRACKER_STEPS.map((s, i) => ({
    ...s,
    done: !isCancelled && i <= currentStep,
  }));

  const displayId = order
    ? `ORD-${order._id.slice(-8).toUpperCase()}`
    : orderId
      ? `ORD-${orderId.slice(-8).toUpperCase()}`
      : "—";

  // ── Error ─────────────────────────────────────────────────────────────────
  if (!loading && error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4 px-6">
        <p className="text-4xl">😕</p>
        <p className="text-gray-500 font-semibold text-center">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] max-w-md mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *, body { font-family: 'Nunito', system-ui, sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .su  { animation: fadeSlideUp 0.4s ease both; }
        .su1 { animation: fadeSlideUp 0.4s 0.06s ease both; }
        .su2 { animation: fadeSlideUp 0.4s 0.12s ease both; }
        .su3 { animation: fadeSlideUp 0.4s 0.18s ease both; }
        .su4 { animation: fadeSlideUp 0.4s 0.24s ease both; }
        .su5 { animation: fadeSlideUp 0.4s 0.30s ease both; }

        @keyframes lineFill {
          from { width: 0 }
          to   { width: 100% }
        }
        .lf { animation: lineFill 0.8s 0.2s ease both; }

        @keyframes dotPop {
          0%  { transform: scale(0); }
          70% { transform: scale(1.25); }
          100%{ transform: scale(1); }
        }
        .dp { animation: dotPop 0.35s ease both; }

        .item-row { transition: background 0.18s; }
        .item-row:hover { background: #f0f9ff !important; }

        .btn-action {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-action:hover { transform: translateY(-2px); }
        .btn-action:active { transform: scale(0.97); }

        .timeline-dot {
          position: relative;
        }
        .timeline-dot::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 24px;
          width: 2px;
          height: calc(100% + 12px);
          background: #e2e8f0;
        }
        .timeline-dot:last-child::before { display: none; }
      `}</style>

      {/* ── Header ── */}
      <div
        className="sticky top-0 z-20 px-4 pt-12 pb-5"
        style={{
          background: "linear-gradient(160deg, #1a4f9c 0%, #1565c0 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <ArrowLeft size={18} color="white" strokeWidth={2.5} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-white">Order Details</h1>
            <p
              className="text-xs font-semibold"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {loading ? "Loading…" : displayId}
            </p>
          </div>
          {/* Status badge in header */}
          {!loading && order && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: statusCfg.bg,
                border: `1.5px solid ${statusCfg.border}`,
              }}
            >
              <StatusIcon size={12} color={statusCfg.color} strokeWidth={2.5} />
              <span
                className="text-xs font-black"
                style={{ color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="px-4 pt-5 pb-20 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 w-40 bg-gray-200 rounded-full" />
                <div className="h-4 w-60 bg-gray-200 rounded-full" />
                <div className="h-4 w-32 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && order && (
        <div className="px-4 pt-5 pb-20 space-y-4">
          {/* ── Order ID + Date ── */}
          <Section className="su">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 font-bold">Order ID</p>
                <p className="text-sm font-black text-sky-600 tracking-wider mt-0.5">
                  {displayId}
                </p>
              </div>
              <CopyBtn value={displayId} />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold">Placed On</p>
                <p className="text-sm font-black text-gray-700 mt-0.5">
                  {formatDateShort(order.createdAt)}
                </p>
              </div>
              <div
                className="w-px h-8 self-center"
                style={{ background: "#e2e8f0" }}
              />
              <div>
                <p className="text-xs text-gray-400 font-bold">Items</p>
                <p className="text-sm font-black text-gray-700 mt-0.5">
                  {order.products?.length || 0} item
                  {(order.products?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <div
                className="w-px h-8 self-center"
                style={{ background: "#e2e8f0" }}
              />
              <div>
                <p className="text-xs text-gray-400 font-bold">Total</p>
                <p className="text-sm font-black text-gray-700 mt-0.5">
                  ₹{order.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </Section>

          {/* ── Tracker ── */}
          <Section className="su1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-black text-gray-800">
                Delivery Tracker
              </p>
              {!isCancelled && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    background: "#fff7ed",
                    color: "#f97316",
                    border: "1.5px solid #fed7aa",
                  }}
                >
                  <CalendarDays size={11} strokeWidth={2.5} />
                  Est. delivery in 1–3 days
                </span>
              )}
            </div>

            <div className="flex items-start">
              {trackerSteps.map((s, i) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center flex-1 relative"
                >
                  {i < trackerSteps.length - 1 && (
                    <div
                      className="absolute top-4 left-1/2 w-full h-1 rounded-full z-0"
                      style={{ background: "#f1f5f9" }}
                    >
                      {trackerSteps[i].done && trackerSteps[i + 1].done && (
                        <div
                          className="lf h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg,${s.color},${trackerSteps[i + 1].color})`,
                          }}
                        />
                      )}
                      {trackerSteps[i].done && !trackerSteps[i + 1].done && (
                        <div
                          className="lf h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg,${s.color},${trackerSteps[i + 1].color})`,
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

            {isCancelled && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 text-center text-sm font-bold text-red-500 flex items-center justify-center gap-2">
                <XCircle size={15} strokeWidth={2.5} />
                This order was cancelled
              </div>
            )}
          </Section>

          {/* ── Status Timeline ── */}
          {order.statusTimeline && order.statusTimeline.length > 0 && (
            <Section className="su2">
              <p className="text-sm font-black text-gray-800 mb-4">Activity</p>
              <div className="space-y-3">
                {[...order.statusTimeline].reverse().map((entry, i) => {
                  const cfg =
                    STATUS_CONFIG[entry.status] || STATUS_CONFIG.PLACED;
                  const EntryIcon = cfg.Icon;
                  return (
                    <div
                      key={i}
                      className="timeline-dot flex items-start gap-3"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: cfg.bg,
                          border: `1.5px solid ${cfg.border}`,
                        }}
                      >
                        <EntryIcon
                          size={12}
                          color={cfg.color}
                          strokeWidth={2.5}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className="text-sm font-black"
                          style={{ color: cfg.color }}
                        >
                          {cfg.label}
                        </p>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* ── Items ── */}
          <Section className="su2">
            <p className="text-sm font-black text-gray-800 mb-4">
              Items ({order.products?.length || 0})
            </p>
            <div className="space-y-2.5">
              {order.products?.map((item, idx) => (
                <div
                  key={idx}
                  className="item-row flex items-center gap-3 p-2.5 rounded-2xl"
                  style={{ background: "#f8fafc" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.images?.[0] || "/img/placeholder.jpeg"}
                    alt={item.title}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      Qty {item.quantity}
                    </p>
                    {item.category && (
                      <p
                        className="text-xs font-bold mt-0.5"
                        style={{ color: "#94a3b8" }}
                      >
                        {item.category}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-sky-600">
                      ₹{item.subtotal?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      ₹{item.price} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div
              className="mt-4 pt-3 space-y-2"
              style={{ borderTop: "1px dashed #e2e8f0" }}
            >
              <div className="flex justify-between text-sm text-gray-500">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold">
                  ₹
                  {order.products
                    ?.reduce((s, p) => s + (p.subtotal || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span className="font-semibold">Delivery</span>
                <span className="font-bold text-emerald-500">Included</span>
              </div>
              <div className="flex justify-between text-base text-gray-800 pt-1">
                <span className="font-black">Total Paid</span>
                <span className="font-black text-sky-600">
                  ₹{order.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </Section>

          {/* ── Payment Info ── */}
          <Section className="su3">
            <p className="text-sm font-black text-gray-800 mb-4">Payment</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f0fdf4" }}
                >
                  {order.paymentMethod === "COD" ? (
                    <Banknote size={18} color="#10b981" strokeWidth={2.2} />
                  ) : (
                    <CreditCard size={18} color="#10b981" strokeWidth={2.2} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-700">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    {order.paymentMethod === "COD"
                      ? "Pay when you receive"
                      : "UPI · Card · Netbanking"}
                  </p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-xs font-black"
                  style={{
                    background:
                      order.paymentStatus === "PAID" ? "#f0fdf4" : "#fff7ed",
                    color:
                      order.paymentStatus === "PAID" ? "#16a34a" : "#f97316",
                    border: `1px solid ${order.paymentStatus === "PAID" ? "#86efac" : "#fed7aa"}`,
                  }}
                >
                  {order.paymentStatus || "PENDING"}
                </div>
              </div>

              {order.merchantTransactionId && (
                <div
                  className="flex items-center justify-between p-3 rounded-2xl"
                  style={{ background: "#f8fafc" }}
                >
                  <div>
                    <p className="text-xs text-gray-400 font-bold">
                      Transaction ID
                    </p>
                    <p className="text-xs font-black text-gray-600 mt-0.5 truncate max-w-[180px]">
                      {order.merchantTransactionId}
                    </p>
                  </div>
                  <CopyBtn value={order.merchantTransactionId} />
                </div>
              )}
            </div>
          </Section>

          {/* ── Delivery Address ── */}
          {order.shippingAddress && (
            <Section className="su4">
              <p className="text-sm font-black text-gray-800 mb-4">
                Delivery Address
              </p>
              <div className="flex gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: "#fff7ed",
                    border: "1.5px solid #fdba74",
                  }}
                >
                  <MapPin size={16} color="#f97316" strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-800">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 mt-1 leading-relaxed">
                    {order.shippingAddress.addressLine}
                    {order.shippingAddress.landmark
                      ? `, ${order.shippingAddress.landmark}`
                      : ""}
                  </p>
                  <p className="text-xs font-semibold text-gray-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    — {order.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            </Section>
          )}

          {/* ── Actions ── */}
          <div className="su5 space-y-3">
            <button
              onClick={handleDownloadInvoice}
              className="btn-action w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                boxShadow: "0 6px 20px rgba(14,165,233,0.3)",
              }}
            >
              <Download size={17} strokeWidth={2.2} />
              Download Invoice
            </button>

            <Link href="/order-his" className="block">
              <button
                className="btn-action w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: "#f8fafc",
                  color: "#64748b",
                  border: "1.5px solid #e2e8f0",
                }}
              >
                <RefreshCcw size={15} strokeWidth={2.2} color="#94a3b8" />
                All Orders
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
