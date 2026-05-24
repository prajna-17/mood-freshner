"use client";

import Image from "next/image";
import Link from "next/link";
import {
	ShoppingCart,
	Bell,
	User,
	Wifi,
	Download,
	Menu,
	X,
	Info,
	MapPin,
	Package,
	BookOpen,
	MessageSquare,
	Star,
	Briefcase,
	Phone,
	Mail,
	ChevronRight,
	Instagram,
	Facebook,
	Twitter,
	LogOut,
	Zap,
	MessageCircle,
} from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";

export default function Header() {
	const router = useRouter();
	const [scrolled, setScrolled] = useState(false);
	const [cartBump, setCartBump] = useState(false);
	const [bellShake, setBellShake] = useState(false);
	const [time, setTime] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [openLogin, setOpenLogin] = useState(false);
	const { install, isInstallable, isInstalled } = usePWAInstall();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("token");
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsLoggedIn(!!token);
		}
	}, [isMenuOpen]);

	const handleLogout = () => {
		if (typeof window !== "undefined") {
			try {
				const token = localStorage.getItem("token");
				if (token) {
					const payload = JSON.parse(atob(token.split(".")[1]));
					const userId = payload.userId;
					if (userId) {
						localStorage.removeItem(`cart_${userId}`);
						localStorage.removeItem(`address_${userId}`);
					}
				}
			} catch (e) {}
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			localStorage.removeItem("cart_guest");
			localStorage.removeItem("pincode");
			localStorage.removeItem("userCoins");
			window.dispatchEvent(new Event("storage"));
			setIsLoggedIn(false);
			setIsMenuOpen(false);
			window.location.href = "/";
		}
	};

	const handleSubscriptionClick = (e) => {
		e.preventDefault();
		if (!isLoggedIn) {
			setIsMenuOpen(false);
			setOpenLogin(true);
		} else {
			setIsMenuOpen(false);
			router.push("/profile");
		}
	};

	// Shrink on scroll
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Live clock
	useEffect(() => {
		const tick = () => {
			const now = new Date();
			setTime(
				now.toLocaleTimeString("en-IN", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: true,
				}),
			);
		};
		tick();
		const t = setInterval(tick, 1000);
		return () => clearInterval(t);
	}, []);

	// Auto-trigger bell shake every 8s
	useEffect(() => {
		const t = setInterval(() => {
			setBellShake(true);
			setTimeout(() => setBellShake(false), 700);
		}, 8000);
		return () => clearInterval(t);
	}, []);

	function handleCartClick() {
		setCartBump(true);
		setTimeout(() => setCartBump(false), 400);
	}

	const menuItems = [
		{ name: "About Us", href: "/about", icon: Info },
		{ name: "Our Farm", href: "/farm", icon: MapPin },
		{ name: "Products", href: "/products", icon: Package },
		{ name: "Blogs", href: "/blogs", icon: BookOpen },
		{ name: "Contact Us", href: "/contact", icon: Phone },
		{ name: "Feedback", href: "/feedback", icon: MessageSquare },
		{ name: "Customer Reviews", href: "/reviews", icon: Star },
		{ name: "Business Opportunity", href: "/business", icon: Briefcase },
	];

	const partnershipWhatsappUrl =
		"https://wa.me/918800091914?text=Hi%20MoodFresh%2C%20I%20want%20to%20apply%20for%20a%20partnership.";

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .hdr-root { font-family: 'DM Sans', sans-serif; }

        @keyframes hdrSlideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes hdrLogoPop   { 0%{opacity:0;transform:scale(0.8)} 65%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes hdrCartBump  { 0%{transform:scale(1)} 35%{transform:scale(1.3) rotate(-12deg)} 65%{transform:scale(0.95) rotate(4deg)} 100%{transform:scale(1) rotate(0)} }
        @keyframes hdrBellShake { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-18deg)} 40%{transform:rotate(18deg)} 60%{transform:rotate(-10deg)} 80%{transform:rotate(10deg)} }
        @keyframes hdrBadgePop  { 0%{transform:scale(0)} 65%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes hdrDotPing   { 0%{transform:scale(1);opacity:0.7} 70%{transform:scale(2);opacity:0} 100%{} }
        @keyframes hdrShimmer   { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes hdrIconIn    { 0%{opacity:0;transform:scale(0.6)} 65%{transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }

        .hdr-slide     { animation: hdrSlideDown 0.55s cubic-bezier(.22,1,.36,1) both; }
        .hdr-logo      { animation: hdrLogoPop   0.6s  cubic-bezier(.22,1,.36,1) both 0.15s; }
        .hdr-icon-0    { animation: hdrIconIn    0.45s cubic-bezier(.22,1,.36,1) both 0.28s; }
        .hdr-icon-1    { animation: hdrIconIn    0.45s cubic-bezier(.22,1,.36,1) both 0.36s; }
        .hdr-icon-2    { animation: hdrIconIn    0.45s cubic-bezier(.22,1,.36,1) both 0.44s; }
        .hdr-badge     { animation: hdrBadgePop  0.4s  cubic-bezier(.22,1,.36,1) both 0.7s; }
        .hdr-cart-bump { animation: hdrCartBump  0.38s cubic-bezier(.22,1,.36,1); }
        .hdr-bell-shake{ animation: hdrBellShake 0.6s  cubic-bezier(.22,1,.36,1); }
        .hdr-dot-ping  { animation: hdrDotPing   1.8s  ease-in-out infinite; }

        .hdr-icon-btn { transition: transform 0.17s cubic-bezier(.22,1,.36,1); }
        .hdr-icon-btn:active { transform: scale(0.85) !important; }

        .hdr-status {
          background: linear-gradient(90deg,#f5c842,#fb923c,#f5c842);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: hdrShimmer 2.8s linear infinite;
        }

        .menu-item-enter { animation: menuSlideIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        @keyframes menuSlideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

			<header
				className="hdr-root hdr-slide sticky top-0 z-50 w-full"
				style={{
					background: scrolled
						? "rgba(12,26,76,0.97)"
						: "linear-gradient(135deg, #0c1a4c 0%, #1a3a8a 50%, #0e2260 100%)",
					backdropFilter: "blur(16px)",
					boxShadow: scrolled
						? "0 4px 24px rgba(0,0,0,0.3)"
						: "0 2px 16px rgba(12,26,76,0.4)",
					transition: "background 0.3s, box-shadow 0.3s",
					paddingTop: "env(safe-area-inset-top, 0px)",
				}}
			>
				{/* Subtle top shimmer line */}
				<div
					className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
					style={{
						background:
							"linear-gradient(90deg,transparent,rgba(245,200,66,0.6),transparent)",
					}}
				/>

				{/* Glow blob */}
				<div
					className="absolute top-0 left-1/2 w-40 h-16 pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)",
						transform: "translateX(-50%) translateY(-30%)",
					}}
				/>

				<div
					className="relative flex items-center justify-center px-4"
					style={{
						height: scrolled ? 44 : 50,
						transition:
							"height 0.3s cubic-bezier(.22,1,.36,1)",
					}}
				>
					{/* ── Left: Menu Icon ── */}
					<div className="absolute left-4 flex items-center">
						<button
							onClick={() => setIsMenuOpen(true)}
							className="hdr-icon-btn text-white p-1 -ml-1 hover:text-[#f5c842]"
							title="Open Menu"
						>
							<Menu size={26} />
						</button>
					</div>

					{/* ── Center: Logo ── */}
					<div className="hdr-logo">
						<Image
							src="/img/logo7.png"
							alt="MoodFresh"
							width={scrolled ? 90 : 110}
							height={scrolled ? 26 : 30}
							className="object-contain"
							style={{
								transition: "width 0.3s, height 0.3s",
							}}
							priority
						/>
					</div>
					{/* ── Right: Icons ── */}
					<div className="absolute right-4 flex items-center gap-3">
						{!isInstalled && (
							<button
								onClick={install}
								className="hdr-icon-btn text-white flex items-center gap-2 hover:text-[#f5c842]"
								title="Install App"
							>
								<div className="flex flex-col text-right leading-tight mr-1">
									<span className="text-[10px] font-bold tracking-tight">
										GET OUR
									</span>
									<span className="text-[11px] font-extrabold text-[#f5c842]">
										APP
									</span>
								</div>
								<Download
									size={22}
									className="w-6 h-6"
								/>
							</button>
						)}
					</div>
				</div>
				{/* Bottom border glow */}
				<div
					className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
					style={{
						background:
							"linear-gradient(90deg,transparent,rgba(245,200,66,0.35),rgba(59,130,246,0.25),transparent)",
					}}
				/>
			</header>

			{/* ── Mobile Menu Drawer ── */}
			<div
				className={`fixed inset-0 z-[60] bg-[#0c1a4c]/80 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
				onClick={() => setIsMenuOpen(false)}
			/>
			<div
				className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-[70] shadow-[10px_0_40px_rgba(0,0,0,0.4)] transform transition-transform duration-500 cubic-bezier(0.22, 1, 0.36, 1) ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div className="h-full flex flex-col">
					{/* Sidebar Header */}
					<div className="py-4 px-5 bg-gradient-to-br from-[#0c1a4c] to-[#1a3a8a] text-white relative overflow-hidden">
						<div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-xl" />
						<div className="relative z-10 flex items-center justify-between mb-2">
							<Image
								src="/img/logo7.png"
								alt="MoodFresh"
								width={95}
								height={26}
								className="object-contain"
							/>
							<button
								onClick={() => setIsMenuOpen(false)}
								className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300"
							>
								<X size={16} />
							</button>
						</div>
						<p className="text-white/60 text-[9px] font-bold tracking-widest uppercase">
							Premium Dairy Experience
						</p>
					</div>

					{/* Navigation Links */}
					<div className="flex-1 py-6 px-4 overflow-y-auto no-scrollbar bg-slate-50">
						<nav className="space-y-1">
							{menuItems.map((item, index) => (
								<Link
									key={index}
									href={item.href}
									onClick={() =>
										setIsMenuOpen(false)
									}
									className={`flex items-center gap-4 px-4 py-3.5 text-slate-700 hover:bg-white hover:text-[#1a3a8a] hover:shadow-md hover:shadow-slate-200/50 rounded-xl transition-all duration-300 group ${isMenuOpen ? "menu-item-enter" : ""}`}
									style={{
										animationDelay: `${index * 0.05 + 0.1}s`,
									}}
								>
									<div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-[#1a3a8a] group-hover:bg-slate-50 transition-colors">
										<item.icon
											size={20}
											strokeWidth={2}
										/>
									</div>
									<span className="font-semibold text-[15px]">
										{item.name}
									</span>
									<ChevronRight
										size={16}
										className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
									/>
								</Link>
							))}
						</nav>
					</div>

					{/* Sidebar Footer */}
					<div className="p-4 bg-white border-t border-slate-100">
						<div className="flex items-center justify-between gap-3 mb-3">
							<div className="flex -space-x-2">
								{[Instagram, Facebook, Twitter].map(
									(SocialIcon, i) => (
										<div
											key={i}
											className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 hover:bg-[#1a3a8a] hover:text-white cursor-pointer transition-all"
										>
											<SocialIcon size={12} />
										</div>
									),
								)}
							</div>
							<p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
								Follow Us
							</p>
						</div>

						<div className="space-y-1.5">
							<div className="flex items-center gap-3 text-slate-500">
								<Mail size={13} />
								<span className="text-[11px] font-medium truncate">
									moodfreshdairy@gmail.com
								</span>
							</div>
							<div className="flex items-center gap-3 text-slate-500">
								<Phone size={13} />
								<span className="text-[11px] font-medium">
									+91 88000 91914 · +91 78959 59613
								</span>
							</div>
						</div>

						<div className="mt-3 space-y-2">
							<a
								href={partnershipWhatsappUrl}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => setIsMenuOpen(false)}
								className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-xs text-white transition-all duration-300 active:scale-[0.98] shadow-md shadow-green-500/10 hover:shadow-green-500/20"
								style={{
									background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
								}}
							>
								<MessageCircle size={14} strokeWidth={2.5} />
								<span>Apply for Partnership</span>
							</a>

							<button
								onClick={handleSubscriptionClick}
								className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-xs text-white transition-all duration-300 active:scale-[0.98] shadow-md shadow-amber-500/10 hover:shadow-amber-500/20"
								style={{
									background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
								}}
							>
								<Zap size={14} strokeWidth={2.5} />
								<span>My Subscription</span>
							</button>

							{isLoggedIn ? (
								<button
									onClick={handleLogout}
									className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-300 active:scale-[0.98] border border-slate-200/60"
								>
									<LogOut size={14} strokeWidth={2.5} className="text-slate-500" />
									<span>Logout</span>
								</button>
							) : (
								<button
									onClick={() => {
										setIsMenuOpen(false);
										setOpenLogin(true);
									}}
									className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-xs text-white transition-all duration-300 active:scale-[0.98] shadow-md shadow-blue-900/10 hover:shadow-blue-900/20"
									style={{
										background: "linear-gradient(135deg, #0c1a4c 0%, #1a3a8a 100%)",
									}}
								>
									<User size={14} strokeWidth={2.5} />
									<span>Login / Register</span>
								</button>
							)}
						</div>

						<div className="mt-4 pt-3 border-t border-slate-100">
							<p className="text-[10px] text-slate-400 text-center font-medium">
								© 2026 MoodFresh Dairy. All rights
								reserved.
							</p>
						</div>
					</div>
				</div>
			</div>
			<LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
		</>
	);
}
