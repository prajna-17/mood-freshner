"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function FlashSale() {
  const [time, setTime] = useState(4 * 60 * 60); // 4 hrs

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(time / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="px-3 mt-10">
      <div className="bg-gradient-to-r from-[#2b6cb0] to-[#1e3a8a] rounded-2xl p-4 text-white w-full space-y-4">
        {/* Top Row */}
        <div className="flex justify-between items-center">
          {/* LEFT SIDE */}
          <div className="space-y-3">
            {/* Tag */}
            <div className="flex items-center gap-2 bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
              <Zap className="w-4 h-4" />
              Flash sale
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl font-semibold leading-tight">
                Today’s Hot <br /> Deals
              </h2>

              <p className="text-white/80 text-sm mt-1">
                Upto 35% off on <br /> select items
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center">
            <p className="text-sm text-white/80 mb-2">Ends in</p>

            <div className="flex items-center gap-2">
              <TimeBox value={hours} label="hrs" />
              <span className="text-xl font-bold">:</span>
              <TimeBox value={minutes} label="min" />
              <span className="text-xl font-bold">:</span>
              <TimeBox value={seconds} label="sec" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ⏱ Small component */
function TimeBox({ value, label }) {
  return (
    <div className="bg-white/20 backdrop-blur-md px-3 py-2 rounded-lg text-center min-w-[50px]">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-white/80">{label}</p>
    </div>
  );
}
