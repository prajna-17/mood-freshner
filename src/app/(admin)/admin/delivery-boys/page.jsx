"use client";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";

const APPROVAL_CONFIG = {
  PENDING:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  APPROVED: { label: "Approved", color: "#22c55e", bg: "rgba(34,197,94,0.15)"  },
  REJECTED: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.15)"  },
};

const VEHICLE_ICONS = { BIKE: "🏍️", SCOOTER: "🛵", CYCLE: "🚲", OTHER: "🚗" };

export default function AdminDeliveryBoysPage() {
  const [boys, setBoys] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("PENDING");
  const [assignModal, setAssignModal] = useState(null); // orderId being assigned
  const [selectedBoy, setSelectedBoy] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("token") : "");
  const authHeaders = () => ({ Authorization: `Bearer ${token()}`, "Content-Type": "application/json" });

  useEffect(() => {
    fetchDeliveryBoys();
    fetchUnassignedOrders();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const res = await fetch(`${API}/admin/delivery-boys`, { headers: authHeaders() });
      const data = await res.json();
      setBoys(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, { headers: authHeaders() });
      const data = await res.json();
      const all = data.data || [];
      setOrders(all.filter(o => !o.assignedTo && o.orderStatus !== "DELIVERED" && o.orderStatus !== "CANCELLED"));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/delivery-boys/${id}/approve`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBoys(prev => prev.map(b => b._id === id ? { ...b, approvalStatus: "APPROVED" } : b));
      showToast("✅ Delivery boy approved!");
    } catch (e) { showToast(`Error: ${e.message}`); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id) => {
    if (!confirm("Reject this delivery boy registration?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/delivery-boys/${id}/reject`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBoys(prev => prev.map(b => b._id === id ? { ...b, approvalStatus: "REJECTED" } : b));
      showToast("❌ Delivery boy rejected.");
    } catch (e) { showToast(`Error: ${e.message}`); }
    finally { setActionLoading(false); }
  };

  const handleToggleActive = async (id, current) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/delivery-boys/${id}/toggle-active`, { method: "PATCH", headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBoys(prev => prev.map(b => b._id === id ? { ...b, isActive: !current } : b));
      showToast(data.message);
    } catch (e) { showToast(`Error: ${e.message}`); }
    finally { setActionLoading(false); }
  };

  const handleAssign = async () => {
    if (!selectedBoy || !assignModal) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/orders/${assignModal}/assign`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ deliveryBoyId: selectedBoy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => prev.filter(o => o._id !== assignModal));
      setAssignModal(null);
      setSelectedBoy("");
      showToast(`✅ Order assigned to ${data.data?.deliveryBoyName || "rider"}!`);
    } catch (e) { showToast(`Error: ${e.message}`); }
    finally { setActionLoading(false); }
  };

  const filtered = boys.filter(b => b.approvalStatus === tab);
  const approvedBoys = boys.filter(b => b.approvalStatus === "APPROVED");
  const pendingCount = boys.filter(b => b.approvalStatus === "PENDING").length;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="page-title" style={{ margin: 0 }}>🛵 Delivery Boys</h1>
        {pendingCount > 0 && (
          <span style={{ background: "#ef4444", color: "#fff", borderRadius: "20px", padding: "4px 12px", fontSize: "13px", fontWeight: 700 }}>
            {pendingCount} Pending
          </span>
        )}
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Total Riders", value: boys.length, color: "#6366f1" },
          { label: "Pending Approval", value: pendingCount, color: "#f59e0b" },
          { label: "Approved", value: boys.filter(b => b.approvalStatus === "APPROVED").length, color: "#22c55e" },
          { label: "Unassigned Orders", value: orders.length, color: "#3b82f6" },
        ].map(st => (
          <div key={st.label} style={{
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px",
            padding: "16px 22px", minWidth: "140px", flex: 1,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "26px", fontWeight: 800, color: st.color }}>{st.value}</div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["PENDING", "APPROVED", "REJECTED"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="primary-btn small"
            style={{
              background: tab === t
                ? APPROVAL_CONFIG[t].color
                : "#f3f4f6",
              color: tab === t ? "#fff" : "#374151",
              border: "none",
            }}
          >
            {APPROVAL_CONFIG[t].label}
            {t === "PENDING" && pendingCount > 0 && (
              <span style={{ background: "rgba(255,255,255,0.3)", borderRadius: "10px", padding: "1px 7px", marginLeft: "6px", fontSize: "11px" }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Delivery Boys List */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "15px" }}>
          No {APPROVAL_CONFIG[tab].label.toLowerCase()} delivery boys
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map(boy => {
            const cfg = APPROVAL_CONFIG[boy.approvalStatus];
            return (
              <div key={boy._id} className="product-card">
                <div className="product-body">
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: `${cfg.bg || "rgba(99,102,241,0.1)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
                      }}>
                        {VEHICLE_ICONS[boy.vehicleType] || "🛵"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827" }}>{boy.name}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>{boy.mobile}</div>
                      </div>
                    </div>
                    <span style={{
                      background: cfg.bg, color: cfg.color,
                      padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                    }}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                    📧 {boy.email || "—"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
                    🚗 {boy.vehicleType} &nbsp;|&nbsp;
                    <span style={{ color: boy.isActive ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                      {boy.isActive ? "● Active" : "● Inactive"}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "14px" }}>
                    Registered: {new Date(boy.createdAt).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {boy.approvalStatus === "PENDING" && (
                      <>
                        <button
                          className="primary-btn small"
                          style={{ background: "#22c55e", flex: 1 }}
                          disabled={actionLoading}
                          onClick={() => handleApprove(boy._id)}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="primary-btn small"
                          style={{ background: "#ef4444", flex: 1 }}
                          disabled={actionLoading}
                          onClick={() => handleReject(boy._id)}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    {boy.approvalStatus === "APPROVED" && (
                      <button
                        className="primary-btn small"
                        style={{ background: boy.isActive ? "#6b7280" : "#22c55e", width: "100%" }}
                        disabled={actionLoading}
                        onClick={() => handleToggleActive(boy._id, boy.isActive)}
                      >
                        {boy.isActive ? "⏸ Deactivate" : "▶ Activate"}
                      </button>
                    )}
                    {boy.approvalStatus === "REJECTED" && (
                      <button
                        className="primary-btn small"
                        style={{ background: "#22c55e", width: "100%" }}
                        disabled={actionLoading}
                        onClick={() => handleApprove(boy._id)}
                      >
                        ✅ Re-approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign Orders Section */}
      <div style={{ marginTop: "36px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>
          📦 Assign Orders to Riders
        </h2>

        {orders.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", background: "#f9fafb", borderRadius: "14px", color: "#9ca3af", fontSize: "14px" }}>
            All orders are assigned ✓
          </div>
        ) : (
          <div className="product-grid">
            {orders.map(order => (
              <div key={order._id} className="product-card">
                <div className="product-body">
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "#111827", marginBottom: "6px" }}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                    📍 {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                    💰 ₹{order.totalAmount} &nbsp;|&nbsp; {order.paymentMethod}
                  </div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "14px" }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                  <button
                    className="primary-btn small"
                    style={{ width: "100%", background: "#6366f1" }}
                    onClick={() => { setAssignModal(order._id); setSelectedBoy(""); }}
                  >
                    🛵 Assign Rider
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: 700 }}>
              Assign Delivery Boy
            </h3>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }}>
              Order #{assignModal.slice(-6).toUpperCase()}
            </p>

            {approvedBoys.length === 0 ? (
              <div style={{ color: "#ef4444", fontSize: "14px", marginBottom: "16px" }}>
                No approved delivery boys available.
              </div>
            ) : (
              <select
                value={selectedBoy}
                onChange={e => setSelectedBoy(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px", border: "1px solid #e5e7eb",
                  borderRadius: "10px", fontSize: "14px", color: "#111827",
                  marginBottom: "20px", background: "#f9fafb", outline: "none",
                }}
              >
                <option value="">— Select a delivery boy —</option>
                {approvedBoys.filter(b => b.isActive).map(b => (
                  <option key={b._id} value={b._id}>
                    {VEHICLE_ICONS[b.vehicleType]} {b.name} ({b.mobile})
                  </option>
                ))}
              </select>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="primary-btn"
                style={{ flex: 1, background: "#6366f1" }}
                disabled={!selectedBoy || actionLoading}
                onClick={handleAssign}
              >
                {actionLoading ? "Assigning..." : "Assign"}
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1, background: "#6b7280" }}
                onClick={() => { setAssignModal(null); setSelectedBoy(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
          background: "#1f2937", color: "#fff", padding: "12px 24px", borderRadius: "30px",
          fontWeight: 700, fontSize: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", zIndex: 9999,
          whiteSpace: "nowrap",
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
