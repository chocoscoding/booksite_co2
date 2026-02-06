import { Truck, Award, Sparkles } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Spedizione gratuita",
  },
  {
    icon: Award,
    title: "Stampa di alta qualità",
  },
  {
    icon: Sparkles,
    title: "Sempre unico",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-mint-light">
                <badge.icon className="h-5 w-5 text-mint" />
              </div>
              <span className="font-semibold text-foreground">{badge.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
