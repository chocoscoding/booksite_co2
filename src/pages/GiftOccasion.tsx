import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gift, ArrowLeft } from "lucide-react";

const GiftOccasion = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleGift = () => {
    navigate("/occasion-selection");
  };

  const handleForMe = () => {
    navigate("/character-selection?is_gift=false");
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        {/* Gift icon */}
        <div className="w-20 h-20 bg-coral-light rounded-full flex items-center justify-center mb-8">
          <Gift className="h-10 w-10 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
          Questo libro è un regalo?
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-10 max-w-md">
          Facci sapere se stai creando un regalo speciale per qualcuno.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleGift}
            className="bg-primary hover:bg-coral-dark text-white px-8 py-6 text-base rounded-full flex items-center gap-2"
          >
            <Gift className="h-5 w-5" />
            Sì, Crea un Regalo
          </Button>
          <Button
            onClick={handleForMe}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base rounded-full"
          >
            No, È per Me
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftOccasion;
