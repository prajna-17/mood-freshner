import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Sun, Droplets, Heart } from "lucide-react";

export const metadata = {
  title: "Our Farm | MoodFresh",
  description: "Discover the lush green pastures where MoodFresh milk comes from. Happy cows, pure dairy.",
};

export default function OurFarmPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-4 font-['DM_Sans',sans-serif]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a4c] via-[#1a3a8a] to-[#0e2260] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-20 -right-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Welcome to <span className="text-green-400">Our Farm</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Take a glimpse into the lush, green pastures where our happy cows graze, ensuring you get the purest milk every day.
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
        
        {/* Intro Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 w-full">
            <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-lg group">
              <Image 
                src="https://images.unsplash.com/photo-1641062680671-fec389e4eeeb?auto=format&fit=crop&q=80" 
                alt="Happy cows in a green pasture" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="inline-flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm font-semibold mb-6 border border-green-100">
              <MapPin size={16} className="mr-1.5" /> Located in the Heart of Nature
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Where Purity Begins</h2>
            <p className="text-gray-600 mb-4 leading-relaxed text-lg">
              Our dairy farm spans across acres of unpolluted, nutrient-rich soil. We believe that the quality of milk is directly linked to the environment our cows live in.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              That's why we've created a stress-free habitat where cows can roam freely, bathe in sunlight, and feed on organic fodder grown right here on our land.
            </p>
          </div>
        </div>

        {/* Farm Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The MoodFresh Difference</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We go beyond standard farming practices. Our approach is entirely focused on animal welfare and sustainable agriculture.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-b from-white to-green-50/50 p-8 rounded-3xl border border-green-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200 rotate-3">
                <Sun size={32} className="-rotate-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Open Pastures</h3>
              <p className="text-gray-600 leading-relaxed">
                Our cows are not confined. They spend their days soaking in natural sunlight and grazing in expansive, open green fields.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-gradient-to-b from-white to-blue-50/50 p-8 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 -rotate-3">
                <Droplets size={32} className="rotate-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Clean Water & Fodder</h3>
              <p className="text-gray-600 leading-relaxed">
                We provide our cattle with RO-purified drinking water and high-quality, pesticide-free fodder grown on our own farm.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-gradient-to-b from-white to-orange-50/50 p-8 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200 rotate-3">
                <Heart size={32} className="-rotate-3" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Happy Cows</h3>
              <p className="text-gray-600 leading-relaxed">
                Happy cows give the best milk. We ensure regular vet checkups, zero hormone injections, and a loving, stress-free environment.
              </p>
            </div>
          </div>
        </div>

        {/* Big Farm Image */}
        <div className="relative h-80 md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl group">
          <Image 
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80" 
            alt="Vast green dairy farm landscape" 
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide drop-shadow-xl mb-4">
              Nature's Best,
            </h2>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-green-400 tracking-wide drop-shadow-xl">
              Direct to Your Door.
            </h2>
          </div>
        </div>

      </main>
    </div>
  );
}
