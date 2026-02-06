import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Come funziona?",
    answer: "È semplicissimo! Rispondi a una serie di domande divertenti sulla persona per cui vuoi creare il libro - le sue stranezze, passioni, momenti memorabili e personalità. La nostra IA poi genera una storia unica e comica basata sulle tue risposte. Puoi visualizzare l'anteprima, personalizzare la copertina e ordinare la stampa!",
  },
  {
    question: "Quanto tempo ci vuole?",
    answer: "Rispondere alle domande richiede circa 10-15 minuti. La generazione del libro è istantanea! Una volta ordinato, la stampa e la spedizione richiedono circa 7-10 giorni lavorativi in Italia, un po' di più per le spedizioni internazionali.",
  },
  {
    question: "Quanto costa?",
    answer: "Il libro parte da €39,99, che include la creazione personalizzata del contenuto, la stampa di alta qualità e la spedizione gratuita in tutto il mondo. Non ci sono costi nascosti!",
  },
  {
    question: "Quanto è lungo il libro?",
    answer: "Ogni libro è un tascabile di 240 pagine, con capitoli scritti professionalmente, illustrazioni e una copertina personalizzata. È un vero libro che sembra provenire da una casa editrice tradizionale!",
  },
  {
    question: "Posso personalizzare la copertina?",
    answer: "Assolutamente! Puoi scegliere tra diversi stili di copertina e la nostra IA genera illustrazioni uniche basate sui personaggi del tuo libro. Puoi anche inserire foto reali se preferisci.",
  },
  {
    question: "Dove spedite?",
    answer: "Spediamo in tutto il mondo! La spedizione è sempre gratuita, che tu sia in Italia, Europa o altrove. I tempi di consegna variano in base alla destinazione.",
  },
  {
    question: "È un vero libro stampato?",
    answer: "Sì, al 100%! Non è un e-book o un PDF. Riceverai un vero libro tascabile stampato professionalmente, con copertina lucida, pagine di qualità e rilegatura professionale. Perfetto da regalare e tenere per sempre!",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Domande Frequenti
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 shadow-soft"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
