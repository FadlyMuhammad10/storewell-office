import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-black uppercase tracking-wider">
              <Zap className="h-4 w-4" />
              Urban Collection 2024
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-balance leading-tight text-white">
                GEAR UP
                <span className="text-accent block">YOUR STYLE</span>
              </h1>
              <p className="text-xl text-white/90 text-pretty max-w-lg font-medium">
                Premium streetwear and urban essentials for the modern man. Bold
                designs, quality materials, uncompromising style.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size="lg"
                className="group bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-4 rounded-lg"
              >
                SHOP NOW
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-4 rounded-lg bg-transparent"
              >
                VIEW CATALOG
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-12 pt-8 border-t-2 border-white/20">
              <div>
                <div className="text-3xl font-black text-accent">15K+</div>
                <div className="text-sm text-white/80 font-bold uppercase tracking-wide">
                  Customers
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-accent">800+</div>
                <div className="text-sm text-white/80 font-bold uppercase tracking-wide">
                  Products
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-accent">4.8</div>
                <div className="text-sm text-white/80 font-bold uppercase tracking-wide">
                  Rating
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-accent/30 to-primary/30 border-4 border-white/20">
              <img
                src="/images/confident-man-in-urban-streetwear-with-shopping-ba.jpg"
                alt="Urban fashion model with shopping bags"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
