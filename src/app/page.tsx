import Banner from "@/components/home/Banner";
import FeaturedServices from "@/components/home/FeaturedServices";
import Categories from "@/components/home/Categories";
import WhyChoose from "@/components/home/WhyChoose";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      <Banner />
      <FeaturedServices />
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </main>
  );
}
