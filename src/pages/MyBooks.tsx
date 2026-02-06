import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Mail,
  BookOpen,
  Eye,
  CreditCard,
  Download,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

interface BookOrder {
  id: string;
  status: string;
  total: number;
  currency: string;
  paidAt: string | null;
  orderNumber: string;
}

interface BookItem {
  id: string;
  title: string;
  subtitle?: string;
  genre: string;
  occasion?: string;
  coverImageUrl?: string;
  previewCoverUrl?: string;
  status: string;
  previewGenerated: boolean;
  createdAt: string;
  generatedAt?: string;
  isPaid: boolean;
  order: BookOrder | null;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const MyBooks = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyTokenAndLoadBooks(token);
    }
  }, [token]);

  const verifyTokenAndLoadBooks = async (tokenToVerify: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Verify the token
      const verifyRes = await fetch(
        `${API_URL}/api/magic-link/verify?token=${encodeURIComponent(tokenToVerify)}`
      );
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error || "Link non valido o scaduto.");
        setIsLoading(false);
        return;
      }

      // Load books
      const booksRes = await fetch(
        `${API_URL}/api/magic-link/books?token=${encodeURIComponent(tokenToVerify)}`
      );
      const booksData = await booksRes.json();

      if (!booksRes.ok || !booksData.success) {
        setError(booksData.error || "Errore nel caricamento dei libri.");
        setIsLoading(false);
        return;
      }

      setBooks(booksData.data);
      setIsAuthenticated(true);
      // Store token for later use
      sessionStorage.setItem("magicLinkToken", tokenToVerify);
    } catch (err) {
      console.error("Verification error:", err);
      setError("Errore di rete. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendMagicLink = async () => {
    if (!isValidEmail(email)) return;

    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/magic-link/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Errore nell'invio del link.");
        return;
      }

      setEmailSent(true);
    } catch (err) {
      console.error("Send magic link error:", err);
      setError("Errore di rete. Riprova più tardi.");
    } finally {
      setIsSending(false);
    }
  };

  const handleViewPreview = (book: BookItem) => {
    const magicToken = sessionStorage.getItem("magicLinkToken") || token;
    navigate(`/book-preview?bookId=${book.id}&token=${magicToken}`);
  };

  const handlePayBook = (book: BookItem) => {
    const magicToken = sessionStorage.getItem("magicLinkToken") || token;
    navigate(`/book-preview?bookId=${book.id}&token=${magicToken}&action=pay`);
  };

  const handleDownloadBook = async (book: BookItem) => {
    const magicToken = sessionStorage.getItem("magicLinkToken") || token;
    // Redirect to download
    window.location.href = `${API_URL}/api/book-access/book?token=${encodeURIComponent(magicToken || "")}`;
  };

  const getStatusBadge = (book: BookItem) => {
    if (book.isPaid && book.status === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Pronto per il download
        </span>
      );
    }
    if (book.isPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          <Clock className="w-3 h-3" />
          In elaborazione
        </span>
      );
    }
    if (book.previewGenerated) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
          <Eye className="w-3 h-3" />
          Anteprima disponibile
        </span>
      );
    }
    if (book.status === "DRAFT") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
          <Clock className="w-3 h-3" />
          Bozza
        </span>
      );
    }
    if (book.status === "GENERATING" || book.status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
          <Loader2 className="w-3 h-3 animate-spin" />
          In generazione
        </span>
      );
    }
    if (book.status === "FAILED") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          Errore
        </span>
      );
    }
    return null;
  };

  const getActionButton = (book: BookItem) => {
    if (book.isPaid && book.status === "COMPLETED") {
      return (
        <Button
          onClick={() => handleDownloadBook(book)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Scarica
        </Button>
      );
    }
    if (book.previewGenerated && !book.isPaid) {
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => handleViewPreview(book)}
            variant="outline"
            className="border-gray-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Anteprima
          </Button>
          <Button
            onClick={() => handlePayBook(book)}
            className="bg-primary hover:bg-coral-dark text-white"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Acquista
          </Button>
        </div>
      );
    }
    if (book.status === "DRAFT") {
      return (
        <Button
          onClick={() => handleViewPreview(book)}
          variant="outline"
          className="border-gray-300"
        >
          Continua
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-20">
          <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center mb-8 animate-pulse">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Verifica in corso...
          </h1>
          <p className="text-gray-600 text-center">
            Stiamo verificando il tuo link di accesso.
          </p>
        </div>
      </div>
    );
  }

  // Authenticated - show books
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">I Miei Libri</h1>
          <p className="text-gray-600 mb-8">
            Visualizza, scarica o completa l'acquisto dei tuoi libri personalizzati.
          </p>

          {books.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Nessun Libro Trovato
              </h2>
              <p className="text-gray-600 mb-6">
                Non hai ancora creato nessun libro. Inizia subito!
              </p>
              <Button
                onClick={() => navigate("/gift-occasion")}
                className="bg-primary hover:bg-coral-dark text-white"
              >
                Crea il Tuo Primo Libro
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <Card key={book.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Book cover */}
                    <div className="w-24 h-32 bg-gradient-to-br from-primary to-coral-dark rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {book.coverImageUrl || book.previewCoverUrl ? (
                        <img
                          src={book.coverImageUrl || book.previewCoverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-8 h-8 text-white" />
                      )}
                    </div>

                    {/* Book info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 truncate">
                            {book.title}
                          </h3>
                          {book.subtitle && (
                            <p className="text-sm text-gray-500 truncate">
                              {book.subtitle}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(book)}
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
                        <span className="capitalize">{book.genre}</span>
                        {book.occasion && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{book.occasion}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>
                          Creato il{" "}
                          {new Date(book.createdAt).toLocaleDateString("it-IT")}
                        </span>
                      </div>

                      {/* Order info */}
                      {book.order && book.isPaid && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-700">
                            <strong>Ordine:</strong> {book.order.orderNumber} •{" "}
                            <strong>Pagato:</strong>{" "}
                            {book.order.total.toFixed(2)} {book.order.currency}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-end">
                        {getActionButton(book)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Email sent confirmation
  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-20">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
            <Mail className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Controlla la Tua Email
          </h1>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Abbiamo inviato un link di accesso a <strong>{email}</strong>.
            Clicca sul link nell'email per visualizzare i tuoi libri.
          </p>
          <p className="text-sm text-gray-500">
            Non hai ricevuto l'email?{" "}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary hover:underline"
            >
              Riprova
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Email input form (not authenticated, no token)
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-20">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Accedi ai Tuoi Libri
            </h1>
            <p className="text-gray-600">
              Inserisci la tua email per visualizzare i tuoi ordini
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Indirizzo Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@esempio.com"
                className="w-full"
              />
            </div>

            <Button
              onClick={handleSendMagicLink}
              disabled={!isValidEmail(email) || isSending}
              className={cn(
                "w-full py-6",
                isValidEmail(email) && !isSending
                  ? "bg-primary hover:bg-coral-dark text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Invia Link di Accesso
                </>
              )}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Ti invieremo un link sicuro per accedere ai tuoi libri
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyBooks;
