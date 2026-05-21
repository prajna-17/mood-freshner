"use client";

import React, { useState, useEffect } from "react";
import { API } from "@/utils/api";
import Modal from "@/components/admin/Modal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import "@/components/admin/modal.css";
import "@/components/admin/confirmModal.css";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVendorId, setCurrentVendorId] = useState(null);

  // Form Fields
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Details Side-drawer / Modal State
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  // Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/vendors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      if (resData.status === "success") {
        setVendors(resData.data || []);
      }
    } catch (err) {
      console.error("Fetch vendors error ❌", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDetails = async (vendorId) => {
    try {
      const res = await fetch(`${API}/vendors/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = await res.json();
      if (resData.status === "success") {
        setSelectedVendorDetails(resData.data);
        setOpenDetailsModal(true);
      } else {
        alert("Failed to load vendor details ❌");
      }
    } catch (err) {
      console.error("Fetch vendor details error ❌", err);
    }
  };

  const handleSaveVendor = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !city.trim() || !state.trim()) {
      alert("Name, Phone, City, and State are required fields!");
      return;
    }

    const payload = {
      name,
      contactPerson,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    };

    try {
      let res;
      if (editMode) {
        res = await fetch(`${API}/vendors/${currentVendorId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/vendors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const resData = await res.json();
      if (resData.status === "success") {
        alert(editMode ? "Vendor updated ✔" : "Vendor created ✔");
        setOpenModal(false);
        fetchVendors();
      } else {
        alert(resData.message || "Operation failed ❌");
      }
    } catch (err) {
      console.error("Save vendor error ❌", err);
      alert("Network error ❌");
    }
  };

  const handleDeleteVendor = async () => {
    try {
      const res = await fetch(`${API}/vendors/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();
      if (resData.status === "success") {
        alert("Vendor deleted successfully ✔");
        setConfirmOpen(false);
        fetchVendors();
      } else {
        alert(resData.message || "Failed to delete vendor. Keep in mind that vendors with purchase records cannot be deleted.");
      }
    } catch (err) {
      console.error("Delete vendor error ❌", err);
      alert("Network error ❌");
    }
  };

  // Financial Stats Totals
  const totalVendorsCount = vendors.length;
  const totalPurchasesAmount = vendors.reduce((acc, curr) => acc + (curr.totalPurchases || 0), 0);
  const totalPaidAmount = vendors.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0);
  const totalOutstandingAmount = vendors.reduce((acc, curr) => acc + (curr.outstanding || 0), 0);

  // Search Filter
  const filteredVendors = vendors.filter((v) => {
    const term = search.toLowerCase();
    return (
      (v.name || "").toLowerCase().includes(term) ||
      (v.contactPerson || "").toLowerCase().includes(term) ||
      (v.phone || "").toLowerCase().includes(term) ||
      (v.city || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 md:p-6 text-gray-800 bg-[#f9fafc] min-h-screen">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f243e] tracking-tight">🤝 Vendor Management</h1>
          <p className="text-sm text-gray-500 mt-1">Add, update vendors and track daily outstanding payments</p>
        </div>
        <button
          className="w-full md:w-auto px-5 py-3 bg-[#1c3b63] hover:bg-[#0b1b2f] text-white rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 font-semibold text-sm"
          onClick={() => {
            setEditMode(false);
            setName("");
            setContactPerson("");
            setPhone("");
            setEmail("");
            setAddress("");
            setCity("");
            setState("");
            setPincode("");
            setOpenModal(true);
          }}
        >
          <span className="text-lg font-bold">+</span> Add New Vendor
        </button>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Vendors</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 block">{totalVendorsCount}</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-xl font-bold">🤝</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Purchased</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 block">₹{totalPurchasesAmount.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl text-xl font-bold">🛒</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Payments</span>
            <span className="text-2xl md:text-3xl font-bold text-[#4cd964] mt-2 block">₹{totalPaidAmount.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl text-xl font-bold">💳</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between bg-gradient-to-r from-red-50 to-white">
          <div>
            <span className="text-xs font-semibold text-red-500 uppercase tracking-wider block">Outstanding Due</span>
            <span className="text-2xl md:text-3xl font-bold text-[#ff6b6b] mt-2 block">₹{totalOutstandingAmount.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-xl text-xl font-bold">⚠️</div>
        </div>
      </div>

      {/* FILTER SEARCH ROW */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search vendor by name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1c3b63] focus:border-transparent text-sm text-gray-900"
          />
          <span className="absolute left-3.5 top-3 text-gray-400 font-medium">🔍</span>
        </div>
        <div className="text-xs text-gray-500 w-full md:w-auto text-right">
          Showing {filteredVendors.length} of {totalVendorsCount} vendors
        </div>
      </div>

      {/* VENDORS GRID LIST (Extremely Mobile Friendly Cards) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1c3b63] mb-4"></div>
          <p className="text-gray-500 text-sm">Loading vendor portfolio...</p>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">No vendors found matches the request.</p>
          <button
            onClick={() => setSearch("")}
            className="mt-4 text-[#1c3b63] hover:underline text-sm font-semibold"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header Info */}
              <div className="p-5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 tracking-tight leading-snug">{vendor.name}</h3>
                    {vendor.contactPerson && (
                      <span className="text-xs text-gray-400 font-medium mt-0.5 block">Attn: {vendor.contactPerson}</span>
                    )}
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-gray-100 font-semibold rounded-lg text-gray-600 block shrink-0">
                    📍 {vendor.city}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600 border-t border-gray-50 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">📞 Phone</span>
                    <a href={`tel:${vendor.phone}`} className="font-semibold text-gray-900 hover:underline">{vendor.phone}</a>
                  </div>
                  {vendor.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">✉️ Email</span>
                      <span className="font-medium text-gray-800 text-right truncate max-w-[180px]">{vendor.email}</span>
                    </div>
                  )}
                  {vendor.address && (
                    <div className="flex flex-col gap-0.5 mt-2">
                      <span className="text-xs text-gray-400">🏠 Address</span>
                      <span className="text-xs text-gray-800 bg-gray-50 p-2 rounded-lg leading-relaxed mt-1 block">
                        {vendor.address}, {vendor.city}, {vendor.state} - {vendor.pincode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-3 mt-5 bg-[#fafbfc] p-3 rounded-xl border border-gray-50 text-center">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Purchased</span>
                    <span className="font-bold text-gray-900 mt-1 block">₹{vendor.totalPurchases?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Outstanding</span>
                    <span className={`font-bold mt-1 block ${vendor.outstanding > 0 ? "text-[#ff6b6b]" : "text-green-600"}`}>
                      ₹{vendor.outstanding?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="bg-gray-50 border-t border-gray-100 p-4 grid grid-cols-3 gap-2">
                <button
                  onClick={() => fetchVendorDetails(vendor._id)}
                  className="px-2 py-2 bg-white border border-gray-200 text-xs font-semibold rounded-lg text-gray-700 hover:bg-gray-100 transition text-center"
                >
                  👁 Details
                </button>
                <button
                  onClick={() => {
                    setEditMode(true);
                    setCurrentVendorId(vendor._id);
                    setName(vendor.name || "");
                    setContactPerson(vendor.contactPerson || "");
                    setPhone(vendor.phone || "");
                    setEmail(vendor.email || "");
                    setAddress(vendor.address || "");
                    setCity(vendor.city || "");
                    setState(vendor.state || "");
                    setPincode(vendor.pincode || "");
                    setOpenModal(true);
                  }}
                  className="px-2 py-2 bg-[#1c3b63] text-white hover:bg-[#0b1b2f] text-xs font-semibold rounded-lg transition text-center"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteId(vendor._id);
                    setConfirmOpen(true);
                  }}
                  className="px-2 py-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition text-center"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT VENDOR MODAL */}
      <Modal
        open={openModal}
        title={editMode ? "📝 Edit Vendor Details" : "🤝 Register New Vendor"}
        onClose={() => setOpenModal(false)}
      >
        <form onSubmit={handleSaveVendor} className="space-y-4 text-gray-900 mt-2 max-h-[75vh] overflow-y-auto px-1">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Company / Vendor Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Fresh Supplies Inc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. sales@vendor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Office / Warehouse Address</label>
            <input
              type="text"
              placeholder="e.g. Building 42, Industrial Zone"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">City *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">State *</label>
              <input
                type="text"
                required
                placeholder="e.g. Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Pincode</label>
              <input
                type="text"
                placeholder="e.g. 400001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3b63] text-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1c3b63] hover:bg-[#0b1b2f] text-white rounded-lg font-bold text-sm shadow-md transition duration-200 mt-6"
          >
            {editMode ? "Save Changes" : "Create Vendor Account"}
          </button>
        </form>
      </Modal>

      {/* DETAILED VENDOR PROFILE DRAWER/MODAL */}
      <Modal
        open={openDetailsModal}
        title="🤝 Vendor Detailed Summary"
        onClose={() => setOpenDetailsModal(false)}
      >
        {selectedVendorDetails && (
          <div className="space-y-6 text-gray-900 mt-2 max-h-[80vh] overflow-y-auto pr-1">
            {/* Header Profiler */}
            <div className="bg-[#0f243e] text-white p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Company Account</span>
              <h2 className="text-xl md:text-2xl font-bold mt-1">{selectedVendorDetails.vendor.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 border-t border-white/10 pt-4">
                <div>
                  <span className="text-[10px] text-gray-300 uppercase block font-semibold">Total Purchases</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">
                    ₹{selectedVendorDetails.vendor.totalPurchases?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-300 uppercase block font-semibold">Amount Paid</span>
                  <span className="text-lg font-bold text-[#4cd964] mt-0.5 block">
                    ₹{selectedVendorDetails.vendor.totalPaid?.toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="text-[10px] text-gray-300 uppercase block font-semibold">Outstanding Due</span>
                  <span className="text-lg font-bold text-[#ff6b6b] mt-0.5 block">
                    ₹{selectedVendorDetails.vendor.outstanding?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Info fields */}
            <div>
              <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Vendor Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-gray-400">📞 Phone</span>
                  <span className="font-bold text-gray-900">{selectedVendorDetails.vendor.phone}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                  <span className="text-gray-400">✉️ Email</span>
                  <span className="font-bold text-gray-900 truncate ml-2">{selectedVendorDetails.vendor.email || "N/A"}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center col-span-1 sm:col-span-2">
                  <span className="text-gray-400">👤 Contact</span>
                  <span className="font-bold text-gray-900">{selectedVendorDetails.vendor.contactPerson || "N/A"}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 col-span-1 sm:col-span-2">
                  <span className="text-gray-400 text-xs block mb-1">📍 Address Location</span>
                  <span className="font-medium text-gray-900 text-xs leading-relaxed block mt-1">
                    {selectedVendorDetails.vendor.address || "No detailed address specified"}
                    <br />
                    {selectedVendorDetails.vendor.city}, {selectedVendorDetails.vendor.state} -{" "}
                    {selectedVendorDetails.vendor.pincode || ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchases History Timeline */}
            <div>
              <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-widest border-b border-gray-100 pb-2 mb-3">
                Purchase Records ({selectedVendorDetails.purchases.length})
              </h4>
              {selectedVendorDetails.purchases.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-2xl text-xs text-gray-500 italic">
                  No purchases logged yet for this vendor.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedVendorDetails.purchases.map((purchase) => (
                    <div
                      key={purchase._id}
                      className="border border-gray-100 rounded-xl p-4 shadow-sm bg-white space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-xs text-gray-400 font-bold block">
                            📅 {new Date(purchase.purchaseDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full block shrink-0 ${
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

                      {/* Items summaries */}
                      <div className="bg-gray-50 p-2 rounded-lg text-xs space-y-1">
                        {purchase.products.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700">
                            <span>
                              {item.title} (x{item.quantity})
                            </span>
                            <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Summary financials of purchase */}
                      <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-gray-400">Total:</span>{" "}
                          <span className="font-bold text-gray-900">₹{purchase.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Paid:</span>{" "}
                          <span className="font-bold text-green-600">₹{purchase.amountPaid?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Due:</span>{" "}
                          <span className="font-bold text-[#ff6b6b]">
                            ₹{(purchase.totalAmount - purchase.amountPaid).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        message="Are you sure you want to permanently delete this vendor? This will not work if the vendor has linked purchase records."
        onConfirm={handleDeleteVendor}
      />
    </div>
  );
}
