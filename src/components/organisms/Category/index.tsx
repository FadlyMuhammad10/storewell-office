import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CategorySection() {
  return (
    <section className="page-container py-16 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-primary text-2xl font-medium">Shop by Category</h2>
        <Link
          href={"/products"}
          className="group inline-flex items-center gap-1"
        >
          <p className="text-xs capitalize font-semibold text-primary group-hover:underline">
            View All
          </p>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <Link
            href={"#"}
            className="space-y-2 items-center justify-center text-center"
            key={i}
          >
            <div className="relative overflow-hidden aspect-3/4">
              <Image
                src={"/images/category.png"}
                alt={"alt"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="uppercase text-xs font-semibold text-primary">
              Clothing
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
