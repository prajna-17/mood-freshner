"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { API } from "@/utils/api";

const DELIVERY_STEPS = ["PICKED", "IN_TRANSIT", "DELIVERED"];

const STEP_CONFIG = {
  PICKED:     { icon: "📦", label: "Picked Up",  color: "#f59e0b" },
  IN_TRANSIT: { icon: "🚗", label: "In Transit", color: "#3b82f6" },
  DELIVERED:  { icon: "✅", label: "Delivered",  color: "#22c55e" },
};

const s = {
  page: { minHeight: "100vh", background: "#0f172a", fontFamily: "'Inter', sans-serif", paddingBottom: "40px" },
  header: {
    background: "linear-gradient(135deg,#1e3a5f,#0f172a)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px",
    position: "sticky", top: 0, zIndex: 100,
  },
  backBtn: { background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "14px" },
  headerTitle: { color: "#fff", fontWeight: 700, fontSize: "16px" },
  section: { padding: "0 20px", marginTop: "20px" },
  sectionTitle: { color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" },
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "16px" },
  addressRow: { display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" },
  addressIcon: { fontSize: "22px", minWidth: "28px" },
  addressLabel: { color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" },
  addressText: { color: "#e2e8f0", fontSize: "14px", lineHeight: 1.6 },
  itemRow: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  itemImg: { width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", background: "rgba(255,255,255,0.05)" },
  itemName: { color: "#e2e8f0", fontSize: "14px", fontWeight: 500 },
  itemQty: { color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" },
  amountRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" },
  amountLabel: { color: "rgba(255,255,255,0.5)", fontSize: "14px" },
  amountVal: { color: "#fff", fontSize: "18px", fontWeight: 800 },
  stepper: { display: "flex", gap: "0", marginBottom: "16px" },
  stepItem: (active, done) => ({
    flex: 1, textAlign: "center", position: "relative",
    opacity: done || active ? 1 : 0.35,
  }),
  stepCircle: (active, done, color) => ({
    width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 6px",
    background: done ? color : active ? `${color}30` : "rgba(255,255,255,0.05)",
    border: `2px solid ${done || active ? color : "rgba(255,255,255,0.1)"}`,
    fontSize: "16px",
  }),
  stepLabel: (active, done, color) => ({
    fontSize: "10px", fontWeight: 600,
    color: done || active ? color : "rgba(255,255,255,0.3)",
  }),
  actionBtn: (color, bg) => ({
    width: "100%", padding: "15px",
    background: bg || `linear-gradient(135deg,${color},${color}cc)`,
    color: "#fff", border: "none", borderRadius: "14px",
    fontSize: "16px", fontWeight: 700, cursor: "pointer",
    marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  }),
  disabledBtn: {
    width: "100%", padding: "15px",
    background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px",
    fontSize: "15px", fontWeight: 600, cursor: "not-allowed", marginBottom: "10px",
  },
  payRow: { display: "flex", gap: "10px", marginTop: "4px" },
  payBtn: (active, color) => ({
    flex: 1, padding: "13px",
    background: active ? color : "rgba(255,255,255,0.05)",
    color: active ? "#fff" : "rgba(255,255,255,0.4)",
    border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
    borderRadius: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer",
    transition: "all 0.2s",
  }),
  toast: (show) => ({
    position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
    background: "#22c55e", color: "#fff", padding: "12px 24px", borderRadius: "30px",
    fontWeight: 700, fontSize: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    opacity: show ? 1 : 0, transition: "opacity 0.3s", zIndex: 9999, whiteSpace: "nowrap",
  }),
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState("");
  const [collectionNotes, setCollectionNotes] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("delivery_token");
    if (!token) { router.replace("/delivery/login"); return; }
    fetchOrder(token);
  }, [orderId]);

  const fetchOrder = async (token) => {
    try {
      const res = await fetch(`${API}/delivery/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const found = (data.data || []).find(o => o._id === orderId);
      if (!found) { router.replace("/delivery/dashboard"); return; }
      setOrder(found);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const updateDeliveryStatus = async (status) => {
    const token = localStorage.getItem("delivery_token");
    setUpdating(true);
    try {
      const res = await fetch(`${API}/delivery/orders/${orderId}/delivery-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deliveryStatus: status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrder(prev => ({ ...prev, deliveryStatus: status, orderStatus: data.data.orderStatus || prev.orderStatus }));
      showToast(`Marked as ${STEP_CONFIG[status].label}!`);
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const updateCollectionStatus = async (status) => {
    const token = localStorage.getItem("delivery_token");
    setUpdating(true);
    try {
      const res = await fetch(`${API}/delivery/orders/${orderId}/collection-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ collectionStatus: status, collectionNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrder(prev => ({ ...prev, collectionStatus: status }));
      showToast(`Payment marked as ${status}!`);
    } catch (e) {
      showToast(`Error: ${e.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>⏳ Loading order...</div>
    </div>
  );

  if (!order) return null;

  const addr = order.shippingAddress;
  const currentStepIdx = DELIVERY_STEPS.indexOf(order.deliveryStatus);
  const nextStep = DELIVERY_STEPS[currentStepIdx + 1];

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => router.back()}>← Back</button>
        <div style={s.headerTitle}>Order #{order._id.slice(-6).toUpperCase()}</div>
      </div>

      {/* Stepper */}
      <div style={{ ...s.section }}>
        <div style={s.sectionTitle}>Delivery Progress</div>
        <div style={{ ...s.card, padding: "20px 16px" }}>
          <div style={s.stepper}>
            {DELIVERY_STEPS.map((step, i) => {
              const done = currentStepIdx >= i;
              const active = currentStepIdx === i;
              const cfg = STEP_CONFIG[step];
              return (
                <div key={step} style={s.stepItem(active, done)}>
                  {/* connector line */}
                  {i > 0 && (
                    <div style={{
                      position: "absolute", top: "17px", left: "-50%", width: "100%",
                      height: "2px", background: done ? cfg.color : "rgba(255,255,255,0.08)",
                    }} />
                  )}
                  <div style={s.stepCircle(active, done, cfg.color)}>{cfg.icon}</div>
                  <div style={s.stepLabel(active, done, cfg.color)}>{cfg.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Pickup & Drop Details</div>
        <div style={s.card}>
          <div style={s.addressRow}>
            <span style={s.addressIcon}>🏬</span>
            <div>
              <div style={s.addressLabel}>Pickup Location</div>
              <div style={s.addressText}>MoodFresh Warehouse — Main Hub</div>
            </div>
          </div>
          <div style={{ ...s.addressRow, borderBottom: "none" }}>
            <span style={s.addressIcon}>📍</span>
            <div>
              <div style={s.addressLabel}>Drop Location</div>
              <div style={s.addressText}>
                <strong style={{ color: "#fff" }}>{addr?.fullName}</strong><br />
                {addr?.phone}<br />
                {addr?.addressLine}
                {addr?.landmark ? `, ${addr.landmark}` : ""}<br />
                {addr?.city}, {addr?.state} — {addr?.postalCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Items in this Order</div>
        <div style={s.card}>
          {order.products?.map((p, i) => (
            <div key={i} style={{ ...s.itemRow, borderBottom: i < order.products.length - 1 ? s.itemRow.borderBottom : "none" }}>
              {p.images?.[0] && <img src={p.images[0]} alt={p.title} style={s.itemImg} />}
              <div style={{ flex: 1 }}>
                <div style={s.itemName}>{p.title}</div>
                <div style={s.itemQty}>Qty: {p.quantity} × ₹{p.price}</div>
              </div>
              <div style={{ color: "#60a5fa", fontWeight: 700, fontSize: "14px" }}>₹{p.subtotal}</div>
            </div>
          ))}
          <div style={{ ...s.amountRow, borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "4px" }}>
            <span style={s.amountLabel}>Total Amount</span>
            <span style={s.amountVal}>₹{order.totalAmount}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Payment Method</span>
            <span style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 600 }}>{order.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Delivery Actions */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Update Delivery Status</div>
        <div style={s.card}>
          {order.deliveryStatus === "UNASSIGNED" && (
            <button style={s.actionBtn("#f59e0b")} disabled={updating} onClick={() => updateDeliveryStatus("PICKED")}>
              📦 Mark as Picked Up
            </button>
          )}
          {order.deliveryStatus === "PICKED" && (
            <button style={s.actionBtn("#3b82f6")} disabled={updating} onClick={() => updateDeliveryStatus("IN_TRANSIT")}>
              🚗 Mark as In Transit
            </button>
          )}
          {order.deliveryStatus === "IN_TRANSIT" && (
            <button style={s.actionBtn("#22c55e")} disabled={updating} onClick={() => updateDeliveryStatus("DELIVERED")}>
              ✅ Mark as Delivered
            </button>
          )}
          {order.deliveryStatus === "DELIVERED" && (
            <div style={{ color: "#22c55e", textAlign: "center", fontWeight: 700, padding: "8px 0" }}>
              ✅ Delivery Completed
            </div>
          )}
        </div>
      </div>

      {/* Payment Collection — show only after delivery */}
      {order.deliveryStatus === "DELIVERED" && (
        <div style={s.section}>
          <div style={s.sectionTitle}>Payment Collection</div>
          <div style={s.card}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginBottom: "14px" }}>
              Was the payment collected?
            </div>
            <div style={s.payRow}>
              <button
                style={s.payBtn(order.collectionStatus === "PAID", "#22c55e")}
                disabled={updating}
                onClick={() => updateCollectionStatus("PAID")}
              >
                ✅ Paid
              </button>
              <button
                style={s.payBtn(order.collectionStatus === "NOT_PAID", "#ef4444")}
                disabled={updating}
                onClick={() => updateCollectionStatus("NOT_PAID")}
              >
                ❌ Not Paid
              </button>
            </div>

            <textarea
              placeholder="Add notes (optional)..."
              value={collectionNotes}
              onChange={e => setCollectionNotes(e.target.value)}
              style={{
                width: "100%", marginTop: "12px", padding: "12px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#e2e8f0", fontSize: "13px",
                resize: "vertical", minHeight: "70px", boxSizing: "border-box", outline: "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={s.toast(!!toast)}>{toast}</div>
    </div>
  );
}
