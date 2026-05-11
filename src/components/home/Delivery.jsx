"use client";

import { useEffect, useRef } from "react";
import { CalendarDays, Repeat, Settings2, Package2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    icon: CalendarDays,
    label: "Daily / Alternate Day",
    desc: "Choose your delivery frequency",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-700",
  },
  {
    icon: Repeat,
    label: "Flexible Plans",
    desc: "Pause, skip or change anytime",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
  },
  {
    icon: Settings2,
    label: "Easy Management",
    desc: "Control orders from the app",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
  },
  {
    icon: Package2,
    label: "Bulk Orders",
    desc: "Dairy products in large quantities",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-700",
  },
];

export default function SubscriptionDelivery() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const iconsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          once: true,
        },
      });

      tl.fromTo(
        sectionRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
      );

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.7, y: -6 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(2)" },
        "-=0.3"
      );

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      );

      tl.fromTo(
        cardsRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: { amount: 0.4, from: "start" },
        },
        "-=0.15"
      );

      tl.fromTo(
        iconsRef.current,
        { scale: 0, rotate: -15 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.35,
          ease: "back.out(2.5)",
          stagger: 0.07,
        },
        "-=0.6"
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
      {/* Badge + Title row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-1.5 bg-orange-50 rounded-full px-3 py-1 mb-2"
            style={{ opacity: 0 }}
          >
            <Repeat className="w-3.5 h-3.5 text-orange-800" />
            <span className="text-xs font-medium text-orange-800 tracking-wide">
              subscribe & save
            </span>
          </div>
          <h2
            ref={titleRef}
            className="text-xl font-medium text-gray-900 leading-snug"
            style={{ fontFamily: "Georgia, serif", opacity: 0 }}
          >
            Subscription &<br />Delivery
          </h2>
        </div>
      </div>

      {/* 2-col compact grid */}
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ icon: Icon, label, desc, iconBg, iconColor }, i) => (
          <div
            key={label}
            ref={(el) => (cardsRef.current[i] = el)}
            className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col gap-2"
            style={{ opacity: 0 }}
          >
            <div
              ref={(el) => (iconsRef.current[i] = el)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}
              style={{ transformOrigin: "center" }}
            >
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {label}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}