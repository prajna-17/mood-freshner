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

export default function Home() {
  return (
    <>
      <HomeTopSection />
      <DeliveryCard />
      {/* <BannerSection /> */}
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
