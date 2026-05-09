"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function DealBanner() {
	const [grabbed, setGrabbed] = useState(false);

	useEffect(() => {
		const coupon = localStorage.getItem("coupon");
		if (coupon) {
			setGrabbed(true);
		}
	}, []);

	const handleGrab = () => {
		localStorage.setItem(
			"coupon",
			JSON.stringify({
				code: "ABD15",
				discount: 10,
			}),
		);
		setGrabbed(true);
		// Notify other components (like OrderSummary)
		window.dispatchEvent(new Event("coupon-applied"));
	};

	return (
		<div className="px-2 mt-5">
			<div className="bg-[#2f6fb3] rounded-2xl p-5 flex items-center justify-between overflow-hidden">
				{/* LEFT CONTENT */}
				<div className="text-white max-w-[80%]">
					<p className="text-orange-400 text-sm font-semibold mb-2">
						TODAY’S DEAL
					</p>

					<h2 className="text-xl font-bold leading-snug mb-2">
						Buy 2 get 10% off
					</h2>

					<p className="text-sm text-white/80">
						On all milk products
					</p>
				</div>

				{/* RIGHT SIDE */}
				<div className="flex items-center gap-3">
					{/* Bottle */}
					<Image
						src="/img/milk.png" // 👈 change if your name is different
						alt="milk"
						width={70}
						height={140}
						className="object-contain"
					/>

					{/* Button */}
					<button
						onClick={handleGrab}
						disabled={grabbed}
						className={`${
							grabbed ? "bg-green-500" : "bg-orange-500"
						} text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors`}
					>
						{grabbed ? "Grabbed ✓" : "Grab It"}
					</button>
				</div>
			</div>
		</div>
	);
}
