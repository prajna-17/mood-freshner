"use client";

import { useEffect, useRef } from "react";
import { Leaf, ShieldCheck, Sparkles, ThumbsUp, Repeat2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const promises = [
  {
    icon: Leaf,
    title: "Farm-Fresh Every Time",
    desc: "Sourced directly from trusted farms and delivered while it's at peak freshness.",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    accent: "border-l-green-300",
  },
  {
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    desc: "Every product passes strict quality checks before it reaches your home.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-700",
    accent: "border-l-orange-300",
  },
  {
    icon: Sparkles,
    title: "Taste & Freshness Intact",
    desc: "No shortcuts. We preserve natural taste and nutrition from farm to fork.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
    accent: "border-l-amber-300",
  },
  {
    icon: ThumbsUp,
    title: "Your Health First",
    desc: "Your well-being is our priority — always pure, always safe, always healthy.",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-700",
    accent: "border-l-pink-300",
  },
  {
    icon: Repeat2,
    title: "Consistent Day After Day",
    desc: "Building long-term trust by delivering the same great quality every single day.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    accent: "border-l-blue-300",
  },
];

export default function OurPromise() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const quoteRef = useRef(null);
  const cardsRef = useRef([]);
  const iconsRef = useRef([]);
  const dividerRef = useRef(null);

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

      // Title
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
        "-=0.2"
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.2"
      );

      // Quote block
      tl.fromTo(
        quoteRef.current,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
        "-=0.1"
      );

      // Divider line draw
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

      // Cards stagger
      tl.fromTo(
        cardsRef.current,
        { opacity: 0, y: 24, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.42,
          ease: "power3.out",
          stagger: { amount: 0.5, from: "start" },
        },
        "-=0.25"
      );

      // Icons bounce in
      tl.fromTo(
        iconsRef.current,
        { scale: 0, rotate: -15 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.38,
          ease: "back.out(2.5)",
          stagger: 0.07,
        },
        "-=0.72"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="mx-4 mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100"
      style={{ opacity: 0 }}
    >
      {/* Badge */}
      <div
        ref={badgeRef}
        className="inline-flex items-center gap-1.5 bg-orange-50 rounded-full px-3 py-1 mb-3"
        style={{ opacity: 0 }}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-orange-800" />
        <span className="text-xs font-medium text-orange-800 tracking-wide">
          our commitment
        </span>
      </div>

      {/* Title */}
      <h2
        ref={titleRef}
        className="text-xl font-medium text-gray-900 leading-snug mb-1"
        style={{ fontFamily: "Georgia, serif", opacity: 0 }}
      >
        Our Promise<br />to You
      </h2>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="text-sm text-gray-500 mb-4 leading-relaxed"
        style={{ opacity: 0 }}
      >
        Freshness, trust, and quality —<br />delivered without compromise.
      </p>

      {/* Pull-quote block */}
      <div
        ref={quoteRef}
        className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-orange-300 px-4 py-3.5 mb-4"
        style={{ opacity: 0 }}
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          "We ensure farm-fresh delivery to our customers, maintaining{" "}
          <span className="font-medium text-gray-800">freshness, taste and quality</span>{" "}
          in every product. Your health and satisfaction are our priority."
        </p>
      </div>

      {/* Subtle divider */}
      <div
        ref={dividerRef}
        className="h-px bg-gray-200 mb-4 rounded-full"
        style={{ opacity: 1 }}
      />

      {/* Promise cards — full width list */}
      <div className="flex flex-col gap-2.5">
        {promises.map(({ icon: Icon, title, desc, iconBg, iconColor, accent }, i) => (
          <div
            key={title}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${accent} p-3.5 flex items-start gap-3`}
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => (iconsRef.current[i] = el)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
              style={{ transformOrigin: "center" }}
            >
              <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
        Building trust, one delivery at a time 🌿
      </p>
    </div>
  );
}