import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Occasion {
  id: string;
  label: string;
  labelIt: string;
  emoji: string;
  hot?: boolean;
}

const occasions: Occasion[] = [
  { id: "birthday", label: "Birthday", labelIt: "Compleanno", emoji: "🎂" },
  { id: "anniversary", label: "Anniversary", labelIt: "Anniversario", emoji: "💕" },
  { id: "bachelorette", label: "Bachelorette", labelIt: "Addio al Nubilato", emoji: "🎉", hot: true },
  { id: "mothers_day", label: "Mother's Day", labelIt: "Festa della Mamma", emoji: "💐" },
  { id: "wedding", label: "Wedding", labelIt: "Matrimonio", emoji: "⛪" },
  { id: "retirement", label: "Retirement", labelIt: "Pensionamento", emoji: "🎊" },
  { id: "fathers_day", label: "Father's Day", labelIt: "Festa del Papà", emoji: "🏆" },
  { id: "valentines_day", label: "Valentine's Day", labelIt: "San Valentino", emoji: "💝" },
  { id: "graduation", label: "Graduation", labelIt: "Laurea", emoji: "🎓" },
  { id: "farewell", label: "Farewell", labelIt: "Addio", emoji: "👋" },
  { id: "new_baby", label: "New Baby", labelIt: "Nuovo Bebè", emoji: "👶" },
  { id: "just_because", label: "Just Because", labelIt: "Senza Motivo", emoji: "🤗" },
  { id: "roast", label: "Roast", labelIt: "Roast", emoji: "😂" },
];

const OccasionSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectOccasion = (occasionId: string) => {
    setSelectedOccasion(occasionId);
    // Navigate to character selection with the occasion
    const params = new URLSearchParams(searchParams);
    params.set("is_gift", "true");
    params.set("occasion", occasionId);
    navigate(`/character-selection?${params.toString()}`);
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
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Qual è l'occasione?
            </h1>
            <p className="text-gray-600">
              Questo ci aiuta a personalizzare l'esperienza per il tuo regalo unico.
            </p>
          </div>

          {/* Occasion grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {occasions.map((occasion) => (
              <button
                key={occasion.id}
                onClick={() => handleSelectOccasion(occasion.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-6 bg-white rounded-xl border-2 transition-all hover:shadow-md",
                  selectedOccasion === occasion.id
                    ? "border-primary bg-coral-light/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {/* Hot badge */}
                {occasion.hot && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Hot Now
                  </div>
                )}

                {/* Emoji */}
                <span className="text-4xl mb-3">{occasion.emoji}</span>

                {/* Label */}
                <span className="text-sm font-medium text-gray-900 text-center">
                  {occasion.labelIt}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccasionSelection;
