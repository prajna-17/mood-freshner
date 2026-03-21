import HeaderSection from "@/components/products/HeaderSection";
import CategoryTabs from "@/components/products/CategoryTabs";
import ResultsBar from "@/components/products/ResultsBar";
import DealBanner from "@/components/products/DealBanner";
import ProductsGrid from "@/components/products/ProductsGrid";
import YouMayLike from "@/components/products/YouMayLike";

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen">
      {" "}
      <HeaderSection />
      <CategoryTabs />
      <ResultsBar />
      <DealBanner />
      <ProductsGrid />
      <YouMayLike />
    </div>
  );
}
