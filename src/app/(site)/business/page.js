import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeft,
	ArrowRight,
	TrendingUp,
	ShieldCheck,
	Truck,
	Users,
	Award,
	Zap,
} from "lucide-react";

export const metadata = {
	title: "Partner With Us | MoodFresh Business",
	description:
		"Join the MoodFresh revolution. Explore franchise and distribution opportunities in the pure dairy sector.",
};

export default function BusinessOpportunityPage() {
	const benefits = [
		{
			title: "Proven Model",
			desc: "Tap into a high-retention subscription model with guaranteed daily recurring revenue.",
			icon: <TrendingUp className="text-orange-500" size={24} />,
		},
		{
			title: "Quality Assurance",
			desc: "Our A2-certified farms and cold-chain logistics ensure you sell only the gold standard of milk.",
			icon: <ShieldCheck className="text-orange-500" size={24} />,
		},
		{
			title: "Marketing Support",
			desc: "Get access to professional branding, digital leads, and local promotional materials.",
			icon: <Zap className="text-orange-500" size={24} />,
		},
	];

	const models = [
		{
			type: "Distributor Partner",
			investment: "Low",
			focus: "Logistics & Delivery",
			description:
				"Manage last-mile delivery in specific zones and earn per liter delivered.",
		},
		{
			type: "Exclusive Franchisee",
			investment: "High",
			focus: "Brand Presence",
			description:
				"Own a MoodFresh experience center and manage wider regional operations.",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 font-['DM_Sans',sans-serif]">
			{/* ── Hero Section ── */}
			<section className="relative overflow-hidden bg-[#0c1a4c] text-white pt-20 pb-32 px-4 sm:px-6 lg:px-8">
				<div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
					<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
				</div>

				<div className="relative max-w-5xl mx-auto text-center z-10">
					<Link
						href="/"
						className="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-6 text-sm font-medium"
					>
						<ArrowLeft size={16} className="mr-2" />
						Back to Home
					</Link>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
						Grow Your Future with{" "}
						<span className="text-orange-400">MoodFresh</span>
					</h1>
					<p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
						The demand for pure, unadulterated dairy is at an
						all-time high. Partner with India's
						fastest-growing ethical dairy brand and build a
						sustainable business.
					</p>
					<div className="mt-10 flex flex-wrap justify-center gap-4">
						<button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all">
							Apply for Partnership
						</button>
						<button className="bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
							Download Brochure
						</button>
					</div>
				</div>
			</section>

			{/* ── Stats/Value Prop ── */}
			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
				<div className="grid md:grid-cols-3 gap-6 mb-20">
					{benefits.map((item, i) => (
						<div
							key={i}
							className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center"
						>
							<div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
								{item.icon}
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-3">
								{item.title}
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{item.desc}
							</p>
						</div>
					))}
				</div>

				{/* ── Business Models ── */}
				<div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
					<div>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
							Partner Programs
						</h2>
						<p className="text-gray-600 mb-10 text-lg">
							We offer flexible partnership models tailored
							to your investment capacity and operational
							expertise.
						</p>
						<div className="space-y-6">
							{models.map((model, idx) => (
								<div
									key={idx}
									className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-orange-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
								>
									<div className="flex justify-between items-start mb-2">
										<h4 className="text-xl font-bold text-blue-900">
											{model.type}
										</h4>
										<span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full w-fit">
											Investment:{" "}
											{model.investment}
										</span>
									</div>
									<p className="text-sm font-semibold text-orange-600 mb-2">
										{model.focus}
									</p>
									<p className="text-gray-600 text-sm">
										{model.description}
									</p>
								</div>
							))}
						</div>
					</div>
					<div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
						<Image
							src="https://images.unsplash.com/photo-1675869940341-d495d49010b5?auto=format&fit=crop&q=80"
							alt="Business Meeting"
							fill
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[#0c1a4c]/80 to-transparent flex items-end p-10">
							<div className="text-white">
								<p className="text-orange-400 font-bold mb-2 uppercase tracking-widest text-xs">
									Testimonial
								</p>
								<h3 className="text-2xl font-light italic">
									"Joining MoodFresh was the best
									decision for my distribution
									business. The tech support and
									product purity make selling easy."
								</h3>
								<p className="mt-4 font-bold">
									— Rajesh K., Bangalore Partner
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* ── Contact Form Section ── */}
				<div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
					<div className="grid md:grid-cols-2">
						<div className="bg-orange-500 p-12 text-white flex flex-col justify-center">
							<h2 className="text-3xl font-bold mb-6">
								Ready to start?
							</h2>
							<p className="mb-8 text-orange-50 opacity-90">
								Fill out the form and our business
								development team will contact you within
								24 hours.
							</p>

							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Truck size={20} />
									</div>
									<span>
										Operational in 15+ Cities
									</span>
								</div>
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Users size={20} />
									</div>
									<span>
										50,000+ Happy Subscribers
									</span>
								</div>
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Award size={20} />
									</div>
									<span>
										Certified A2 Dairy Farms
									</span>
								</div>
							</div>
						</div>

						<div className="p-12">
							<form className="grid grid-cols-1 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Full Name
									</label>
									<input
										type="text"
										className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
										placeholder="John Doe"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										City of Interest
									</label>
									<input
										type="text"
										className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
										placeholder="e.g. Mumbai"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Investment Range
									</label>
									<select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white">
										<option>₹5L - ₹10L</option>
										<option>₹10L - ₹25L</option>
										<option>₹25L+</option>
									</select>
								</div>
								<button
									type="submit"
									className="mt-4 bg-[#0c1a4c] hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center"
								>
									Request a Callback{" "}
									<ArrowRight
										size={18}
										className="ml-2"
									/>
								</button>
							</form>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
