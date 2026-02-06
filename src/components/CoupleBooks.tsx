import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import coupleBook1 from "@/assets/couple-book-1.jpg";
import coupleBook2 from "@/assets/couple-book-2.png";
import coupleBook3 from "@/assets/couple-book-3.jpg";
import coupleBook4 from "@/assets/couple-book-4.jpg";

const coupleBooks = [
  { src: coupleBook1, alt: "Il selfie che ha dato inizio a tutto" },
  { src: coupleBook2, alt: "La regina del buonumore" },
  { src: coupleBook3, alt: "Due persone una cucina zero calma" },
  { src: coupleBook4, alt: "Il caffè la pioggia e noi" },
];

const CoupleBooks = () => {
  return (
    <section className="py-20 bg-coral-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-primary fill-primary" />
          <span className="text-primary font-semibold">Libri di Coppia</span>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Celebra la Vostra Storia d'Amore
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trasforma i momenti più divertenti della vostra relazione in un libro personalizzato
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {coupleBooks.map((book, index) => (
            <div
              key={index}
              className="w-40 h-56 md:w-48 md:h-64 rounded-lg overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-2"
            >
              <img
                src={book.src}
                alt={book.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mb-4 text-sm">Scorri per vedere altri esempi</p>

        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-coral-dark text-primary-foreground shadow-coral">
            Crea il Libro di Coppia per San Valentino
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            🚚 Ordina entro il 29 Gennaio per la consegna prima di San Valentino!
          </p>
        </div>
      </div>
    </section>
  );
};

export default CoupleBooks;
