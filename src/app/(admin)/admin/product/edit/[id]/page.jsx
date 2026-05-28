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
  const [sizesList, setSizesList] = useState([]);
  const [colors, setColors] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sellingCategory, setSellingCategory] = useState("featured");
  const [inStock, setInStock] = useState(true);
  const [superCategories, setSuperCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [superCategoryId, setSuperCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [pincodes, setPincodes] = useState("");
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
    if (data.sizes && data.sizes.length > 0) {
      if (typeof data.sizes[0] === "object") {
        setSizesList(
          data.sizes.map((s) => ({
            size: s.size,
            price: s.price,
            oldPrice: s.oldPrice || "",
            quantity: s.quantity || 0,
          })),
        );
      } else {
        // Backward compatibility converter for legacy string sizes
        setSizesList(
          data.sizes.map((s) => ({
            size: s,
            price: data.price,
            oldPrice: data.oldPrice || "",
            quantity: data.quantity || 0,
          })),
        );
      }
    } else {
      setSizesList([]);
    }
    setColors(data.colors.join(","));
    setCategoryId(data.category?._id || "");
    setPincodes((data.availablePincodes || []).join(","));
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
      sizes: sizesList.filter((s) => s.size.trim()).map((s) => ({
        size: s.size.trim(),
        price: Number(s.price) || 0,
        oldPrice: s.oldPrice ? Number(s.oldPrice) : undefined,
        quantity: Number(s.quantity) || 0,
      })),
      colors: colors.split(",").map((x) => x.trim()),
      category: categoryId,
      availablePincodes: pincodes
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
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
      <h1 className="page-title text-gray-800 font-extrabold mb-6">Edit Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-900">
        {/* Left Column: Basic Details & Media */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">Basic Information</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Product Name</label>
              <input
                className="modal-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
              <textarea
                className="modal-input"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
          </div>

          {/* Card 2: Product Gallery */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">Product Gallery</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Upload Product Images</label>
              <input
                ref={mainFileRef}
                type="file"
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </div>

            {(previewImages.length > 0 || images.length > 0) && (
              <div className="image-preview-box mt-3 p-2 bg-gray-50 rounded-lg">
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
            )}

            {colorImages.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Color Variants Gallery</h4>
                <div className="flex flex-col gap-4 bg-gray-50 p-3 rounded-lg">
                  {colorImages.map((c, i) => (
                    <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Color: <span className="text-blue-600">{c.color}</span>
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
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Delivery */}
        <div className="flex flex-col gap-6">
          {/* Card 3: Delivery Options */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">Delivery</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Available Pincodes</label>
              <input
                className="modal-input"
                placeholder="Pincodes (e.g. 560001,560002)"
                value={pincodes}
                onChange={(e) => setPincodes(e.target.value)}
              />
            </div>
          </div>

          {/* Card 4: Pricing & Inventory */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-1">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Price (INR)</label>
                <input
                  className="modal-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Old Price (INR)</label>
                <input
                  className="modal-input"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="Old Price"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Quantity In Stock</label>
              <input
                className="modal-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
              />
            </div>

            <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="inStockCheckEdit"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="inStockCheckEdit" className="text-sm font-semibold text-gray-700 cursor-pointer">
                In Stock & Available
              </label>
            </div>

            {/* SIZES & PRICING CRUD */}
            <div className="flex flex-col gap-4 border-t pt-4 mt-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">Sizes & Pricing</h4>
                <button
                  type="button"
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition active:scale-95"
                  onClick={() => setSizesList([...sizesList, { size: "", price: "", oldPrice: "", quantity: "1" }])}
                >
                  + Add Size Variant
                </button>
              </div>

              {sizesList.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {sizesList.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-3 rounded-xl relative border border-gray-150 shadow-sm">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 font-extrabold uppercase">Size Label</label>
                        <input
                          className="modal-input text-xs"
                          placeholder="e.g. 500ml, Small"
                          value={item.size}
                          onChange={(e) => {
                            const updated = [...sizesList];
                            updated[idx].size = e.target.value;
                            setSizesList(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 font-extrabold uppercase">Price (INR)</label>
                        <input
                          className="modal-input text-xs"
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => {
                            const updated = [...sizesList];
                            updated[idx].price = e.target.value;
                            setSizesList(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-gray-500 font-extrabold uppercase">Old Price</label>
                        <input
                          className="modal-input text-xs"
                          type="number"
                          placeholder="Old Price"
                          value={item.oldPrice}
                          onChange={(e) => {
                            const updated = [...sizesList];
                            updated[idx].oldPrice = e.target.value;
                            setSizesList(updated);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1 relative pr-8">
                        <label className="text-[10px] text-gray-500 font-extrabold uppercase">Stock Qty</label>
                        <input
                          className="modal-input text-xs"
                          type="number"
                          placeholder="Stock"
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...sizesList];
                            updated[idx].quantity = e.target.value;
                            setSizesList(updated);
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-2 bottom-3 text-red-500 hover:text-red-700 font-bold"
                          onClick={() => {
                            setSizesList(sizesList.filter((_, i) => i !== idx));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No custom sizes added. Product will use the base price and quantity above.</p>
              )}
            </div>
          </div>

          {/* Action button */}
          <button className="primary-btn create-btn py-3 w-full" onClick={updateProduct}>
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
