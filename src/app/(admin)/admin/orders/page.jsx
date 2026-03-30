"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "@/utils/api";
import "@/components/admin/modal.css";

export default function AdminOrders() {
  const [filter, setFilter] = useState("ALL");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadOrders();
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, []);
  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lebah-token")}`,
        },
      });

      const data = await res.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };
  const loadNotifications = async () => {
    try {
      const res = await fetch(`${API}/orders/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lebah-token")}`,
        },
      });

      const data = await res.json();
      const orders = data.data || [];

      const formatted = orders.map((order) => ({
        id: order._id,
        message: `Order #${order._id.slice(-6)} placed`,
        read: order.isNotified,
        date: new Date(order.createdAt).toLocaleString(),
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };
  // ✅ STATUS BADGE HELPER (ONLY ADDITION)
  const getStatusBadge = (status) => {
    const styles = {
      PLACED: { bg: "#fff3cd", color: "#856404" },
      SHIPPED: { bg: "#e3f2fd", color: "#1565c0" },
      DELIVERED: { bg: "#e8f5e9", color: "#2e7d32" },
      CANCELLED: { bg: "#fdecea", color: "#c62828" },
    };

    return (
      <span
        style={{
          background: styles[status]?.bg,
          color: styles[status]?.color,
          padding: "3px 8px",
          borderRadius: 12,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "PENDING") return order.orderStatus !== "DELIVERED";
    if (filter === "DELIVERED") return order.orderStatus === "DELIVERED";
    if (filter === "COD") return order.paymentMethod === "COD";
    if (filter === "ONLINE") return order.paymentMethod === "ONLINE";
    return true; // ALL
  });

  if (loading) {
    return <div style={{ padding: 30 }}>Loading orders...</div>;
  }

  return (
    <div className="font-semibold text-gray-900">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="page-title">Manage Orders</h1>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              fontSize: 22,
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
          >
            🔔
            {notifications.filter((n) => !n.read).length > 0 && (
              <span
                style={{
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: 10,
                  position: "absolute",
                  top: -5,
                  right: -5,
                }}
              >
                {notifications.filter((n) => !n.read).length}{" "}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 35,
                width: 280,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                zIndex: 1000,
              }}
            >
              {notifications.length === 0 && (
                <div style={{ fontSize: 13 }}>No notifications</div>
              )}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: 8,
                    marginBottom: 6,
                    background: n.read ? "#f5f5f5" : "#e8f0fe",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  <div>{n.message}</div>

                  <div style={{ marginTop: 5 }}>
                    {!n.read && (
                      <button
                        onClick={async () => {
                          await fetch(`${API}/orders/mark-notified/${n.id}`, {
                            method: "PATCH",
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem("lebah-token")}`,
                            },
                          });

                          setNotifications((prev) =>
                            prev.map((item) =>
                              item.id === n.id ? { ...item, read: true } : item,
                            ),
                          );
                        }}
                        style={{ fontSize: 11 }}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* FILTER BUTTONS */}
      <div
        className="cat-top-row"
        style={{ gap: 6, justifyContent: "flex-start" }}
      >
        <button className="primary-btn small" onClick={() => setFilter("ALL")}>
          All
        </button>
        <button
          className="primary-btn small"
          onClick={() => setFilter("PENDING")}
        >
          Pending
        </button>
        <button
          className="primary-btn small"
          onClick={() => setFilter("DELIVERED")}
        >
          Delivered
        </button>
        <button className="primary-btn small" onClick={() => setFilter("COD")}>
          COD
        </button>
        <button
          className="primary-btn small"
          onClick={() => setFilter("ONLINE")}
        >
          Online
        </button>
      </div>

      {/* ORDERS LIST */}
      <div className="product-grid">
        {filteredOrders.map((order) => (
          <div key={order._id} className="product-card">
            <div className="product-body">
              <div className="product-title">Order #{order._id.slice(-6)}</div>

              <div className="product-sub">
                <span>Total: ₹{order.totalAmount}</span>
                <span>{order.paymentMethod}</span>
              </div>

              <div className="product-sub">
                <span>Status: {getStatusBadge(order.orderStatus)}</span>
                <span>Payment: {order.paymentStatus}</span>
              </div>

              <div style={{ marginTop: 8 }}>
                {order.products.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <img
                      src={p.images?.[0]}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <div style={{ fontSize: 13 }}>
                      {p.title} × {p.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <div style={{ marginTop: 10 }}>
                <Link href={`/admin/orders/${order._id}`}>
                  <button className="primary-btn small">View Details</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
