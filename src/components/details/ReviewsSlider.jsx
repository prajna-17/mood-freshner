"use client";

import { Star } from "lucide-react";

const REVIEWS = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    name: "Priya Day",
    initial: "P",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    name: "Kavita Day",
    initial: "K",
  },
  {
    text: "Very fresh and good quality milk!",
    name: "Riya Sharma",
    initial: "R",
  },
];

export default function ReviewsSlider() {
  return (
    <div className="px-4 mt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-2xl font-md text-gray-900"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {" "}
          Reviews
        </h2>
      </div>

      {/* SLIDER */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="min-w-[220px] bg-white rounded-xl p-3 shadow-sm border"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#f97316" stroke="#f97316" />
              ))}
            </div>

            {/* Text */}
            <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>

            {/* User */}
            <div className="flex items-center gap-2 mt-3">
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
                {r.initial}
              </div>

              <p className="text-xs text-black font-medium">{r.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
