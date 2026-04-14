"use client";

import { useState, useEffect } from "react";
import { API } from "@/utils/api";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginModal({ isOpen, onClose }) {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ── Mount animation ──
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
      document.body.style.overflow = "hidden";
    } else {
      setShow(false);
      const t = setTimeout(() => setVisible(false), 350);
      document.body.style.overflow = "auto";
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm
        transition-opacity duration-300
        ${show ? "opacity-100" : "opacity-0"}`}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-1/2 z-[1000] w-full max-w-md -translate-x-1/2
        transition-transform duration-[350ms]
        ${show ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-t-3xl px-6 pt-3 pb-10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Welcome</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Sign in to continue
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full"
            >
              ✕
            </button>
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500">Name *</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-2xl px-4 py-3 mt-1"
              />
            </div>

            {/* Google Login */}
            <div className="flex justify-center mt-3">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!form.name.trim()) {
                    setError("Name is required");
                    return;
                  }

                  try {
                    const res = await fetch(`${API}/auth/google`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        credential: credentialResponse.credential,
                        name: form.name, // ✅ IMPORTANT
                      }),
                    });

                    const data = await res.json();

                    if (!res.ok) throw new Error(data.message);

                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data));

                    setSuccess(true);

                    setTimeout(() => {
                      setSuccess(false);
                      onClose();
                      setForm({ name: "" });
                    }, 1500);
                  } catch (err) {
                    setError(err.message);
                  }
                }}
                onError={() => setError("Google Login Failed")}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Success */}
      {success && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white shadow px-5 py-3 rounded-full">
          🎉 Logged in successfully
        </div>
      )}
    </>
  );
}
