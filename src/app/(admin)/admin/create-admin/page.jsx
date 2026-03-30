"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CreateAdminPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateAdmin = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    setLoading(true);

    try {
      const token = getToken();

      const res = await fetch(`${API}/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Admin created successfully ✅");
        setEmail("");
        router.push("/admin");
      } else {
        alert(data.message || "Failed to create admin");
      }
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="page-title text-[#6b3430]">Create Admin</h2>
      <div className="page-title-underline"></div>

      <div style={{ maxWidth: 400, marginTop: 30 }}>
        <input
          type="email"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="modal-input"
        />

        <button
          onClick={handleCreateAdmin}
          disabled={loading}
          className="primary-btn create-btn"
          style={{ marginTop: 20 }}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>
    </div>
  );
}
