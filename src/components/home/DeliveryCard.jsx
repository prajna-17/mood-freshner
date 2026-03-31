"use client";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { getUserIdFromToken } from "@/utils/auth";
import LoginModal from "@/components/LoginModal";

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
};

// ── Address Modal ─────────────────────────────────────────────────────────────
function AddressModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_ADDRESS);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit number";
    if (!form.addressLine.trim()) e.addressLine = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!/^\d{6}$/.test(form.postalCode))
      e.postalCode = "Enter valid 6-digit PIN";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
  };

  const field = (label, key, placeholder, type = "text") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-sky-700">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => {
          setForm((f) => ({ ...f, [key]: e.target.value }));
          setErrors((err) => ({ ...err, [key]: undefined }));
        }}
        placeholder={placeholder}
        className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors[key] ? "border-red-400 bg-red-50" : "border-sky-200 bg-sky-50 focus:border-sky-400"}`}
      />
      {errors[key] && (
        <span className="text-xs text-red-500">{errors[key]}</span>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl px-5 pt-5 pb-8 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-1">
          <div className="w-10 h-1 rounded-full bg-sky-200" />
        </div>
        <p className="text-base font-bold text-sky-800">
          {initial?.addressLine ? "Edit Address" : "Add Address"}
        </p>
        {field("Full Name", "fullName", "John Doe")}
        {field("Phone Number", "phone", "10-digit mobile number", "tel")}
        {field("Address Line", "addressLine", "House no, Street, Area")}
        {field("Landmark (optional)", "landmark", "Near landmark")}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-sky-700">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => {
                setForm((f) => ({ ...f, city: e.target.value }));
                setErrors((err) => ({ ...err, city: undefined }));
              }}
              placeholder="Bengaluru"
              className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors.city ? "border-red-400 bg-red-50" : "border-sky-200 bg-sky-50 focus:border-sky-400"}`}
            />
            {errors.city && (
              <span className="text-xs text-red-500">{errors.city}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-sky-700">State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => {
                setForm((f) => ({ ...f, state: e.target.value }));
                setErrors((err) => ({ ...err, state: undefined }));
              }}
              placeholder="Karnataka"
              className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${errors.state ? "border-red-400 bg-red-50" : "border-sky-200 bg-sky-50 focus:border-sky-400"}`}
            />
            {errors.state && (
              <span className="text-xs text-red-500">{errors.state}</span>
            )}
          </div>
        </div>
        {field("PIN Code", "postalCode", "560001", "tel")}
        <button
          onClick={handleSave}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3.5 rounded-2xl text-sm transition active:scale-95"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}

// ── DeliveryCard ──────────────────────────────────────────────────────────────
export default function DeliveryCard() {
  const [address, setAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Load address from localStorage
  const loadAddress = () => {
    const userId = getUserIdFromToken();
    if (!userId) return;
    try {
      const addr = JSON.parse(localStorage.getItem(`address_${userId}`));
      if (addr) setAddress(addr);
    } catch {}
  };

  useEffect(() => {
    loadAddress();

    // Listen for address updates from profile page or checkout
    const onUpdate = () => loadAddress();
    window.addEventListener("addressUpdated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("addressUpdated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const handleChangeClick = () => {
    // Check login
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = (newAddr) => {
    const userId = getUserIdFromToken();
    if (userId)
      localStorage.setItem(`address_${userId}`, JSON.stringify(newAddr));
    setAddress(newAddr);
    setShowAddressModal(false);
    window.dispatchEvent(new Event("addressUpdated"));
  };

  return (
    <>
      <div className="px-4 mt-10">
        <div className="bg-gradient-to-r from-[#2b6cb0] to-[#1e3a8a] rounded-2xl p-4 flex items-center justify-between shadow-md">
          {/* LEFT */}
          <div className="flex items-start gap-2">
            <MapPin className="text-blue-200 w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <p className="text-blue-200 text-sm">Delivering to</p>
              {address ? (
                <>
                  <p className="text-white font-semibold text-base mt-0.5 leading-tight">
                    {address.addressLine}
                  </p>
                  <p className="text-blue-200 text-xs mt-0.5">
                    {address.city}, {address.state} — {address.postalCode}
                  </p>
                </>
              ) : (
                <p className="text-white font-medium text-base mt-1">
                  Add a delivery address
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={handleChangeClick}
            className="text-orange-400 font-medium underline text-sm whitespace-nowrap ml-3 transition-opacity hover:opacity-70"
          >
            {address ? "Change" : "Add"}
          </button>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          initial={address}
          onSave={handleSaveAddress}
          onClose={() => setShowAddressModal(false)}
        />
      )}

      {/* Login Modal (shown if not logged in) */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
