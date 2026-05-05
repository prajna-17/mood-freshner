"use client";

import React, { useRef } from "react";
import {
	Star,
	CheckCircle2,
	Quote,
	ArrowRight,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";

const REVIEWS = [
	{
		id: 1,
		name: "Anjali Sharma",
		rating: 5,
		comment: "The buffalo milk is exceptionally creamy. Reminds me of the farm in my childhood.",
		avatar: "AS",
	},
	{
		id: 2,
		name: "Vikram Malhotra",
		rating: 5,
		comment: "Excellent service! Delivery is always on time, usually before 7 AM. Kids love it.",
		avatar: "VM",
	},
	{
		id: 3,
		name: "Priya Gupta",
		rating: 5,
		comment: "The ghee is aromatic and pure. MoodFresh is now our go-to for all things dairy.",
		avatar: "PG",
	},
	{
		id: 4,
		name: "Rahul Verma",
		rating: 5,
		comment: "The paneer is so soft! The UI of the app is also seamless. Best in the market.",
		avatar: "RV",
	},
];

export default function HomeReviewsSlider() {
	// Use a standard null-initialized ref
	const scrollRef = useRef(null);

	const scroll = (direction) => {
		if (scrollRef.current) {
			const container = scrollRef.current;
			const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of the width

			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="bg-slate-50 overflow-hidden pt-20">
			<div className="px-6 mb-8 flex items-end justify-between max-w-6xl mx-auto">
				<div>
					<h2 className="text-3xl font-extrabold text-[#0c1a4c] tracking-tight">
						Customer{" "}
						<span className="text-[#fb923c]">Reviews</span>
					</h2>
					<p className="text-slate-400 text-sm font-medium mt-1">
						Trusted by 10,000+ happy families
					</p>
				</div>

				{/* Navigation Buttons */}
				<div className="flex gap-2">
					<button
						onClick={() => scroll("left")}
						className="p-3 rounded-full bg-white border border-slate-200 text-[#0c1a4c] active:scale-90 hover:bg-[#0c1a4c] hover:text-white transition-all shadow-sm"
					>
						<ChevronLeft size={20} />
					</button>
					<button
						onClick={() => scroll("right")}
						className="p-3 rounded-full bg-white border border-slate-200 text-[#0c1a4c] active:scale-90 hover:bg-[#0c1a4c] hover:text-white transition-all shadow-sm"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>

			{/* Horizontal Scroll Container */}
			<div
				ref={scrollRef}
				className="flex gap-4 overflow-x-auto px-6 pb-8 no-scrollbar snap-x snap-mandatory"
				style={{ scrollBehavior: "smooth" }}
			>
				{REVIEWS.map((review) => (
					<div
						key={review.id}
						className="min-w-[85vw] md:min-w-[400px] snap-center bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative flex flex-col justify-between"
					>
						<div className="absolute top-6 right-8 text-slate-100">
							<Quote size={50} fill="currentColor" />
						</div>

						<div className="relative z-10">
							<div className="flex items-center gap-0.5 mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										size={14}
										className="fill-[#fb923c] text-[#fb923c]"
									/>
								))}
							</div>

							<p className="text-[#0c1a4c] text-lg leading-relaxed font-medium mb-8 italic">
								"{review.comment}"
							</p>

							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-gradient-to-br from-[#0c1a4c] to-[#1a3a8a] rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
									{review.avatar}
								</div>
								<div>
									<div className="flex items-center gap-1.5">
										<span className="font-bold text-[#0c1a4c] text-sm">
											{review.name}
										</span>
										<CheckCircle2
											size={14}
											className="text-green-500"
										/>
									</div>
									<span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
										Verified Buyer
									</span>
								</div>
							</div>
						</div>
					</div>
				))}

				{/* End of Slider Card */}
				<div className="min-w-[50vw] md:min-w-[300px] snap-center flex flex-col items-center justify-center pr-6">
					<Link href="/reviews">
						<div className="group flex flex-col items-center">
							<div className="w-16 h-16 bg-[#0c1a4c] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform">
								<ArrowRight size={24} />
							</div>
							<span className="text-[#0c1a4c] font-bold text-xs mt-3 uppercase tracking-widest">
								View All
							</span>
						</div>
					</Link>
				</div>
			</div>

			<style jsx>{`
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</section>
	);
}
