import HomeCarousel from "@/app/_HomeCarousel";
import Footer from "@/app/_Footer";
import Header from "@/app/_Header";
import { EmblaOptionsType } from "embla-carousel";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";

// Dynamically import the Japan inventory component with no SSR
const HomeJapanInventory = dynamic(() => import("@/app/HomeJapanInventory"), {
  ssr: false,
  loading: () => (
    <div className="w-full py-8 text-center">Loading Japan inventory...</div>
  ),
});

const OPTIONS: EmblaOptionsType = { loop: true };

const Home = () => {
  return (
    <div className="absolute left-0 top-0 w-screen overflow-y-auto">
      {/* Home section */}
      <div className="relative min-h-screen">
        <Header />
        <HomeCarousel options={OPTIONS} />
        <Footer />
      </div>

      {/* Japan inventory section */}
      <div className="mt-8 w-full border-t-2 border-gray-200 bg-gray-50 pt-8">
        <div className="py-4">
          <HomeJapanInventory />
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Home;
