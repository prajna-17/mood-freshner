"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const cartItems = [
  {
    id: 1,
    name: "Air Mesh Sneakers",
    size: "UK 9",
    price: 2499,
    qty: 1,
    img: "/img/3milk.jpeg",
  },
  {
    id: 2,
    name: "Classic White Tee",
    size: "M",
    price: 799,
    qty: 2,
    img: "/img/3milk.jpeg",
  },
  {
    id: 3,
    name: "Cargo Shorts",
    size: "32",
    price: 1299,
    qty: 1,
    img: "/img/3milk.jpeg",
  },
];

const delivery = 99;

export default function CheckoutPage() {
  const router = useRouter();

  const [payment, setPayment] = useState("online");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + delivery;

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
    }, 1800);
  };

  if (placed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sky-50 px-6">
        <style>{`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.15); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .pop-in { animation: popIn 0.6s cubic-bezier(.36,.07,.19,.97) both; }
          .fade-up { animation: fadeUp 0.5s ease both; }
          .fade-up-1 { animation: fadeUp 0.5s 0.3s ease both; }
          .fade-up-2 { animation: fadeUp 0.5s 0.55s ease both; }
        `}</style>
        <div className="pop-in text-6xl mb-4">🎉</div>
        <h2 className="fade-up text-2xl font-bold text-sky-700 mb-2">
          Order Placed!
        </h2>
        <p className="fade-up-1 text-sky-500 text-sm text-center mb-6">
          Your order is confirmed. We'll deliver it soon.
        </p>
        <div className="fade-up-2 bg-white rounded-2xl px-8 py-4 shadow-md text-sky-700 font-semibold text-lg">
          ₹{total.toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col max-w-md mx-auto relative overflow-x-hidden">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(14,165,233,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(14,165,233,0); }
          100% { box-shadow: 0 0 0 0 rgba(14,165,233,0); }
        }
        @keyframes spin-check {
          0% { transform: scale(0) rotate(-90deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes bounceBtn {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .slide-down { animation: slideDown 0.5s cubic-bezier(.4,0,.2,1) both; }
        .item-row { animation: fadeUp 0.45s cubic-bezier(.4,0,.2,1) both; }
        .item-row:nth-child(1) { animation-delay: 0.05s; }
        .item-row:nth-child(2) { animation-delay: 0.15s; }
        .item-row:nth-child(3) { animation-delay: 0.25s; }
        .summary-block { animation: fadeUp 0.5s 0.3s cubic-bezier(.4,0,.2,1) both; }
        .pay-block { animation: fadeUp 0.5s 0.45s cubic-bezier(.4,0,.2,1) both; }
        .btn-block { animation: fadeUp 0.5s 0.6s cubic-bezier(.4,0,.2,1) both; }

        .card-shimmer {
          background: linear-gradient(90deg,#e0f2fe 25%,#bae6fd 50%,#e0f2fe 75%);
          background-size: 400px 100%;
          animation: shimmer 1.8s infinite linear;
        }
        .pay-card {
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .pay-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 50%, rgba(14,165,233,0.08), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .pay-card:hover::after { opacity: 1; }
        .pay-card.selected {
          border-color: #0ea5e9;
          background: #f0f9ff;
          animation: pulse-ring 1.2s ease-out;
        }
        .check-icon { animation: spin-check 0.35s cubic-bezier(.36,.07,.19,.97) both; }
        .place-btn {
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .place-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14,165,233,0.4);
        }
        .place-btn:not(:disabled):active { transform: scale(0.97); }
        .place-btn .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        .loading-dots span {
          display: inline-block;
          animation: bounce 0.8s infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .img-card {
          transition: transform 0.3s ease;
        }
        .img-card:hover { transform: scale(1.06) rotate(-1deg); }
        .divider-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #bae6fd; display: inline-block;
        }
      `}</style>

      {/* Header */}
      <div className="slide-down sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-sky-100 px-5 py-4 flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors">
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-sky-800 tracking-tight flex-1">
          Checkout
        </h1>
        <span className="text-xs bg-sky-100 text-sky-600 px-2 py-0.5 rounded-full font-medium">
          {cartItems.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pb-36 px-4 pt-5 space-y-4">
        {/* Order Summary Card */}
        <div className="slide-down bg-white rounded-3xl shadow-sm border border-sky-100 overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2">
            <span className="text-base font-bold text-sky-800">
              Order Summary
            </span>
            <div className="flex-1 h-px bg-sky-50 ml-2" />
            <span className="text-xs text-sky-400 font-medium">Review</span>
          </div>

          <div className="px-4 pb-4 space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="item-row flex items-center gap-3 p-2 rounded-2xl hover:bg-sky-50/60 transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="img-card w-16 h-16 rounded-xl object-cover shadow-sm"
                  />
                  {item.qty > 1 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                      {item.qty}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-sky-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-sky-400 mt-0.5">{item.size}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-sky-700">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </p>
                  {item.qty > 1 && (
                    <p className="text-xs text-sky-300">₹{item.price} each</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 flex items-center gap-1.5 py-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="divider-dot" />
            ))}
          </div>

          {/* Price breakdown */}
          <div className="summary-block px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm text-sky-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-sky-600">
              <span>Delivery</span>
              <span className="text-emerald-500 font-medium">₹{delivery}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-sky-800 pt-2 border-t border-sky-50">
              <span>Total</span>
              <span className="text-sky-600">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="pay-block bg-white rounded-3xl shadow-sm border border-sky-100 p-5">
          <p className="text-base font-bold text-sky-800 mb-4">
            Payment Method
          </p>
          <div className="space-y-3">
            {/* Online Payment */}
            <div
              className={`pay-card flex items-center gap-4 p-4 rounded-2xl border-2 ${
                payment === "online"
                  ? "selected border-sky-400 bg-sky-50"
                  : "border-sky-100 bg-white"
              }`}
              onClick={() => setPayment("online")}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  payment === "online" ? "bg-sky-500" : "bg-sky-50"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={payment === "online" ? "#fff" : "#38bdf8"}
                  strokeWidth="2"
                >
                  <rect x="2" y="5" width="20" height="14" rx="3" />
                  <path d="M2 10h20" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold transition-colors ${payment === "online" ? "text-sky-700" : "text-sky-900"}`}
                >
                  Online Payment
                </p>
                <p className="text-xs text-sky-400 mt-0.5">
                  UPI · Card · Netbanking
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  payment === "online"
                    ? "border-sky-500 bg-sky-500"
                    : "border-sky-200"
                }`}
              >
                {payment === "online" && (
                  <svg
                    className="check-icon"
                    width="11"
                    height="11"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* COD */}
            <div
              className={`pay-card flex items-center gap-4 p-4 rounded-2xl border-2 ${
                payment === "cod"
                  ? "selected border-sky-400 bg-sky-50"
                  : "border-sky-100 bg-white"
              }`}
              onClick={() => setPayment("cod")}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  payment === "cod" ? "bg-sky-500" : "bg-sky-50"
                }`}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={payment === "cod" ? "#fff" : "#38bdf8"}
                  strokeWidth="2"
                >
                  <path
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2"
                    strokeLinecap="round"
                  />
                  <rect x="9" y="11" width="12" height="8" rx="2" />
                  <circle
                    cx="15"
                    cy="15"
                    r="1.5"
                    fill={payment === "cod" ? "#fff" : "#38bdf8"}
                    stroke="none"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold transition-colors ${payment === "cod" ? "text-sky-700" : "text-sky-900"}`}
                >
                  Cash on Delivery
                </p>
                <p className="text-xs text-sky-400 mt-0.5">
                  Pay when you receive
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  payment === "cod"
                    ? "border-sky-500 bg-sky-500"
                    : "border-sky-200"
                }`}
              >
                {payment === "cod" && (
                  <svg
                    className="check-icon"
                    width="11"
                    height="11"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery address teaser */}
        <div className="summary-block bg-white rounded-3xl shadow-sm border border-sky-100 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#38bdf8"
              strokeWidth="2"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-sky-400 font-medium">Delivering to</p>
            <p className="text-sm font-semibold text-sky-800 truncate">
              42, MG Road, Bengaluru — 560001
            </p>
          </div>
          <button className="text-xs text-sky-500 font-semibold hover:text-sky-700 transition-colors whitespace-nowrap">
            Change
          </button>
        </div>
        <div className="px-1 pt-4 pb-6">
          <button
            onClick={() => router.push("/order-confirm")}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold text-base py-4 rounded-2xl shadow-md active:scale-95 transition"
          >
            Proceed to Pay
          </button>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
    </div>
  );
}
