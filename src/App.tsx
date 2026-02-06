import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GiftOccasion from "./pages/GiftOccasion";
import CharacterSelection from "./pages/CharacterSelection";
import Questionnaire from "./pages/Questionnaire";
import GenreSelection from "./pages/GenreSelection";
import EmailCapture from "./pages/EmailCapture";
import BookPreview from "./pages/BookPreview";
import BookGenerated from "./pages/BookGenerated";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gift-occasion" element={<GiftOccasion />} />
          <Route path="/character-selection" element={<CharacterSelection />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/genre-selection" element={<GenreSelection />} />
          <Route path="/email-capture" element={<EmailCapture />} />
          <Route path="/book-preview" element={<BookPreview />} />
          <Route path="/book-generated" element={<BookGenerated />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
