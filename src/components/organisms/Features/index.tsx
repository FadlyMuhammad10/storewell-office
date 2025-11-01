import { Card, CardContent } from "@/components/ui/card";
import { Award, RotateCcw, Shield, Truck } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "FREE DELIVERY",
      description:
        "Lightning-fast shipping on orders over $75. Get your gear delivered nationwide.",
    },
    {
      icon: Shield,
      title: "SECURE CHECKOUT",
      description:
        "Military-grade security for all transactions. Your data is protected.",
    },
    {
      icon: RotateCcw,
      title: "NO-HASSLE RETURNS",
      description:
        "30-day return guarantee. Don't like it? Send it back, no questions asked.",
    },
    {
      icon: Award,
      title: "PREMIUM QUALITY",
      description:
        "Only the finest materials and craftsmanship. Built to last, designed to impress.",
    },
  ];
  return (
    <section className="py-20 lg:py-28 bg-foreground/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-primary/20 shadow-lg hover:shadow-xl hover:border-accent transition-all duration-300 bg-card"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-black text-xl mb-4 text-foreground uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-medium text-pretty">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
