"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API } from "@/utils/api";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  icon: { fontSize: "52px", textAlign: "center", display: "block", marginBottom: "12px" },
  title: { color: "#fff", fontSize: "26px", fontWeight: 700, textAlign: "center", margin: 0 },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: "14px", textAlign: "center", marginTop: "6px", marginBottom: "32px" },
  label: { display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 500, marginBottom: "6px", marginTop: "18px" },
  input: {
    width: "100%", padding: "13px 16px",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px", color: "#fff", fontSize: "15px", outline: "none",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "14px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff", border: "none", borderRadius: "12px",
    fontSize: "16px", fontWeight: 700, cursor: "pointer",
    marginTop: "28px", letterSpacing: "0.3px",
  },
  errorBox: {
    background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px", padding: "12px 16px", color: "#fca5a5",
    fontSize: "14px", marginTop: "16px", textAlign: "center",
  },
  pendingBox: {
    background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)",
    borderRadius: "12px", padding: "20px", color: "#fde68a",
    fontSize: "14px", marginTop: "16px", textAlign: "center",
  },
  registerLink: { textAlign: "center", marginTop: "24px", color: "rgba(255,255,255,0.5)", fontSize: "14px" },
};

export default function DeliveryLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setApprovalStatus(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/delivery/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.approvalStatus === "PENDING") {
        setApprovalStatus("PENDING");
        return;
      }
      if (data.approvalStatus === "REJECTED") {
        setApprovalStatus("REJECTED");
        return;
      }
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("delivery_token", data.token);
      localStorage.setItem("delivery_id", data._id);
      localStorage.setItem("delivery_name", data.name);
      localStorage.setItem("delivery_mobile", data.mobile);
      router.push("/delivery/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <span style={styles.icon}>🛵</span>
        <h1 style={styles.title}>Delivery Partner Login</h1>
        <p style={styles.subtitle}>Sign in to manage your deliveries</p>

        {approvalStatus === "PENDING" && (
          <div style={styles.pendingBox}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>⏳</div>
            <div style={{ fontWeight: 700, marginBottom: "4px" }}>Awaiting Approval</div>
            <div style={{ color: "rgba(253,230,138,0.8)", fontSize: "13px" }}>
              Your account is under review. You'll be able to login once admin approves it.
            </div>
          </div>
        )}

        {approvalStatus === "REJECTED" && (
          <div style={{ ...styles.errorBox, padding: "16px" }}>
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>❌</div>
            <div style={{ fontWeight: 700 }}>Registration Rejected</div>
            <div style={{ fontSize: "13px", marginTop: "4px" }}>Please contact support for assistance.</div>
          </div>
        )}

        {!approvalStatus && (
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Mobile Number</label>
            <input
              style={styles.input}
              name="mobile"
              type="tel"
              placeholder="Enter registered mobile"
              value={form.mobile}
              onChange={handleChange}
              maxLength={10}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <div style={styles.errorBox}>{error}</div>}

            <button
              type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        )}

        <div style={styles.registerLink}>
          New here?{" "}
          <Link href="/delivery/register" style={{ color: "#60a5fa", fontWeight: 600 }}>
            Register as Delivery Partner
          </Link>
        </div>
      </div>
    </div>
  );
}
