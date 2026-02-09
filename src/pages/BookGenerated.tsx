import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Loader2, AlertCircle, Download, RefreshCw } from "lucide-react";
import { getBookSession, getAuthHeaders } from "@/lib/bookSession";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Status-aware messages for each generation phase
const STATUS_MESSAGES: Record<string, { title: string; subtitle: string }> = {
  DRAFT: { title: "Preparazione in corso...", subtitle: "Stiamo preparando il tuo libro per la generazione" },
  PENDING: { title: "In coda...", subtitle: "Il tuo libro è in attesa di essere generato" },
  GENERATING: { title: "Stiamo scrivendo la tua storia...", subtitle: "La nostra IA sta creando capitoli unici e personalizzati" },
  COVER_PENDING: { title: "Generando la copertina...", subtitle: "Stiamo creando un'illustrazione unica per il tuo libro" },
  UPLOADING: { title: "Ultimi ritocchi...", subtitle: "Stiamo preparando il PDF e caricando i file" },
  COMPLETED: { title: "Libro Generato!", subtitle: "Il tuo libro personalizzato è pronto per il download" },
  FAILED: { title: "Si è verificato un errore", subtitle: "La generazione del libro non è riuscita. Puoi riprovare." },
};

const POLL_INTERVAL = 4000; // 4 seconds

const BookGenerated = () => {
  const navigate = useNavigate();
  const session = getBookSession();
  const [bookStatus, setBookStatus] = useState<string>("DRAFT");
  const [error, setError] = useState<string | null>(null);
  const [generationStarted, setGenerationStarted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generationTriggered = useRef(false);

  const bookId = session?.bookId;
  const name = session?.character?.name || "il tuo personaggio";

  const isTerminal = bookStatus === "COMPLETED" || bookStatus === "FAILED";
  const isLoading = !isTerminal;

  const fetchBookStatus = useCallback(async () => {
    if (!bookId) return;

    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) throw new Error("Errore nel recupero dello stato");

      const data = await response.json();
      const book = data.data;

      setBookStatus(book.status);
      setPdfUrl(book.pdfUrl || null);
      setCoverImageUrl(book.coverImageUrl || null);

      // Stop polling once in a terminal state
      if (book.status === "COMPLETED" || book.status === "FAILED") {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, [bookId]);

  const startGeneration = useCallback(async () => {
    if (!bookId || generationTriggered.current) return;
    generationTriggered.current = true;

    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        // If already generating/completed, just poll for status
        if (response.status === 400) {
          setGenerationStarted(true);
          return;
        }
        throw new Error(errData.error || "Errore nell'avvio della generazione");
      }

      setGenerationStarted(true);
    } catch (err) {
      console.error("Generation start error:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      generationTriggered.current = false;
    }
  }, [bookId]);

  // Initial: fetch status & start generation if needed
  useEffect(() => {
    if (!bookId) {
      setError("Nessun libro trovato. Torna alla home e crea un nuovo libro.");
      return;
    }

    const init = async () => {
      // First check current status
      await fetchBookStatus();
    };

    init();
  }, [bookId, fetchBookStatus]);

  // After initial status fetch, decide whether to start generation
  useEffect(() => {
    if (!bookId || generationStarted) return;

    // Start generation if book is in a state that allows it
    if (bookStatus === "DRAFT" || bookStatus === "FAILED") {
      startGeneration();
    } else {
      // Already generating or completed
      setGenerationStarted(true);
    }
  }, [bookId, bookStatus, generationStarted, startGeneration]);

  // Start polling once generation has been triggered
  useEffect(() => {
    if (!generationStarted || isTerminal) return;

    pollRef.current = setInterval(fetchBookStatus, POLL_INTERVAL);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [generationStarted, isTerminal, fetchBookStatus]);

  const handleRetry = () => {
    setError(null);
    setBookStatus("DRAFT");
    generationTriggered.current = false;
    setGenerationStarted(false);
    startGeneration();
  };

  const handleDownload = async () => {
    if (!bookId) return;
    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}/download`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data?.url) {
          window.open(data.data.url, "_blank");
        }
      }
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const statusInfo = STATUS_MESSAGES[bookStatus] || STATUS_MESSAGES.GENERATING;

  // Error state (no bookId)
  if (error && !bookId) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <AlertCircle className="h-14 w-14 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">{statusInfo.title}</h1>
        <p className="text-gray-600 text-center max-w-md mb-8">{error}</p>
        <Button
          onClick={() => navigate("/")}
          className="py-6 px-8 bg-primary hover:bg-coral-dark text-white rounded-xl"
        >
          Torna alla Home
        </Button>
      </div>
    );
  }

  // Loading / Generating state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
          {statusInfo.title}
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          {statusInfo.subtitle}
        </p>

        {/* Progress indicator */}
        <div className="w-full max-w-md mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full bg-primary rounded-full transition-all duration-1000",
                bookStatus === "PENDING" && "w-[10%]",
                bookStatus === "GENERATING" && "w-[50%]",
                bookStatus === "COVER_PENDING" && "w-[75%]",
                bookStatus === "UPLOADING" && "w-[90%]",
                bookStatus === "DRAFT" && "w-[5%] animate-pulse",
              )}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {bookStatus === "GENERATING" && "Questo può richiedere qualche minuto..."}
            {bookStatus === "COVER_PENDING" && "Quasi pronto..."}
            {bookStatus === "UPLOADING" && "Finalizzazione in corso..."}
          </p>
        </div>
      </div>
    );
  }

  // Failed state
  if (bookStatus === "FAILED") {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <AlertCircle className="h-14 w-14 text-red-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
          {statusInfo.title}
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-8">
          {statusInfo.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button
            onClick={handleRetry}
            className="flex-1 py-6 bg-primary hover:bg-coral-dark text-white rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Riprova
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex-1 py-6 border-primary text-primary hover:bg-coral-light rounded-xl"
          >
            Torna alla Home
          </Button>
        </div>
      </div>
    );
  }

  // Completed state
  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
      <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center mb-8">
        <CheckCircle className="h-14 w-14 text-primary" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
        Libro Generato!
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        Il tuo libro personalizzato su {name} è pronto!
      </p>

      {/* Cover preview — 1024x1024 with 15% padding, shown as portrait */}
      {coverImageUrl ? (
        <div className="w-72 sm:w-80 md:w-96 aspect-[2/3] rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-100 bg-black flex items-center justify-center">
          <img src={coverImageUrl} alt="Cover" style={{ height: '100%', width: 'auto', objectFit: 'cover', maxHeight: '100%' }} className="max-h-full object-cover" />
        </div>
      ) : (
        <div className="w-72 sm:w-80 md:w-96 aspect-[2/3] bg-white rounded-xl shadow-lg flex items-center justify-center mb-8 border border-gray-100">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        {pdfUrl && (
          <Button
            onClick={handleDownload}
            className="flex-1 py-6 bg-primary hover:bg-coral-dark text-white rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Scarica il Libro
          </Button>
        )}
        <Button
          onClick={() => navigate("/book-preview")}
          variant="outline"
          className="flex-1 py-6 border-primary text-primary hover:bg-coral-light rounded-xl"
        >
          Visualizza Anteprima
        </Button>
        <Button
          onClick={() => navigate("/gift-occasion")}
          variant="outline"
          className="flex-1 py-6 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl"
        >
          Crea un Altro Libro
        </Button>
      </div>
    </div>
  );
};

export default BookGenerated;
