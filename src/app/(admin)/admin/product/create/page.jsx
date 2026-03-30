"use client";

import { API } from "@/utils/api";
import { useUploadThing } from "@/utils/upload";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCreateProduct() {
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  // 🔹 images
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [colorImages, setColorImages] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [superCategories, setSuperCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [superCategoryId, setSuperCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  // 🔹 form fields
  const [categories, setCategories] = useState([]);
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
  const mainFileRef = React.useRef(null);
  const colorFileRef = React.useRef(null);

  // useEffect(() => {
  //   fetch(`${API}/categories`)
  //     .then((r) => r.json())
  //     .then((d) => {
  //       console.log("CATEGORY RESPONSE:", d);
  //       setCategories(Array.isArray(d) ? d : d.data || []);
  //     })
  //     .catch(() => console.log("Category fetch failed ❌"));
  // }, []);

  useEffect(() => {
    fetch(`${API}/super-categories`)
      .then((r) => r.json())
      .then(setSuperCategories);
  }, []);
  useEffect(() => {
    if (!superCategoryId) return;

    fetch(`${API}/categories?superCategory=${superCategoryId}`)
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : d.data || []));
  }, [superCategoryId]);
  useEffect(() => {
    if (!categoryId) return;

    fetch(`${API}/sub-categories?category=${categoryId}`)
      .then((r) => r.json())
      .then(setSubCategories);
  }, [categoryId]);

  // 🔹 MAIN IMAGES UPLOAD
  const handleImagesUpload = async (files) => {
    const upload = await startUpload(files);

    if (upload) {
      const realUrls = upload.map((u) => u.ufsUrl);
      setImages((p) => [...p, ...realUrls]);
    }
  };

  // 🔹 REMOVE MAIN IMAGE
  const removeMainImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (updated.length === 0 && mainFileRef.current) {
        mainFileRef.current.value = "";
      }

      return updated;
    });
  };

  // 🔹 COLOR IMAGES UPLOAD
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

  // 🔹 REMOVE COLOR IMAGE
  const removeColorImage = (colorIndex, imageIndex) => {
    setColorImages((prev) => {
      const updated = [...prev];

      updated[colorIndex].images.splice(imageIndex, 1);

      if (updated[colorIndex].images.length === 0) {
        updated.splice(colorIndex, 1);
      }

      if (colorFileRef.current) {
        colorFileRef.current.value = "";
      }

      return updated;
    });
  };

  // 🔹 SUBMIT
  const submitProduct = async () => {
    if (images.length === 0) {
      alert("Upload images first!");
      return;
    }

    const payload = {
      id: "PID-" + Date.now(),
      title,
      description,
      images,
      colorImages,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      quantity: Number(quantity),
      sizes: sizes.split(",").map((s) => s.trim()),
      colors: colors.split(",").map((s) => s.trim()),
      category: categoryId,
      subCategory: subCategoryId,

      productSellingCategory: sellingCategory,
      inStock,
    };

    const token = localStorage.getItem("token");

    // const res = await fetch(`${API}/products`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(payload),
    // });

    const res = await fetch(`${API}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Product Created ✔");
      router.push("/admin/product");
    } else {
      alert("Create failed ❌");
    }
  };

  return (
    <div>
      <h1 className="page-title">Create Product</h1>

      <div className="create-prod-form">
        <input
          ref={mainFileRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImagesUpload([...e.target.files])}
        />

        <div className="image-preview-box">
          {images.map((img, i) => (
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
          placeholder="Product Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="modal-input"
          rows={3}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* <input
          className="modal-input"
          placeholder="Colors (Red,Blue)"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
        /> */}

        <select
          className="modal-input"
          value={superCategoryId}
          onChange={(e) => {
            setSuperCategoryId(e.target.value);
            setCategoryId("");
            setSubCategoryId("");
          }}
        >
          <option value="">Select Super Category</option>
          {superCategories.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="modal-input"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubCategoryId("");
          }}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="modal-input"
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
        >
          <option value="">Select Sub Category</option>
          {subCategories.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* <input
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
          className="modal-input"
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
                {/* <p style={{ fontSize: 12, fontWeight: 500 }}>
                  Color: {c.color}
                </p> */}
                {/* <div className="image-preview-box">
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
                </div> */}
              </div>
            ))}
          </div>
        )}

        <input
          className="modal-input"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="modal-input"
          placeholder="Old Price"
          value={oldPrice}
          onChange={(e) => setOldPrice(e.target.value)}
        />
        <input
          className="modal-input"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {/* <input
          className="modal-input"
          placeholder="Sizes (S,M,L)"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        /> */}

        <select
          className="modal-input"
          value={sellingCategory}
          onChange={(e) => setSellingCategory(e.target.value)}
        >
          <option value="featured">Featured</option>
          <option value="on-selling">On Selling</option>
          <option value="best-selling">Best Selling</option>
          <option value="top-rating">Top Rating</option>
        </select>

        <div className="instock-row">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label>In Stock</label>
        </div>

        <button className="primary-btn create-btn" onClick={submitProduct}>
          Create Product
        </button>
      </div>
    </div>
  );
}
