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
  Download,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookSession, getAuthHeaders as getSessionAuthHeaders } from "@/lib/bookSession";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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

interface BookStatus {
  id: string;
  status: string;
  isPaid: boolean;
  pdfUrl?: string;
  coverImageUrl?: string;
}

const BookPreview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getBookSession();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 1-3 = pages
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [bookStatus, setBookStatus] = useState<BookStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Support both session storage and URL param for bookId (for email links)
  const bookId = session?.bookId || searchParams.get("bookId");
  const name = session?.character?.name || searchParams.get("name") || "il tuo personaggio";
  const emailToken = searchParams.get("token"); // JWT from email/magic link

  useEffect(() => {
    if (!bookId) {
      setError("Nessun libro trovato");
      setIsLoading(false);
      return;
    }

    loadBookAndPreview();
  }, [bookId]);

  const getAuthHeaders = (): Record<string, string> => {
    // Prefer email-link token, then session-based auth
    if (emailToken) {
      return { Authorization: `Bearer ${emailToken}` };
    }
    return getSessionAuthHeaders();
  };

  const loadBookAndPreview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, try to get existing preview
      const previewResponse = await fetch(
        `${API_URL}/api/books/${bookId}/preview`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      if (previewResponse.ok) {
        const previewResult = await previewResponse.json();
        setPreviewData(previewResult.data);
      } else {
        // Generate preview if not exists
        await generatePreview();
      }

      // Get book status to check if paid
      await fetchBookStatus();
    } catch (err) {
      console.error("Load error:", err);
      // Try to generate preview anyway
      await generatePreview();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const book = data.data;

        // Check if there's a paid order for this book
        const ordersResponse = await fetch(
          `${API_URL}/api/orders?bookId=${bookId}`,
          { headers: getAuthHeaders() }
        );

        let isPaid = false;
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          isPaid = ordersData.data?.some(
            (order: { status: string }) =>
              order.status === "PAID" ||
              order.status === "FULFILLED" ||
              order.status === "DELIVERED"
          );
        }

        setBookStatus({
          id: book.id,
          status: book.status,
          isPaid,
          pdfUrl: book.pdfUrl,
          coverImageUrl: book.coverImageUrl,
        });
      }
    } catch (err) {
      console.error("Failed to fetch book status:", err);
    }
  };

  const generatePreview = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error("Errore nella generazione dell'anteprima");
      }

      const result = await response.json();
      setPreviewData(result.data);
    } catch (err) {
      console.error("Preview generation error:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
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

  const handlePurchase = async () => {
    setIsCreatingOrder(true);

    try {
      // Create order
      const orderResponse = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          bookId,
          productId: "digital_book",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Errore nella creazione dell'ordine");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.data.id;

      // Create checkout session
      const checkoutResponse = await fetch(
        `${API_URL}/api/orders/${orderId}/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            returnUrl: `${window.location.origin}/i-miei-libri`,
          }),
        }
      );

      if (!checkoutResponse.ok) {
        throw new Error("Errore nella creazione del checkout");
      }

      const checkoutData = await checkoutResponse.json();

      // Redirect to payment page
      if (checkoutData.data.checkoutUrl) {
        window.location.href = checkoutData.data.checkoutUrl;
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : "Errore nell'acquisto");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}/download`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.url) {
          window.open(data.data.url, "_blank");
        }
      }
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleRegenerate = () => {
    setPreviewData(null);
    setIsLoading(true);
    generatePreview().then(() => setIsLoading(false));
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
  const isPaid = bookStatus?.isPaid || false;
  const isCompleted = bookStatus?.status === "COMPLETED";

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
          <span className="font-medium text-gray-900">
            {isPaid ? "Il Tuo Libro" : "Anteprima del Libro"}
          </span>
        </div>

        <Button
          onClick={handleRegenerate}
          variant="ghost"
          size="sm"
          className="text-gray-600"
          disabled={isPaid}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Paid badge */}
      {isPaid && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Libro acquistato</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Book preview */}
        <div className="w-full max-w-2xl mb-8">
          {isOnCover ? (
            /* Cover Page */
            <Card className="aspect-[3/4] relative overflow-hidden rounded-2xl shadow-xl">
              {previewData?.previewCoverUrl || bookStatus?.coverImageUrl ? (
                <img
                  src={bookStatus?.coverImageUrl || previewData?.previewCoverUrl}
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

        {/* CTA based on payment status */}
        {isPaid && isCompleted ? (
          /* Download CTA for paid users */
          <div className="flex flex-col gap-3 w-full max-w-md">
            <Button
              onClick={handleDownload}
              size="lg"
              className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Scarica il Libro Completo
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Il tuo libro è pronto! Clicca per scaricare il PDF completo.
            </p>
          </div>
        ) : isPaid ? (
          /* Generating CTA for paid but not completed */
          <div className="flex flex-col gap-3 w-full max-w-md">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-medium text-blue-800">
                    Libro in elaborazione
                  </p>
                  <p className="text-sm text-blue-600">
                    Stiamo generando il tuo libro completo. Ti invieremo
                    un'email quando sarà pronto!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Purchase CTA for unpaid users */
          <>
            {/* Preview notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mb-6">
              <p className="text-sm text-amber-800 text-center">
                <strong>Questa è solo un'anteprima!</strong> Il libro completo
                conterrà molte più pagine con la storia completa e tutte le
                illustrazioni.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
              <Button
                onClick={handlePurchase}
                disabled={isCreatingOrder}
                size="lg"
                className="w-full py-6 bg-primary hover:bg-coral-dark text-white rounded-xl text-lg"
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creazione ordine...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ordina il Libro Completo
                  </>
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Ti è piaciuta l'anteprima? Acquista il libro completo e ricevilo
                a casa tua!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookPreview;
