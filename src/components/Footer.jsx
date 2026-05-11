"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const footerLinks = {
	SHOP: [
		{ label: "All Products", href: "/products" },
		{ label: "Fresh Milk", href: "/products?category=milk" },
		{ label: "Pure Ghee", href: "/products?category=ghee" },
		{ label: "Curd & Paneer", href: "/products?category=dairy" },
		{ label: "Our Farm", href: "/farm" },
	],
	COMPANY: [
		{ label: "About Us", href: "/about" },
		{ label: "Latest Blogs", href: "/blogs" },
		{ label: "Feedback", href: "/feedback" },
		{ label: "Customer Reviews", href: "/reviews" },
		{ label: "Contact Us", href: "/contact" },
	],
	ACCOUNT: [
		{ label: "My Profile", href: "/profile" },
		{ label: "Order History", href: "/order-his" },
		{ label: "Notifications", href: "/notifications" },
		{ label: "Shopping Cart", href: "/cart" },
	],
};

export default function Footer() {
	return (
		<footer
			className="text-white relative overflow-hidden"
			style={{
				background:
					"linear-gradient(135deg, #0c1a4c 0%, #1a3a8a 50%, #0e2260 100%)",
			}}
		>
			{" "}
			{/* Decorative background blobs */}
			<div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#f5c842]/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />
			<div className="max-w-7xl mx-auto px-4 pt-12 pb-12 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
					{/* Brand column */}
					<div className="lg:col-span-1">
						<div className="space-y-4">
							<Image
								src="/img/logo8.png"
								alt="MoodFresh"
								width={140}
								height={50}
								className=""
							/>
							<p className="text-white/60 text-sm leading-relaxed">
								 भरोसा जो हर बूंद में दिखे - देश से शुद्धता का वादा।
							</p>
							<p className="text-white/60 text-xs leading-relaxed">
								 Experience the Real Taste of Fresh Dairy. Direct From Farm to Your Home.
							</p>
						</div>
					</div>

					{/* Links columns */}
					<div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-10">
						{Object.entries(footerLinks).map(
							([title, links]) => (
								<div key={title}>
									<h4 className="text-[#f5c842] font-black text-xs tracking-[0.2em] uppercase mb-6">
										{title}
									</h4>
									<ul className="space-y-3.5">
										{links.map((link, i) => (
											<li key={i}>
												<Link
													href={
														link.href
													}
													prefetch={
														false
													}
													className="text-white/50 hover:text-white text-[13px] font-medium transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-2 group"
												>
													<span className="w-1.5 h-[1.5px] bg-[#f5c842] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							),
						)}
					</div>
				</div>

				{/* Bottom bar */}
				<div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-white/40 text-xs">
						© 2025 MoodFresh. All rights reserved. Made with
						🧀 in India.
					</p>
					<p className="text-white/40 text-xs">
						 MOODFRESH FOOD AND BEVERAGES <br /> Village Taharpur, Bijnor (U.P.) - 246731
					</p>

					{/* Social icons moved here */}
					<div className="flex items-center gap-3">
						{[
							{
								icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12.07h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12.07h2.773l-.443 2.89h-2.33v6.988C20.343 21.128 24 16.991 24 12.073z",
							},
							{
								icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
							},
							{
								icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z",
							},
						].map((s, i) => (
							<a
								key={i}
								href="#"
								className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#f5c842] flex items-center justify-center transition-all duration-300 hover:scale-110"
							>
								<svg
									className="w-4 h-4 fill-white/70 hover:fill-[#1a3c5e]"
									viewBox="0 0 24 24"
								>
									<path d={s.icon} />
								</svg>
							</a>
						))}
					</div>

					<div className="flex items-center gap-4">
						{[
							"Privacy Policy",
							"Terms of Service",
							"Refund Policy",
						].map((l, i) => (
							<Link
								key={i}
								href="#"
								className="text-white/40 hover:text-[#f5c842] text-xs transition-colors"
							>
								{l}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
