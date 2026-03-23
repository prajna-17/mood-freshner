"use client";
import React from "react";
import "./confirmModal.css";

export default function ConfirmModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3 className="confirm-title">Are you sure?</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
