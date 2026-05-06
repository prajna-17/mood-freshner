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
	city: "Bijnor",
	state: "Uttar Pradesh",
	postalCode: "",
};

// ── Address Modal ─────────────────────────────────────────────────────────────
function AddressModal({ initial, onSave, onClose }) {
	const [form, setForm] = useState(initial || EMPTY_ADDRESS);
	const [errors, setErrors] = useState({});

	const validate = () => {
		const e = {};
		if (!form.fullName.trim()) e.fullName = "Required";
		if (!/^\d{10}$/.test(form.phone))
			e.phone = "Enter valid 10-digit number";
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
			<label className="text-xs font-semibold text-sky-700">
				{label}
			</label>
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
				{field(
					"Phone Number",
					"phone",
					"10-digit mobile number",
					"tel",
				)}
				{field(
					"Address Line",
					"addressLine",
					"House no, Street, Area",
				)}
				{field("Landmark (optional)", "landmark", "Near landmark")}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-sky-700">
							City
						</label>
						<input
							type="text"
							value={form.city}
							onChange={(e) => {
								setForm((f) => ({
									...f,
									city: e.target.value,
								}));
								setErrors((err) => ({
									...err,
									city: undefined,
								}));
							}}
							placeholder="Bengaluru"
							className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
								errors.city
									? "border-red-400 bg-red-50"
									: "border-sky-200 bg-sky-50 focus:border-sky-400"
							}`}
						/>
						{errors.city && (
							<span className="text-xs text-red-500">
								{errors.city}
							</span>
						)}
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-sky-700">
							State
						</label>
						<input
							type="text"
							value={form.state}
							onChange={(e) => {
								setForm((f) => ({
									...f,
									state: e.target.value,
								}));
								setErrors((err) => ({
									...err,
									state: undefined,
								}));
							}}
							placeholder="Karnataka"
							className={`rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
								errors.state
									? "border-red-400 bg-red-50"
									: "border-sky-200 bg-sky-50 focus:border-sky-400"
							}`}
						/>
						{errors.state && (
							<span className="text-xs text-red-500">
								{errors.state}
							</span>
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
					console.log(data);
					const pincode = data.postcode;

					if (!pincode) {
						setDetectMsg(
							"Could not find pincode for your location",
						);
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
					const key = userId
						? `address_${userId}`
						: "address_guest";
					localStorage.setItem(
						key,
						JSON.stringify(detectedAddress),
					);
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
			<div className="px-4 mt-2">
  <div className="bg-gradient-to-r from-[#2b6cb0] to-[#1e3a8a] rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-sm">

    {/* LEFT — Address */}
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <MapPin className="text-blue-200 w-4 h-4 flex-shrink-0" />

      {address ? (
        <p className="text-white text-sm truncate">
          {address.addressLine}, {address.city}
        </p>
      ) : (
        <p className="text-white text-sm truncate">
          Set delivery location
        </p>
      )}
    </div>

    {/* RIGHT — Actions */}
    <div className="flex items-center gap-1 flex-shrink-0">

      {/* Detect */}
      <button
        onClick={handleAutoDetect}
        disabled={detecting}
        className="p-1.5 rounded-md bg-white/10 border border-white/20 text-white/90"
      >
        {detecting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LocateFixed className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Manual Add / Change */}
      <button
        onClick={handleManualAdd}
        className="p-1.5 rounded-md bg-orange-500 text-white"
      >
        <PenLine className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>

  {/* Status (optional, stays below) */}
  {detectMsg && (
    <p
      className={`text-[10px] mt-1 px-1 ${
        detectMsg.startsWith("✓") ? "text-green-600" : "text-red-500"
      }`}
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
