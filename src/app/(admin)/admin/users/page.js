"use client";

import { API } from "@/utils/api";
import { useEffect, useState } from "react";

const API_BASE = API;

export default function AdminUsersPage() {

    const [users, setUsers] = useState([]);
const [filteredUsers, setFilteredUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [showCreate, setShowCreate] = useState(false);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState({
		name: "",
		email: "",
		role: "CUSTOMER",
		coins: 0,
		isVerified: true,
	});

	const getToken = () => localStorage.getItem("token");

	const fetchUsers = async () => {
		try {
			setLoading(true);

			const res = await fetch(
				`${API_BASE}/admin/users`,
				{
					headers: {
						Authorization: `Bearer ${getToken()}`,
					},
				},
			);

			const data = await res.json();


				const fetchedUsers =
	data.data || data.data?.users || data.users || [];

setUsers(fetchedUsers);
setFilteredUsers(fetchedUsers);
			
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
	if (!search.trim()) {
		setFilteredUsers(users);
		return;
	}

	const lowerSearch = search.toLowerCase();

	const filtered = users.filter((user) => {
		const name = user.name?.toLowerCase() || "";
		const email = user.email?.toLowerCase() || "";
		const phone = user.address?.phone?.toLowerCase() || "";

		return (
			name.includes(lowerSearch) ||
			email.includes(lowerSearch) ||
			phone.includes(lowerSearch)
		);
	});

	setFilteredUsers(filtered);
}, [search, users]);

	const handleFormChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const resetForm = () => {
		setForm({
			name: "",
			email: "",
			role: "CUSTOMER",
			coins: 0,
			isVerified: true,
		});
	};

	const createUser = async (e) => {
		e.preventDefault();
		if (!form.email.trim()) {
			alert("Email is required");
			return;
		}

		try {
			setSaving(true);
			const res = await fetch(`${API_BASE}/admin/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify(form),
			});
			const data = await res.json();

			if (!res.ok) {
				alert(data?.message || "User create failed");
				return;
			}

			setUsers((prev) => [data.data, ...prev]);
			resetForm();
			setShowCreate(false);
			alert("User created ✔");
		} catch (err) {
			console.error(err);
			alert("Network error");
		} finally {
			setSaving(false);
		}
	};

	const deleteUser = async (user) => {
		if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;

		try {
			const res = await fetch(`${API_BASE}/admin/users/${user._id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			});
			const data = await res.json();

			if (!res.ok) {
				alert(data?.message || "Delete failed");
				return;
			}

			setUsers((prev) => prev.filter((item) => item._id !== user._id));
			alert("User deleted ✔");
		} catch (err) {
			console.error(err);
			alert("Network error");
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "APPROVED":
				return {
					bg: "#dcfce7",
					text: "#15803d",
				};

			case "REJECTED":
				return {
					bg: "#fee2e2",
					text: "#dc2626",
				};

			default:
				return {
					bg: "#fef9c3",
					text: "#a16207",
				};
		}
	};

	return (
		<div
			style={{
				padding: "28px",
				background: "#f8fafc",
				minHeight: "100vh",
			}}
		>
			{/* HEADER */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 24,
					flexWrap: "wrap",
					gap: 12,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 26,
							fontWeight: 800,
							color: "#0f172a",
							marginBottom: 4,
						}}
					>
						Users
					</h1>

					<p
						style={{
							fontSize: 14,
							color: "#64748b",
						}}
					>
						Manage all registered users
					</p>
				</div>

				<div
					style={{
						display: "flex",
						gap: 10,
					}}
				>
					<button
						onClick={() => setShowCreate((prev) => !prev)}
						style={{
							padding: "11px 16px",
							borderRadius: 10,
							border: "none",
							background: "#1a3a8a",
							color: "#fff",
							fontSize: 14,
							fontWeight: 700,
							cursor: "pointer",
						}}
					>
						{showCreate ? "Close" : "+ Add User"}
					</button>

					<input
						type="text"
						placeholder="Search by name or email"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						style={{
							padding: "11px 14px",
							borderRadius: 10,
							border: "1px solid #e2e8f0",
							fontSize: 14,
							minWidth: 240,
							outline: "none",
						}}
					/>

					
				</div>
			</div>

			{showCreate && (
				<form
					onSubmit={createUser}
					style={{
						background: "#fff",
						border: "1px solid #e2e8f0",
						borderRadius: 16,
						padding: 18,
						marginBottom: 24,
						display: "grid",
						gridTemplateColumns:
							"repeat(auto-fit, minmax(180px, 1fr))",
						gap: 12,
					}}
				>
					<input
						type="text"
						placeholder="Name"
						value={form.name}
						onChange={(e) =>
							handleFormChange("name", e.target.value)
						}
						style={{
							padding: "11px 14px",
							borderRadius: 10,
							border: "1px solid #e2e8f0",
							fontSize: 14,
						}}
					/>
					<input
						type="email"
						placeholder="Email *"
						value={form.email}
						onChange={(e) =>
							handleFormChange("email", e.target.value)
						}
						style={{
							padding: "11px 14px",
							borderRadius: 10,
							border: "1px solid #e2e8f0",
							fontSize: 14,
						}}
					/>
					<select
						value={form.role}
						onChange={(e) =>
							handleFormChange("role", e.target.value)
						}
						style={{
							padding: "11px 14px",
							borderRadius: 10,
							border: "1px solid #e2e8f0",
							fontSize: 14,
							background: "#fff",
						}}
					>
						<option value="CUSTOMER">Customer</option>
						<option value="ADMIN">Admin</option>
					</select>
					<input
						type="number"
						min="0"
						placeholder="Coins"
						value={form.coins}
						onChange={(e) =>
							handleFormChange("coins", e.target.value)
						}
						style={{
							padding: "11px 14px",
							borderRadius: 10,
							border: "1px solid #e2e8f0",
							fontSize: 14,
						}}
					/>
					<label
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							fontSize: 14,
							color: "#334155",
							fontWeight: 600,
						}}
					>
						<input
							type="checkbox"
							checked={form.isVerified}
							onChange={(e) =>
								handleFormChange(
									"isVerified",
									e.target.checked,
								)
							}
						/>
						Verified
					</label>
					<button
						type="submit"
						disabled={saving}
						style={{
							padding: "11px 16px",
							borderRadius: 10,
							border: "none",
							background: saving ? "#94a3b8" : "#16a34a",
							color: "#fff",
							fontSize: 14,
							fontWeight: 700,
							cursor: saving ? "not-allowed" : "pointer",
						}}
					>
						{saving ? "Saving..." : "Create User"}
					</button>
				</form>
			)}

			{/* STATS */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
					gap: 16,
					marginBottom: 28,
				}}
			>
				<div
					style={{
						background: "#fff",
						padding: 20,
						borderRadius: 16,
						border: "1px solid #e2e8f0",
					}}
				>
					<p
						style={{
							fontSize: 13,
							color: "#64748b",
							marginBottom: 8,
						}}
					>
						Total Users
					</p>

					<h2
						style={{
							fontSize: 28,
							fontWeight: 800,
							color: "#0f172a",
						}}
					>
						{filteredUsers.length}
					</h2>
				</div>

				<div
					style={{
						background: "#fff",
						padding: 20,
						borderRadius: 16,
						border: "1px solid #e2e8f0",
					}}
				>
					<p
						style={{
							fontSize: 13,
							color: "#64748b",
							marginBottom: 8,
						}}
					>
						Verified Users
					</p>

					<h2
						style={{
							fontSize: 28,
							fontWeight: 800,
							color: "#16a34a",
						}}
					>
						{filteredUsers.filter((u) => u.isVerified).length}
					</h2>
				</div>

				<div
					style={{
						background: "#fff",
						padding: 20,
						borderRadius: 16,
						border: "1px solid #e2e8f0",
					}}
				>
					<p
						style={{
							fontSize: 13,
							color: "#64748b",
							marginBottom: 8,
						}}
					>
						Admins
					</p>

					<h2
						style={{
							fontSize: 28,
							fontWeight: 800,
							color: "#7c3aed",
						}}
					>
						{
							filteredUsers.filter((u) => u.role === "ADMIN")
								.length
						}
					</h2>
				</div>
			</div>

			{/* USERS LIST */}
			<div
				style={{
					background: "#fff",
					borderRadius: 18,
					padding: 20,
					border: "1px solid #e2e8f0",
					overflowX: "auto",
				}}
			>
				<h3
					style={{
						fontSize: 18,
						fontWeight: 700,
						marginBottom: 18,
						color: "#0f172a",
					}}
				>
					All Users
				</h3>

				{loading ? (
					<p
						style={{
							color: "#94a3b8",
							fontSize: 14,
						}}
					>
						Loading users...
					</p>
				) : filteredUsers.length === 0 ? (
					<p
						style={{
							color: "#94a3b8",
							fontSize: 14,
						}}
					>
						No users found.
					</p>
				) : (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 14,
						}}
					>
						{filteredUsers.map((user) => (
							<div
								key={user._id}
								style={{
									border: "1px solid #e2e8f0",
									borderRadius: 16,
									padding: 18,
									background: "#fff",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent:
											"space-between",
										alignItems: "flex-start",
										gap: 16,
										flexWrap: "wrap",
									}}
								>
									{/* LEFT */}
									<div
										style={{
											flex: 1,
										}}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: 10,
												marginBottom: 10,
												flexWrap: "wrap",
											}}
										>
											<h4
												style={{
													fontSize: 17,
													fontWeight: 700,
													color: "#0f172a",
												}}
											>
												{user.name ||
													"No Name"}
											</h4>

											<span
												style={{
													background:
														user.role ===
														"ADMIN"
															? "#ede9fe"
															: "#dbeafe",
													color:
														user.role ===
														"ADMIN"
															? "#7c3aed"
															: "#2563eb",
													padding:
														"4px 10px",
													borderRadius: 30,
													fontSize: 11,
													fontWeight: 700,
												}}
											>
												{user.role}
											</span>

											<span
												style={{
													background:
														user.isVerified
															? "#dcfce7"
															: "#fee2e2",
													color:
														user.isVerified
															? "#15803d"
															: "#dc2626",
													padding:
														"4px 10px",
													borderRadius: 30,
													fontSize: 11,
													fontWeight: 700,
												}}
											>
												{user.isVerified
													? "VERIFIED"
													: "UNVERIFIED"}
											</span>
										</div>

										<p
											style={{
												fontSize: 14,
												color: "#475569",
												marginBottom: 8,
											}}
										>
											{user.email}
										</p>

										<div
											style={{
												display: "flex",
												gap: 24,
												flexWrap: "wrap",
												marginBottom: 14,
											}}
										>
											<div>
												<p
													style={{
														fontSize: 12,
														color: "#94a3b8",
														marginBottom: 4,
													}}
												>
													Coins
												</p>

												<p
													style={{
														fontWeight: 700,
														color: "#f59e0b",
													}}
												>
													🪙{" "}
													{user.coins ||
														0}
												</p>
											</div>

											<div>
												<p
													style={{
														fontSize: 12,
														color: "#94a3b8",
														marginBottom: 4,
													}}
												>
													Joined
												</p>

												<p
													style={{
														fontWeight: 600,
														color: "#334155",
														fontSize: 13,
													}}
												>
													{new Date(
														user.createdAt,
													).toLocaleDateString(
														"en-IN",
													)}
												</p>
											</div>
										</div>

										{/* ADDRESS */}
										{user.address && (
											<div
												style={{
													background:
														"#f8fafc",
													padding: 14,
													borderRadius: 12,
												}}
											>
												<p
													style={{
														fontSize: 12,
														fontWeight: 700,
														color: "#64748b",
														marginBottom: 8,
													}}
												>
													ADDRESS
												</p>

												<p
													style={{
														fontSize: 13,
														color: "#334155",
														lineHeight: 1.6,
													}}
												>
													{
														user
															.address
															.fullName
													}
													<br />
													{
														user
															.address
															.phone
													}
													<br />
													{
														user
															.address
															.addressLine
													}
													,{" "}
													{
														user
															.address
															.city
													}
													,{" "}
													{
														user
															.address
															.state
													}{" "}
													-{" "}
													{
														user
															.address
															.postalCode
													}
												</p>
											</div>
										)}
									</div>

									{/* RIGHT */}
									<div
										style={{
											minWidth: 250,
										}}
									>
										<button
											onClick={() =>
												deleteUser(user)
											}
											style={{
												width: "100%",
												marginBottom: 14,
												padding: "9px 12px",
												borderRadius: 10,
												border:
													"1px solid #fecaca",
												background: "#fef2f2",
												color: "#dc2626",
												fontSize: 13,
												fontWeight: 700,
												cursor: "pointer",
											}}
										>
											Delete User
										</button>

										<p
											style={{
												fontSize: 13,
												fontWeight: 700,
												marginBottom: 12,
												color: "#334155",
											}}
										>
											Coin Requests
										</p>

										{user.coinRequests
											?.length === 0 ? (
											<p
												style={{
													fontSize: 13,
													color: "#94a3b8",
												}}
											>
												No requests
											</p>
										) : (
											user.coinRequests?.map(
												(req, idx) => {
													const colors =
														getStatusColor(
															req.status,
														);

													return (
														<div
															key={
																idx
															}
															style={{
																border:
																	"1px solid #e2e8f0",
																borderRadius: 12,
																padding:
																	"10px 12px",
																marginBottom: 10,
															}}
														>
															<div
																style={{
																	display:
																		"flex",
																	justifyContent:
																		"space-between",
																	alignItems:
																		"center",
																	marginBottom: 6,
																}}
															>
																<p
																	style={{
																		fontWeight: 700,
																		fontSize: 14,
																		color: "#0f172a",
																	}}
																>
																	₹{" "}
																	{
																		req.amount
																	}
																</p>

																<span
																	style={{
																		background:
																			colors.bg,
																		color:
																			colors.text,
																		padding:
																			"4px 10px",
																		borderRadius: 30,
																		fontSize: 11,
																		fontWeight: 700,
																	}}
																>
																	{
																		req.status
																	}
																</span>
															</div>

															<p
																style={{
																	fontSize: 11,
																	color: "#94a3b8",
																}}
															>
																{new Date(
																	req.requestedAt,
																).toLocaleString(
																	"en-IN",
																)}
															</p>
														</div>
													);
												},
											)
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
