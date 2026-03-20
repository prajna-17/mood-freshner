"use client";

import Image from "next/image";

export default function OurStory() {
  return (
    <div className="px-4 mt-10 text-center space-y-5 bg-white">
      {/* Title */}
      <h2
        className="text-2xl font-md text-gray-900"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Our Story
      </h2>

      {/* Image (ONLY items focus) */}
      <div className="flex justify-center bg-white  rounded-2xl">
        <div className="bg-white  rounded-xl">
          <Image
            src="/img/wooden1.png"
            alt="Story"
            width={220}
            height={220}
            className="object-contain"
          />
        </div>
      </div>

      {/* Subtitle */}
      <h3 className="text-blue-600 text-lg font-medium">
        Straight From Happy Farms
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed px-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget sodales
        lorem. Vivamus molestie diam quis. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit.
      </p>

      {/* Badges */}
      <div className="flex gap-3 justify-center flex-wrap">
        <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-4 py-2 bg-white">
          <Image src="/img/checkmark.png" alt="FSSAI" width={20} height={20} />
          <span className="text-blue-600 text-sm font-medium">
            FSSAI Certified
          </span>
        </div>

        <div className="flex items-center gap-2 border border-blue-200 rounded-xl px-4 py-2 bg-white">
          <Image src="/img/sustainable.png" alt="Eco" width={20} height={20} />
          <span className="text-blue-600 text-sm font-medium">
            Eco Packaging
          </span>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden mt-6">
        <Image
          src="/img/factory.jpeg"
          alt="Video"
          fill
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white -mt-10 px-4">
          <p className="text-center text-lg font-medium">
            Discover the taste <br /> of milky-rich goodness
          </p>

          {/* Play Button (your image) */}
          <div className="mt-4">
            <Image
              src="/img/play.png" // 👈 your play icon
              alt="Play"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
