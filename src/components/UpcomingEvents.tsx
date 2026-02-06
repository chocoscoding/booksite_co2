import { Button } from "@/components/ui/button";
import { Heart, Users, Laugh, Calendar } from "lucide-react";

const events = [
  {
    icon: Heart,
    date: "14 Febbraio 2026",
    daysAway: "18 giorni",
    title: "San Valentino",
    description: "Crea una storia romantica che celebra il vostro amore e i ricordi condivisi.",
    urgency: "🚚 Ordina entro il 29 Gennaio per la consegna prima di San Valentino!",
    buttonText: "Inizia il Libro Regalo",
    accent: true,
  },
  {
    icon: Users,
    date: "11 Maggio 2026",
    daysAway: "105 giorni",
    title: "Festa della Mamma",
    description: "Celebra la mamma con un libro pieno di ricordi preziosi e storie dal cuore.",
    buttonText: "Inizia il Libro Regalo",
    accent: false,
  },
  {
    icon: Laugh,
    date: "Sempre è un buon momento!",
    title: "Prendi in Giro un Amico",
    description: "Qualsiasi giorno è perfetto per prendere in giro un buon amico. Trasforma le sue stranezze in un ricordo esilarante.",
    buttonText: "Inizia un Libro Roast",
    accent: false,
  },
];

const UpcomingEvents = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pianifica per i Prossimi Eventi
          </h2>
          <p className="text-lg text-muted-foreground">
            Non perdere mai l'occasione di fare il regalo perfetto e personale.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {events.map((event, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 ${
                event.accent 
                  ? 'bg-coral-light border-2 border-primary' 
                  : 'bg-card border border-border'
              } shadow-soft`}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{event.date}</span>
              </div>
              {event.daysAway && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-mint-light text-mint rounded-full mb-4">
                  tra {event.daysAway}
                </span>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  event.accent ? 'bg-primary' : 'bg-coral-light'
                }`}>
                  <event.icon className={`h-5 w-5 ${event.accent ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
              </div>
              
              <p className="text-muted-foreground mb-4">{event.description}</p>
              
              {event.urgency && (
                <p className="text-sm text-primary font-medium mb-4">{event.urgency}</p>
              )}
              
              <Button 
                className={`w-full ${
                  event.accent 
                    ? 'bg-primary hover:bg-coral-dark text-primary-foreground shadow-coral' 
                    : 'bg-foreground hover:bg-navy-light text-background'
                }`}
              >
                {event.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
