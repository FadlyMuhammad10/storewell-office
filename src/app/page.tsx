import BrandSection from "@/components/organisms/Brand";
import CategorySection from "@/components/organisms/Category";
import GallerySection from "@/components/organisms/Gallery";
import HeroSection from "@/components/organisms/Hero";
import ProductsSection from "@/components/organisms/Products";
import PromotialHero from "@/components/organisms/Promotial";
import TestimonialHero from "@/components/organisms/Testimonial";

export default function Home() {
  return (
    <div className="tracking-wide">
      <HeroSection />
      <div className="bg-[#F5F3F3]">
        <CategorySection />
      </div>
      <ProductsSection />
      <BrandSection />
      <PromotialHero />
      <div className="bg-[#EFEDED]">
        <TestimonialHero />
      </div>
      <GallerySection />
    </div>
  );
}
