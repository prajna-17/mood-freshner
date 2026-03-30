"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/utils/api";

export default function AdminHome() {
  const router = useRouter();
  const [totalOrders, setTotalOrders] = useState(0);

  const [totalCategories, setTotalCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");

      const [catRes, prodRes, orderRes] = await Promise.all([
        fetch(`${API}/categories`).then((r) => r.json()),
        fetch(`${API}/products`).then((r) => r.json()),
        fetch(`${API}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((r) => r.json()),
      ]);

      const categories = Array.isArray(catRes) ? catRes : catRes.data || [];
      const products = Array.isArray(prodRes) ? prodRes : prodRes.data || [];
      const orders = Array.isArray(orderRes) ? orderRes : orderRes.data || [];

      setTotalCategories(categories.length);
      setTotalProducts(products.length);
      setTotalOrders(orders.length);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  return (
    <div>
      <h2 className="page-title text-[#6b3430]">Admin Dashboard</h2>
      <div className="page-title-underline"></div>

      {/* Top Buttons */}
      <div className="dashboard-actions">
        <button
          className="dash-btn"
          onClick={() => router.push("/admin/category")}
        >
          Manage Categories
        </button>
        <button
          className="dash-btn"
          onClick={() => router.push("/admin/product")}
        >
          Manage Products
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-title">Total Products</div>
          <div className="dashboard-card-value">{totalProducts}</div>
          <div className="dashboard-card-sub">Active: 0 / Inactive: 0</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Total Categories</div>
          <div className="dashboard-card-value">{totalCategories}</div>
          <div className="dashboard-card-sub">Active: 0 / Inactive: 0</div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-title">Active Orders</div>
          <div className="dashboard-card-value">{totalOrders}</div>
          <div className="dashboard-card-sub">Pending / Completed</div>
        </div>
      </div>

      <h3 className="recent-title">Recently Added Products</h3>
      <p className="recent-empty">No products found.</p>
    </div>
  );
}
