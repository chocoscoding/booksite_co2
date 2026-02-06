import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Genre {
  id: string;
  name: string;
  description: string;
  emoji: string;
  popular?: boolean;
}

const genres: Genre[] = [
  {
    id: "comedy",
    name: "Commedia",
    description: "Una storia esilarante garantita per farti ridere a crepapelle.",
    emoji: "😂",
    popular: true,
  },
  {
    id: "adventure",
    name: "Avventura",
    description: "Un viaggio emozionante nell'ignoto, pieno di sfide e scoperte.",
    emoji: "🗺️",
  },
  {
    id: "romance",
    name: "Romantico",
    description: "Una storia commovente di amore, passione e connessione emotiva.",
    emoji: "❤️",
  },
  {
    id: "mystery",
    name: "Mistero",
    description: "Una trama avvincente con indizi e enigmi da risolvere.",
    emoji: "🕵️",
  },
  {
    id: "memoir",
    name: "Memoir",
    description: "Un racconto personale e riflessivo di esperienze di vita reale.",
    emoji: "✍️",
  },
  {
    id: "drama",
    name: "Dramma",
    description: "Una narrazione emotiva e ricca di conflitti che esplora le relazioni umane.",
    emoji: "🎭",
  },
];

const GenreSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    if (selectedGenre) {
      // Preserve all existing params and add genre
      const newParams = new URLSearchParams(searchParams);
      newParams.set("genre", selectedGenre);
      navigate(`/email-capture?${newParams.toString()}`);
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
      <div className="flex-1 px-4 pb-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Seleziona un Genere
          </h1>
          <p className="text-gray-600">
            Il genere definisce il tono e lo stile della narrazione e delle illustrazioni della tua storia.
          </p>
        </div>

        {/* Genre grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={cn(
                "relative flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all",
                selectedGenre === genre.id
                  ? "border-primary bg-coral-light"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              {/* Popular badge */}
              {genre.popular && (
                <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                  ⭐ Popolare
                </span>
              )}

              {/* Emoji */}
              <span className="text-3xl">{genre.emoji}</span>

              {/* Content */}
              <div className="flex-1 pr-16">
                <h3 className={cn(
                  "font-bold text-lg mb-1",
                  selectedGenre === genre.id ? "text-primary" : "text-gray-900"
                )}>
                  {genre.name}
                </h3>
                <p className="text-gray-600 text-sm">{genre.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Continue button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedGenre}
          className={cn(
            "w-full py-6 rounded-lg text-base transition-all",
            selectedGenre
              ? "bg-primary hover:bg-coral-dark text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          Continua
        </Button>
      </div>
    </div>
  );
};

export default GenreSelection;
