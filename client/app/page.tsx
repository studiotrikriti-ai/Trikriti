import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CustomSection from "@/components/home/CustomSection";
import WhyUs from "@/components/home/WhyUs";
import BlogTeaser from "@/components/home/BlogTeaser";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
     
      <FeaturedProducts />
      <WhyUs />
      <CustomSection />
      <CTABanner />
      <BlogTeaser />
    </>
  );
}
