"use client";

import { API } from "@/utils/api";
import { useEffect, useState } from "react";

const API_BASE = API;

export default function AdminContactsPage() {
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedContact, setSelectedContact] = useState(null);
	const [search, setSearch] = useState("");
	const [toast, setToast] = useState(null);
	const [deleting, setDeleting] = useState("");

	const showToast = (msg, type = "success") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	const fetchContacts = async () => {
		try {
			const token = localStorage.getItem("token");

			const res = await fetch(`${API_BASE}/contacts`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();

			if (res.ok) {
				setContacts(data.data || []);
			} else {
				showToast(data.message || "Failed to load contacts", "error");
			}
		} catch {
			showToast("Network error", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchContacts();
	}, []);

	const handleDelete = async (id) => {
		if (!confirm("Delete this contact message?")) return;

		setDeleting(id);

		try {
			const token = localStorage.getItem("token");

			const res = await fetch(`${API_BASE}/contacts/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();

			if (res.ok) {
				showToast("Contact deleted");
				setContacts((prev) => prev.filter((c) => c._id !== id));

				if (selectedContact?._id === id) {
					setSelectedContact(null);
				}
			} else {
				showToast(data.message || "Delete failed", "error");
			}
		} catch {
			showToast("Network error", "error");
		} finally {
			setDeleting("");
		}
	};

	const filteredContacts = contacts.filter((c) => {
		const text = `
      ${c.firstName || ""}
      ${c.lastName || ""}
      ${c.email || ""}
      ${c.subject || ""}
      ${c.message || ""}
    `.toLowerCase();

		return text.includes(search.toLowerCase());
	});

	const formatDate = (date) =>
		new Date(date).toLocaleString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	return (
		<div
			style={{
				fontFamily: "'Nunito', sans-serif",
				minHeight: "100vh",
				background: "#f8fafc",
			}}
		>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

        .card {
          background: white;
          border-radius: 22px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }

        .contact-row {
          transition: all 0.15s ease;
          cursor: pointer;
          border-radius: 14px;
        }

        .contact-row:hover {
          background: #f8fafc;
        }

        .contact-selected {
          background: #eff6ff !important;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          outline: none;
          font-weight: 700;
          font-size: 14px;
        }

        .search-input:focus {
          border-color: #2563eb;
        }

        .delete-btn {
          background: #fff1f2;
          color: #e11d48;
          border: 1px solid #fecdd3;
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .delete-btn:hover {
          background: #e11d48;
          color: white;
        }

        .toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 22px;
          border-radius: 14px;
          color: white;
          font-weight: 800;
          z-index: 9999;
        }

        .toast-success {
          background: #0f172a;
        }

        .toast-error {
          background: #e11d48;
        }
          
        @media (max-width: 900px) {
  .contacts-layout {
    grid-template-columns: 1fr !important;
  }

  .contact-sidebar {
    position: static !important;
    top: unset !important;
  }
}

@media (max-width: 640px) {
  .mobile-padding {
    padding: 14px !important;
  }

  .mobile-header {
    padding: 22px 16px !important;
  }

  .mobile-title {
    font-size: 22px !important;
  }

  .mobile-card {
    border-radius: 18px !important;
  }

  .mobile-row {
    padding: 12px !important;
  }

  .mobile-avatar {
    width: 42px !important;
    height: 42px !important;
    border-radius: 12px !important;
    font-size: 14px !important;
  }

  .mobile-text {
    font-size: 13px !important;
  }

  .mobile-subtext {
    font-size: 11px !important;
  }

  .mobile-message {
    font-size: 13px !important;
    line-height: 1.6 !important;
  }

  .mobile-btn {
    width: 100%;
    justify-content: center;
  }

  .mobile-stats {
    flex-direction: column !important;
  }
}
      `}</style>

			{/* Header */}
			<div
				style={{
					background: "linear-gradient(135deg,#0f172a,#2563eb)",
					padding: "28px",
				}}
			>
				<div style={{ maxWidth: 1200, margin: "0 auto" }}>
					<h1
						style={{
							color: "white",
							fontSize: 28,
							fontWeight: 900,
							margin: 0,
						}}
					>
						Contact Messages
					</h1>

					<p
						style={{
							color: "rgba(255,255,255,0.7)",
							marginTop: 6,
							fontWeight: 700,
							fontSize: 14,
						}}
					>
						View and manage customer contact form submissions
					</p>

					<div
						style={{
							display: "flex",
							gap: 14,
							marginTop: 20,
						}}
					>
						<div
							style={{
								background: "rgba(255,255,255,0.12)",
								padding: "14px 18px",
								borderRadius: 16,
							}}
						>
							<p
								style={{
									color: "white",
									fontWeight: 900,
									fontSize: 24,
									margin: 0,
								}}
							>
								{contacts.length}
							</p>

							<p
								style={{
									color: "rgba(255,255,255,0.65)",
									fontSize: 12,
									fontWeight: 700,
									margin: 0,
								}}
							>
								Total Messages
							</p>
						</div>
					</div>
				</div>
			</div>

			<div
	className="mobile-padding"
	style={{
		maxWidth: 1200,
		margin: "0 auto",
		padding: 20,
	}}
>
				<div
	style={{
		display: "grid",
		gridTemplateColumns:
			selectedContact && typeof window !== "undefined" && window.innerWidth > 900
				? "1fr 420px"
				: "1fr",
		gap: 18,
	}}
>
					{/* Left */}
					<div className="card">
						<div
							style={{
								padding: 18,
								borderBottom: "1px solid #e2e8f0",
							}}
						>
							<input
								className="search-input"
								placeholder="Search contacts..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						<div
							style={{
								padding: 12,
								maxHeight: "75vh",
								overflowY: "auto",
							}}
						>
							{loading ? (
								<p
									style={{
										padding: 20,
										fontWeight: 800,
										color: "#64748b",
									}}
								>
									Loading contacts...
								</p>
							) : filteredContacts.length === 0 ? (
								<div
									style={{
										padding: 40,
										textAlign: "center",
										color: "#94a3b8",
										fontWeight: 800,
									}}
								>
									No contact messages found
								</div>
							) : (
								filteredContacts.map((contact) => (
									<div
										key={contact._id}
										className={`contact-row ${
											selectedContact?._id === contact._id
												? "contact-selected"
												: ""
										}`}
										style={{
											padding: 14,
											display: "flex",
											gap: 14,
											alignItems: "center",
										}}
										onClick={() =>
											setSelectedContact(contact)
										}
									>
										<div
											style={{
												width: 46,
												height: 46,
												borderRadius: 14,
												background:
													"linear-gradient(135deg,#2563eb,#1d4ed8)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "white",
												fontWeight: 900,
												fontSize: 16,
												flexShrink: 0,
											}}
										>
											{(
												contact.firstName?.[0] ||
												contact.email?.[0] ||
												"?"
											).toUpperCase()}
										</div>

										<div
											style={{
												flex: 1,
												minWidth: 0,
											}}
										>
											<p
												style={{
													margin: 0,
													fontWeight: 900,
													fontSize: 14,
													color: "#0f172a",
												}}
											>
												{contact.firstName ||
												contact.lastName
													? `${contact.firstName || ""} ${contact.lastName || ""}`
													: "Unnamed"}
											</p>

											<p
												style={{
													margin: "2px 0",
													fontSize: 12,
													color: "#64748b",
													fontWeight: 700,
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis",
												}}
											>
												{contact.email}
											</p>

											<p
												style={{
													margin: 0,
													fontSize: 11,
													color: "#94a3b8",
													fontWeight: 700,
												}}
											>
												{formatDate(contact.createdAt)}
											</p>
										</div>
									</div>
								))
							)}
						</div>
					</div>

					{/* Right */}
					{selectedContact && (
						<div
							className="card"
							style={{
								padding: 22,
								height: "fit-content",
								position: "sticky",
								top: 20,
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									marginBottom: 18,
								}}
							>
								<h2
									style={{
										margin: 0,
										fontSize: 18,
										fontWeight: 900,
										color: "#0f172a",
									}}
								>
									Message Details
								</h2>

								<button
									className="delete-btn"
									onClick={() =>
										handleDelete(selectedContact._id)
									}
									disabled={
										deleting === selectedContact._id
									}
								>
									{deleting === selectedContact._id
										? "Deleting..."
										: "Delete"}
								</button>
							</div>

							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 16,
								}}
							>
								<div>
									<p
										style={{
											fontSize: 11,
											fontWeight: 800,
											color: "#94a3b8",
											marginBottom: 4,
										}}
									>
										NAME
									</p>

									<p
										style={{
											fontWeight: 800,
											color: "#0f172a",
											margin: 0,
										}}
									>
										{selectedContact.firstName ||
										selectedContact.lastName
											? `${selectedContact.firstName || ""} ${selectedContact.lastName || ""}`
											: "Not provided"}
									</p>
								</div>

								<div>
									<p
										style={{
											fontSize: 11,
											fontWeight: 800,
											color: "#94a3b8",
											marginBottom: 4,
										}}
									>
										EMAIL
									</p>

									<p
										style={{
											fontWeight: 800,
											color: "#2563eb",
											margin: 0,
											wordBreak: "break-word",
										}}
									>
										{selectedContact.email}
									</p>
								</div>

								<div>
									<p
										style={{
											fontSize: 11,
											fontWeight: 800,
											color: "#94a3b8",
											marginBottom: 4,
										}}
									>
										PHONE
									</p>

									<p
										style={{
											fontWeight: 800,
											color: "#0f172a",
											margin: 0,
										}}
									>
										{selectedContact.phone || "Not provided"}
									</p>
								</div>

								<div>
									<p
										style={{
											fontSize: 11,
											fontWeight: 800,
											color: "#94a3b8",
											marginBottom: 4,
										}}
									>
										SUBJECT
									</p>

									<p
										style={{
											fontWeight: 800,
											color: "#0f172a",
											margin: 0,
										}}
									>
										{selectedContact.subject ||
											"Not provided"}
									</p>
								</div>

								<div>
									<p
										style={{
											fontSize: 11,
											fontWeight: 800,
											color: "#94a3b8",
											marginBottom: 8,
										}}
									>
										MESSAGE
									</p>

									<div
										style={{
											background: "#f8fafc",
											border: "1px solid #e2e8f0",
											padding: 16,
											borderRadius: 14,
											fontSize: 14,
											lineHeight: 1.7,
											color: "#334155",
											fontWeight: 700,
											whiteSpace: "pre-wrap",
										}}
									>
										{selectedContact.message ||
											"No message"}
									</div>
								</div>

								<div>
									<p
										style={{
											fontSize: 11,
											fontWeight: 800,
											color: "#94a3b8",
											marginBottom: 4,
										}}
									>
										RECEIVED
									</p>

									<p
										style={{
											fontWeight: 800,
											color: "#0f172a",
											margin: 0,
										}}
									>
										{formatDate(
											selectedContact.createdAt,
										)}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Toast */}
			{toast && (
				<div className={`toast toast-${toast.type}`}>
					{toast.msg}
				</div>
			)}
		</div>
	);
}