"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "@/utils/api";
import "@/components/admin/modal.css";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const res = await fetch(`${API}/orders/order-details/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lebah-token")}`,
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
        Authorization: `Bearer ${localStorage.getItem("lebah-token")}`,
      },
      body: JSON.stringify({ orderStatus: status }),
    });

    if (!res.ok) {
      alert("Failed to update order ❌");
      return;
    }

    setOrder((prev) => ({
      ...prev,
      orderStatus: status,
      isCompleted: status === "DELIVERED" || status === "CANCELLED",
    }));
  };

  const cancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const res = await fetch(`${API}/orders/${order._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("lebah-token")}`,
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
          </div>

          <hr style={{ margin: "12px 0" }} />

          {/* PAYMENT */}
          <div className="product-sub">
            <span>Total: ₹{order.totalAmount}</span>
            <span>{order.paymentMethod}</span>
          </div>

          <div className="product-sub">
            <span>Status: {order.orderStatus}</span>
            <span>Payment: {order.paymentStatus}</span>
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
        </div>
      </div>
    </div>
  );
}
