"use client";

import React, { useState, useEffect } from "react";
import { API } from "@/utils/api";
import Modal from "@/components/admin/Modal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import "@/components/admin/modal.css";
import "@/components/admin/confirmModal.css";

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterVendor, setFilterVendor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Create Purchase Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [purchaseItems, setPurchaseItems] = useState([
    { product: "", title: "", price: 0, quantity: 1, isCustom: true },
  ]);

  // Initial Payment inside purchase form
  const [initialPayAmount, setInitialPayAmount] = useState(0);
  const [initialPayMethod, setInitialPayMethod] = useState("CASH");
  const [initialPayNotes, setInitialPayNotes] = useState("Initial payment");

  // Purchase Details Drawer State
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  // Add Partial Payment inside details modal
  const [partialPayAmount, setPartialPayAmount] = useState(0);
  const [partialPayMethod, setPartialPayMethod] = useState("CASH");
  const [partialPayNotes, setPartialPayNotes] = useState("");

  // Delete Purchase State
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchPurchases();
    fetchVendors();
    fetchProducts();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      
      // Construct Query parameters
      let url = `${API}/purchases?`;
      if (filterVendor) url += `vendor=${filterVendor}&`;
      if (filterStatus) url += `paymentStatus=${filterStatus}&`;
      if (filterStartDate) url += `startDate=${filterStartDate}&`;
      if (filterEndDate) url += `endDate=${filterEndDate}&`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = await res.json();
      if (resData.status === "success") {
        setPurchases(resData.data || []);
      }
    } catch (err) {
      console.error("Fetch purchases error ❌", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API}/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = await res.json();
      if (resData.status === "success") {
        setVendors(resData.data || []);
      }
    } catch (err) {
      console.error("Fetch vendors list error ❌", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const resData = await res.json();
      const prodsList = Array.isArray(resData) ? resData : resData.data || [];
      setProducts(prodsList);
    } catch (err) {
      console.error("Fetch catalog products error ❌", err);
    }
  };

  // Re-run purchases fetching when filters change
  useEffect(() => {
    fetchPurchases();
  }, [filterVendor, filterStatus, filterStartDate, filterEndDate]);

  // Handle Items changes in Log Purchase Form
  const handleItemFieldChange = (index, field, value) => {
    const items = [...purchaseItems];
    
    if (field === "product") {
      if (value === "CUSTOM") {
        items[index].product = "";
        items[index].title = "";
        items[index].price = 0;
        items[index].isCustom = true;
      } else {
        // Find selected product
        const prod = products.find((p) => p._id === value);
        if (prod) {
          items[index].product = prod._id;
          items[index].title = prod.title;
          items[index].price = prod.price || 0;
          items[index].isCustom = false;
        }
      }
    } else {
      items[index][field] = value;
    }
    
    setPurchaseItems(items);
  };

  const addItemRow = () => {
    setPurchaseItems([
      ...purchaseItems,
      { product: "", title: "", price: 0, quantity: 1, isCustom: true },
    ]);
  };

  const removeItemRow = (index) => {
    if (purchaseItems.length === 1) return;
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  // Grand Total Calculation
  const grandTotal = purchaseItems.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.quantity)), 0);

  const handleSavePurchase = async (e) => {
    e.preventDefault();

    if (!selectedVendor) {
      alert("Please select a vendor!");
      return;
    }

    // Validate Items
    const formattedProducts = [];
    for (const item of purchaseItems) {
      if (!item.title.trim()) {
        alert("All purchase items must have a title/name!");
        return;
      }
      if (Number(item.price) <= 0 || Number(item.quantity) <= 0) {
        alert("Price and Quantity must be positive values!");
        return;
      }
      
      formattedProducts.push({
        product: item.product || undefined,
        title: item.title.trim(),
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal: Number(item.price) * Number(item.quantity),
      });
    }

    const payload = {
      vendor: selectedVendor,
      products: formattedProducts,
      totalAmount: grandTotal,
      purchaseDate,
      initialPayment: initialPayAmount > 0 ? {
        amount: Number(initialPayAmount),
        paymentDate: purchaseDate,
        paymentMethod: initialPayMethod,
        notes: initialPayNotes,
      } : null,
    };

    try {
      const res = await fetch(`${API}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.status === "success") {
        alert("Purchase logged successfully ✔");
        setOpenModal(false);
        setPurchaseItems([{ product: "", title: "", price: 0, quantity: 1, isCustom: true }]);
        setInitialPayAmount(0);
        fetchPurchases();
      } else {
        alert(resData.message || "Failed to log purchase ❌");
      }
    } catch (err) {
      console.error("Save purchase error ❌", err);
      alert("Network error ❌");
    }
  };

  // Add Additional Partial Payment
  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (!partialPayAmount || Number(partialPayAmount) <= 0) {
      alert("Please enter a valid payment amount!");
      return;
    }

    const maxAllowed = selectedPurchase.totalAmount - selectedPurchase.amountPaid;
    if (Number(partialPayAmount) > maxAllowed) {
      alert(`Paid amount cannot exceed outstanding dues of ₹${maxAllowed.toLocaleString()}`);
      return;
    }

    const payload = {
      amount: Number(partialPayAmount),
      paymentDate: new Date(),
      paymentMethod: partialPayMethod,
      notes: partialPayNotes.trim() || "Partial payment logged",
    };

    try {
      const res = await fetch(`${API}/purchases/${selectedPurchase._id}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.status === "success") {
        alert("Payment logged successfully ✔");
        setPartialPayAmount(0);
        setPartialPayNotes("");
        
        // Refresh details modal & parent dashboard
        setSelectedPurchase(resData.data);
        fetchPurchases();
      } else {
        alert(resData.message || "Failed to record payment ❌");
      }
    } catch (err) {
      console.error("Add payment error ❌", err);
      alert("Network error ❌");
    }
  };

  // Delete Payment Transaction
  const handleDeletePayment = async (paymentId) => {
    if (!confirm("Are you sure you want to delete this payment record? It will decrease the paid amount.")) return;

    try {
      const res = await fetch(`${API}/purchases/${selectedPurchase._id}/payments/${paymentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();
      if (resData.status === "success") {
        alert("Payment deleted successfully ✔");
        setSelectedPurchase(resData.data);
        fetchPurchases();
      } else {
        alert(resData.message || "Failed to delete payment ❌");
      }
    } catch (err) {
      console.error("Delete payment transaction error ❌", err);
    }
  };

  // Delete Entire Purchase Bill
  const handleDeletePurchase = async () => {
    try {
      const res = await fetch(`${API}/purchases/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();
      if (resData.status === "success") {
        alert("Purchase bill deleted ✔");
        setConfirmDeleteOpen(false);
        fetchPurchases();
      } else {
        alert(resData.message || "Failed to delete purchase ❌");
      }
    } catch (err) {
      console.error("Delete purchase error ❌", err);
      alert("Network error ❌");
    }
  };

  return (
    <div className="p-4 md:p-6 text-gray-800 bg-[#f9fafc] min-h-screen">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f243e] tracking-tight">🛒 Daily Purchases</h1>
          <p className="text-sm text-gray-500 mt-1">Maintain daily supplies log and track vendor payment status</p>
        </div>
        <button
          className="w-full md:w-auto px-5 py-3 bg-[#1c3b63] hover:bg-[#0b1b2f] text-white rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 font-semibold text-sm"
          onClick={() => {
            setSelectedVendor("");
            setPurchaseDate(new Date().toISOString().split("T")[0]);
            setPurchaseItems([{ product: "", title: "", price: 0, quantity: 1, isCustom: true }]);
            setInitialPayAmount(0);
            setInitialPayMethod("CASH");
            setInitialPayNotes("Initial payment");
            setOpenModal(true);
          }}
        >
          <span className="text-lg font-bold">+</span> Log New Purchase
        </button>
      </div>

      {/* FILTER SEARCH DASHBOARD BLOCK */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
        <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">🎯 Filtering Log Archives</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Vendor Filter */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">Select Vendor</label>
            <select
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3b63]"
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">Payment Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3b63]"
            >
              <option value="">All Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">Start Date</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3b63]"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">End Date</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1c3b63]"
            />
          </div>
        </div>

        {/* Clear Filters Helper */}
        {(filterVendor || filterStatus || filterStartDate || filterEndDate) && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setFilterVendor("");
                setFilterStatus("");
                setFilterStartDate("");
                setFilterEndDate("");
              }}
              className="text-xs text-[#1c3b63] hover:underline font-semibold flex items-center gap-1"
            >
              🔄 Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* DAILY PURCHASES LIST GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c3b63] mb-4"></div>
          <p className="text-gray-500 text-sm">Parsing daily purchase logs...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-gray-500 font-medium">No purchase items matches the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => {
            const remaining = purchase.totalAmount - purchase.amountPaid;
            const progress = (purchase.amountPaid / purchase.totalAmount) * 100;
            
            return (
              <div
                key={purchase._id}
                className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  {/* Card Header info */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 truncate max-w-[170px] tracking-tight">
                        {purchase.vendor?.name || "Unknown Vendor"}
                      </h3>
                      <span className="text-[11px] font-bold text-gray-400 mt-1 block">
                        📅 {new Date(purchase.purchaseDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg block shrink-0 ${
                        purchase.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : purchase.paymentStatus === "PARTIAL"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {purchase.paymentStatus}
                    </span>
                  </div>

                  {/* Items summary lists */}
                  <div className="mt-4 bg-gray-50 p-3 rounded-xl space-y-1.5 max-h-[110px] overflow-y-auto">
                    {purchase.products.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                        <span className="truncate max-w-[150px] font-medium">{p.title}</span>
                        <span className="text-gray-400 shrink-0 font-bold ml-2">
                          {p.quantity} x ₹{p.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Values block */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 text-center">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">Bill Total</span>
                      <span className="font-bold text-gray-900 text-sm block mt-1">₹{purchase.totalAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">Amount Paid</span>
                      <span className="font-bold text-green-600 text-sm block mt-1">₹{purchase.amountPaid.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider block">Due Remaining</span>
                      <span className={`font-bold text-sm block mt-1 ${remaining > 0 ? "text-red-500" : "text-gray-400"}`}>
                        ₹{remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar paid vs due */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-[#4cd964] h-1.5 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1.5">
                      <span>{Math.round(progress)}% Paid</span>
                      <span>₹{remaining.toLocaleString()} due</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedPurchase(purchase);
                      setOpenDetailsModal(true);
                    }}
                    className="w-full py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-semibold rounded-lg transition duration-200 text-center"
                  >
                    🔍 View Dues & Details
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(purchase._id);
                      setConfirmDeleteOpen(true);
                    }}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-lg transition duration-200 text-center"
                  >
                    🗑 Delete Bill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE NEW PURCHASE MODAL */}
      <Modal
        open={openModal}
        title="🛒 Log Daily Supply Purchase"
        onClose={() => setOpenModal(false)}
      >
        <form onSubmit={handleSavePurchase} className="space-y-4 text-gray-900 mt-2 max-h-[80vh] overflow-y-auto pr-1 pl-1">
          {/* Vendor picker & Date field */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Select Vendor *</label>
              <select
                required
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black bg-white"
              >
                <option value="">-- Choose Vendor --</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Purchase Date *</label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
              />
            </div>
          </div>

          {/* DYNAMIC ITEMS BUILDER */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Supply Items List</span>
              <button
                type="button"
                onClick={addItemRow}
                className="px-3 py-1 bg-white hover:bg-gray-100 text-[#1c3b63] border border-gray-200 rounded-lg text-xs font-semibold shadow-sm transition"
              >
                + Add Item
              </button>
            </div>

            {/* List of item rows */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {purchaseItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-3 items-stretch md:items-end justify-between shadow-xs relative"
                >
                  {/* Product Catalog search selection */}
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] font-bold text-gray-400 block mb-0.5">Catalog Integration</label>
                    <select
                      value={item.product || "CUSTOM"}
                      onChange={(e) => handleItemFieldChange(index, "product", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-black bg-white"
                    >
                      <option value="CUSTOM">Custom Write-in Name</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title} (₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title Name Write-in */}
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] font-bold text-gray-400 block mb-0.5">Supply Item Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Milk Packet, Paperbags"
                      value={item.title}
                      disabled={!item.isCustom}
                      onChange={(e) => handleItemFieldChange(index, "title", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-black disabled:bg-gray-50"
                    />
                  </div>

                  {/* Price */}
                  <div className="w-[100px]">
                    <label className="text-[10px] font-bold text-gray-400 block mb-0.5">Price *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="₹0.00"
                      value={item.price}
                      onChange={(e) => handleItemFieldChange(index, "price", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-black"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="w-[80px]">
                    <label className="text-[10px] font-bold text-gray-400 block mb-0.5">Qty *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemFieldChange(index, "quantity", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-black"
                    />
                  </div>

                  {/* Subtotal & Delete actions */}
                  <div className="flex items-center gap-3 justify-between md:justify-end shrink-0 pl-1 mt-2 md:mt-0">
                    <div className="text-right">
                      <span className="text-[9px] text-gray-400 block">Subtotal</span>
                      <span className="font-bold text-xs text-gray-800 block">
                        ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                      </span>
                    </div>
                    {purchaseItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition text-sm font-semibold shrink-0 block"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Display calculated grand total */}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Bill Grand Total:</span>
              <span className="text-lg font-black text-[#1c3b63]">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* INITIAL PAYMENT BLOCK */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-3">
            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">💸 Upfront Initial Payment</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Paid Amount */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Paid Amount (optional)</label>
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  placeholder="₹0.00"
                  value={initialPayAmount}
                  onChange={(e) => setInitialPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Payment Method</label>
                <select
                  value={initialPayMethod}
                  onChange={(e) => setInitialPayMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black bg-white"
                >
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  <option value="CHEQUE">CHEQUE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Payment Transaction Notes</label>
              <input
                type="text"
                placeholder="e.g. Paid partial upfront to delivery boy"
                value={initialPayNotes}
                onChange={(e) => setInitialPayNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1c3b63] hover:bg-[#0b1b2f] text-white rounded-lg font-bold text-sm shadow-md transition duration-200 mt-6"
          >
            Save Purchase bill & Log Dues
          </button>
        </form>
      </Modal>

      {/* COMPREHENSIVE PURCHASE DETAILS & RECORD PAYMENTS MODAL */}
      <Modal
        open={openDetailsModal}
        title="🛒 Detailed Supplies Invoice"
        onClose={() => setOpenDetailsModal(false)}
      >
        {selectedPurchase && (
          <div className="space-y-6 text-gray-900 mt-2 max-h-[80vh] overflow-y-auto pr-1 pl-1">
            {/* Header info block */}
            <div className="bg-[#0f243e] text-white p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Vendor Account</span>
                  <h3 className="text-xl font-bold mt-0.5">{selectedPurchase.vendor?.name || "N/A"}</h3>
                  <span className="text-[11px] text-gray-300 mt-1 block">
                    Logged on: {new Date(selectedPurchase.purchaseDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 block ${
                    selectedPurchase.paymentStatus === "PAID"
                      ? "bg-green-100/10 text-green-400 border border-green-500/20"
                      : selectedPurchase.paymentStatus === "PARTIAL"
                      ? "bg-yellow-100/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-red-100/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {selectedPurchase.paymentStatus}
                </span>
              </div>

              {/* Pricing Cards Inside Details Header */}
              <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/10 pt-4 text-center">
                <div>
                  <span className="text-[10px] text-gray-300 uppercase block font-medium">Bill Grand Total</span>
                  <span className="text-base font-bold text-white mt-0.5 block">
                    ₹{selectedPurchase.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-300 uppercase block font-medium">Amount Paid</span>
                  <span className="text-base font-bold text-[#4cd964] mt-0.5 block">
                    ₹{selectedPurchase.amountPaid?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-300 uppercase block font-medium">Remaining Due</span>
                  <span className="text-base font-bold text-[#ff6b6b] mt-0.5 block">
                    ₹{(selectedPurchase.totalAmount - selectedPurchase.amountPaid).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Supplied products breakdown */}
            <div>
              <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Items Purchased Breakdown
              </h4>
              <div className="space-y-2">
                {selectedPurchase.products.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex justify-between items-center text-sm"
                  >
                    <div>
                      <span className="font-bold text-gray-900 block">{item.title}</span>
                      {item.product && (
                        <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">
                          🔗 Catalog Integrated product
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-800 block">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5 block">
                        {item.quantity} units @ ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Payments History Timeline */}
            <div>
              <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Payments Timeline Transactions
              </h4>
              {selectedPurchase.payments.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-2xl text-xs text-gray-500 italic">
                  No payments logged for this purchase yet (PENDING).
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPurchase.payments.map((payment) => (
                    <div
                      key={payment._id}
                      className="border border-gray-100 rounded-xl p-3 bg-white flex justify-between items-center shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-green-600">₹{payment.amount?.toLocaleString()}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {payment.paymentMethod}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block">
                          📅 {new Date(payment.paymentDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          at {new Date(payment.paymentDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                        {payment.notes && <p className="text-[11px] text-gray-500 italic mt-1 leading-normal">{payment.notes}</p>}
                      </div>
                      <button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-sm shrink-0 block"
                        title="Delete transaction log"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* "+ Log Partial Payment" form if not paid */}
            {selectedPurchase.totalAmount - selectedPurchase.amountPaid > 0 ? (
              <div className="border border-[#4cd964]/20 rounded-2xl p-4 bg-gradient-to-r from-green-50/50 to-white/10 space-y-3">
                <h4 className="text-xs font-extrabold text-green-700 uppercase tracking-widest">💰 Record Additional Payment</h4>
                <form onSubmit={handleAddPayment} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Amount */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Pay Amount *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max={selectedPurchase.totalAmount - selectedPurchase.amountPaid}
                        placeholder="₹0.00"
                        value={partialPayAmount}
                        onChange={(e) => setPartialPayAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-xs text-black"
                      />
                    </div>

                    {/* Method */}
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-1">Payment Method</label>
                      <select
                        value={partialPayMethod}
                        onChange={(e) => setPartialPayMethod(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-xs text-black bg-white"
                      >
                        <option value="CASH">CASH</option>
                        <option value="UPI">UPI</option>
                        <option value="BANK_TRANSFER">BANK TRANSFER</option>
                        <option value="CHEQUE">CHEQUE</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Paid outstanding due via GPay"
                      value={partialPayNotes}
                      onChange={(e) => setPartialPayNotes(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-xs shadow-md transition duration-200 mt-2"
                  >
                    Submit Dues Payment Log
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 p-4 rounded-2xl text-center text-xs font-semibold text-green-700">
                🎉 This purchase is fully paid! No outstanding dues remaining.
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        message="Are you sure you want to permanently delete this purchase bill record? This will reduce the vendor's purchase history."
        onConfirm={handleDeletePurchase}
      />
    </div>
  );
}
