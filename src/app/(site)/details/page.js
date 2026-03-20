import ProductTop from "@/components/details/ProductTop";
import ProductHightlights from "@/components/details/ProductHighlights";
import RelatedProducts from "@/components/details/RelatedProducts";
import DeliveryBanner from "@/components/details/DeliveryBanner";
import YouCanAlsoTry from "@/components/details/YouCanAlsoTry";
import ReviewsSlider from "@/components/details/ReviewsSlider";
export default function Page() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <ProductTop />
      <ProductHightlights />
      <RelatedProducts />
      <DeliveryBanner />
      <YouCanAlsoTry />
      <ReviewsSlider />
    </div>
  );
}
