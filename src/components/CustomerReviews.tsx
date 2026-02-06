import { Star } from "lucide-react";
import reviewer1 from "@/assets/reviewer-1.jpg";
import reviewer2 from "@/assets/reviewer-2.jpg";
import reviewer3 from "@/assets/reviewer-3.jpg";

const reviews = [
  {
    quote: "Abbiamo risposto a qualche domanda sul mio migliore amico per il suo 30° compleanno, e il risultato è stato un libro esilarante, sorprendentemente toccante, pieno di tutte le nostre battute interne e ricordi. Era sbalordito. Il regalo migliore di sempre.",
    image: reviewer1,
    name: "Giulia R.",
    role: "Esperta di Regali",
  },
  {
    quote: "Per il nostro anniversario, ho raccolto storie della nostra relazione usando il questionario. Il libro ha trasformato i nostri piccoli momenti in un'epica storia d'amore. Mia moglie ha pianto di gioia. È il nostro ricordo più prezioso ora.",
    image: reviewer2,
    name: "Marco B.",
    role: "Marito Romantico",
  },
  {
    quote: "Ho fatto un libro per mia nonna, pieno di storie di famiglia e aneddoti divertenti. Il processo è stato così semplice, e vederla leggerlo, ridendo e ricordando, è stato impagabile. Ha dato vita alla storia della nostra famiglia.",
    image: reviewer3,
    name: "Sofia M.",
    role: "Storica di Famiglia",
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recensioni dei Clienti
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-soft border border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed italic">
                "{review.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
