import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getBookSession, 
  setEmail as saveEmail, 
  setBookId, 
  setAuthToken,
  prepareBookCreationData 
} from "@/lib/bookSession";

const EmailCapture = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContinue = async () => {
    if (!isValidEmail(email)) return;

    setIsLoading(true);
    setError(null);

    // Save email to session
    saveEmail(email);

    try {
      // Get all data from session storage
      const session = getBookSession();
      if (!session) {
        throw new Error("Sessione non trovata. Riprova dall'inizio.");
      }

      const bookData = prepareBookCreationData();
      if (!bookData) {
        throw new Error("Dati del libro non trovati");
      }

      const { characters, customization, isGift, genre, occasion } = bookData;
      const name = session.character?.name || "";

      // Create book draft via API
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      
      // First, register/login the user (simplified for demo)
      const authResponse = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "TempPass123!", // In production, handle this better
          name: isGift ? "Gift Giver" : name,
        }),
      });

      let token = "";
      let userId = "";
      if (authResponse.ok) {
        const authData = await authResponse.json();
        token = authData.data.token;
        userId = authData.data.user.id;
        localStorage.setItem("authToken", token);
        setAuthToken(token);
      } else {
        // Try login if register fails (user might exist)
        const loginResponse = await fetch(`${apiUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: "TempPass123!" }),
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          token = loginData.data.token;
          userId = loginData.data.user.id;
          localStorage.setItem("authToken", token);
          setAuthToken(token);
        } else {
          throw new Error("Impossibile autenticare l'utente");
        }
      }

      // Create book draft (backend generates real MongoDB ID)
      const bookResponse = await fetch(`${apiUrl}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `La Storia di ${name}`,
          genre,
          occasion,
          characters,
          customization,
        }),
      });

      if (!bookResponse.ok) {
        throw new Error("Errore nella creazione del libro");
      }

      const bookDataResponse = await bookResponse.json();
      const bookId = bookDataResponse.data.id; // This is the REAL MongoDB ID from backend

      // Save book ID to session
      setBookId(bookId);

      // Navigate to title selection (no URL params needed)
      navigate("/title-selection");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Si è verificato un errore");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Back button */}
       <div className="p-4 relative z-10">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        {/* Mail icon */}
        <div className="w-20 h-20 bg-coral-light rounded-full flex items-center justify-center mb-8">
          <Mail className="h-10 w-10 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
          Inserisci la Tua Email
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-8 max-w-md">
          Ricevi un link per continuare da qualsiasi dispositivo
        </p>

        {/* Email input */}
        <div className="w-full max-w-md">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="la.tua@email.com"
            className="w-full px-4 py-6 text-base text-center border border-gray-200 rounded-xl focus:border-primary focus:ring-primary"
            disabled={isLoading}
          />

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <Button
            onClick={handleContinue}
            disabled={!isValidEmail(email) || isLoading}
            className={cn(
              "w-full mt-4 py-6 rounded-xl text-base transition-all",
              isValidEmail(email) && !isLoading
                ? "bg-primary hover:bg-coral-dark text-white"
                : "bg-primary/50 text-white cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creazione in corso...
              </>
            ) : (
              "Continua"
            )}
          </Button>

          {/* Terms */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Continuando, accetti i nostri{" "}
            <a href="/terms" className="text-primary hover:underline">
              Termini
            </a>{" "}
            e la{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailCapture;
