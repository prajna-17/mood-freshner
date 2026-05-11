"use client";

import { useEffect, useRef } from "react";
import { CheckCircle, Sprout, Leaf, Package, Truck, Heart, Star } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: CheckCircle,
    label: "100% Pure & Fresh",
    desc: "No adulteration, ever",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-800",
  },
  {
    icon: Sprout,
    label: "Farm Direct",
    desc: "Sourced from trusted farms",
    iconBg: "bg-green-50",
    iconColor: "text-green-800",
  },
  {
    icon: Leaf,
    label: "No Chemicals",
    desc: "Zero preservatives added",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
  },
  {
    icon: Package,
    label: "Hygienic Pack",
    desc: "Sealed for safety",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-800",
  },
  {
    icon: Truck,
    label: "Fast Delivery",
    desc: "Right to your doorstep",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-800",
  },
  {
    icon: Heart,
    label: "Family Trusted",
    desc: "Loved by thousands",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-800",
  },
];

export default function WhyChoose() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const iconsRef = useRef([]);
  const trustRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
        },
      });

      // Section fade + rise
      tl.fromTo(
        sectionRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );

      // Badge pop
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.7, y: -6 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(2)" },
        "-=0.3"
      );

      // Title slide up
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "-=0.2"
      );

      // Subtitle fade
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.2"
      );

      // Cards stagger
      tl.fromTo(
        cardsRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          stagger: { amount: 0.55, from: "start" },
        },
        "-=0.1"
      );

      // Icons bounce in
      tl.fromTo(
        iconsRef.current,
        { scale: 0, rotate: -15 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(2.5)",
          stagger: 0.07,
        },
        "-=0.7"
      );

      // Trust bar
      tl.fromTo(
        trustRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.15"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mx-4 mt-10 bg-gray-50 rounded-2xl p-5 border border-gray-100"
      style={{ opacity: 0 }}
    >
      {/* Badge */}
      <div
        ref={badgeRef}
        className="inline-flex items-center gap-1.5 bg-orange-50 rounded-full px-3 py-1 mb-3"
        style={{ opacity: 0 }}
      >
        <Leaf className="w-3.5 h-3.5 text-orange-800" />
        <span className="text-xs font-medium text-orange-800 tracking-wide">
          100% natural
        </span>
      </div>

      {/* Title */}
      <h2
        ref={titleRef}
        className="text-xl font-medium text-gray-900 leading-snug mb-1"
        style={{ fontFamily: "Georgia, serif", opacity: 0 }}
      >
        Why Choose<br />Mood Fresh?
      </h2>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="text-sm text-gray-500 mb-5 leading-relaxed"
        style={{ opacity: 0 }}
      >
        Goodness straight from the farm,<br />delivered to your door.
      </p>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {features.map(({ icon: Icon, label, desc, iconBg, iconColor }, i) => (
          <div
            key={label}
            ref={(el) => (cardsRef.current[i] = el)}
            className="bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col gap-2.5"
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => (iconsRef.current[i] = el)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
              style={{ transformOrigin: "center" }}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust bar */}
      <div
        ref={trustRef}
        className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5"
        style={{ opacity: 0 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
        ))}
        <span className="text-xs text-gray-400 ml-1">
          Trusted by 10,000+ happy families
        </span>
      </div>
    </div>
  );
}