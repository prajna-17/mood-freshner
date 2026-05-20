"use client";

import { useState } from "react";
import {
	Mail,
	ArrowRight,
	CheckCircle2,
} from "lucide-react";
import { API } from "@/utils/api";

export default function SubscribeSectionCompact() {
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email) return;

		setLoading(true);
		try {
			const res = await fetch(`${API}/subscribers`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});
			const data = await res.json();
			if (data.success) {
				setSubscribed(true);
				setMessage(data.message || "Successfully subscribed!");
				setEmail("");
				setTimeout(() => {
					setSubscribed(false);
					setMessage("");
				}, 4000);
			} else {
				alert(data.message || "Something went wrong. Please try again.");
			}
		} catch (error) {
			alert("Failed to connect to server. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="px-4 bg-slate-50">
			<div className="max-w-md mx-auto relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0c1a4c] via-[#132a75] to-[#0c1a4c] p-6 shadow-2xl">
				{/* Glow */}
				<div className="absolute -top-12 -right-12 w-40 h-40 bg-[#fb923c]/20 rounded-full blur-3xl" />

				<div className="relative z-10">
					{/* Header */}
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 rounded-[1.4rem] bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-xl">
							<Mail size={24} />
						</div>

						<div>
							<p className="text-[#fb923c] text-[10px] font-bold uppercase tracking-[0.25em]">
								Newsletter
							</p>

							<h2 className="text-2xl font-extrabold text-white leading-tight tracking-tight">
								Subscribe to our emails
							</h2>
						</div>
					</div>

					<p className="mt-5 text-sm leading-relaxed text-white/70">
						Get fresh offers, dairy updates & product
						launches directly in your inbox.
					</p>

					{/* Form */}
					<form
						onSubmit={handleSubmit}
						className="mt-6 space-y-3"
					>
						<input
							type="email"
							required
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
							placeholder="Enter your email"
							className="w-full h-13 rounded-2xl bg-white text-[#0c1a4c] px-5 outline-none border-none font-medium text-sm p-2"
						/>

						<button
							type="submit"
							disabled={loading}
							className="group w-full h-13 rounded-2xl bg-[#fb923c] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg p-2 disabled:opacity-50"
						>
							{loading ? "Subscribing..." : "Subscribe Now"}

							{!loading && (
								<ArrowRight
									size={16}
									className="group-hover:translate-x-1 transition-transform"
								/>
							)}
						</button>
					</form>

					{/* Success */}
					{subscribed && (
						<div className="mt-4 flex items-center gap-2 rounded-2xl bg-green-500/10 border border-green-400/20 px-4 py-3 text-green-300 text-sm font-medium">
							<CheckCircle2 size={16} />

							{message}
						</div>
					)}

					<p className="mt-4 text-[11px] leading-relaxed text-white/40">
						No spam. Unsubscribe anytime.
					</p>
				</div>
			</div>
		</section>
	);
}