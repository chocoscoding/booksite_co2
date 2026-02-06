import { MessageCircleQuestion, Palette, Package } from "lucide-react";

const steps = [
  {
    icon: MessageCircleQuestion,
    number: "1",
    title: "Rispondi alle Domande",
    description: "Rispondi a domande guidate per catturare la personalità, le stranezze e i momenti chiave dei personaggi della tua storia.",
  },
  {
    icon: Palette,
    number: "2",
    title: "Scegli il Tuo Stile",
    description: "Scegli un genere, conferma i personaggi e progetta la copertina perfetta del tuo libro con illustrazioni generate dall'IA.",
  },
  {
    icon: Package,
    number: "3",
    title: "Ricevi il Tuo Libro",
    description: "Ricevi il tuo libro tascabile di 240 pagine stampato professionalmente con spedizione gratuita in tutto il mondo.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Come Funziona il Nostro Generatore di Libri IA
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Il modo più semplice per creare libri personalizzati con l'intelligenza artificiale
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-shadow duration-300 border border-border"
            >
              <div className="absolute -top-4 left-8 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                {step.number}
              </div>
              <div className="mb-6 mt-2">
                <div className="w-14 h-14 rounded-xl bg-coral-light flex items-center justify-center">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
