"use client";

import { useState, useEffect } from "react";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setNotifications(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreate = async () => {
    if (!title.trim() || !message.trim())
      return alert("Both title and message are required");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title, message }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle("");
        setMessage("");
        fetchNotifications();
      } else {
        alert(data.message || "Failed to create notification");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) fetchNotifications();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: 680 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 24,
          color: "#1e293b",
        }}
      >
        Notifications
      </h2>

      {/* ── Create Form ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "22px 24px",
          marginBottom: 32,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          border: "1px solid #f1f5f9",
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 16,
            color: "#334155",
          }}
        >
          Create New Notification
        </h3>

        <input
          type="text"
          placeholder="Title  e.g. 50% OFF Today!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            marginBottom: 12,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            color: "#1e293b",
          }}
        />

        <textarea
          placeholder="Message  e.g. Get 50% off on all products today only!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            marginBottom: 18,
            fontSize: 14,
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
            color: "#1e293b",
          }}
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          style={{
            background: loading ? "#93c5fd" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "11px 28px",
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </div>

      {/* ── List ── */}
      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 14,
          color: "#334155",
        }}
      >
        Sent Notifications{" "}
        <span
          style={{
            background: "#eff6ff",
            color: "#3b82f6",
            borderRadius: 20,
            padding: "2px 10px",
            fontSize: 12,
          }}
        >
          {notifications.length}
        </span>
      </h3>

      {fetching && <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading...</p>}

      {!fetching && notifications.length === 0 && (
        <p style={{ color: "#94a3b8", fontSize: 14 }}>
          No notifications sent yet.
        </p>
      )}

      {notifications.map((n) => (
        <div
          key={n._id}
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            border: "1px solid #f1f5f9",
          }}
        >
          <div style={{ flex: 1, marginRight: 12 }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 4,
                color: "#1e293b",
              }}
            >
              {n.title}
            </p>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>
              {n.message}
            </p>
            <p style={{ color: "#94a3b8", fontSize: 11 }}>
              {new Date(n.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <button
            onClick={() => handleDelete(n._id)}
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              border: "none",
              borderRadius: 7,
              padding: "7px 14px",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
