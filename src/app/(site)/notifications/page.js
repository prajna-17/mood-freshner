"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ArrowLeft } from "lucide-react";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setNotifications(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Nunito', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #f1f5f9",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "#f1f5f9",
            border: "none",
            borderRadius: 10,
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={18} color="#374151" strokeWidth={2.5} />
        </button>
        <h1
          style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1e293b" }}
        >
          Notifications
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px" }}>
        {/* Loading skeletons */}
        {loading &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 80,
                borderRadius: 14,
                background: "#e2e8f0",
                marginBottom: 12,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}

        {/* Empty state */}
        {!loading && notifications.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 80,
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#eff6ff",
                borderRadius: "50%",
                padding: 20,
              }}
            >
              <Bell size={36} color="#93c5fd" />
            </div>
            <p style={{ color: "#94a3b8", fontSize: 15, fontWeight: 700 }}>
              No notifications yet
            </p>
            <p style={{ color: "#cbd5e1", fontSize: 13 }}>
              Check back later for offers and updates
            </p>
          </div>
        )}

        {/* Notification cards */}
        {!loading &&
          notifications.map((n, i) => (
            <div
              key={n._id}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 12,
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                border: "1px solid #f1f5f9",
                animation: `slideUp 0.35s ${i * 0.06}s ease both`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  background: "#eff6ff",
                  borderRadius: 12,
                  padding: 11,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bell size={18} color="#3b82f6" />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: 14,
                    color: "#1e293b",
                    marginBottom: 4,
                  }}
                >
                  {n.title}
                </p>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>
                  {n.message}
                </p>
                <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>
                  {new Date(n.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
