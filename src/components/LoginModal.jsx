"use client";

import { useState, useEffect } from "react";
import { API } from "@/utils/api";

export default function LoginModal({ isOpen, onClose }) {
  // `visible` controls whether the DOM node exists
  // `show` controls the CSS transition (slide + fade)
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(0);

  // ── Mount / unmount with animation ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // tiny delay so the transition fires after mount
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      // wait for slide-out to finish before removing from DOM
      const t = setTimeout(() => setVisible(false), 350);
      document.body.style.overflow = "auto";
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  // Countdown timer
  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── API calls ────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(2);
      setTimer(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          name: form.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        throw new Error(data.message);
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name || form.name,
          email: data.email || form.email,
          role: data.role, // ✅ ADD THIS
        }),
      );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setStep(1);
        setForm({ name: "", email: "", otp: "" });
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${show ? "opacity-100" : "opacity-0"}`}
      />

      {/* ── Sheet ── */}
      <div
        className={`fixed bottom-0 left-1/2 z-[1000] w-full max-w-md -translate-x-1/2
          transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]
          ${show ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div
          className={`bg-white rounded-t-3xl px-6 pt-3 pb-10 shadow-2xl
            ${shake ? "animate-[shake_0.4s_ease]" : ""}`}
          style={shake ? { animation: "shake 0.4s ease" } : {}}
        >
          {/* Handle */}
          <div className="flex justify-center mb-5">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {step === 1 ? "Welcome back" : "Check your email"}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {step === 1
                  ? "Sign in to continue shopping"
                  : `OTP sent to ${form.email}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-sky-400 focus:bg-white transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-sky-400 focus:bg-white transition-colors"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || !form.email.trim()}
                className="mt-2 w-full bg-sky-500 hover:bg-sky-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-2xl transition-all duration-200 shadow-md shadow-sky-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:300ms]" />
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              {/* Back */}
              <button
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="flex items-center gap-1.5 text-xs text-sky-500 font-medium mb-1 w-fit"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  One-Time Password
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="● ● ● ● ● ●"
                  maxLength={6}
                  value={form.otp}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      otp: e.target.value.replace(/\D/g, ""),
                    });
                    setError("");
                  }}
                  className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3.5 text-xl text-center font-bold tracking-[0.5em] text-gray-900 placeholder-gray-300 outline-none focus:border-sky-400 focus:bg-white transition-colors"
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || form.otp.length < 4}
                className="mt-1 w-full bg-sky-500 hover:bg-sky-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3.5 rounded-2xl transition-all duration-200 shadow-md shadow-sky-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:300ms]" />
                  </span>
                ) : (
                  "Verify & Login"
                )}
              </button>

              <button
                onClick={handleSendOtp}
                disabled={timer > 0 || loading}
                className="text-sm text-center text-gray-400 disabled:opacity-40 mt-1"
              >
                {timer > 0 ? (
                  <span>
                    Resend in{" "}
                    <span className="text-sky-500 font-semibold">{timer}s</span>
                  </span>
                ) : (
                  <span className="text-sky-500 font-medium">Resend OTP</span>
                )}
              </button>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-500 text-sm text-center rounded-2xl px-4 py-2.5">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* ── Success toast ── */}
      {success && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1002]
          bg-white border border-gray-100 shadow-xl rounded-full
          px-5 py-3 flex items-center gap-2.5
          animate-[slideUp_0.4s_cubic-bezier(0.32,0.72,0,1)_both]"
        >
          <span className="text-lg">🎉</span>
          <p className="text-sm font-semibold text-gray-800">
            Welcome! You're logged in
          </p>
        </div>
      )}

      {/* Shake + slideUp keyframes */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </>
  );
}
