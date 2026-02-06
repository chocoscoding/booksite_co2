import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Loader2,
  Sparkles,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewPage {
  chapterNumber: number;
  title: string;
  content: string;
}

interface PreviewData {
  title: string;
  subtitle?: string;
  previewPages: PreviewPage[];
  previewCoverUrl?: string;
  previewGenerated: boolean;
}

const BookPreview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 1-3 = pages
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bookId = searchParams.get("bookId");
  const name = searchParams.get("name") || "il tuo personaggio";

  useEffect(() => {
    if (!bookId) {
      setError("Nessun libro trovato");
      setIsLoading(false);
      return;
    }

    generatePreview();
  }, [bookId]);

  const generatePreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/books/${bookId}/preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella generazione dell'anteprima");
      }

      const result = await response.json();
      setPreviewData(result.data);
    } catch (err) {
      console.error("Preview generation error:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPages = (previewData?.previewPages?.length || 0) + 1; // +1 for cover
    if (currentPage < maxPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePurchase = () => {
    // Navigate to purchase flow with book ID
    const newParams = new URLSearchParams(searchParams);
    navigate(`/checkout?${newParams.toString()}`);
  };

  const handleRegenerate = () => {
    setPreviewData(null);
    generatePreview();
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
          Stiamo creando la tua anteprima...
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          La nostra IA sta generando le prime 3 pagine e la copertina del tuo
          libro personalizzato per {name}.
        </p>

        {/* Loading bar */}
        <div className="w-full max-w-md mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-loading-bar"></div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Ci vorrà circa 30-60 secondi...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <BookOpen className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
          Qualcosa è andato storto
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-8">{error}</p>

        <div className="flex gap-4">
          <Button onClick={handleBack} variant="outline" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>
          <Button
            onClick={generatePreview}
            className="bg-primary hover:bg-coral-dark rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  const totalPages = (previewData?.previewPages?.length || 0) + 1;
  const isOnCover = currentPage === 0;
  const currentPreviewPage = isOnCover
    ? null
    : previewData?.previewPages?.[currentPage - 1];

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-medium text-gray-900">Anteprima del Libro</span>
        </div>

        <Button
          onClick={handleRegenerate}
          variant="ghost"
          size="sm"
          className="text-gray-600"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Book preview */}
        <div className="w-full max-w-xl mb-8">
          {isOnCover ? (
            /* Cover Page */
            <Card className="aspect-[3/4] relative overflow-hidden rounded-2xl shadow-xl">
              {previewData?.previewCoverUrl ? (
                <img
                  src={previewData.previewCoverUrl}
                  alt="Book cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-coral-dark flex flex-col items-center justify-center p-8">
                  <BookOpen className="w-20 h-20 text-white mb-6" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                    {previewData?.title || "Il Tuo Libro"}
                  </h2>
                  {previewData?.subtitle && (
                    <p className="text-lg text-white/80 text-center">
                      {previewData.subtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Cover label */}
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  Copertina
                </span>
              </div>
            </Card>
          ) : (
            /* Content Page */
            <Card className="aspect-[3/4] relative overflow-hidden rounded-2xl shadow-xl bg-white p-6 md:p-8">
              <div className="h-full flex flex-col">
                {/* Page header */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <span className="text-sm text-primary font-medium">
                    Pagina {currentPage}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    {currentPreviewPage?.title || `Capitolo ${currentPage}`}
                  </h3>
                </div>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentPreviewPage?.content || "Contenuto della pagina..."}
                  </p>
                </div>

                {/* Page footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <span className="text-sm text-gray-400">
                    {currentPage} / 3
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Page navigation dots */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentPage === index
                  ? "w-6 bg-primary"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={handlePreviousPage}
            variant="outline"
            disabled={currentPage === 0}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Indietro
          </Button>

          <Button
            onClick={handleNextPage}
            variant="outline"
            disabled={currentPage === totalPages - 1}
            className="rounded-xl"
          >
            Avanti
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Preview notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mb-6">
          <p className="text-sm text-amber-800 text-center">
            <strong>Questa è solo un'anteprima!</strong> Il libro completo
            conterrà molte più pagine con la storia completa e tutte le
            illustrazioni.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 w-full max-w-md">
          <Button
            onClick={handlePurchase}
            size="lg"
            className="w-full py-6 bg-primary hover:bg-coral-dark text-white rounded-xl text-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Ordina il Libro Completo
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Ti è piaciuta l'anteprima? Acquista il libro completo e ricevilo a
            casa tua!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookPreview;
