"use client";

import { useEffect, useState } from "react";
import { Coins, BellRing, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LowCoinsReminder() {
	const [showPopup, setShowPopup] = useState(false);
	const [coins, setCoins] = useState(0);
	const [remindLater, setRemindLater] = useState(false);

	useEffect(() => {
		// Check if user already clicked remind later
		const reminder = localStorage.getItem("coinsReminder");

		if (reminder === "dismissed") {
			setRemindLater(true);
			return;
		}

		const storedCoins = Number(localStorage.getItem("userCoins")) || 0;

		setCoins(storedCoins);

		if (storedCoins <= 300) {
			setShowPopup(true);
		}
	}, []);

	const handleClose = () => {
		setShowPopup(false);
	};

	const handleRemindLater = () => {
		localStorage.setItem("coinsReminder", "dismissed");

		setRemindLater(true);
		setShowPopup(false);

		// Optional: Show again after 12 hours
		setTimeout(() => {
			localStorage.removeItem("coinsReminder");
		}, 1000 * 60 * 60 * 12);
	};

	if (!showPopup || remindLater) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
			<div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
				{/* Glow Background */}
				<div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#fb923c]/20 blur-3xl" />

				{/* Close Button */}
				<button
					onClick={handleClose}
					className="absolute right-5 top-5 z-20 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 active:scale-90"
				>
					<X size={18} />
				</button>

				<div className="relative z-10 p-8">
					{/* Icon */}
					<div className="mb-6 flex justify-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#0c1a4c] to-[#1a3a8a] text-white shadow-xl">
							<Coins size={36} />
						</div>
					</div>

					{/* Heading */}
					<div className="text-center">
						<h2 className="text-3xl font-extrabold tracking-tight text-[#0c1a4c]">
							Low{" "}
							<span className="text-[#fb923c]">
								Coins
							</span>
						</h2>

						<p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
							You only have{" "}
							<span className="font-bold text-[#0c1a4c]">
								{coins} coins
							</span>{" "}
							left in your account.
						</p>

						<p className="mt-1 text-sm text-slate-400">
							Recharge now to continue enjoying uninterrupted
							services.
						</p>
					</div>

					{/* Buttons */}
					<div className="mt-8 flex flex-col gap-3">
						<Link href="/profile">
							<button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0c1a4c] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95">
								Buy More Coins
								<ArrowRight
									size={18}
									className="transition-transform group-hover:translate-x-1"
								/>
							</button>
						</Link>

						<button
							onClick={handleRemindLater}
							className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-95"
						>
							<BellRing size={16} />
							Remind Me Later
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}