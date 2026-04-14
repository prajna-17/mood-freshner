"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  LocateFixed,
  PenLine,
  CheckCircle2,
  Loader2,
} from "lucide-react";
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
        className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
          errors[key]
            ? "border-red-400 bg-red-50"
            : "border-sky-200 bg-sky-50 focus:border-sky-400"
        }`}
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
              className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
                errors.city
                  ? "border-red-400 bg-red-50"
                  : "border-sky-200 bg-sky-50 focus:border-sky-400"
              }`}
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
              className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
                errors.state
                  ? "border-red-400 bg-red-50"
                  : "border-sky-200 bg-sky-50 focus:border-sky-400"
              }`}
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
  const [detecting, setDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState("");

  const loadAddress = () => {
    const userId = getUserIdFromToken();
    try {
      const addr = userId
        ? JSON.parse(localStorage.getItem(`address_${userId}`))
        : JSON.parse(localStorage.getItem("address_guest"));
      if (addr) setAddress(addr);
    } catch {}
  };

  useEffect(() => {
    loadAddress();
    const onUpdate = () => loadAddress();
    window.addEventListener("addressUpdated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("addressUpdated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  // ── Auto-detect ──
  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setDetectMsg("Geolocation not supported");
      return;
    }

    setDetecting(true);
    setDetectMsg("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await res.json();
          const pincode = data.postcode;

          if (!pincode) {
            setDetectMsg("Could not find pincode for your location");
            setDetecting(false);
            return;
          }

          const detectedAddress = {
            fullName: "",
            phone: "",
            addressLine: "Your Location",
            landmark: "",
            city: data.city || data.locality || "",
            state: data.principalSubdivision || "",
            postalCode: pincode,
          };

          const userId = getUserIdFromToken();
          const key = userId ? `address_${userId}` : "address_guest";
          localStorage.setItem(key, JSON.stringify(detectedAddress));
          localStorage.setItem("pincode", pincode);

          setAddress(detectedAddress);
          setDetectMsg("✓ Location detected!");

          // 🔥 notify all product components to re-fetch
          window.dispatchEvent(new Event("addressUpdated"));
          window.dispatchEvent(new Event("pincodeUpdated"));
        } catch {
          setDetectMsg("Failed to detect location");
        }
        setDetecting(false);
      },
      () => {
        setDetectMsg("Location access denied");
        setDetecting(false);
      },
      { timeout: 8000, enableHighAccuracy: true },
    );
  };

  // ── Manual add ──
  const handleManualAdd = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = (newAddr) => {
    const userId = getUserIdFromToken();
    const key = userId ? `address_${userId}` : "address_guest";
    localStorage.setItem(key, JSON.stringify(newAddr));
    localStorage.setItem("pincode", newAddr.postalCode);

    setAddress(newAddr);
    setShowAddressModal(false);

    // 🔥 notify all product components to re-fetch
    window.dispatchEvent(new Event("addressUpdated"));
    window.dispatchEvent(new Event("pincodeUpdated"));
  };

  return (
    <>
      <div className="px-4 mt-10 space-y-2">
        {/* Main Card */}
        <div className="bg-gradient-to-r from-[#2b6cb0] to-[#1e3a8a] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            {/* LEFT — address info */}
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
                    Set your delivery location
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT — change button if address exists */}
            {address && (
              <button
                onClick={handleManualAdd}
                className="text-orange-400 font-medium underline text-sm whitespace-nowrap ml-3"
              >
                Change
              </button>
            )}
          </div>

          {/* Action Buttons — shown when no address OR always */}
          {!address && (
            <div className="flex gap-2 mt-4">
              {/* Auto Detect */}
              <button
                onClick={handleAutoDetect}
                disabled={detecting}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-medium py-2.5 rounded-xl transition active:scale-95"
              >
                {detecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LocateFixed className="w-4 h-4" />
                )}
                {detecting ? "Detecting..." : "Auto Detect"}
              </button>

              {/* Add Manually */}
              <button
                onClick={handleManualAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2.5 rounded-xl transition active:scale-95"
              >
                <PenLine className="w-4 h-4" />
                Add Manually
              </button>
            </div>
          )}

          {/* If address exists, show small re-detect option */}
          {address && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAutoDetect}
                disabled={detecting}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 text-xs py-1.5 px-3 rounded-lg transition"
              >
                {detecting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <LocateFixed className="w-3 h-3" />
                )}
                {detecting ? "Detecting..." : "Re-detect location"}
              </button>
            </div>
          )}
        </div>

        {/* Status message */}
        {detectMsg && (
          <p
            className={`text-xs px-1 ${detectMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}
          >
            {detectMsg}
          </p>
        )}
      </div>

      {showAddressModal && (
        <AddressModal
          initial={address}
          onSave={handleSaveAddress}
          onClose={() => setShowAddressModal(false)}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
