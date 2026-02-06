import { Check } from "lucide-react";

const features = [
  {
    title: "Creazione Avanzata con IA",
    description: "Il nostro generatore di libri IA utilizza l'intelligenza artificiale all'avanguardia per trasformare le tue storie personali in libri scritti professionalmente. A differenza dei semplici modelli, la nostra IA crea narrazioni uniche su misura per ogni persona.",
  },
  {
    title: "Libri Personalizzati Semplici",
    description: "Creare libri personalizzati non è mai stato così facile. Rispondi semplicemente a domande divertenti sul tuo personaggio, e il nostro generatore IA si occupa del resto - dalla scrittura di capitoli avvincenti alla progettazione di copertine bellissime.",
  },
  {
    title: "Qualità Professionale",
    description: "Ogni libro personalizzato che creiamo è formattato professionalmente come un tascabile di 240 pagine. Il nostro generatore assicura che il tuo libro personalizzato appaia e sembri provenire da un editore tradizionale.",
  },
  {
    title: "Perfetto per Ogni Occasione",
    description: "Che tu abbia bisogno di libri personalizzati per compleanni, anniversari, o semplicemente perché, il nostro generatore IA crea il regalo personalizzato perfetto. Ogni libro è generato in modo unico e impossibile da replicare.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perché Scegliere il Nostro Generatore di Libri IA?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-soft border border-border"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-mint-light flex items-center justify-center mt-1">
                  <Check className="h-5 w-5 text-mint" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
