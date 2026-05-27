"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Modal from "@/components/admin/Modal";
import "@/components/admin/confirmModal.css";
import { API } from "@/utils/api";

export default function AdminProducts() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [quantityProduct, setQuantityProduct] = useState(null);
  const [quantityValue, setQuantityValue] = useState("");
  const [quantitySaving, setQuantitySaving] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadData = async () => {
    const prodRes = await fetch(`${API}/products`).then((r) => r.json());
    const catRes = await fetch(`${API}/categories`).then((r) => r.json());

    // ✅ IMPORTANT FIX
    setProducts(Array.isArray(prodRes) ? prodRes : prodRes.data || []);
    setCategories(Array.isArray(catRes) ? catRes : catRes.data || []);
  };

  useEffect(() => {
    const timer = setTimeout(loadData, 0);
    return () => clearTimeout(timer);
  }, []);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredProducts = products
    .filter((p) => (categoryFilter ? p.category?._id === categoryFilter : true))
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const openQuantityModal = (product) => {
    setQuantityProduct(product);
    setQuantityValue(product.quantity ?? 0);
    setQuantityModalOpen(true);
  };

  const updateQuantity = async () => {
    const nextQuantity = Number(quantityValue);

    if (!Number.isInteger(nextQuantity) || nextQuantity < 0) {
      alert("Enter a valid quantity");
      return;
    }

    setQuantitySaving(true);

    const res = await fetch(`${API}/products/${quantityProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: nextQuantity,
        inStock: nextQuantity > 0,
      }),
    });

    if (res.ok) {
      const updated = await res.json();

      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)),
      );
      setQuantityModalOpen(false);
      setQuantityProduct(null);
      alert("Quantity updated ✔");
    } else {
      alert("Quantity update failed ❌");
    }

    setQuantitySaving(false);
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
            <img
              src={p.images?.[0]}
              alt={p.title}
              className="product-img"
            />

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
                  className="primary-btn small"
                  onClick={() => openQuantityModal(p)}
                >
                  Update Qty
                </button>

                <button
                  className="delete-btn small"
                  onClick={() => askDelete(p._id)}
                >
                  Delete
                </button>

                {/* <button className="inactive-btn small">
                  {p.inStock ? "Deactivate" : "Activate"}
                </button> */}
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

      <Modal
        open={quantityModalOpen}
        onClose={() => setQuantityModalOpen(false)}
        title="Update Product Quantity"
      >
        <div className="flex flex-col gap-4 text-gray-900">
          <div>
            <div className="text-sm font-bold text-gray-800">
              {quantityProduct?.title}
            </div>
            <div className="text-xs text-gray-500">
              Current quantity: {quantityProduct?.quantity ?? 0}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              New Quantity
            </label>
            <input
              className="modal-input"
              type="number"
              min="0"
              step="1"
              value={quantityValue}
              onChange={(e) => setQuantityValue(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <button
            className="primary-btn"
            onClick={updateQuantity}
            disabled={quantitySaving}
          >
            {quantitySaving ? "Updating..." : "Update Quantity"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
