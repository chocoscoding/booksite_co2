import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EmailCapture = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

    try {
      // Get all the collected data from URL params
      const name = searchParams.get("name") || "";
      const characterType = searchParams.get("type") || "person";
      const gender = searchParams.get("gender") || "";
      const occasion = searchParams.get("occasion") || "";
      const genre = searchParams.get("genre") || "";
      const isGift = searchParams.get("is_gift") === "true";

      // Get questionnaire answers from params
      const answers: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        if (!["name", "type", "gender", "occasion", "genre", "is_gift"].includes(key)) {
          answers[key] = value;
        }
      });

      // Build character info
      const characters = [
        {
          name,
          role: "protagonist" as const,
          description: answers.personality || "",
          personality: answers.quirks ? [answers.quirks] : [],
        },
      ];

      // Build customization
      const customization = {
        genre,
        occasion,
        tone: genre === "comedy" ? "funny" : genre === "romance" ? "romantic" : "adventurous",
        pageCount: 20,
        includeIllustrations: true,
        recipientName: name,
        recipientRelationship: isGift ? "gift recipient" : "self",
        dedicationMessage: answers.memorable_moment || "",
        specialMessages: [answers.dreams, answers.hobbies].filter(Boolean),
      };

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
      if (authResponse.ok) {
        const authData = await authResponse.json();
        token = authData.data.accessToken;
        localStorage.setItem("authToken", token);
      } else {
        // Try login if register fails (user might exist)
        const loginResponse = await fetch(`${apiUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: "TempPass123!" }),
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          token = loginData.data.accessToken;
          localStorage.setItem("authToken", token);
        } else {
          throw new Error("Impossibile autenticare l'utente");
        }
      }

      // Create book draft
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

      const bookData = await bookResponse.json();
      const bookId = bookData.data.id;

      // Navigate to preview with book ID
      const newParams = new URLSearchParams(searchParams);
      newParams.set("email", email);
      newParams.set("bookId", bookId);
      navigate(`/book-preview?${newParams.toString()}`);
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
      <div className="p-4">
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
