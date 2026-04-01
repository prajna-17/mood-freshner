"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Home,
} from "lucide-react";
import { getUserIdFromToken } from "@/utils/auth";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";
// ── Status config ─────────────────────────────────────────────────────────────
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

// ── Format date ───────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function OrderSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-4 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="w-14 h-14 rounded-2xl bg-gray-200" />
        <div className="w-14 h-14 rounded-2xl bg-gray-200" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-gray-200 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f8] max-w-md mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *, body { font-family: 'Nunito', system-ui, sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .order-card {
          animation: fadeSlideUp 0.4s ease both;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.1);
        }
        .order-card:active { transform: scale(0.98); }
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
            <h1 className="text-xl font-black text-white">Order History</h1>
            <p
              className="text-xs font-semibold"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {loading
                ? "Loading…"
                : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Package size={18} color="white" strokeWidth={2.2} />
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-20 space-y-4">
        {/* Loading skeletons */}
        {loading && [1, 2, 3].map((i) => <OrderSkeleton key={i} />)}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 space-y-3">
            <p className="text-4xl">😕</p>
            <p className="text-gray-500 font-semibold">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "#e0f2fe" }}
            >
              <ShoppingBag size={36} color="#0ea5e9" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-lg font-black text-gray-700">No orders yet</p>
              <p className="text-sm text-gray-400 font-semibold mt-1">
                When you place an order, it will show up here
              </p>
            </div>
            <Link href="/">
              <button
                className="px-6 py-3 rounded-2xl font-black text-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                }}
              >
                Start Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Order cards */}
        {!loading &&
          !error &&
          orders.map((order, idx) => {
            const statusKey = order.orderStatus || "PLACED";
            const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.PLACED;
            const StatusIcon = cfg.Icon;

            // First 3 product images
            const previewImgs = order.products?.slice(0, 3) || [];
            const extraCount =
              (order.products?.length || 0) - previewImgs.length;

            const displayId = `ORD-${order._id.slice(-8).toUpperCase()}`;

            return (
              <Link href={`/order-his/${order._id}`} key={order._id}>
                <div
                  className="order-card bg-white rounded-3xl p-4"
                  style={{
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                    border: "1px solid #f1f5f9",
                    animationDelay: `${idx * 0.06}s`,
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400 font-bold">
                        Order ID
                      </p>
                      <p className="text-sm font-black text-sky-600 tracking-wide">
                        {displayId}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{
                        background: cfg.bg,
                        border: `1.5px solid ${cfg.border}`,
                      }}
                    >
                      <StatusIcon
                        size={12}
                        color={cfg.color}
                        strokeWidth={2.5}
                      />
                      <span
                        className="text-xs font-black"
                        style={{ color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Product image previews */}
                  <div className="flex items-center gap-2 mb-3">
                    {previewImgs.map((p, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0"
                        style={{
                          border: "1.5px solid #f1f5f9",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images?.[0] || "/img/placeholder.jpeg"}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-black text-sky-500"
                        style={{
                          background: "#f0f9ff",
                          border: "1.5px dashed #7dd3fc",
                        }}
                      >
                        +{extraCount}
                      </div>
                    )}
                    {/* Item names */}
                    <div className="flex-1 min-w-0 ml-1">
                      <p className="text-sm font-black text-gray-800 truncate">
                        {order.products?.[0]?.title || "Product"}
                      </p>
                      {order.products?.length > 1 && (
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">
                          +{order.products.length - 1} more item
                          {order.products.length - 1 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid #f1f5f9" }}
                  >
                    <div>
                      <p className="text-xs text-gray-400 font-bold">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="text-xs font-bold text-gray-500 mt-0.5">
                        {order.paymentMethod || "COD"} ·{" "}
                        {order.paymentStatus || "PENDING"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-black text-gray-800">
                        ₹{order.totalAmount?.toLocaleString()}
                      </p>
                      <ChevronRight
                        size={16}
                        color="#cbd5e1"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
