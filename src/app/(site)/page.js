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
import PincodeModal from "@/components/PincodeModal";

export default function Home() {
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const pincode = localStorage.getItem("pincode");

    if (!pincode) {
      setShowPincodeModal(true);
    }

    setIsReady(true); // ✅ important
  }, []);

  // ⛔ prevent render before client loads
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

      <PincodeModal
        isOpen={showPincodeModal}
        onSave={(pin) => {
          localStorage.setItem("pincode", pin);
          setShowPincodeModal(false);
          window.location.reload();
        }}
      />
    </>
  );
}
