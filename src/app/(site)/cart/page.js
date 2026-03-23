import CartHeader from "@/components/cart/CartHeader";
import CartList from "@/components/cart/CartList";
import DeliveryCard from "@/components/cart/DeliveryCard";
import CouponCard from "@/components/cart/CouponCard";
import OrderSummary from "@/components/cart/OrderSummary";
import TrustSection from "@/components/cart/TrustSection";
import RecentlyPurchased from "@/components/home/RecentlyPurchased";
import CheckoutBar from "@/components/cart/CheckoutBar";

export default function CartPage() {
  return (
    <div className="bg-white min-h-screen">
      <CartHeader />
      <CartList />
      <DeliveryCard />
      <CouponCard />
      <OrderSummary />
      <TrustSection />
      <RecentlyPurchased />
      <CheckoutBar />
    </div>
  );
}
