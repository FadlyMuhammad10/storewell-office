import Image from "next/image";
import Link from "next/link";

export default function GallerySection() {
  return (
    <section className="page-container py-16 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-primary text-2xl font-medium">Share by You</h2>
        <Link href={"/"} className="group inline-flex items-center gap-1">
          <p className="text-xs capitalize font-semibold text-primary group-hover:underline">
            @storewell_official
          </p>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="relative overflow-hidden w-56 h-56">
            <Image
              src={"/images/category.png"}
              alt={"alt"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
