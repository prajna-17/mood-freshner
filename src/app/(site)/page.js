"use client";

import { useEffect, useState } from "react";
import BannerSection from "@/components/home/BannerSection";
import BestSellers from "@/components/home/BestSellers";
import CategoriesSection from "@/components/home/CategoriesSection";
import DeliveryCard from "@/components/home/DeliveryCard";
import HomeTopSection from "@/components/home/HomeTopSection";
import PromoBanner from "@/components/home/PromoBanner";
import TodaysFresh from "@/components/home/TodaysFresh";
import FlashSale from "@/components/home/FlashSale";
import OurStory from "@/components/home/OurStory";
import RecentlyPurchased from "@/components/home/RecentlyPurchased";
import WhyChoose from "@/components/home/WhyChoose";
import { getUserIdFromToken } from "@/utils/auth";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // 🔥 SAME logic wrapped into function (NO CHANGE)
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setIsReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );

          const data = await res.json();
          const pincode = data.postcode;

          if (pincode) {
            localStorage.setItem("pincode", pincode);

            const detectedAddress = {
              fullName: "",
              phone: "",
              addressLine: "Your Location",
              landmark: "",
              city: data.city || data.locality,
              state: data.principalSubdivision,
              postalCode: pincode,
            };

            const userId = getUserIdFromToken();

            if (userId) {
              localStorage.setItem(
                `address_${userId}`,
                JSON.stringify(detectedAddress),
              );
            } else {
              localStorage.setItem(
                "address_guest",
                JSON.stringify(detectedAddress),
              );
            }

            window.dispatchEvent(new Event("addressUpdated"));
          } else {
            console.log("Pincode not found");
          }
        } catch (err) {
          console.log("Error detecting location", err);
        }

        setIsReady(true);
      },
      (error) => {
        console.log("Location denied", error);
        setIsReady(true);
      },
      {
        timeout: 5000,
        enableHighAccuracy: true,
      },
    );
  };

  useEffect(() => {
    const existingPin = localStorage.getItem("pincode");

    // ✅ If already exists → just render
    if (existingPin) {
      setIsReady(true);
      return;
    }

    // 🔥 Try auto-detect first (works on laptop)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          detectLocation(); // auto success
        },
        () => {
          // 👇 mobile case → show modal
          setShowPermissionModal(true);
          setIsReady(true);
        },
        { timeout: 4000 },
      );
    } else {
      setIsReady(true);
    }
  }, []);

  // ⛔ prevent SSR mismatch
  if (!isReady) return <div>Loading...</div>;

  return (
    <>
      {/* 🔥 Permission Modal (Chrome-like) */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/30 pt-20">
          <div className="bg-white w-[90%] max-w-sm rounded-xl shadow-lg p-4">
            <p className="text-sm text-gray-800 font-medium">
              📍 Allow location access?
            </p>

            <p className="text-xs text-gray-500 mt-1">
              We use your location to auto-detect delivery area.
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="text-gray-500 text-sm"
              >
                Block
              </button>

              <button
                onClick={() => {
                  setShowPermissionModal(false);
                  detectLocation(); // 👈 triggers real browser popup
                }}
                className="text-blue-600 font-semibold text-sm"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <HomeTopSection />
      <DeliveryCard />
      <BannerSection />
      <CategoriesSection />
      <BestSellers />
      <PromoBanner />
      <TodaysFresh />
      <FlashSale />
      <OurStory />
      <RecentlyPurchased />
      <WhyChoose />
    </>
  );
}
