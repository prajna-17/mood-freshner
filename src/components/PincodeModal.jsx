"use client";

import { useState } from "react";

export default function PincodeModal({ isOpen, onSave }) {
  const [pincode, setPincode] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Enter your pincode
        </h2>

        <input
          type="text"
          placeholder="e.g. 560001"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <button
          onClick={() => {
            if (!pincode) return;
            onSave(pincode);
          }}
          className="w-full bg-orange-500 text-white py-2 rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
