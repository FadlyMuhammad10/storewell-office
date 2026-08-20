import { Star } from "lucide-react";

export default function TestimonialHero() {
  return (
    <div className="page-container py-16 space-y-10 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="inline-flex">
              <Star className="w-5 h-5" fill="black" />
            </div>
          ))}
          <p className="text-normal text-lg text-[#1B1C1C]">
            &quot;The quality of the cashmere is beyond anything I&apos;ve
            experienced. Storewell has become my only destination for elevated
            basics.&quot;
          </p>
          <p className="font-semibold text-xs text-[#444748]">— ELENA R.</p>
        </div>
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="inline-flex">
              <Star className="w-5 h-5" fill="black" />
            </div>
          ))}
          <p className="text-normal text-lg text-[#1B1C1C]">
            &quot;Exceptional service and timely delivery. The attention to
            detail in the packaging alone speaks volumes about the brand.&quot;
          </p>
          <p className="font-semibold text-xs text-[#444748]">— JULIAN M.</p>
        </div>
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="inline-flex">
              <Star className="w-5 h-5" fill="black" />
            </div>
          ))}
          <p className="text-normal text-lg text-[#1B1C1C]">
            &quot;Finally, a brand that understands that minimalism doesn&apos;t
            mean boring. Each piece feels intentional and unique.&quot;
          </p>
          <p className="font-semibold text-xs text-[#444748]">— SARAH K.</p>
        </div>
      </div>
    </div>
  );
}
