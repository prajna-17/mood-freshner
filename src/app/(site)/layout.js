import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav"; // 👈 add this
import LowCoinsReminder from "@/components/LowCoinsReminder"; 

export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <LowCoinsReminder />   
      {children}
      <BottomNav /> {/* 👈 add here */}
      <Footer />
    </>
  );
}
