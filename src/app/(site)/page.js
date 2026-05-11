"use client";

import { useState, useEffect } from "react";
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
import HomeReviewsSlider from "@/components/home/CustomerReviews";
import OurPromise from "@/components/home/OurPromise";
import SubscriptionDelivery from "@/components/home/Delivery";

export default function Home() {
	// 🔥 Always render immediately — products handle their own fetching
	return (
		<>
			<HomeTopSection />
			<DeliveryCard />
			<TodaysFresh />
			<BestSellers />
			<CategoriesSection />
			<BannerSection />
			<PromoBanner />
			<FlashSale />
			<OurStory />
			<RecentlyPurchased />
			<WhyChoose />
			<OurPromise/>
			<SubscriptionDelivery/>
			<HomeReviewsSlider />
		</>
	);
}
