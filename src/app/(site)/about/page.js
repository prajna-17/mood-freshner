import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Leaf, ShieldCheck, HeartPulse } from "lucide-react";

export const metadata = {
  title: "About Us | MoodFresh",
  description: "Learn more about MoodFresh's journey, mission, and commitment to pure, farm-fresh dairy.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-4 font-['DM_Sans',sans-serif]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a4c] via-[#1a3a8a] to-[#0e2260] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-20 -right-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Our Journey to <span className="text-orange-400">Pure Dairy</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            At MoodFresh, we believe in the purity of farm-fresh milk. Discover how we're redefining dairy with unadulterated, wholesome, and locally sourced products.
          </p>
        </div>
        
        {/* Curved Bottom Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto text-gray-50 fill-current">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-lg">
              MoodFresh started with a simple vision: to bring the purest, unadulterated farm-fresh milk right to your doorstep. We noticed a gap in the market for genuinely fresh dairy products that stay true to their natural origins.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Through sustainable farming and ethical practices, our dedicated team ensures that every drop of milk you receive maintains its natural goodness, empowering you and your family to live a healthier, more balanced life.
            </p>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 w-full">
            <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-lg group">
              <Image 
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80" 
                alt="Fresh milk and dairy products" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-8 rounded-3xl border border-orange-100">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
              <Leaf size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To deliver premium quality, fresh dairy products that promote holistic health while preserving the environment and supporting local dairy farming communities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-3xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
              <HeartPulse size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To be the world’s most trusted brand for pure, farm-fresh dairy, inspiring millions to embrace a lifestyle rooted in nature's wholesome nourishment.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MoodFresh?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            We don't just sell milk; we offer a commitment to quality and purity.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Farm Fresh", desc: "Sourced directly from local farms, delivered fresh every morning.", icon: <Leaf className="text-green-500" /> },
              { title: "Quality Assured", desc: "Rigorous testing to ensure only the highest quality milk reaches you.", icon: <ShieldCheck className="text-blue-500" /> },
              { title: "100% Pure", desc: "No adulterants, no preservatives. Just pure, wholesome dairy.", icon: <CheckCircle2 className="text-orange-500" /> },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
