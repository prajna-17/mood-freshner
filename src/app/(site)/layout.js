import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav"; // 👈 add this

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <BottomNav /> {/* 👈 add here */}
      <Footer />
    </>
  );
}
