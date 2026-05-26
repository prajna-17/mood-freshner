"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/auth";
import { API } from "@/utils/api";

const BASEAPI = API;

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

      const res = await fetch(`${BASEAPI}/admin/create`, {
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

      <div
        style={{ maxWidth: 420, marginTop: 30 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4"
      >
        <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">
          Admin Credentials
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="modal-input text-gray-800"
          />
        </div>

        <button
          onClick={handleCreateAdmin}
          disabled={loading}
          className="primary-btn create-btn"
          style={{ marginTop: 8 }}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>
    </div>
  );
}
