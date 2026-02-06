import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sparkles, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  placeholder: string;
  tip?: string;
}

const Questionnaire = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const characterType = searchParams.get("type") || "person";
  const gender = searchParams.get("gender") || "";
  const isGift = searchParams.get("is_gift") === "true";

  const personQuestions: Question[] = [
    {
      id: "personality",
      question: `Come descriveresti la personalità di ${name}?`,
      placeholder: "Sempre ottimista, fa ridere tutti, terribile nel ricordare i nomi...",
      tip: "Più dettagli condividi, più personalizzato e unico sarà il tuo libro! Non trattenerti — raccontaci tutto ciò che lo/la rende speciale.",
    },
    {
      id: "quirks",
      question: `Quali sono le stranezze divertenti di ${name}?`,
      placeholder: "Sempre ottimista e felice...",
    },
    {
      id: "memorable_moment",
      question: `Qual è un momento memorabile con ${name}?`,
      placeholder: "Sempre ottimista...",
    },
    {
      id: "hobbies",
      question: `Quali sono gli hobby di ${name}?`,
      placeholder: "Sempre ottimista...",
    },
    {
      id: "job",
      question: `Qual è il lavoro di ${name}?`,
      placeholder: "Sempre...",
    },
    {
      id: "best_friends",
      question: `Chi sono i migliori amici di ${name}?`,
      placeholder: "Sara del college che è una calciatrice...",
      tip: "Elenca ogni persona su una nuova riga con il nome, età, genere e relazione.",
    },
    {
      id: "family",
      question: `Chi sono i familiari di ${name}?`,
      placeholder: "Mamma che chiama ogni domenica alle 19, fratello Tom che gli deve ancora 20€...",
      tip: "Elenca ogni persona su una nuova riga con il nome, età, genere e relazione.",
    },
    {
      id: "dreams",
      question: `Qual è il più grande sogno di ${name}?`,
      placeholder: "Vuole aprire un food truck chiamato 'Taco Bout It' e viaggiare per il mondo...",
    },
  ];

  const petQuestions: Question[] = [
    {
      id: "personality",
      question: `Come descriveresti la personalità di ${name}?`,
      placeholder: "Giocoso, ama le coccole, sempre affamato...",
      tip: "Più dettagli condividi, più personalizzato e unico sarà il tuo libro!",
    },
    {
      id: "quirks",
      question: `Quali sono le stranezze divertenti di ${name}?`,
      placeholder: "Insegue la propria coda, abbaia al postino...",
    },
    {
      id: "favorite_activities",
      question: `Quali sono le attività preferite di ${name}?`,
      placeholder: "Giocare a palla, dormire al sole, rubare calzini...",
    },
    {
      id: "memorable_moment",
      question: `Qual è un momento memorabile con ${name}?`,
      placeholder: "Quella volta che ha distrutto il divano nuovo...",
    },
    {
      id: "best_friends",
      question: `Chi sono i migliori amici di ${name}?`,
      placeholder: "Il gatto del vicino, il cane del parco...",
    },
  ];

  const questions = characterType === "pet" ? petQuestions : personQuestions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showReview, setShowReview] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const remainingQuestions = questions.length - currentQuestionIndex - 1;

  const handleSaveAndContinue = () => {
    if (currentAnswer.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: currentAnswer.trim(),
      }));
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer(answers[questions[currentQuestionIndex + 1]?.id] || "");
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer(answers[questions[currentQuestionIndex + 1]?.id] || "");
    }
  };

  const handleBack = () => {
    if (showReview) {
      setShowReview(false);
    } else if (currentQuestionIndex > 0) {
      // Save current answer before going back
      if (currentAnswer.trim()) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: currentAnswer.trim(),
        }));
      }
      setCurrentQuestionIndex((prev) => prev - 1);
      setCurrentAnswer(answers[questions[currentQuestionIndex - 1]?.id] || "");
    } else {
      // Go back to character selection
      navigate(`/character-selection?is_gift=${isGift}`);
    }
  };

  const handleContinueToGenre = () => {
    // Save current answer if exists
    if (currentAnswer.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: currentAnswer.trim(),
      }));
    }

    const queryParams = new URLSearchParams({
      name,
      type: characterType,
      is_gift: String(isGift),
      ...answers,
      ...(currentAnswer.trim() ? { [currentQuestion.id]: currentAnswer.trim() } : {}),
    });
    
    if (gender) {
      queryParams.set("gender", gender);
    }

    navigate(`/genre-selection?${queryParams.toString()}`);
  };

  const handleReview = () => {
    // Save current answer before showing review
    if (currentAnswer.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: currentAnswer.trim(),
      }));
    }
    setShowReview(true);
  };

  const handleEditAnswer = (questionId: string) => {
    const questionIndex = questions.findIndex((q) => q.id === questionId);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
      setCurrentAnswer(answers[questionId] || "");
      setShowReview(false);
    }
  };

  if (showReview) {
    const answeredQuestions = questions.filter((q) => answers[q.id]);
    
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
        {/* Review content */}
        <div className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
          {/* Header - above content */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setShowReview(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowReview(false)}
              className="text-primary font-medium hover:underline"
            >
              Torna alle domande
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Le Tue Risposte
          </h1>
          <p className="text-gray-600 mb-6">
            <span className="bg-yellow-200 px-1">Rivedi</span> e modifica prima di continuare.
          </p>

          <div className="space-y-6">
            {answeredQuestions.map((q) => (
              <div key={q.id} className="border-b border-gray-200 pb-4">
                <p className="font-medium text-gray-900 mb-1">{q.question}</p>
                <p className="text-gray-600 mb-2">{answers[q.id]}</p>
                <button
                  onClick={() => handleEditAnswer(q.id)}
                  className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                >
                  <Pencil className="h-4 w-4" />
                  Modifica
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleContinueToGenre}
            className="w-full mt-8 py-6 bg-primary hover:bg-coral-dark text-white rounded-lg flex items-center justify-center gap-2"
          >
            Continua alla Selezione del Genere
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Header - above questions */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            {answeredCount > 0 && (
              <button
                onClick={handleReview}
                className="text-primary font-medium hover:underline"
              >
                Rivedi ({answeredCount})
              </button>
            )}
          </div>

          {/* Question */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {currentQuestion.question}
          </h1>

          {/* Tip box */}
          {currentQuestion.tip && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Consiglio:</span> {currentQuestion.tip}
              </p>
            </div>
          )}

          {/* Answer textarea */}
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={currentQuestion.placeholder}
            className="w-full min-h-[150px] px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 resize-none"
          />

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSaveAndContinue}
              disabled={!currentAnswer.trim()}
              className={cn(
                "flex-1 py-6 rounded-lg flex items-center justify-center gap-2 transition-all",
                currentAnswer.trim()
                  ? "bg-primary hover:bg-coral-dark text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Salva e Continua
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleSkip}
              variant="outline"
              className="px-6 py-6 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Salta
            </Button>
          </div>

          {/* Skip helper text */}
          <p className="text-center text-sm text-gray-400 mt-3">
            Non hai tempo? Salta pure — la nostra IA completerà i dettagli mancanti in modo coerente.
          </p>

          {/* Remaining questions */}
          <p className="text-center text-gray-500 mt-4">
            {remainingQuestions} {remainingQuestions === 1 ? "domanda rimasta" : "domande rimaste"}
          </p>

          {/* Quick finish option */}
          {answeredCount >= 1 && (
            <div className="border-t border-gray-200 mt-6 pt-6">
              <p className="text-center text-sm text-gray-500 mb-3">
                Hai fretta? Con {answeredCount} {answeredCount === 1 ? "risposta" : "risposte"} possiamo già creare un libro personalizzato!
              </p>
              <Button
                onClick={handleContinueToGenre}
                className="w-full py-6 bg-primary hover:bg-coral-dark text-white rounded-lg flex items-center justify-center gap-2"
              >
                Continua alla Selezione del Genere
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
