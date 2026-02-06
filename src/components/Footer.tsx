import { Button } from "@/components/ui/button";
import { BookOpen, Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto a Creare un Regalo Indimenticabile?
          </h2>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-coral-dark text-primary-foreground text-lg px-8 py-6 shadow-coral"
          >
            Crea il Tuo Libro
          </Button>
        </div>

        <div className="border-t border-white/20 pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">RegalaLibro</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Termini</a>
              <a href="#" className="hover:text-white transition-colors">Contatti</a>
            </div>
          </div>

          <p className="text-center text-white/50 text-sm mt-8">
            © 2026 RegalaLibro. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
