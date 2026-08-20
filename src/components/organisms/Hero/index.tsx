import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[800px] overflow-hidden">
      <Image
        src="/images/confident-man-in-urban-streetwear-with-shopping-ba.jpg"
        alt="Urban Fashion"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-center page-container gap-3.5">
        <p className="text-6xl font-semibold text-start">
          THE NEW <br />
          ELEGANCE
        </p>
        <div className="flex gap-4">
          <Button
            className="uppercase bg-primary rounded-md font-light text-white"
            size="lg"
          >
            Shop Now
          </Button>
          <Button
            variant={"outline"}
            className="uppercase bg-primary rounded-md font-light text-white"
            size="lg"
          >
            View Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}
