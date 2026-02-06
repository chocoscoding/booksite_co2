import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">RegalaLibro</span>
        </div>
        <Button 
          onClick={() => navigate("/gift-occasion")}
          className="bg-primary hover:bg-coral-dark text-primary-foreground shadow-coral"
        >
          Crea il Tuo Libro
        </Button>
      </div>
    </header>
  );
};

export default Header;
