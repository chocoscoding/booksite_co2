import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Dog } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookSession, setCharacterData } from "@/lib/bookSession";

type CharacterType = "person" | "pet" | null;
type Gender = "female" | "male" | "non-binary" | "prefer-not-to-say" | null;

const CharacterSelection = () => {
  const navigate = useNavigate();
  const session = getBookSession();
  const isGift = session?.isGift ?? false;

  const [characterType, setCharacterType] = useState<CharacterType>("person");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [step, setStep] = useState<"type" | "gender">("type");

  const handleContinue = () => {
    if (characterType === "person" && step === "type" && name.trim()) {
      setStep("gender");
    } else if (characterType === "person" && step === "gender" && gender) {
      // Store character data in session and navigate
      setCharacterData({
        name: name.trim(),
        type: "person",
        gender: gender,
      });
      navigate("/questionnaire");
    } else if (characterType === "pet" && name.trim()) {
      // Store character data in session and navigate
      setCharacterData({
        name: name.trim(),
        type: "pet",
      });
      navigate("/questionnaire");
    }
  };

  const handleBack = () => {
    if (step === "gender") {
      setStep("type");
      setGender(null);
    } else {
      navigate("/gift-occasion");
    }
  };

  const canContinue = () => {
    if (characterType === "person") {
      if (step === "type") return name.trim().length > 0;
      if (step === "gender") return gender !== null;
    }
    if (characterType === "pet") return name.trim().length > 0;
    return false;
  };

  const genderOptions = [
    { value: "female" as Gender, label: "Femmina", icon: "♀" },
    { value: "male" as Gender, label: "Maschio", icon: "♂" },
    { value: "non-binary" as Gender, label: "Non binario", icon: "⚧" },
    { value: "prefer-not-to-say" as Gender, label: "Preferisco non dire", icon: "?" },
  ];

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
      <div className="flex-1 flex items-center justify-center px-4 -mt-20">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-sm">
          {characterType === "person" && step === "gender" ? (
            <>
              {/* Gender selection step */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Chi sarà il protagonista del libro?
              </h1>
              <p className="text-gray-600 mb-6">
                Usa chiunque tu voglia — un amico, un familiare, o anche te stesso.
              </p>

              {/* Name display */}
              <div className="mb-6">
                <Input
                  value={name}
                  readOnly
                  className="w-full px-4 py-3 text-base border border-primary rounded-lg bg-white"
                />
              </div>

              {/* Gender selection */}
              <p className="text-gray-700 font-medium mb-4">Seleziona un genere</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGender(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                      gender === option.value
                        ? "border-primary bg-coral-light"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Character type selection step */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {characterType === "pet" 
                  ? "Come si chiama il tuo animale?" 
                  : "Chi sarà il protagonista del libro?"}
              </h1>
              <p className="text-gray-600 mb-6">
                {characterType === "pet"
                  ? "Creeremo una storia deliziosa con protagonista il tuo adorato animale!"
                  : "Usa chiunque tu voglia — un amico, un familiare, o anche te stesso."}
              </p>

              {/* Type selector */}
              <p className="text-gray-700 font-medium mb-3">Questo libro parla di:</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setCharacterType("person")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all",
                    characterType === "person"
                      ? "border-primary bg-coral-light"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <User className={cn(
                    "h-8 w-8",
                    characterType === "person" ? "text-primary" : "text-gray-500"
                  )} />
                  <span className={cn(
                    "font-medium",
                    characterType === "person" ? "text-primary" : "text-gray-700"
                  )}>
                    Una Persona
                  </span>
                </button>
                <button
                  onClick={() => setCharacterType("pet")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all",
                    characterType === "pet"
                      ? "border-primary bg-coral-light"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Dog className={cn(
                    "h-8 w-8",
                    characterType === "pet" ? "text-primary" : "text-gray-500"
                  )} />
                  <span className={cn(
                    "font-medium",
                    characterType === "pet" ? "text-primary" : "text-gray-700"
                  )}>
                    Un Animale
                  </span>
                </button>
              </div>

              {/* Pet info box */}
              {characterType === "pet" && (
                <div className="bg-blue-100 border border-blue-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
                  <Dog className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-500">
                    <span className="font-semibold">Libro Animale:</span> Crea una storia divertente e illustrata con protagonista il tuo amico peloso (o piumato)!
                  </p>
                </div>
              )}

              {/* Name input */}
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={characterType === "pet" 
                  ? "Nome dell'animale (es. Max, Luna)" 
                  : "Nome completo del personaggio"}
                className="w-full px-4 py-3 text-base border border-gray-200 rounded-lg focus:border-primary focus:ring-primary"
              />
            </>
          )}

          {/* Continue button */}
          <Button
            onClick={handleContinue}
            disabled={!canContinue()}
            className={cn(
              "w-full mt-6 py-6 text-base rounded-lg transition-all",
              canContinue()
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

export default CharacterSelection;
