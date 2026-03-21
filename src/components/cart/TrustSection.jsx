"use client";

import Image from "next/image";

export default function TrustSection() {
  const items = [
    {
      img: "/img/quality.png", // 👈 your image
      title: "Quality",
      subtitle: "Guarantee",
    },
    {
      img: "/img/delivery.png",
      title: "Secure",
      subtitle: "Delivery",
    },
    {
      img: "/img/payment.png",
      title: "Easy & Secure",
      subtitle: "Payments",
    },
  ];

  return (
    <div className="px-4 mt-10 mb-6">
      <div className="flex justify-between text-center">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-1/3">
            {/* IMAGE */}
            <Image
              src={item.img}
              alt={item.title}
              width={60}
              height={60}
              className="object-contain mb-3"
            />

            {/* TEXT */}
            <p className="text-sm text-gray-800 leading-tight">
              {item.title} <br /> {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
