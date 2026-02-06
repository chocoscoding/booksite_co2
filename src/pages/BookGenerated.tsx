import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Loader2 } from "lucide-react";

const BookGenerated = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const name = searchParams.get("name") || "il tuo personaggio";

  useEffect(() => {
    // Simulate book generation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        {/* Loading spinner */}
        <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>

        {/* Loading text */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
          Stiamo creando il tuo libro...
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          La nostra IA sta creando una storia unica e personalizzata per {name}. Ci vorrà solo un momento!
        </p>

        {/* Loading bar */}
        <div className="w-full max-w-md mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
      {/* Success icon */}
      <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center mb-8">
        <CheckCircle className="h-14 w-14 text-primary" />
      </div>

      {/* Success text */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
        Libro Generato!
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Il tuo libro personalizzato su {name} è pronto! Ti abbiamo inviato un'email con il link per visualizzarlo.
      </p>

      {/* Book preview placeholder */}
      <div className="w-48 h-64 bg-white rounded-xl shadow-lg flex items-center justify-center mb-8 border border-gray-100">
        <BookOpen className="h-16 w-16 text-primary" />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          onClick={handleGoHome}
          className="flex-1 py-6 bg-primary hover:bg-coral-dark text-white rounded-xl"
        >
          Torna alla Home
        </Button>
        <Button
          onClick={() => navigate("/gift-occasion")}
          variant="outline"
          className="flex-1 py-6 border-primary text-primary hover:bg-coral-light rounded-xl"
        >
          Crea un Altro Libro
        </Button>
      </div>
    </div>
  );
};

export default BookGenerated;
