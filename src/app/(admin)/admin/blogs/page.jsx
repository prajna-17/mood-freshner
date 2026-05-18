"use client";

import Modal from "@/components/admin/Modal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import "@/components/admin/modal.css";
import "@/components/admin/confirmModal.css";
import React, { useState, useEffect } from "react";
import { useUploadThing } from "@/utils/upload";
import { API } from "@/utils/api";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Modal & Form states
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [status, setStatus] = useState("PUBLISHED");
  const [images, setImages] = useState([]);

  // Confirm Delete state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/blogs`);
      const data = await res.json();
      if (data.statusCode === 200) {
        setBlogs(data.data || []);
      }
    } catch (err) {
      console.error("Fetch blogs failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Image Uploader hook
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const uploadedUrls = res.map((r) => r.ufsUrl);
      setImages((prev) => [...prev, ...uploadedUrls]);
    },
    onUploadError: () => alert("Image upload failed ❌"),
  });

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    const payload = {
      title,
      content,
      author,
      status,
      images,
    };

    const token = localStorage.getItem("token");
    const url = editMode ? `${API}/blogs/${currentId}` : `${API}/blogs`;
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.statusCode === 200 || result.statusCode === 201) {
        alert(editMode ? "Blog updated successfully! ✔" : "Blog created successfully! ✔");
        setOpenModal(false);
        fetchBlogs();
      } else {
        alert(result.message || "Operation failed ❌");
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Something went wrong ❌");
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/blogs/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.statusCode === 200) {
        alert("Blog deleted! ✔");
        setConfirmOpen(false);
        fetchBlogs();
      } else {
        alert(result.message || "Delete failed ❌");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Network error ❌");
    }
  };

  // Remove individual image during upload preview
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#6b3430] mb-2">Manage Blogs</h1>
          <div className="h-1 w-20 bg-[#6b3430] rounded-full"></div>
        </div>

        <button
          className="bg-[#6b3430] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#5a2a26] transition-colors shadow-sm"
          onClick={() => {
            setEditMode(false);
            setTitle("");
            setContent("");
            setAuthor("Admin");
            setStatus("PUBLISHED");
            setImages([]);
            setOpenModal(true);
          }}
        >
          + Add New Blog
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search blogs..."
          className="w-full max-w-md p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-[#6b3430] focus:border-[#6b3430]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="p-12 text-center text-gray-500">Loading blogs...</div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-gray-50">
                  <img
                    src={blog.images?.[0] || "/img/placeholder.jpg"}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white ${
                      blog.status === "PUBLISHED" ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {blog.content}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-gray-50 bg-gray-50/50 flex justify-between gap-3">
                <button
                  onClick={() => {
                    setEditMode(true);
                    setCurrentId(blog._id);
                    setTitle(blog.title);
                    setContent(blog.content);
                    setAuthor(blog.author || "Admin");
                    setStatus(blog.status || "PUBLISHED");
                    setImages(blog.images || []);
                    setOpenModal(true);
                  }}
                  className="flex-1 py-2 text-center text-sm font-semibold rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteId(blog._id);
                    setConfirmOpen(true);
                  }}
                  className="flex-1 py-2 text-center text-sm font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-gray-400 italic">No blogs found.</div>
      )}

      {/* ADD/EDIT BLOG MODAL */}
      <Modal
        open={openModal}
        title={editMode ? "Edit Blog Post" : "Add New Blog"}
        onClose={() => setOpenModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-gray-900 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#6b3430] focus:border-[#6b3430]"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#6b3430] focus:border-[#6b3430]"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#6b3430] focus:border-[#6b3430]"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[#6b3430] focus:border-[#6b3430]"
              rows={6}
              placeholder="Write blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              disabled={isUploading}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  startUpload(files);
                }
              }}
            />
            {isUploading && (
              <p className="text-xs text-[#6b3430] mt-1.5 animate-pulse">Uploading images...</p>
            )}

            {/* Uploaded Images Preview */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {images.map((imgUrl, i) => (
                  <div key={i} className="relative w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
                    <img src={imgUrl} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6b3430] text-white rounded-lg text-sm font-semibold hover:bg-[#5a2a26] transition shadow-sm"
              disabled={isUploading}
            >
              Save Blog
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="This blog post will be permanently deleted."
        onConfirm={handleDelete}
      />
    </div>
  );
}
