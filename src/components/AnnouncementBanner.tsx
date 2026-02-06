import { Heart } from "lucide-react";

const AnnouncementBanner = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <Heart className="h-4 w-4 fill-current" />
        <span>Libri di Coppia – Ordina entro il 29 Gen per San Valentino →</span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
