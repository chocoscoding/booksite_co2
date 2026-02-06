import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookSession, setCoverType } from "@/lib/bookSession";

type CoverType = "photo" | "illustrated";

const CoverSelection = () => {
  const navigate = useNavigate();
  const session = getBookSession();
  const [selectedCover, setSelectedCover] = useState<CoverType>("photo");

  const bookId = session?.bookId;
  const name = session?.character?.name || "";

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    // Save cover type to session
    setCoverType(selectedCover);

    if (selectedCover === "photo") {
      // Go to photo upload
      navigate("/photo-upload");
    } else {
      // Go directly to book preview for illustrated cover
      navigate("/book-preview");
    }
  };

  const coverOptions = [
    {
      id: "photo" as CoverType,
      title: "Personalizzata con foto",
      description:
        "Trasforma la persona nella foto nella protagonista di una splendida copertina generata dall'IA.",
      icon: Camera,
      popular: true,
      image: "/covers/photo-cover-example.png",
    },
    {
      id: "illustrated" as CoverType,
      title: "Copertina illustrata",
      description:
        "Una bellissima copertina artistica IA basata sul tema del libro.",
      icon: Palette,
      popular: false,
      image: "/covers/illustrated-cover-example.png",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center border-b border-gray-200 bg-white">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Come vuoi la tua copertina?
            </h1>
            <p className="text-gray-600">
              Scegli una copertina basata su foto o una copertina artistica IA.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Stesso prezzo e qualità di stampa per entrambe le opzioni.
            </p>
          </div>

          {/* Cover options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {coverOptions.map((option) => (
              <Card
                key={option.id}
                onClick={() => setSelectedCover(option.id)}
                className={cn(
                  "relative p-6 cursor-pointer transition-all hover:shadow-lg",
                  selectedCover === option.id
                    ? "ring-2 ring-primary border-primary"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {/* Popular badge */}
                {option.popular && (
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    PIÙ POPOLARE
                  </div>
                )}

                {/* Selection indicator */}
                {selectedCover === option.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Cover preview */}
                <div className="flex justify-center mb-4 mt-6">
                  <div className="w-32 h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    {option.image ? (
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center",
                        option.image ? "hidden" : ""
                      )}
                    >
                      <option.icon className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Anteprima</span>
                    </div>
                  </div>
                </div>

                {/* Option details */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </Card>
            ))}
          </div>

          {/* Continue button */}
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleContinue}
              size="lg"
              className="w-full max-w-md py-6 bg-primary hover:bg-coral-dark text-white rounded-xl text-lg"
            >
              Continua
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Puoi cambiare lo stile della copertina prima di ordinare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverSelection;
