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
import { getUserIdFromToken } from "@/utils/auth"; // ✅ IMPORTANT

export default function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const existingPin = localStorage.getItem("pincode");

    // ✅ If already exists → just render
    if (existingPin) {
      setIsReady(true);
      return;
    }

    // ✅ Auto detect location
    if (navigator.geolocation) {
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
              // ✅ Save pincode
              localStorage.setItem("pincode", pincode);

              // ✅ Create address object
              const detectedAddress = {
                fullName: "",
                phone: "",
                addressLine: "Your Location",
                landmark: "",
                city: data.city || data.locality,
                state: data.principalSubdivision,
                postalCode: pincode,
              };

              // ✅ Correct userId handling
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

              // ✅ Update UI instantly
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
      );
    } else {
      setIsReady(true);
    }
  }, []);

  // ⛔ prevent SSR mismatch
  if (!isReady) return null;

  return (
    <>
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
