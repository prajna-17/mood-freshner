"use client";

import Modal from "@/components/admin/Modal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import "@/components/admin/modal.css";
import "@/components/admin/confirmModal.css";
import React, { useState, useEffect } from "react";
import { useUploadThing } from "@/utils/upload";
import { API } from "@/utils/api";

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1); // 1-super | 2-category | 3-sub
  const [superCategories, setSuperCategories] = useState([]);
  const [superCategory, setSuperCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [subCategories, setSubCategories] = useState([]); // list for modal
  const [originalSubCategories, setOriginalSubCategories] = useState([]);
  const [subMap, setSubMap] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    try {
      const [res, superRes] = await Promise.all([
        fetch(`${API}/categories`),
        fetch(`${API}/super-categories`),
      ]);
      const data = await res.json();
      const superData = await superRes.json();

      const cats = data?.data || [];
      setCategories(cats);
      setSuperCategories(Array.isArray(superData) ? superData : []);

      const map = {};
      for (const cat of cats) {
        const subRes = await fetch(`${API}/sub-categories?category=${cat._id}`);
        const subsData = await subRes.json();
        map[cat._id] = subsData?.data || subsData || [];
      }

      setSubMap(map);
    } catch (err) {
      console.error("Fetch error ❌", err);
    }
  };

  useEffect(() => {
    if (!API) return;
    fetchData();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [existingSubCategory, setExistingSubCategory] = useState("");

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setImage(res[0].ufsUrl);
    },
    onUploadError: () => alert("Upload failed ❌"),
  });

  const filtered = categories.filter(
    (c) =>
      typeof c?.name === "string" &&
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1 className="page-title">Manage Categories</h1>

      <div className="cat-top-row">
        <input
          type="text"
          placeholder="Search categories..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={() => {
            setEditMode(false);
            setStep(1);
            setSuperCategory("");
            setName("");
            setSubCategory("");
            setSubCategories([]);
            setOriginalSubCategories([]);
            setImage("");
            setPreview("");
            setOpenModal(true);
          }}
        >
          + Create Category
        </button>
      </div>

      <div className="category-grid">
        {filtered.map((cat) => (
          <div key={cat._id} className="category-card text-gray-900">
            <img
              src={cat.image || "/img/placeholder.jpg"}
              className="category-img"
            />
            <div className="category-title">{cat.name}</div>
            <div className="mt-2 mb-4 font-bold">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === cat._id ? null : cat._id)
                }
                className="w-full flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                <span className="text-sm font-bold text-gray-800 gap-3">
                  Subcategories
                </span>
                <span className="text-xs bg-gray-300 px-2 py-1 rounded-full">
                  {subMap[cat._id]?.length || 0}
                </span>
              </button>

              {openDropdown === cat._id && (
                <div className="mt-3 bg-white rounded-xl shadow-md p-3 flex flex-col gap-2 animate-fadeIn">
                  {subMap[cat._id]?.length > 0 ? (
                    subMap[cat._id].map((sub) => (
                      <div
                        key={sub._id}
                        className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        <span className="text-sm text-gray-700">
                          {sub.name}
                        </span>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this subcategory?")) return;
                            await fetch(`${API}/sub-categories/${sub._id}`, {
                              method: "DELETE",
                            });
                            setSubMap((prev) => ({
                              ...prev,
                              [cat._id]: prev[cat._id].filter(
                                (s) => s._id !== sub._id,
                              ),
                            }));
                          }}
                          className="text-xs font-medium px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      No subcategories available
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="category-actions">
              <button
                className="edit-btn"
                onClick={async () => {
                  setEditMode(true);
                  setCurrentId(cat._id);
                  setName(cat.name);
                  setImage(cat.image);
                  setPreview(cat.image);
                  setSuperCategory(cat.superCategory?._id || cat.superCategory || "");
                  setStep(1);

                  const subRes = await fetch(
                    `${API}/sub-categories?category=${cat._id}`,
                  );
                  const subs = await subRes.json();
                  const subList = subs?.data || subs || [];
                  setSubCategories(subList);
                  setOriginalSubCategories(subList);
                  setSubCategory("");

                  setOpenModal(true);
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => {
                  setDeleteId(cat._id);
                  setConfirmOpen(true);
                }}
              >
                Delete
              </button>

              <button className="inactive-btn">Activate</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal
        open={openModal}
        title={editMode ? "Edit Category" : "Create Category"}
        onClose={() => setOpenModal(false)}
      >
        {/* STEP 1 – SUPER CATEGORY */}
        {step === 1 && (
          <div className="text-gray-900 flex flex-col gap-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">
              {editMode ? "Change Super Category" : "Select Super Category"}
            </h3>

            {editMode ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Super Category
                </label>
                <select
                  className="modal-input text-gray-800"
                  value={superCategory}
                  onChange={(e) => setSuperCategory(e.target.value)}
                >
                  <option value="">Select</option>
                  {superCategories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Choose a Super Category to continue
                </label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {superCategories.map((s) => (
                    <button
                      key={s._id}
                      className={`primary-btn text-sm ${
                        superCategory === s._id
                          ? "bg-blue-700 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => {
                        setSuperCategory(s._id);
                        setStep(2);
                      }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!superCategories.length && (
              <p className="text-sm text-gray-500 mt-2">
                Create a super category first from the Super Categories page.
              </p>
            )}

            {editMode && (
              <button
                className="primary-btn create-btn"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            )}
          </div>
        )}

        {/* STEP 2 – CATEGORY DETAILS */}
        {step === 2 && (
          <div className="text-gray-900 flex flex-col gap-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">
              Category Details
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Category Name
              </label>
              <input
                type="text"
                className="modal-input text-gray-800"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Category Image
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPreview(URL.createObjectURL(file));
                  startUpload([file]);
                }}
              />
              {isUploading && (
                <p className="text-xs text-blue-500 font-medium">Uploading image...</p>
              )}
            </div>

            {preview && (
              <img
                src={preview}
                style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover" }}
              />
            )}

            <button
              className="primary-btn create-btn"
              onClick={() => {
                if (!name || !image) {
                  alert("Category name & image required");
                  return;
                }
                setStep(3);
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 3 – SUB CATEGORIES */}
        {step === 3 && (
          <div className="text-gray-900 flex flex-col gap-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">
              Sub-Categories
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Add Sub Category
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  className="modal-input text-gray-800"
                  placeholder="Sub Category Name"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                />
                <button
                  className="primary-btn"
                  style={{ fontSize: 14, padding: "8px 16px" }}
                  onClick={() => {
                    if (!subCategory.trim()) return;
                    const exists = subCategories.some(
                      (s) =>
                        s.name.trim().toLowerCase() ===
                        subCategory.trim().toLowerCase(),
                    );
                    if (exists) {
                      alert("SubCategory already added in this category ⚠️");
                      return;
                    }
                    setSubCategories((p) => [...p, { name: subCategory.trim() }]);
                    setSubCategory("");
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* SUB CATEGORY LIST */}
            {subCategories.length > 0 && (
              <div className="border rounded-lg divide-y bg-gray-50 max-h-44 overflow-y-auto px-3">
                {subCategories.map((s, index) => (
                  <div
                    key={s._id ?? `new-${index}`}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-sm font-medium text-gray-700">{s.name}</span>
                    <button
                      onClick={() =>
                        setSubCategories((p) => p.filter((_, i) => i !== index))
                      }
                      className="text-xs text-red-500 font-bold hover:text-red-700 px-2 py-1"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="primary-btn create-btn"
              style={{ marginTop: 8 }}
              onClick={async () => {
                if (subCategories.length === 0) {
                  alert("Add at least one subcategory");
                  return;
                }

                try {
                  if (!superCategory || !name || !image) {
                    alert("Super category, category name & image required");
                    return;
                  }

                  /* ===== EDIT MODE ===== */
                  if (editMode) {
                    const categoryRes = await fetch(`${API}/categories/${currentId}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name, image, superCategory }),
                    });
                    const updatedCategory = await categoryRes.json();

                    if (!categoryRes.ok) {
                      alert(updatedCategory?.message || "Category update failed");
                      return;
                    }

                    for (const s of subCategories) {
                      // EXISTING subcategory → UPDATE
                      if (s._id) {
                        const subRes = await fetch(`${API}/sub-categories/${s._id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name: s.name }),
                        });
                        const subData = await subRes.json();
                        if (!subRes.ok) {
                          alert(subData?.message || "Subcategory update failed");
                          return;
                        }
                      }
                      // NEW subcategory → CREATE
                      else {
                        const subRes = await fetch(`${API}/sub-categories`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: s.name,
                            category: currentId,
                          }),
                        });
                        const subData = await subRes.json();
                        if (!subRes.ok) {
                          alert(subData?.message || "Subcategory create failed");
                          return;
                        }
                      }
                    }

                    const keptIds = new Set(
                      subCategories.filter((s) => s._id).map((s) => s._id),
                    );
                    const removedSubCategories = originalSubCategories.filter(
                      (s) => s._id && !keptIds.has(s._id),
                    );

                    for (const s of removedSubCategories) {
                      const deleteRes = await fetch(`${API}/sub-categories/${s._id}`, {
                        method: "DELETE",
                      });
                      const deleteData = await deleteRes.json();
                      if (!deleteRes.ok) {
                        alert(deleteData?.message || "Subcategory delete failed");
                        return;
                      }
                    }

                    const subRes = await fetch(
                      `${API}/sub-categories?category=${currentId}`,
                    );
                    const subs = await subRes.json();
                    const nextSubs = subs?.data || subs || [];

                    setCategories((prev) =>
                      prev.map((cat) =>
                        cat._id === currentId ? updatedCategory : cat,
                      ),
                    );
                    setSubMap((prev) => ({
                      ...prev,
                      [currentId]: nextSubs,
                    }));

                    alert("Category updated ✔");
                    setOpenModal(false);
                    return;
                  }

                  /* ===== CREATE MODE ===== */
                  const catRes = await fetch(`${API}/categories`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name,
                      image,
                      superCategory,
                    }),
                  });
                  const cat = await catRes.json();

                  if (!catRes.ok) {
                    alert(cat?.message || "Category create failed");
                    return;
                  }

                  for (const s of subCategories) {
                    await fetch(`${API}/sub-categories`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: s.name,
                        category: cat._id,
                      }),
                    });
                  }

                  setCategories((p) => [...p, cat]);
                  const subRes = await fetch(
                    `${API}/sub-categories?category=${cat._id}`,
                  );
                  const subs = await subRes.json();

                  setSubMap((prev) => ({
                    ...prev,
                    [cat._id]: subs?.data || subs || [],
                  }));

                  alert("Category created ✔");
                  setOpenModal(false);
                } catch {
                  alert("Action failed ❌");
                }
              }}
            >
              Save
            </button>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="Category will be permanently deleted."
        onConfirm={async () => {
          try {
            const r = await fetch(`${API}/categories/${deleteId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!r.ok) {
              const err = await r.text();
              console.error("DELETE CATEGORY ERROR:", err);
              alert("Delete failed ❌");
              return;
            }

            setCategories((p) => p.filter((c) => c._id !== deleteId));
            alert("Deleted ✔");
            setConfirmOpen(false);
          } catch (e) {
            console.error("DELETE REQUEST FAILED:", e);
            alert("Network error ❌");
          }
        }}
      />
    </div>
  );
}
