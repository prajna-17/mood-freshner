"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    localStorage.removeItem("isProfileComplete");
    router.push("/auth");
  };
  return (
    <div className="admin-main">
      {/* HEADER */}
      <header
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}
        <div
          className="header-left"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <button className="sidebar-btn" onClick={() => setOpen(!open)}>
            ☰
          </button>

          <span className="admin-app-name">SNS</span>
        </div>

        {/* RIGHT SIDE */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginRight: 20,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            color: "#ffffff",
          }}
        >
          Home
        </button>
      </header>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <Link href="/admin/" className="admin-link">
          Dashboard
        </Link>

        <Link href="/admin/category" className="admin-link">
          Categories
        </Link>

        <Link href="/admin/product" className="admin-link">
          Products
        </Link>

        <Link href="/admin/orders" className="admin-link">
          Orders
        </Link>

        <Link href="/admin/create-admin" className="admin-link">
          Create Admin
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
