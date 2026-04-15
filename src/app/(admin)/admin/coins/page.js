"use client";
import { useState, useEffect } from "react";

const API_BASE = "https://mood-freshner-backend.onrender.com/api";

export default function AdminCoinsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const [resolving, setResolving] = useState(""); // requestId being resolved
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("requests"); // "requests" | "users"

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.data || []);
      else showToast(data.message || "Failed to load users", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // All pending requests across all users
  const allPending = users
    .flatMap((u) =>
      (u.coinRequests || [])
        .filter((r) => r.status === "PENDING")
        .map((r) => ({
          ...r,
          userName: u.name || u.email,
          userEmail: u.email,
          userId: u._id,
        })),
    )
    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  // Approve a coin request
  const handleApprove = async (userId, requestId, amount, userName) => {
    setResolving(requestId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/admin/users/${userId}/coin-requests/${requestId}/approve`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (res.ok) {
        showToast(`✓ Approved — ${amount} coins credited to ${userName}`);
        fetchUsers();
      } else {
        showToast(data.message || "Approval failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setResolving("");
    }
  };

  // Reject a coin request
  const handleReject = async (userId, requestId, userName) => {
    setResolving(requestId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/admin/users/${userId}/coin-requests/${requestId}/reject`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (res.ok) {
        showToast(`Request rejected for ${userName}`, "info");
        fetchUsers();
      } else {
        showToast(data.message || "Rejection failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setResolving("");
    }
  };

  // Manually add coins to a user
  const handleAddCoins = async () => {
    if (!selectedUser || !addAmount || Number(addAmount) <= 0) return;
    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/admin/users/${selectedUser._id}/add-coins`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: Number(addAmount) }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        showToast(
          `✓ ${addAmount} coins added to ${selectedUser.name || selectedUser.email}`,
        );
        setAddAmount("");
        setSelectedUser(null);
        fetchUsers();
      } else {
        showToast(data.message || "Failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div
      style={{
        fontFamily: "'Nunito', system-ui, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        * { font-family: 'Nunito', system-ui, sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .card { background: white; border-radius: 20px; box-shadow: 0 2px 16px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
        .request-row { transition: background 0.15s; border-radius: 16px; }
        .request-row:hover { background: #f8fafc; }
        .approve-btn { background: #dcfce7; color: #16a34a; border: 1.5px solid #bbf7d0; font-weight: 800; font-size: 12px; padding: 6px 14px; border-radius: 12px; cursor: pointer; transition: all 0.15s; }
        .approve-btn:hover { background: #22c55e; color: white; border-color: #22c55e; }
        .reject-btn { background: #fff1f2; color: #f43f5e; border: 1.5px solid #fecdd3; font-weight: 800; font-size: 12px; padding: 6px 14px; border-radius: 12px; cursor: pointer; transition: all 0.15s; }
        .reject-btn:hover { background: #f43f5e; color: white; border-color: #f43f5e; }
        .tab-btn { padding: 8px 20px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; transition: all 0.2s; border: none; }
        .tab-active { background: #0ea5e9; color: white; }
        .tab-inactive { background: transparent; color: #64748b; }
        .user-row { transition: all 0.15s; border-radius: 14px; cursor: pointer; }
        .user-row:hover { background: #f0f9ff; }
        .user-row-selected { background: #e0f2fe !important; }
        .search-input { border: 2px solid #e2e8f0; border-radius: 14px; padding: 10px 16px; font-size: 14px; font-weight: 700; outline: none; transition: border 0.2s; width: 100%; }
        .search-input:focus { border-color: #0ea5e9; }
        .coin-input { border: 2px solid #fde68a; border-radius: 14px; padding: 10px 16px; font-size: 15px; font-weight: 800; outline: none; background: #fffbeb; color: #92400e; width: 100%; transition: border 0.2s; }
        .coin-input:focus { border-color: #f59e0b; }
        .add-btn { background: linear-gradient(135deg,#f59e0b,#f97316); color: white; border: none; border-radius: 14px; padding: 11px 24px; font-weight: 900; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .add-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .badge-pending { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .badge-approved { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .badge-rejected { background: #fff1f2; color: #f43f5e; border: 1px solid #fecdd3; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 16px; font-weight: 800; font-size: 13px; z-index: 9999; animation: toastIn 0.3s ease; white-space: nowrap; box-shadow: 0 8px 30px rgba(0,0,0,0.15); }
        .toast-success { background: #1e293b; color: white; }
        .toast-error { background: #f43f5e; color: white; }
        .toast-info { background: #0ea5e9; color: white; }
        .empty-state { text-align: center; padding: 48px 24px; color: #94a3b8; font-weight: 700; }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          background: "linear-gradient(135deg,#1e3a5f,#1565c0)",
          padding: "28px 28px 24px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: "linear-gradient(135deg,#f59e0b,#f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.3" />
                <text
                  x="12"
                  y="16.5"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="white"
                >
                  ₿
                </text>
              </svg>
            </div>
            <h1
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: 900,
                margin: 0,
              }}
            >
              Coins Management
            </h1>
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              fontWeight: 600,
              margin: 0,
              marginLeft: 52,
            }}
          >
            Approve coin purchases · manually credit coins · view balances
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            {[
              { label: "Total Users", value: users.length },
              {
                label: "Pending Requests",
                value: allPending.length,
                highlight: allPending.length > 0,
              },
              {
                label: "Total Coins Issued",
                value: users
                  .reduce((s, u) => s + (u.coins || 0), 0)
                  .toLocaleString(),
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "12px 18px",
                  backdropFilter: "blur(8px)",
                  border: s.highlight
                    ? "1.5px solid #f59e0b"
                    : "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <p
                  style={{
                    color: "white",
                    fontSize: 22,
                    fontWeight: 900,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    color: s.highlight ? "#fbbf24" : "rgba(255,255,255,0.55)",
                    fontSize: 11,
                    fontWeight: 700,
                    margin: 0,
                    marginTop: 3,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        {/* ── Tabs ── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            background: "#f1f5f9",
            padding: 4,
            borderRadius: 16,
            width: "fit-content",
          }}
        >
          <button
            className={`tab-btn ${activeTab === "requests" ? "tab-active" : "tab-inactive"}`}
            onClick={() => setActiveTab("requests")}
          >
            Pending Requests{" "}
            {allPending.length > 0 && (
              <span
                style={{
                  background: "#f43f5e",
                  color: "white",
                  borderRadius: 20,
                  padding: "1px 7px",
                  fontSize: 11,
                  marginLeft: 6,
                }}
              >
                {allPending.length}
              </span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "tab-active" : "tab-inactive"}`}
            onClick={() => setActiveTab("users")}
          >
            All Users
          </button>
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: 72,
                  borderRadius: 16,
                  background: "#f1f5f9",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </div>
        ) : activeTab === "requests" ? (
          /* ── Pending Requests Tab ── */
          <div>
            {allPending.length === 0 ? (
              <div className="card empty-state fade-up">
                <div style={{ fontSize: 40, marginBottom: 12 }}>🪙</div>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#475569",
                    margin: 0,
                  }}
                >
                  No pending requests
                </p>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                  All coin purchase requests have been resolved
                </p>
              </div>
            ) : (
              <div className="card fade-up" style={{ overflow: "hidden" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 900,
                      fontSize: 15,
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    Pending Coin Requests
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      margin: 0,
                      marginTop: 2,
                    }}
                  >
                    These users have paid & are waiting for coins to be credited
                  </p>
                </div>
                <div style={{ padding: "8px 12px" }}>
                  {allPending.map((req) => (
                    <div
                      key={req._id}
                      className="request-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "12px 10px",
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 14,
                          background: "linear-gradient(135deg,#0ea5e9,#1565c0)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: "white",
                            fontWeight: 900,
                            fontSize: 14,
                          }}
                        >
                          {(req.userName || "?")[0].toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 800,
                            fontSize: 14,
                            color: "#1e293b",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {req.userName}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            margin: 0,
                            fontWeight: 600,
                          }}
                        >
                          {req.userEmail} · {formatDate(req.requestedAt)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <p
                          style={{
                            fontWeight: 900,
                            fontSize: 16,
                            color: "#f59e0b",
                            margin: 0,
                          }}
                        >
                          {req.amount.toLocaleString()}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "#94a3b8",
                            margin: 0,
                            fontWeight: 700,
                          }}
                        >
                          coins · ₹{req.amount}
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button
                          className="approve-btn"
                          disabled={resolving === req._id}
                          onClick={() =>
                            handleApprove(
                              req.userId,
                              req._id,
                              req.amount,
                              req.userName,
                            )
                          }
                        >
                          {resolving === req._id ? "..." : "Approve"}
                        </button>
                        <button
                          className="reject-btn"
                          disabled={resolving === req._id}
                          onClick={() =>
                            handleReject(req.userId, req._id, req.userName)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── All Users Tab ── */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: selectedUser ? "1fr 320px" : "1fr",
              gap: 16,
            }}
          >
            {/* User list */}
            <div className="card fade-up" style={{ overflow: "hidden" }}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <input
                  className="search-input"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  maxHeight: 520,
                  overflowY: "auto",
                }}
              >
                {filteredUsers.length === 0 ? (
                  <div className="empty-state">
                    <p>No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((u) => (
                    <div
                      key={u._id}
                      className={`user-row ${selectedUser?._id === u._id ? "user-row-selected" : ""}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 10px",
                      }}
                      onClick={() =>
                        setSelectedUser(selectedUser?._id === u._id ? null : u)
                      }
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          background: "linear-gradient(135deg,#0ea5e9,#1565c0)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            color: "white",
                            fontWeight: 900,
                            fontSize: 14,
                          }}
                        >
                          {(u.name || u.email || "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 800,
                            fontSize: 13,
                            color: "#1e293b",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {u.name || "—"}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            margin: 0,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {u.email}
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p
                          style={{
                            fontWeight: 900,
                            fontSize: 15,
                            color: "#f59e0b",
                            margin: 0,
                          }}
                        >
                          {(u.coins || 0).toLocaleString()}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: "#94a3b8",
                            margin: 0,
                            fontWeight: 700,
                          }}
                        >
                          coins
                        </p>
                      </div>
                      {/* Pending badge */}
                      {(u.coinRequests || []).filter(
                        (r) => r.status === "PENDING",
                      ).length > 0 && (
                        <span className="badge-pending">
                          {
                            (u.coinRequests || []).filter(
                              (r) => r.status === "PENDING",
                            ).length
                          }{" "}
                          pending
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar: Add coins + history */}
            {selectedUser && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {/* Add coins panel */}
                <div
                  className="card"
                  style={{ padding: 20, animation: "slideIn 0.3s ease both" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: "linear-gradient(135deg,#f59e0b,#f97316)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontWeight: 900,
                          fontSize: 16,
                        }}
                      >
                        +
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 900,
                          fontSize: 14,
                          color: "#1e293b",
                          margin: 0,
                        }}
                      >
                        Add Coins
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          margin: 0,
                          fontWeight: 700,
                        }}
                      >
                        to {selectedUser.name || selectedUser.email}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#fffbeb",
                      border: "1.5px solid #fde68a",
                      borderRadius: 14,
                      padding: "10px 14px",
                      marginBottom: 14,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        color: "#92400e",
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      Current Balance
                    </p>
                    <p
                      style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: "#f59e0b",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {(selectedUser.coins || 0).toLocaleString()}{" "}
                      <span style={{ fontSize: 13, color: "#b45309" }}>
                        coins
                      </span>
                    </p>
                  </div>

                  <input
                    className="coin-input"
                    type="number"
                    placeholder="Amount to add (e.g. 500)"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    min={1}
                    style={{ marginBottom: 12 }}
                  />
                  {addAmount && Number(addAmount) > 0 && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "#16a34a",
                        fontWeight: 700,
                        marginBottom: 10,
                        marginTop: -6,
                      }}
                    >
                      New balance will be:{" "}
                      {(
                        (selectedUser.coins || 0) + Number(addAmount)
                      ).toLocaleString()}{" "}
                      coins
                    </p>
                  )}
                  <button
                    className="add-btn"
                    onClick={handleAddCoins}
                    disabled={adding || !addAmount || Number(addAmount) <= 0}
                    style={{ width: "100%" }}
                  >
                    {adding
                      ? "Adding…"
                      : `Add ${addAmount ? Number(addAmount).toLocaleString() : ""} Coins`}
                  </button>
                </div>

                {/* Coin request history */}
                {(selectedUser.coinRequests || []).length > 0 && (
                  <div
                    className="card"
                    style={{
                      padding: 16,
                      animation: "slideIn 0.35s ease both",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 900,
                        fontSize: 13,
                        color: "#1e293b",
                        margin: "0 0 12px",
                      }}
                    >
                      Request History
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {[...(selectedUser.coinRequests || [])]
                        .reverse()
                        .slice(0, 6)
                        .map((r) => (
                          <div
                            key={r._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontWeight: 800,
                                  fontSize: 13,
                                  color: "#1e293b",
                                  margin: 0,
                                }}
                              >
                                {r.amount.toLocaleString()} coins
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "#94a3b8",
                                  margin: 0,
                                  fontWeight: 600,
                                }}
                              >
                                {formatDate(r.requestedAt)}
                              </p>
                            </div>
                            <span className={`badge-${r.status.toLowerCase()}`}>
                              {r.status}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Toast ── */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
