"use client";

import ConfirmModal from "@/components/admin/ConfirmModal";
import Modal from "@/components/admin/Modal";
import "@/components/admin/confirmModal.css";
import "@/components/admin/modal.css";
import { API } from "@/utils/api";
import React, { useEffect, useState } from "react";

export default function AdminSuperCategory() {
  const [superCategories, setSuperCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSuperCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/super-categories`);
      const data = await res.json();
      setSuperCategories(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Super category fetch error", err);
      alert("Failed to load super categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setCurrentId(null);
    setEditMode(false);
  };

  const filtered = superCategories.filter((item) =>
    item?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Super category name required");
      return;
    }

    try {
      const res = await fetch(
        editMode
          ? `${API}/super-categories/${currentId}`
          : `${API}/super-categories`,
        {
          method: editMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Save failed");
        return;
      }

      if (editMode) {
        setSuperCategories((prev) =>
          prev.map((item) => (item._id === currentId ? data : item)),
        );
      } else {
        setSuperCategories((prev) => [data, ...prev]);
      }

      setOpenModal(false);
      resetForm();
    } catch (err) {
      console.error("Super category save error", err);
      alert("Action failed");
    }
  };

  return (
    <div>
      <h1 className="page-title">Manage Super Categories</h1>

      <div className="cat-top-row">
        <input
          type="text"
          placeholder="Search super categories..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
        >
          + Create Super Category
        </button>
      </div>

      {loading ? (
        <p className="recent-empty">Loading super categories...</p>
      ) : filtered.length === 0 ? (
        <p className="recent-empty">No super categories found.</p>
      ) : (
        <div className="category-grid">
          {filtered.map((item) => (
            <div key={item._id} className="category-card text-gray-900">
              <div className="category-title">{item.name}</div>
              <div className="category-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditMode(true);
                    setCurrentId(item._id);
                    setName(item.name);
                    setOpenModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => {
                    setDeleteId(item._id);
                    setConfirmOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={openModal}
        title={editMode ? "Edit Super Category" : "Create Super Category"}
        onClose={() => {
          setOpenModal(false);
          resetForm();
        }}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">
            Super Category Details
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Super Category Name
            </label>
            <input
              type="text"
              className="modal-input text-gray-800"
              placeholder="Super Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button className="primary-btn create-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="Super category will be permanently deleted. Categories linked to it must be moved or deleted first."
        onConfirm={async () => {
          try {
            const res = await fetch(`${API}/super-categories/${deleteId}`, {
              method: "DELETE",
            });
            const data = await res.json().catch(() => ({}));

            if (res.status === 404) {
              setSuperCategories((prev) =>
                prev.filter((item) => item._id !== deleteId),
              );
              setConfirmOpen(false);
              alert("Super category was already removed. List refreshed.");
              return;
            }

            if (!res.ok) {
              alert(data?.message || "Delete failed");
              return;
            }

            setSuperCategories((prev) =>
              prev.filter((item) => item._id !== deleteId),
            );
            setConfirmOpen(false);
          } catch (err) {
            console.error("Super category delete error", err);
            alert("Network error");
          }
        }}
      />
    </div>
  );
}
