import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, RefreshCw, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookSession, setTitle, getAuthHeaders } from "@/lib/bookSession";

interface TitleVariant {
  title: string;
  subtitle: string;
}

const TitleSelection = () => {
  const navigate = useNavigate();
  const session = getBookSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [titleVariants, setTitleVariants] = useState<TitleVariant[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bookId = session?.bookId;
  const name = session?.character?.name || "";

  useEffect(() => {
    if (bookId) {
      generateTitles();
    } else {
      setError("Nessun libro trovato");
      setIsLoading(false);
    }
  }, [bookId]);

  const generateTitles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/books/${bookId}/generate-titles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Errore nella generazione dei titoli");
      }

      const result = await response.json();
      setTitleVariants(result.data.titles);
    } catch (err) {
      console.error("Title generation error:", err);
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setSelectedIndex(null);
    setUseCustom(false);
    generateTitles();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectVariant = (index: number) => {
    setSelectedIndex(index);
    setUseCustom(false);
  };

  const handleUseCustom = () => {
    setUseCustom(true);
    setSelectedIndex(null);
  };

  const handleContinue = async () => {
    let finalTitle: string;
    let finalSubtitle: string | undefined;

    if (useCustom) {
      if (!customTitle.trim()) return;
      finalTitle = customTitle.trim();
      finalSubtitle = customSubtitle.trim() || undefined;
    } else if (selectedIndex !== null) {
      const selected = titleVariants[selectedIndex];
      finalTitle = selected.title;
      finalSubtitle = selected.subtitle;
    } else {
      return;
    }

    // Save title to session
    setTitle(finalTitle, finalSubtitle);

    // Update the book draft with the selected title
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/books/${bookId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            title: finalTitle,
            customization: finalSubtitle ? { subtitle: finalSubtitle } : undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore nel salvataggio del titolo");
      }

      // Navigate to cover selection (no URL params needed)
      navigate("/cover-selection");
    } catch (err) {
      console.error("Save title error:", err);
      setError(err instanceof Error ? err.message : "Errore nel salvataggio");
    }
  };

  const canContinue = useCustom ? customTitle.trim().length > 0 : selectedIndex !== null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
          Stiamo creando i titoli perfetti...
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          La nostra IA sta generando alcune opzioni di titolo creative per il tuo libro.
        </p>
      </div>
    );
  }

  if (error && titleVariants.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          Qualcosa è andato storto
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-8">{error}</p>
        <Button onClick={handleBack} variant="outline" className="rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Indietro
        </Button>
      </div>
    );
  }

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
      <div className="flex-1 px-4 pb-8 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Scegli il Titolo Perfetto
          </h1>
          <p className="text-gray-600">
            Abbiamo creato alcune opzioni in base alle tue risposte. Tocca il tuo preferito.
          </p>
        </div>

        {/* Title variants */}
        <div className="space-y-4 mb-6">
          {titleVariants.map((variant, index) => (
            <button
              key={index}
              onClick={() => handleSelectVariant(index)}
              className={cn(
                "w-full text-left p-5 rounded-xl border-2 transition-all",
                selectedIndex === index
                  ? "border-primary bg-coral-light"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={cn(
                    "font-bold text-lg mb-1",
                    selectedIndex === index ? "text-primary" : "text-gray-900"
                  )}>
                    {variant.title}
                  </h3>
                  <p className="text-gray-600 text-sm italic">
                    "{variant.subtitle}"
                  </p>
                </div>
                {selectedIndex === index && (
                  <Check className="w-5 h-5 text-primary flex-shrink-0 ml-3" />
                )}
              </div>
            </button>
          ))}

          {/* Custom title option */}
          <button
            onClick={handleUseCustom}
            className={cn(
              "w-full text-left p-5 rounded-xl border-2 transition-all",
              useCustom
                ? "border-primary bg-coral-light"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className={cn(
                  "w-5 h-5",
                  useCustom ? "text-primary" : "text-gray-500"
                )} />
              </div>
              <div>
                <h3 className={cn(
                  "font-bold text-lg",
                  useCustom ? "text-primary" : "text-gray-900"
                )}>
                  Scrivi il Tuo Titolo
                </h3>
                <p className="text-gray-500 text-sm">Crea un titolo completamente personalizzato</p>
              </div>
            </div>
          </button>

          {/* Custom title inputs */}
          {useCustom && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titolo *
                </label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Libro Senza Titolo"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sottotitolo (opzionale)
                </label>
                <Input
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder="Inserisci un sottotitolo (opzionale)"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleRegenerate}
            variant="outline"
            disabled={isRegenerating}
            className="rounded-xl border-gray-300"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRegenerating && "animate-spin")} />
            Rigenera
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className={cn(
              "flex-1 py-6 rounded-xl transition-all",
              canContinue
                ? "bg-primary hover:bg-coral-dark text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            Continua
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TitleSelection;
