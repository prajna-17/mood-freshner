"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, 
  Send, 
  MessageSquare, 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  ThumbsUp, 
  CheckCircle2,
  ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("general");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const feedbackTypes = [
    { id: "general", label: "General", icon: MessageSquare },
    { id: "product", label: "Product", icon: Heart },
    { id: "delivery", label: "Delivery", icon: ThumbsUp },
    { id: "app", label: "App", icon: Smile },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please provide a star rating!");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-5">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold text-[#0c1a4c] tracking-tight">Thank You!</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Your feedback means the world to us. We'll use it to make <span className="text-[#fb923c] font-bold">MoodFresh</span> even better for you.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-[#0c1a4c] text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-[#0c1a4c]/20"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-[#0c1a4c] text-white pt-10 pb-20 px-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#fb923c]/10 rounded-full -ml-24 -mb-24 blur-2xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="mb-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Share your <br/><span className="text-[#fb923c]">experience</span></h1>
          <p className="text-white/60 font-medium text-lg leading-snug">Help us grow and serve you better fresh dairy every day.</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto px-5 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Rating Section */}
            <div className="text-center space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">How was your experience?</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star 
                      size={40} 
                      className={`transition-all duration-300 ${
                        (hoverRating || rating) >= star 
                          ? "fill-[#fb923c] text-[#fb923c]" 
                          : "text-slate-200"
                      }`}
                      strokeWidth={(hoverRating || rating) >= star ? 0 : 2}
                    />
                  </button>
                ))}
              </div>
              <div className="h-6">
                {(hoverRating || rating) > 0 && (
                  <p className="text-[#fb923c] font-extrabold text-sm animate-in fade-in slide-in-from-bottom-1 uppercase tracking-tighter">
                    {["Terrible", "Bad", "Okay", "Good", "Amazing"][(hoverRating || rating) - 1]}
                  </p>
                )}
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">What is this about?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
                      feedbackType === type.id 
                        ? "border-[#fb923c] bg-orange-50/30 text-[#fb923c] shadow-sm" 
                        : "border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <type.icon size={20} />
                    <span className="text-xs font-bold uppercase tracking-tight">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Tell us more</p>
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  className="w-full min-h-[150px] rounded-[2rem] border-2 border-slate-50 bg-slate-50 p-6 text-[15px] font-medium text-slate-700 outline-none focus:border-[#0c1a4c]/10 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-300 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4.5 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg ${
                isSubmitting 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-[#0c1a4c] hover:bg-[#1a3a8a] shadow-[#0c1a4c]/20"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Feedback...</span>
                </>
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm border border-white rounded-[2rem] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#fb923c]/10 text-[#fb923c] rounded-2xl flex items-center justify-center flex-shrink-0">
            <Heart size={24} />
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Your personal information is always secure. We only use your feedback to improve our products and services.
          </p>
        </div>
      </div>
    </div>
  );
}
