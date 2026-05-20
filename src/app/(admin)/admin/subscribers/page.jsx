"use client";

import { API } from "@/utils/api";
import { useEffect, useState } from "react";
import { Mail, Search, Trash2, Copy, Check, Users } from "lucide-react";

export default function AdminSubscribersPage() {
	const [subscribers, setSubscribers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [toast, setToast] = useState(null);
	const [deleting, setDeleting] = useState("");
	const [copied, setCopied] = useState(false);

	const showToast = (msg, type = "success") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	const fetchSubscribers = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API}/subscribers`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (res.ok) {
				setSubscribers(data.data || []);
			} else {
				showToast(data.message || "Failed to load subscribers", "error");
			}
		} catch {
			showToast("Network error", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSubscribers();
	}, []);

	const handleDelete = async (id) => {
		if (!confirm("Remove this subscriber?")) return;
		setDeleting(id);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${API}/subscribers/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			if (res.ok) {
				showToast("Subscriber removed");
				setSubscribers((prev) => prev.filter((s) => s._id !== id));
			} else {
				showToast(data.message || "Remove failed", "error");
			}
		} catch {
			showToast("Network error", "error");
		} finally {
			setDeleting("");
		}
	};

	const copyAllEmails = () => {
		const emails = filteredSubscribers.map((s) => s.email).join(", ");
		if (!emails) return;
		navigator.clipboard.writeText(emails);
		setCopied(true);
		showToast("Copied all emails to clipboard!");
		setTimeout(() => setCopied(false), 2000);
	};

	const filteredSubscribers = subscribers.filter((s) =>
		s.email.toLowerCase().includes(search.toLowerCase())
	);

	const formatDate = (date) =>
		new Date(date).toLocaleString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	return (
		<div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .subs-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .subs-header-banner {
          background: linear-gradient(135deg, #0c1a4c, #1a3a8a);
          padding: 24px 20px 20px;
        }

        .subs-header-title {
          color: white;
          font-size: 22px;
          font-weight: 900;
          margin: 0;
          line-height: 1.2;
        }

        .subs-header-sub {
          color: rgba(255,255,255,0.65);
          margin-top: 6px;
          font-weight: 700;
          font-size: 12px;
          line-height: 1.5;
        }

        .subs-stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          padding: 10px 16px;
          border-radius: 14px;
          margin-top: 16px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .subs-stat-count {
          color: white;
          font-weight: 900;
          font-size: 22px;
          margin: 0;
          line-height: 1;
        }

        .subs-stat-label {
          color: rgba(255,255,255,0.65);
          font-size: 11px;
          font-weight: 700;
          margin: 0;
        }

        .subs-toolbar {
          padding: 14px 16px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .subs-search-wrap {
          position: relative;
          width: 100%;
        }

        .subs-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .subs-search-input {
          width: 100%;
          padding: 11px 14px 11px 38px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          outline: none;
          font-weight: 700;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          transition: border-color 0.2s;
        }

        .subs-search-input:focus {
          border-color: #2563eb;
          background: white;
        }

        .subs-copy-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 11px 16px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #1e293b;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Nunito', sans-serif;
        }

        .subs-copy-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .subs-copy-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .subs-list-wrap {
          padding: 10px;
          max-height: 65vh;
          overflow-y: auto;
        }

        .subs-list-wrap::-webkit-scrollbar { width: 4px; }
        .subs-list-wrap::-webkit-scrollbar-track { background: transparent; }
        .subs-list-wrap::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }

        .sub-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid #f1f5f9;
          transition: background 0.15s;
          margin-bottom: 6px;
        }

        .sub-row:last-child { margin-bottom: 0; }

        .sub-row:hover { background: #f0f9ff; }

        .sub-row-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .sub-icon-wrap {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 11px;
          background: #f0fdf4;
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sub-email {
          margin: 0;
          font-weight: 800;
          font-size: 13px;
          color: #0f172a;
          word-break: break-all;
          line-height: 1.3;
        }

        .sub-date {
          margin: 3px 0 0 0;
          font-size: 10px;
          color: #94a3b8;
          font-weight: 700;
          white-space: nowrap;
        }

        .del-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-width: 36px;
          height: 36px;
          padding: 0 10px;
          border-radius: 10px;
          background: #fff1f2;
          color: #e11d48;
          border: 1px solid #fecdd3;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Nunito', sans-serif;
          white-space: nowrap;
        }

        .del-btn:hover:not(:disabled) {
          background: #e11d48;
          color: white;
          border-color: #e11d48;
        }

        .del-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .del-btn-text { display: none; }

        .subs-empty {
          padding: 40px 20px;
          text-align: center;
          color: #94a3b8;
          font-weight: 800;
          font-size: 14px;
        }

        .subs-loading {
          padding: 30px 20px;
          text-align: center;
          color: #64748b;
          font-weight: 800;
        }

        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 11px 20px;
          border-radius: 12px;
          color: white;
          font-weight: 800;
          z-index: 9999;
          font-size: 13px;
          white-space: nowrap;
          max-width: calc(100vw - 32px);
          text-align: center;
        }
        .toast-success { background: #0f172a; }
        .toast-error   { background: #e11d48; }

        /* ── Tablet+ ── */
        @media (min-width: 540px) {
          .subs-header-banner { padding: 28px 28px 22px; }
          .subs-header-title  { font-size: 26px; }
          .subs-header-sub    { font-size: 13px; }

          .subs-toolbar {
            flex-direction: row;
            align-items: center;
            padding: 16px 20px;
            gap: 14px;
          }

          .subs-search-wrap { flex: 1; }
          .subs-copy-btn    { width: auto; white-space: nowrap; }

          .del-btn-text { display: inline; }

          .subs-list-wrap { padding: 12px; }
          .sub-email      { font-size: 14px; }
          .sub-date       { font-size: 11px; }
        }

        @media (min-width: 768px) {
          .subs-header-title { font-size: 28px; }
        }
      `}</style>

			{/* Header Banner */}
			<div className="subs-header-banner">
				<div style={{ maxWidth: 900, margin: "0 auto" }}>
					<h1 className="subs-header-title">Newsletter Subscribers</h1>
					<p className="subs-header-sub">
						View and manage email subscriptions from the homepage newsletter form
					</p>

					<div className="subs-stat-pill">
						<Users size={18} color="rgba(255,255,255,0.8)" />
						<div>
							<p className="subs-stat-count">{subscribers.length}</p>
							<p className="subs-stat-label">Total Subscribers</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 12px 40px" }}>
				<div className="subs-card">
					{/* Toolbar */}
					<div className="subs-toolbar">
						<div className="subs-search-wrap">
							<Search size={16} className="subs-search-icon" />
							<input
								className="subs-search-input"
								placeholder="Search by email…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						<button
							className="subs-copy-btn"
							onClick={copyAllEmails}
							disabled={filteredSubscribers.length === 0}
						>
							{copied ? (
								<Check size={15} style={{ color: "#16a34a" }} />
							) : (
								<Copy size={15} />
							)}
							<span>{copied ? "Copied!" : "Copy All Emails"}</span>
						</button>
					</div>

					{/* List */}
					<div className="subs-list-wrap">
						{loading ? (
							<p className="subs-loading">Loading subscribers…</p>
						) : filteredSubscribers.length === 0 ? (
							<div className="subs-empty">
								<Mail size={32} style={{ color: "#cbd5e1", marginBottom: 10 }} />
								<p style={{ margin: 0 }}>No subscribers found</p>
							</div>
						) : (
							filteredSubscribers.map((sub, index) => (
								<div
									key={sub._id}
									className="sub-row"
									style={{ background: index % 2 === 0 ? "#ffffff" : "#f8fafc" }}
								>
									<div className="sub-row-left">
										<div className="sub-icon-wrap">
											<Mail size={17} />
										</div>
										<div style={{ minWidth: 0 }}>
											<p className="sub-email">{sub.email}</p>
											<p className="sub-date">
												Subscribed on {formatDate(sub.createdAt)}
											</p>
										</div>
									</div>

									<button
										className="del-btn"
										onClick={() => handleDelete(sub._id)}
										disabled={deleting === sub._id}
										title="Remove subscriber"
									>
										<Trash2 size={14} />
										<span className="del-btn-text">
											{deleting === sub._id ? "Removing…" : "Remove"}
										</span>
									</button>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Toast */}
			{toast && (
				<div className={`toast toast-${toast.type}`}>{toast.msg}</div>
			)}
		</div>
	);
}
