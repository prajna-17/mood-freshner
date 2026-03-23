"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API } from "@/utils/api";
import { useUploadThing } from "@/utils/upload";
import "@/components/admin/modal.css";
import "@/components/admin/confirmModal.css";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const { startUpload } = useUploadThing("imageUploader");

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [colorImages, setColorImages] = useState([]);
  const [currentColor, setCurrentColor] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sellingCategory, setSellingCategory] = useState("featured");
  const [inStock, setInStock] = useState(true);
  const [superCategories, setSuperCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [superCategoryId, setSuperCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const mainFileRef = React.useRef(null);
  const colorFileRef = React.useRef(null);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    const res = await fetch(`${API}/products/${id}`);
    const data = await res.json();

    setTitle(data.title);
    setDescription(data.description);
    setImages(data.images || []);
    setColorImages(data.colorImages || []);
    setPrice(data.price);
    setOldPrice(data.oldPrice || "");
    setQuantity(data.quantity);
    setSizes(data.sizes.join(","));
    setColors(data.colors.join(","));
    setCategoryId(data.category?._id || "");
    setSellingCategory(data.productSellingCategory);
    setInStock(data.inStock);

    setLoading(false);
  };

  const loadCategories = async () => {
    const res = await fetch(`${API}/categories`);
    setCategories(await res.json());
  };

  const handleImageUpload = async (files) => {
    const fileArray = Array.from(files);

    // Preview only
    const previews = fileArray.map((f) => URL.createObjectURL(f));
    setPreviewImages((p) => [...p, ...previews]);

    // Upload
    const uploaded = await startUpload(fileArray);

    if (uploaded) {
      const realUrls = uploaded.map((u) => u.ufsUrl);
      setImages((p) => [...p, ...realUrls]);
    }
  };

  const removeMainImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (updated.length === 0 && mainFileRef.current) {
        mainFileRef.current.value = "";
      }

      return updated;
    });
  };

  const handleColorUpload = async (files) => {
    if (!currentColor.trim()) return alert("Enter color first");

    const upload = await startUpload(files);
    if (upload) {
      setColorImages((p) => [
        ...p,
        { color: currentColor, images: upload.map((u) => u.ufsUrl) },
      ]);
      setCurrentColor("");
    }
  };

  const removeColorImage = (colorIndex, imageIndex) => {
    setColorImages((prev) => {
      const updated = [...prev];

      updated[colorIndex].images.splice(imageIndex, 1);

      // 🔥 remove color block if no images left
      if (updated[colorIndex].images.length === 0) {
        updated.splice(colorIndex, 1);
      }

      if (colorFileRef.current) {
        colorFileRef.current.value = "";
      }

      return updated;
    });
  };

  const updateProduct = async () => {
    const body = {
      title,
      description,
      images,
      colorImages,
      price: Number(price),
      oldPrice: Number(oldPrice),
      quantity: Number(quantity),
      sizes: sizes.split(",").map((x) => x.trim()),
      colors: colors.split(",").map((x) => x.trim()),
      category: categoryId,
      productSellingCategory: sellingCategory,
      inStock,
    };

    const res = await fetch(`${API}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Product Updated ✔");
      router.push("/admin/product");
    } else {
      alert("Failed ❌");
    }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading...</div>;

  return (
    <div>
      <h1 className="page-title">Edit Product</h1>

      <div className="create-prod-form">
        <input
          ref={mainFileRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files)}
        />

        <div className="image-preview-box">
          {[...previewImages, ...images].map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={img} className="preview-img" />
              <span
                onClick={() => removeMainImage(i)}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#000",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                ✕
              </span>
            </div>
          ))}
        </div>

        <input
          className="modal-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product Name"
        />
        <textarea
          className="modal-input"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        {/* 
        <input
          className="modal-input"
          placeholder="Color (Red / Blue)"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
        /> */}
        {/* <input
          ref={colorFileRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleColorUpload([...e.target.files])}
        /> */}

        {colorImages.length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {colorImages.map((c, i) => (
              <div key={i}>
                <p style={{ fontSize: 12, fontWeight: 500 }}>
                  Color: {c.color}
                </p>
                <div className="image-preview-box">
                  {c.images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img src={img} className="preview-img" />
                      <span
                        onClick={() => removeColorImage(i, idx)}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#000",
                          color: "#fff",
                          borderRadius: "50%",
                          width: 18,
                          height: 18,
                          fontSize: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          className="modal-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
        <input
          className="modal-input"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
          placeholder="Old Price"
        />
        <input
          className="modal-input"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
        />
        <input
          className="modal-input"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          placeholder="Sizes (S,M,L)"
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
          }}
        >
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label>In Stock</label>
        </div>

        <button className="primary-btn create-btn" onClick={updateProduct}>
          Update Product
        </button>
      </div>
    </div>
  );
}
