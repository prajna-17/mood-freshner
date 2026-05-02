import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";

export const metadata = {
  title: "Blogs | MoodFresh",
  description: "Read our latest articles on dairy, health, and sustainable farming.",
};

export default function BlogsPage() {
  const blogs = [
    {
      title: "The Incredible Health Benefits of A2 Milk",
      desc: "Discover why A2 milk is considered superior for digestion and overall wellness compared to regular milk.",
      image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80",
      date: "Oct 12, 2023",
      author: "Dr. Sharma"
    },
    {
      title: "Farm to Table: The MoodFresh Journey",
      desc: "Take a behind-the-scenes look at how we ensure pure milk reaches your doorstep within hours of milking.",
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80",
      date: "Nov 05, 2023",
      author: "Farm Team"
    },
    {
      title: "Delicious Recipes Using Farm Fresh Dairy",
      desc: "From creamy paneer to rich desserts, explore our favorite recipes you can make with MoodFresh products.",
      image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80",
      date: "Dec 20, 2023",
      author: "Chef Aditi"
    },
    {
      title: "Why Sustainable Farming Matters",
      desc: "How ethical practices and caring for our cows leads to better milk and a healthier planet.",
      image: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80",
      date: "Jan 15, 2024",
      author: "Sustainability Team"
    },
    {
      title: "Understanding Milk Pasteurization",
      desc: "A simple guide to how we make sure your milk is perfectly safe without losing its natural nutrients.",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80",
      date: "Feb 28, 2024",
      author: "Quality Control"
    },
    {
      title: "The Secret to Perfect Homemade Curd",
      desc: "Struggling to set the perfect curd? Follow our foolproof guide using MoodFresh pure milk.",
      image: "https://images.unsplash.com/photo-1728910107657-a1806c4e22bf?auto=format&fit=crop&q=80",
      date: "Mar 10, 2024",
      author: "Priya Singh"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-4 font-['DM_Sans',sans-serif]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1a4c] via-[#1a3a8a] to-[#0e2260] text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
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
            The MoodFresh <span className="text-orange-400">Journal</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Insights, health tips, and stories from our farm. Discover the world of pure dairy.
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto text-gray-50 fill-current">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Featured Post */}
        <div className="bg-white rounded-3xl shadow-xl p-4 md:p-6 mb-16 flex flex-col md:flex-row gap-8 group cursor-pointer hover:shadow-2xl transition-shadow border border-gray-100">
          <div className="md:w-1/2 relative h-64 md:h-[400px] rounded-2xl overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80" 
              alt="Featured Post" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
              Featured
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center px-4 md:px-8 pb-4 md:pb-0">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center"><Calendar size={14} className="mr-1" /> Oct 12, 2023</span>
              <span className="flex items-center"><User size={14} className="mr-1" /> Dr. Sharma</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
              The Incredible Health Benefits of Pure Farm Milk
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Discover why farm-fresh milk is considered superior for digestion and overall wellness compared to heavily processed regular milk. We break down the science...
            </p>
            <div className="inline-flex items-center text-blue-600 font-semibold text-lg group-hover:text-blue-800 transition-colors">
              Read Article <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group flex flex-col">
              <div className="relative h-56 w-full overflow-hidden">
                <Image 
                  src={blog.image} 
                  alt={blog.title} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center"><Calendar size={12} className="mr-1" /> {blog.date}</span>
                  <span className="flex items-center"><User size={12} className="mr-1" /> {blog.author}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {blog.desc}
                </p>
                <div className="inline-flex items-center text-orange-600 font-medium text-sm group-hover:text-orange-700 transition-colors mt-auto">
                  Read More <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
