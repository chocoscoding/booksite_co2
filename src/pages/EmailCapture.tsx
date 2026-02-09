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
import { guestApi } from "@/lib/api";

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

      // Step 1: Create book draft via guest API (no auth required)
      const createResult = await guestApi.createBook({
        genre: genre || "comedy",
        occasion,
        characters: characters.map((c) => ({
          name: c.name,
          role: (c.role as "protagonist" | "supporting" | "antagonist") || "protagonist",
          description: c.description,
          personality: c.personality,
        })),
        customization: {
          tone: customization.tone as "funny" | "heartfelt" | "adventurous" | "educational" | "romantic",
          pageCount: customization.pageCount,
          includeIllustrations: customization.includeIllustrations,
          recipientName: customization.recipientName,
          recipientRelationship: customization.recipientRelationship,
          dedicationMessage: customization.dedicationMessage,
          specialMessages: customization.specialMessages as string[] | undefined,
        },
      });

      if (!createResult.success || !createResult.data) {
        throw new Error(createResult.error || "Errore nella creazione del libro");
      }

      const bookId = createResult.data.id;

      // Step 2: Capture email — links book to a user account and returns a JWT
      const captureResult = await guestApi.captureEmail(
        bookId,
        email,
        isGift ? "Gift Giver" : name
      );

      if (!captureResult.success || !captureResult.data) {
        throw new Error(captureResult.error || "Errore nel salvataggio dell'email");
      }

      const { token } = captureResult.data;

      // Save book ID and auth token to session
      setBookId(bookId);
      setAuthToken(token);
      localStorage.setItem("authToken", token);

      // Navigate to title selection
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
