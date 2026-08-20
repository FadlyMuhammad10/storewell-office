import { Button } from "@/components/ui/button";
import React from "react";

export default function PromotialHero() {
  return (
    <div className="page-container py-16 space-y-10">
      <div className="bg-[#E9E1D9] rounded-lg flex flex-col items-center justify-center text-center p-20 space-y-5">
        <p className="text-[#4A4640] text-xs font-semibold">OUR PHILOSOPHY</p>
        <h2 className="text-[#1E1B16] font-medium text-3xl">
          &quot;Luxury is not about excess. It&apos;s about the <br /> resonance
          of a single, perfect object.&quot;
        </h2>
        <p className="text-lg font-normal text-[#4A4640]">
          Discover our commitment to sustainable craftsmanship and timeless
          design in <br />
          our latest sustainability journal.
        </p>
        <Button
          className="uppercase bg-primary font-light text-white rounded-md"
          size="lg"
        >
          Read The Journal
        </Button>
      </div>
    </div>
  );
}
