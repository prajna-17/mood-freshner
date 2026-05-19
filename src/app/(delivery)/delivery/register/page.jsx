"use client";
import { useState } from "react";
import Link from "next/link";
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
    maxWidth: "420px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
  },
  logo: {
    textAlign: "center",
    marginBottom: "32px",
  },
  icon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "12px",
  },
  title: {
    color: "#fff",
    fontSize: "26px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
    marginTop: "6px",
  },
  label: {
    display: "block",
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "6px",
    marginTop: "18px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(30,58,95,0.9)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "28px",
    transition: "opacity 0.2s, transform 0.1s",
    letterSpacing: "0.3px",
  },
  successBox: {
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.4)",
    borderRadius: "16px",
    padding: "28px 24px",
    textAlign: "center",
    color: "#86efac",
  },
  errorBox: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: "14px",
    marginTop: "16px",
    textAlign: "center",
  },
  loginLink: {
    textAlign: "center",
    marginTop: "24px",
    color: "rgba(255,255,255,0.5)",
    fontSize: "14px",
  },
};

export default function DeliveryRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    vehicleType: "BIKE",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.mobile || !form.password) {
      setError("Name, mobile and password are required.");
      return;
    }
    if (form.mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/delivery/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.icon}>🛵</span>
          <h1 style={styles.title}>Join as Delivery Partner</h1>
          <p style={styles.subtitle}>MoodFresh Delivery Network</p>
        </div>

        {success ? (
          <div style={styles.successBox}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
              Registration Submitted!
            </div>
            <div style={{ fontSize: "14px", color: "rgba(134,239,172,0.8)", marginBottom: "20px" }}>
              Your application is under review. Admin will approve your account shortly.
            </div>
            <Link href="/delivery/login">
              <button style={{ ...styles.btn, marginTop: 0, width: "auto", padding: "10px 24px" }}>
                Go to Login
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Full Name *</label>
            <input
              style={styles.input}
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Mobile Number *</label>
            <input
              style={styles.input}
              name="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={handleChange}
              maxLength={10}
              required
            />

            <label style={styles.label}>Email (Optional)</label>
            <input
              style={styles.input}
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
            />

            <label style={styles.label}>Password *</label>
            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Vehicle Type</label>
            <select
              style={styles.select}
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
            >
              <option value="BIKE">🏍️ Bike</option>
              <option value="SCOOTER">🛵 Scooter</option>
              <option value="CYCLE">🚲 Cycle</option>
              <option value="OTHER">🚗 Other</option>
            </select>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button
              type="submit"
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </form>
        )}

        <div style={styles.loginLink}>
          Already registered?{" "}
          <Link href="/delivery/login" style={{ color: "#60a5fa", fontWeight: 600 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
