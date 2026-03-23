"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/admin/ConfirmModal";
import "@/components/admin/confirmModal.css";
import { API } from "@/utils/api";

export default function AdminProducts() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prodRes = await fetch(`${API}/products`).then((r) => r.json());
    const catRes = await fetch(`${API}/categories`).then((r) => r.json());

    // ✅ IMPORTANT FIX
    setProducts(Array.isArray(prodRes) ? prodRes : prodRes.data || []);
    setCategories(Array.isArray(catRes) ? catRes : catRes.data || []);
  };

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredProducts = products
    .filter((p) => (categoryFilter ? p.category?._id === categoryFilter : true))
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const res = await fetch(`${API}/products/${deleteId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      alert("Product deleted ✔");
    } else {
      alert("Delete failed ❌");
    }

    setConfirmOpen(false);
  };

  return (
    <div>
      <h1 className="page-title">Manage Products</h1>

      <div className="cat-top-row">
        <div style={{ display: "flex", gap: 12 }}>
          <input
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="search-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ minWidth: 180 }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Link href="/admin/product/create">
          <button className="primary-btn">+ Create Product</button>
        </Link>
      </div>

      <div className="product-grid">
        {filteredProducts.map((p) => (
          <div className="product-card" key={p._id}>
            <img src={p.images?.[0]} className="product-img" />

            <div className="product-body">
              <div className="product-title">{p.title}</div>
              <div className="product-price">₹{p.price}</div>

              <div className="product-sub">
                <span>{p.category?.name}</span>
                <span>Qty: {p.quantity}</span>
              </div>

              <div className="product-actions">
                <Link href={`/admin/product/edit/${p._id}`}>
                  <button className="primary-btn small">Edit</button>
                </Link>

                <button
                  className="delete-btn small"
                  onClick={() => askDelete(p._id)}
                >
                  Delete
                </button>

                <button className="inactive-btn small">
                  {p.inStock ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="This product will be permanently deleted."
      />
    </div>
  );
}
