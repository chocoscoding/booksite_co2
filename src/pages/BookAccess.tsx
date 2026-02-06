import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle, BookOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateBookSession } from "@/lib/bookSession";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface TokenPayload {
  bookId: string;
  userId: string;
  email: string;
  action: "preview" | "download" | "pay";
}

/**
 * BookAccess — handles JWT-authenticated access from email links.
 *
 * URL shape:  /book-access?token=<jwt>&action=preview|download|pay
 *
 * Flow:
 *  1. Verify the token against the backend.
 *  2. Depending on the action, redirect to or render the appropriate view.
 */
const BookAccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<
    "verifying" | "valid" | "expired" | "error"
  >("verifying");
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = searchParams.get("token");
  const action = searchParams.get("action") || "preview";

  // ── Verify token on mount ──
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Link non valido — nessun token trovato.");
      return;
    }

    verifyToken(token);
  }, [token]);

  const verifyToken = async (jwt: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/book-access/verify?token=${encodeURIComponent(jwt)}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("expired");
        setErrorMessage(
          data.error?.message || "Il link è scaduto o non è più valido."
        );
        return;
      }

      setPayload(data.data);
      setStatus("valid");

      // Store the book-access token so downstream pages can use it
      sessionStorage.setItem("bookAccessToken", jwt);
      
      // Also save bookId to session storage for consistent access
      updateBookSession({ 
        bookId: data.data.bookId,
        bookAccessToken: jwt 
      });

      // Redirect based on action
      redirectByAction(data.data, jwt);
    } catch {
      setStatus("error");
      setErrorMessage("Errore di rete — riprova più tardi.");
    }
  };

  const redirectByAction = (p: TokenPayload, jwt: string) => {
    // For email links, we still pass bookId and token in URL for backward compatibility
    // but session storage is the primary source now
    const params = new URLSearchParams();
    params.set("bookId", p.bookId);
    params.set("token", jwt);

    switch (p.action) {
      case "preview":
        navigate(`/book-preview?${params.toString()}`, { replace: true });
        break;
      case "pay":
        navigate(`/book-preview?${params.toString()}&pay=1`, {
          replace: true,
        });
        break;
      case "download":
        // Trigger download directly from the API
        window.location.href = `${API_URL}/api/book-access/book?token=${encodeURIComponent(jwt)}`;
        break;
      default:
        navigate(`/book-preview?${params.toString()}`, { replace: true });
    }
  };

  // ── Verifying state ──
  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Verifica in corso...
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Stiamo verificando il tuo link di accesso sicuro.
        </p>
      </div>
    );
  }

  // ── Expired / Invalid token ──
  if (status === "expired") {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-8">
          <ShieldCheck className="h-12 w-12 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Link scaduto
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-8">
          {errorMessage}
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-coral-dark text-white rounded-xl px-8 py-3"
        >
          Torna alla Home
        </Button>
      </div>
    );
  }

  // ── Generic error ──
  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Errore
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-8">
          {errorMessage}
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-coral-dark text-white rounded-xl px-8 py-3"
        >
          Torna alla Home
        </Button>
      </div>
    );
  }

  // ── Valid — brief flash while redirecting ──
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
        <BookOpen className="h-12 w-12 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Accesso verificato!
      </h1>
      <p className="text-gray-600 text-center max-w-md">
        Reindirizzamento in corso...
      </p>
    </div>
  );
};

export default BookAccess;
