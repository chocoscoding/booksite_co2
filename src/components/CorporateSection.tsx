import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const CorporateSection = () => {
  return (
    <section className="py-20 bg-navy text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-coral" />
            <span className="text-coral font-semibold">Per Team e Aziende</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cerchi Regali Aziendali?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Aumenta il morale del team e celebra i tuoi collaboratori con libri personalizzati con il branding della tua azienda. Sconti esclusivi per ordini in grandi quantità.
          </p>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-navy"
          >
            Scopri i Regali Aziendali
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CorporateSection;
