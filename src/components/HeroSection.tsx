import { Button } from "@/components/ui/button";
import { Gift, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookCarousel from "./BookCarousel";
import heroPerson1 from "@/assets/hero-person-1.jpg";
import heroPerson2 from "@/assets/hero-person-2.jpg";
import heroPerson3 from "@/assets/hero-person-3.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCreateBook = () => {
    navigate("/gift-occasion");
  };

  return (
    <section className="pt-32 pb-16 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <BookCarousel />
        
        <div className="text-center max-w-3xl mx-auto mt-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Stampa un Libro Comico Personalizzato in Pochi Minuti
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Rispondi a qualche domanda divertente, visualizza l'anteprima della storia su di loro, e noi stamperemo e spediremo il libro
          </p>
          
          <Button 
            onClick={handleCreateBook}
            size="lg" 
            className="bg-primary hover:bg-coral-dark text-primary-foreground text-lg px-8 py-6 shadow-coral"
          >
            Crea il Tuo Libro
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <span className="text-foreground font-medium">8.000+ libri personalizzati creati</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <span className="text-foreground font-medium">Valutato 4.9/5 dai nostri clienti</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-12 overflow-hidden">
          {[heroPerson3, heroPerson2, heroPerson3].map((img, index) => (
            <div
              key={index}
              className="w-48 h-64 md:w-56 md:h-72 rounded-xl overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105"
            >
              <img
                src={img}
                alt={`Persona felice con il libro ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
