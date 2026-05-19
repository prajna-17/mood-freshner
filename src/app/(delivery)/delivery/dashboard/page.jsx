"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API } from "@/utils/api";

const STATUS_CONFIG = {
  UNASSIGNED: { label: "Unassigned", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
  PICKED:      { label: "Picked Up",  color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  IN_TRANSIT:  { label: "In Transit", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  DELIVERED:   { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
};

const COLLECTION_CONFIG = {
  PENDING:  { label: "Payment Pending", color: "#f59e0b" },
  PAID:     { label: "Paid ✓",          color: "#22c55e" },
  NOT_PAID: { label: "Unpaid",          color: "#ef4444" },
};

const s = {
  page: { minHeight: "100vh", background: "#0f172a", fontFamily: "'Inter', sans-serif", paddingBottom: "32px" },
  header: {
    background: "linear-gradient(135deg, #1e3a5f, #0f172a)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "16px 20px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    position: "sticky", top: 0, zIndex: 100,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "10px" },
  headerName: { color: "#fff", fontWeight: 700, fontSize: "16px" },
  headerSub: { color: "rgba(255,255,255,0.5)", fontSize: "12px" },
  logoutBtn: {
    background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
    color: "#fca5a5", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px",
  },
  tabs: { display: "flex", gap: "8px", padding: "20px 20px 0", overflowX: "auto" },
  tab: (active) => ({
    padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
    background: active ? "linear-gradient(135deg,#3b82f6,#1d4ed8)" : "rgba(255,255,255,0.07)",
    color: active ? "#fff" : "rgba(255,255,255,0.5)",
  }),
  stats: { display: "flex", gap: "12px", padding: "16px 20px", overflowX: "auto" },
  stat: { background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px 18px", minWidth: "100px", textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" },
  statNum: { color: "#fff", fontSize: "22px", fontWeight: 800 },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px" },
  list: { padding: "0 20px" },
  card: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", padding: "18px", marginBottom: "12px",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  orderId: { color: "#60a5fa", fontWeight: 700, fontSize: "15px" },
  badge: (cfg) => ({
    background: cfg.bg, color: cfg.color, borderRadius: "20px",
    padding: "3px 10px", fontSize: "11px", fontWeight: 700,
  }),
  addressRow: { display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "6px" },
  addressIcon: { fontSize: "16px", marginTop: "1px" },
  addressText: { color: "rgba(255,255,255,0.65)", fontSize: "13px", lineHeight: 1.5 },
  amount: { color: "#fff", fontWeight: 700, fontSize: "16px", marginTop: "10px" },
  viewBtn: {
    display: "block", textAlign: "center", marginTop: "14px",
    background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    color: "#fff", borderRadius: "10px", padding: "10px",
    fontWeight: 700, fontSize: "14px", textDecoration: "none",
  },
  empty: { textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "60px 20px", fontSize: "15px" },
  loading: { textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "80px 20px" },
};

const TABS = ["ALL", "PICKED", "IN_TRANSIT", "DELIVERED"];

export default function DeliveryDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("ALL");
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("delivery_token");
    if (!token) { router.replace("/delivery/login"); return; }
    setName(localStorage.getItem("delivery_name") || "Rider");
    fetchOrders(token);
  }, []);

  const fetchOrders = async (token) => {
    try {
      const res = await fetch(`${API}/delivery/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { router.replace("/delivery/login"); return; }
      setOrders(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    ["delivery_token","delivery_id","delivery_name","delivery_mobile"].forEach(k => localStorage.removeItem(k));
    router.replace("/delivery/login");
  };

  const filtered = orders.filter(o =>
    tab === "ALL" ? true : o.deliveryStatus === tab
  );

  const countOf = (status) => orders.filter(o => o.deliveryStatus === status).length;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <span style={{ fontSize: "28px" }}>🛵</span>
          <div>
            <div style={s.headerName}>Hey, {name}!</div>
            <div style={s.headerSub}>Delivery Dashboard</div>
          </div>
        </div>
        <button style={s.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {/* Stats */}
      <div style={s.stats}>
        {[
          { label: "Total", count: orders.length, color: "#60a5fa" },
          { label: "Picked", count: countOf("PICKED"), color: "#f59e0b" },
          { label: "In Transit", count: countOf("IN_TRANSIT"), color: "#3b82f6" },
          { label: "Delivered", count: countOf("DELIVERED"), color: "#22c55e" },
        ].map(st => (
          <div key={st.label} style={s.stat}>
            <div style={{ ...s.statNum, color: st.color }}>{st.count}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {TABS.map(t => (
          <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>
            {t === "ALL" ? "All Orders" : STATUS_CONFIG[t]?.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div style={{ ...s.list, marginTop: "16px" }}>
        {loading && <div style={s.loading}>⏳ Loading your orders...</div>}
        {!loading && filtered.length === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📦</div>
            No orders found
          </div>
        )}
        {!loading && filtered.map(order => {
          const dCfg = STATUS_CONFIG[order.deliveryStatus] || STATUS_CONFIG.UNASSIGNED;
          const cCfg = COLLECTION_CONFIG[order.collectionStatus] || COLLECTION_CONFIG.PENDING;
          const addr = order.shippingAddress;
          return (
            <div key={order._id} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.orderId}>Order #{order._id.slice(-6).toUpperCase()}</div>
                <span style={s.badge(dCfg)}>{dCfg.label}</span>
              </div>

              <div style={s.addressRow}>
                <span style={s.addressIcon}>📍</span>
                <div style={s.addressText}>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", display: "block" }}>DROP OFF</span>
                  {addr?.fullName} • {addr?.addressLine}, {addr?.city}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <div style={s.amount}>₹{order.totalAmount}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>{order.paymentMethod}</span>
                  <span style={{ color: cCfg.color, fontSize: "11px", fontWeight: 600 }}>{cCfg.label}</span>
                </div>
              </div>

              <Link href={`/delivery/dashboard/order/${order._id}`} style={s.viewBtn}>
                View & Update →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
