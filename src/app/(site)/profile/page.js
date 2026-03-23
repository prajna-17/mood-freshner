"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  Settings,
  User,
  ChevronRight,
  MapPin,
  CreditCard,
  ClipboardList,
  Gift,
  Star,
  Bell,
  LogOut,
  Edit3,
  Package,
  Zap,
  Award,
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────
const user = {
  name: "Deepali Lale",
  email: "deepali.123@gmail.com",
  initials: "DL",
  membership: "Gold Member",
  stats: [
    { label: "Orders", value: "48", Icon: Package },
    { label: "Active Sub", value: "3", Icon: Zap },
    { label: "Points", value: "1.2k", Icon: Award },
  ],
};

const subscriptions = [
  {
    id: 1,
    name: "Full Cream Milk",
    qty: "1 L",
    schedule: "Daily Morning",
    active: true,
    bg: "#f59e0b",
    img: "/img/yogurt.jpeg",
  },
  {
    id: 2,
    name: "Fresh Curd",
    qty: "250g",
    schedule: "Alt Days",
    active: true,
    bg: "#1e3a5f",
    img: "/img/curd.jpeg",
  },
  {
    id: 3,
    name: "Fresh Paneer",
    qty: "250g",
    schedule: "Every Sunday",
    active: true,
    bg: "#0ea5e9",
    img: "/img/panner.jpeg",
  },
];

const accountItems = [
  {
    Icon: MapPin,
    label: "Delivery Address",
    sub: "3 Saved locations",
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
    href: "/profile/address",
  },
  {
    Icon: CreditCard,
    label: "Payment Methods",
    sub: "UPI .....1234",
    iconBg: "#f0fdf4",
    iconColor: "#10b981",
    href: "/profile/payment",
  },
  {
    Icon: ClipboardList,
    label: "Order History",
    sub: "Last Order : 3 days ago",
    iconBg: "#fff7ed",
    iconColor: "#f97316",
    href: "/profile/orders",
  },
  {
    Icon: Gift,
    label: "Refer & Earn",
    sub: "Get Rs.50 per referral",
    iconBg: "#fdf4ff",
    iconColor: "#a855f7",
    href: "/profile/refer",
  },
  {
    Icon: Bell,
    label: "Notifications",
    sub: "Manage your alerts",
    iconBg: "#fff1f2",
    iconColor: "#f43f5e",
    href: "/profile/notifications",
  },
  {
    Icon: Settings,
    label: "Settings",
    sub: "App preferences",
    iconBg: "#f8fafc",
    iconColor: "#64748b",
    href: "/profile/settings",
  },
];

const navItems = [
  { Icon: Home, label: "Home", href: "/", active: false },
  { Icon: ShoppingCart, label: "Cart", href: "/cart", active: false },
  { Icon: Settings, label: "Settings", href: "/settings", active: false },
  { Icon: User, label: "Profile", href: "/profile", active: true },
];

// ── Component ──────────────────────────────────────────────
export default function ProfilePage() {
  const [activeNav, setActiveNav] = useState("Profile");

  return (
    <div className="min-h-screen bg-[#f0f4f8] max-w-md mx-auto relative flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *, body { font-family: 'Nunito', system-ui, sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%  { opacity: 0; transform: scale(0.85); }
          70% { transform: scale(1.04); }
          100%{ opacity: 1; transform: scale(1); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-4px); }
        }
        @keyframes shimmer {
          0%   { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(251,191,36,0.5); }
          70%  { box-shadow: 0 0 0 10px rgba(251,191,36,0); }
          100% { box-shadow: 0 0 0 0 rgba(251,191,36,0); }
        }

        .fade-up   { animation: fadeSlideUp 0.45s ease both; }
        .fade-up-1 { animation: fadeSlideUp 0.45s 0.06s ease both; }
        .fade-up-2 { animation: fadeSlideUp 0.45s 0.12s ease both; }
        .fade-up-3 { animation: fadeSlideUp 0.45s 0.18s ease both; }
        .fade-up-4 { animation: fadeSlideUp 0.45s 0.24s ease both; }
        .fade-up-5 { animation: fadeSlideUp 0.45s 0.30s ease both; }
        .pop-in    { animation: popIn 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .float     { animation: floatY 3s ease-in-out infinite; }
        .avatar-ring { animation: pulse-ring 2.5s ease infinite; }

        .stat-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(14,165,233,0.15);
        }

        .sub-card {
          transition: transform 0.2s, box-shadow 0.2s;
          flex-shrink: 0;
        }
        .sub-card:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .account-row {
          transition: background 0.18s, transform 0.18s;
        }
        .account-row:hover {
          background: #f0f9ff !important;
          transform: translateX(3px);
        }
        .account-row:active {
          transform: scale(0.98);
        }

        .nav-btn {
          transition: transform 0.15s;
        }
        .nav-btn:active { transform: scale(0.9); }

        .membership-badge {
          background: linear-gradient(90deg, #fff 0%, #fef9c3 40%, #fff 60%, #fff 100%);
          background-size: 300px 100%;
          animation: shimmer 2.5s linear infinite;
        }

        .sub-scroll::-webkit-scrollbar { display: none; }
        .sub-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .leaf-decoration {
          position: absolute;
          opacity: 0.12;
          pointer-events: none;
        }

        /* Sub image: fill the box, no broken-image icon */
        .sub-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
      `}</style>

      {/* ── Header / Hero ── */}
      <div
        className="relative overflow-hidden px-5 pt-12 pb-8"
        style={{
          background:
            "linear-gradient(160deg, #1a4f9c 0%, #1565c0 50%, #0d47a1 100%)",
        }}
      >
        {/* Decorative leaf blobs */}
        <div
          className="leaf-decoration"
          style={{ top: -10, left: -20, width: 100, height: 100 }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <ellipse
              cx="60"
              cy="40"
              rx="45"
              ry="30"
              fill="white"
              transform="rotate(-30 60 40)"
            />
            <ellipse
              cx="40"
              cy="60"
              rx="35"
              ry="20"
              fill="white"
              transform="rotate(-30 40 60)"
            />
          </svg>
        </div>
        <div
          className="leaf-decoration"
          style={{ top: 20, right: -15, width: 80, height: 80 }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <ellipse
              cx="40"
              cy="40"
              rx="40"
              ry="25"
              fill="white"
              transform="rotate(30 40 40)"
            />
          </svg>
        </div>
        <div
          className="leaf-decoration"
          style={{ bottom: -10, left: -10, width: 90, height: 90 }}
        >
          <svg viewBox="0 0 100 100" fill="none">
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="22"
              fill="white"
              transform="rotate(-15 50 50)"
            />
          </svg>
        </div>

        {/* Edit button */}
        <div className="flex justify-end mb-4 relative z-10">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Edit3 size={14} color="white" strokeWidth={2.2} />
          </button>
        </div>

        {/* Avatar + info */}
        <div className="flex flex-col items-center relative z-10">
          <div className="pop-in relative mb-3">
            <div
              className="avatar-ring w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
              style={{
                background: "white",
                border: "3px solid #f59e0b",
                color: "#1565c0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              {user.initials}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#f59e0b", border: "2px solid white" }}
            >
              <Star size={11} fill="white" color="white" strokeWidth={0} />
            </div>
          </div>

          <h1 className="fade-up text-xl font-black text-white mt-1">
            {user.name}
          </h1>
          <p
            className="fade-up-1 text-sm font-semibold"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            {user.email}
          </p>

          <div className="fade-up-2 mt-3">
            <div
              className="membership-badge px-5 py-2 rounded-full flex items-center gap-2"
              style={{ boxShadow: "0 2px 12px rgba(245,158,11,0.3)" }}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-black" style={{ color: "#b45309" }}>
                {user.membership}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="fade-up-2 px-4 -mt-1 pb-2">
        <div
          className="grid grid-cols-3 gap-3 bg-white rounded-3xl p-4"
          style={{
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #e0f2fe",
          }}
        >
          {user.stats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="stat-card flex flex-col items-center py-2 rounded-2xl"
              style={{ background: "#f0f7ff" }}
            >
              <Icon
                size={16}
                color="#0ea5e9"
                strokeWidth={2.2}
                className="mb-1"
              />
              <span className="text-lg font-black text-gray-800 leading-tight">
                {value}
              </span>
              <span className="text-[11px] font-bold text-sky-500 mt-0.5">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-5">
        {/* ── Subscriptions ── */}
        <div className="fade-up-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-black text-gray-800">Subscriptions</h2>
            <button className="text-sm font-black" style={{ color: "#f59e0b" }}>
              Manage
            </button>
          </div>

          <div className="sub-scroll flex gap-3 overflow-x-auto pb-2">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="sub-card relative rounded-2xl overflow-hidden"
                style={{
                  background: sub.bg,
                  minWidth: 140,
                  height: 160,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                {/* Active badge */}
                <div
                  className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black text-white z-10"
                  style={{ background: "#22c55e" }}
                >
                  Active
                </div>

                {/* ── Product image using plain <img> — works directly with /public ── */}
                <div
                  className="absolute top-3 left-3 w-12 h-12 rounded-xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sub.img} alt={sub.name} className="sub-img" />
                </div>

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white/80 text-[11px] font-bold">
                    {sub.name}
                  </p>
                  <p className="text-white text-lg font-black leading-tight">
                    {sub.qty}
                  </p>
                  <p className="text-white/70 text-[10px] font-semibold mt-0.5">
                    {sub.schedule}
                  </p>
                </div>
              </div>
            ))}

            {/* Add new subscription card */}
            <div
              className="sub-card flex flex-col items-center justify-center rounded-2xl cursor-pointer"
              style={{
                minWidth: 100,
                height: 160,
                background: "white",
                border: "2px dashed #bae6fd",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                style={{ background: "#e0f2fe" }}
              >
                <Zap size={18} color="#0ea5e9" strokeWidth={2.2} />
              </div>
              <p className="text-[11px] font-black text-sky-500 text-center leading-tight px-2">
                Add New
              </p>
            </div>
          </div>
        </div>

        {/* ── Account Section ── */}
        <div className="fade-up-4">
          <h2 className="text-xl font-black text-gray-800 mb-3">Account</h2>
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              border: "1px solid #f1f5f9",
            }}
          >
            {accountItems.map((item, i) => (
              <Link href={item.href} key={item.label}>
                <div
                  className="account-row flex items-center gap-4 px-4 py-4 bg-white"
                  style={{
                    borderBottom:
                      i < accountItems.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: item.iconBg }}
                  >
                    <item.Icon
                      size={18}
                      color={item.iconColor}
                      strokeWidth={2.2}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-800">
                      {item.label}
                    </p>
                    <p
                      className="text-xs font-semibold mt-0.5"
                      style={{ color: "#64748b" }}
                    >
                      {item.sub}
                    </p>
                  </div>
                  <ChevronRight size={16} color="#cbd5e1" strokeWidth={2.5} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Logout ── */}
        <div className="fade-up-5">
          <button
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-97"
            style={{
              background: "#fff1f2",
              color: "#f43f5e",
              border: "1.5px solid #fecdd3",
            }}
          >
            <LogOut size={17} strokeWidth={2.5} />
            Log Out
          </button>
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
    </div>
  );
}
