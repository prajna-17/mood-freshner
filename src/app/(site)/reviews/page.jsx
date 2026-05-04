"use client";

import React, { useState } from "react";
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Filter,
  ChevronLeft,
  Quote
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Anjali Sharma",
    date: "2 days ago",
    rating: 5,
    comment: "The buffalo milk is exceptionally creamy and fresh. Reminds me of the milk we used to get directly from the farm in my childhood. Highly recommended!",
    verified: true,
    avatar: "AS",
    images: ["https://images.unsplash.com/photo-1550583724-125581f35045?auto=format&fit=crop&q=80&w=200"]
  },
  {
    id: 2,
    name: "Vikram Malhotra",
    date: "1 week ago",
    rating: 5,
    comment: "Excellent service! The delivery is always on time, usually before 7 AM. The A2 Cow Milk has been great for my kids.",
    verified: true,
    avatar: "VM",
  },
  {
    id: 3,
    name: "Priya Gupta",
    date: "2 weeks ago",
    rating: 4,
    comment: "The ghee is aromatic and pure. Only giving 4 stars because the delivery was delayed once due to heavy rain, but the product quality is 5/5.",
    verified: true,
    avatar: "PG",
  },
  {
    id: 4,
    name: "Rahul Verma",
    date: "3 weeks ago",
    rating: 5,
    comment: "Best dairy app in the market. The UI is clean and the ordering process is seamless. Plus, the paneer is so soft!",
    verified: true,
    avatar: "RV",
  },
];

export default function ReviewsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const stats = [
    { label: "Happy Customers", value: "10K+", icon: Users },
    { label: "Average Rating", value: "4.8/5", icon: Star },
    { label: "Reviews", value: "2.4K", icon: MessageSquare },
    { label: "Quality Score", value: "99%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-[#0c1a4c] text-white pt-10 pb-28 px-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fb923c]/10 rounded-full -ml-32 -mb-32 blur-2xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="mb-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Voices of our <br/><span className="text-[#fb923c]">Community</span>
          </h1>
          <p className="text-white/60 font-medium text-lg md:text-xl max-w-xl leading-relaxed">
            Discover why thousands of families trust MoodFresh for their daily fresh dairy needs.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-5 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-slate-50 text-[#1a3a8a] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#fb923c] group-hover:text-white transition-colors">
                <stat.icon size={20} />
              </div>
              <span className="text-xl font-extrabold text-[#0c1a4c]">{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-5 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-[#0c1a4c] tracking-tight">Recent Reviews</h2>
            <p className="text-slate-400 text-sm font-medium">Real stories from verified buyers</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {["all", "5 star", "4 star", "verified"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === f 
                    ? "bg-[#0c1a4c] text-white shadow-lg shadow-[#0c1a4c]/20" 
                    : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-6">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="bg-white rounded-[2.5rem] p-8 shadow-md border border-slate-50 relative group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-8 right-8 text-slate-50 opacity-20 group-hover:opacity-40 transition-opacity">
                <Quote size={80} strokeWidth={3} />
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0c1a4c] to-[#1a3a8a] rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#0c1a4c]/20">
                      {review.avatar}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0c1a4c]">{review.name}</span>
                        {review.verified && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-tight">
                            <CheckCircle2 size={10} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                      <span className="text-slate-400 text-xs font-medium">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < review.rating ? "fill-[#fb923c] text-[#fb923c]" : "text-slate-200"} 
                        strokeWidth={i < review.rating ? 0 : 2}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-slate-600 text-base leading-relaxed font-medium mb-6 italic">
                  "{review.comment}"
                </p>

                {review.images && (
                  <div className="flex gap-3 mb-2">
                    {review.images.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-white group-hover:scale-105 transition-all duration-300">
                        <Image 
                          src={img} 
                          alt="Review attachment" 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="px-10 py-4 bg-white text-[#0c1a4c] font-bold rounded-2xl border-2 border-slate-100 hover:border-[#0c1a4c]/10 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            Load More Reviews
          </button>
        </div>
      </div>
    </div>
  );
}
