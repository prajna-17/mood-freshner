"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "@/utils/api";
import {
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  isPaymentSuccessful,
} from "@/utils/payment";
import "@/components/admin/modal.css";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Notification state
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");

  // Payment tracking states
  const [newAmountPaid, setNewAmountPaid] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const res = await fetch(`${API}/orders/order-details/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setOrder(data.data);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    const res = await fetch(`${API}/orders/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ orderStatus: status }),
    });

    if (!res.ok) {
      alert("Failed to update order ❌");
      return;
    }

    setOrder((prev) => {
  const isDelivered = status === "DELIVERED";
  const isCancelled = status === "CANCELLED";

  return {
    ...prev,
    orderStatus: status,
    isCompleted: isDelivered || isCancelled,
    paymentStatus: isDelivered
      ? prev.paymentMethod === "COD"
        ? "PAID"
        : "SUCCESS"
      : "PENDING",
  };
});
  };

  const cancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const res = await fetch(`${API}/orders/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        orderStatus: "CANCELLED",
        paymentStatus: "FAILED",
      }),
    });

    if (!res.ok) {
      alert("Cancel failed ❌");
      return;
    }

    alert("Order cancelled ✔");
    setOrder((prev) => ({
      ...prev,
      orderStatus: "CANCELLED",
      paymentStatus: "FAILED",
      isCompleted: true,
    }));
  };

  const downloadInvoice = () => {
    window.open(`${API}/orders/invoice/${order._id}`, "_blank");
  };

  const handleUpdatePayment = async () => {
    if (newAmountPaid === "") return;
    setUpdatingPayment(true);
    try {
      const res = await fetch(`${API}/orders/payment/${order._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amountPaid: Number(newAmountPaid) }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Payment details updated!");
        setOrder(data.data);
        setNewAmountPaid("");
      } else {
        alert("Failed to update payment details: " + (data.message || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Error updating payment");
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notifyTitle || !notifyMessage) {
      alert("Please enter title and message");
      return;
    }

    try {
      const res = await fetch(`${API}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: order.user,
          title: notifyTitle,
          message: notifyMessage,
        }),
      });

      if (res.ok) {
        alert("Notification sent successfully");
        setShowNotifyModal(false);
        setNotifyTitle("");
        setNotifyMessage("");
      } else {
        alert("Failed to send notification");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending notification");
    }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;
  if (!order) return <div style={{ padding: 30 }}>Order not found</div>;

  return (
    <div className="font-semibold text-gray-900">
      <h1 className="page-title">Order Details</h1>

      <div className="product-card">
        <div className="product-body">
          {/* ORDER SUMMARY */}
          <div className="product-title">Order #{order._id}</div>

          <div style={{ fontSize: 13, marginTop: 6, opacity: 0.85 }}>
            <div>Order Date: {new Date(order.createdAt).toLocaleString()}</div>
            {order.merchantTransactionId && (
              <div>Transaction ID: {order.merchantTransactionId}</div>
            )}
            <div>Customer ID: {order.user}</div>
            <div style={{ marginTop: 4, fontWeight: "bold", color: order.orderType === "BULK_ADVANCE" ? "#b45309" : "#0284c7" }}>
              Order Type: {order.orderType === "BULK_ADVANCE" ? "📅 ADVANCE BULK BOOKING" : "🛍️ STANDARD ORDER"}
            </div>
            {order.orderType === "BULK_ADVANCE" && order.scheduledDeliveryDate && (
              <div style={{ fontWeight: "bold", color: "#b45309" }}>
                Scheduled Delivery Date: {new Date(order.scheduledDeliveryDate).toLocaleDateString("en-IN")}
              </div>
            )}
          </div>

          <hr style={{ margin: "12px 0" }} />

          {/* PAYMENT */}
          <div className="product-sub">
            <span>Total: ₹{order.totalAmount}</span>
            <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>

          {order.orderType === "BULK_ADVANCE" && (
            <div style={{ fontSize: 13, margin: "8px 0", padding: 10, background: "#fef3c7", borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Amount Paid:</span>
                <span style={{ fontWeight: "bold", color: "#16a34a" }}>₹{order.amountPaid || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Balance Due:</span>
                <span style={{ fontWeight: "bold", color: "#dc2626" }}>₹{order.balanceDue || 0}</span>
              </div>
            </div>
          )}

          <div className="product-sub">
            <span>Status: {order.orderStatus}</span>
            <span>Payment: {getPaymentStatusLabel(order.paymentStatus)}</span>
          </div>

          <hr style={{ margin: "14px 0" }} />

          {/* PRODUCTS */}
          <h4 style={{ fontSize: 14, marginBottom: 8 }}>Products</h4>
          {order.products.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <img
                src={p.images?.[0]}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 6,
                  objectFit: "cover",
                }}
              />
              <div style={{ fontSize: 13 }}>
                <div>
                  {p.title} × {p.quantity}
                </div>
                <div style={{ opacity: 0.7 }}>₹{p.subtotal}</div>
              </div>
            </div>
          ))}

          <hr style={{ margin: "14px 0" }} />

          {/* SHIPPING */}
          <h4 style={{ fontSize: 14, marginBottom: 6 }}>Shipping Address</h4>
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            <div>{order.shippingAddress.fullName}</div>
            <div>{order.shippingAddress.phone}</div>
            <div>{order.shippingAddress.addressLine}</div>
            <div>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </div>
            <div>{order.shippingAddress.postalCode}</div>
          </div>

          <hr style={{ margin: "14px 0" }} />

          {/* ADMIN ACTIONS */}
          <h4 style={{ fontSize: 14, marginBottom: 6 }}>Admin Actions</h4>

          <select
            className="search-input"
            value={order.orderStatus}
            disabled={order.orderStatus === "CANCELLED"}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option value="PLACED">PLACED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="primary-btn small" onClick={() => setShowNotifyModal(true)}>
              Notify User
            </button>
            <button className="primary-btn small" onClick={downloadInvoice}>
              Download Invoice
            </button>

            {order.orderStatus !== "CANCELLED" && (
              <button
                className="small"
                onClick={cancelOrder}
                style={{
                  backgroundColor: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Cancel Order
              </button>
            )}

            <button
              className="inactive-btn small"
              onClick={() => router.back()}
            >
              Back
            </button>
          </div>

          {order.orderType === "BULK_ADVANCE" && (
            <div style={{ marginTop: 20, borderTop: "1px solid #eee", paddingTop: 15 }}>
              <h4 style={{ fontSize: 14, marginBottom: 8, color: "#b45309" }}>Payment Tracking & Updates</h4>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Enter total amount paid"
                  className="search-input"
                  value={newAmountPaid}
                  onChange={(e) => setNewAmountPaid(e.target.value)}
                  style={{ maxWidth: 220, margin: 0 }}
                />
                <button
                  className="primary-btn small"
                  onClick={handleUpdatePayment}
                  disabled={updatingPayment}
                  style={{ background: "#b45309" }}
                >
                  {updatingPayment ? "Updating..." : "Update Amount Paid"}
                </button>
              </div>
              <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                * Balance Due will automatically update to Total minus Amount Paid.
              </p>
            </div>
          )}
        </div>
      </div>

      {showNotifyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Notify User</h2>
            <input
              type="text"
              placeholder="Notification Title"
              className="search-input"
              value={notifyTitle}
              onChange={(e) => setNotifyTitle(e.target.value)}
              style={{ width: "100%", marginBottom: 10, marginTop: 10 }}
            />
            <textarea
              placeholder="Notification Message"
              className="search-input"
              value={notifyMessage}
              onChange={(e) => setNotifyMessage(e.target.value)}
              style={{ width: "100%", height: 100, marginBottom: 10, resize: "none" }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="primary-btn" onClick={handleSendNotification}>
                Send
              </button>
              <button className="inactive-btn" onClick={() => setShowNotifyModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
