import { Star } from "lucide-react";

const testimonials = [
  "Idea regalo - risolta!",
  "Il regalo più divertente di sempre!",
  "La sorpresa perfetta per l'anniversario!",
  "Ha fatto piangere mia madre di gioia!",
  "Non potevo credere fosse un libro vero!",
  "Il regalo più originale che abbia mai fatto!",
];

const TestimonialsMarquee = () => {
  return (
    <section className="py-12 bg-background overflow-hidden">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-primary fill-primary" />
          ))}
        </div>
        <p className="text-muted-foreground">4.9/5 dai nostri clienti felici</p>
      </div>

      <div className="relative">
        <div className="flex animate-marquee">
          {[...testimonials, ...testimonials].map((text, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-4 px-6 py-3 bg-card rounded-full border border-border shadow-soft"
            >
              <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">
                {text}
              </h2>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Persone Vere. Reazioni Vere.
        </h3>
        <p className="text-muted-foreground">
          Scopri perché migliaia di persone amano regalare un libro comico personalizzato.
        </p>
      </div>
    </section>
  );
};

export default TestimonialsMarquee;
