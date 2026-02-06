import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GiftOccasion from "./pages/GiftOccasion";
import OccasionSelection from "./pages/OccasionSelection";
import CharacterSelection from "./pages/CharacterSelection";
import Questionnaire from "./pages/Questionnaire";
import GenreSelection from "./pages/GenreSelection";
import EmailCapture from "./pages/EmailCapture";
import TitleSelection from "./pages/TitleSelection";
import CoverSelection from "./pages/CoverSelection";
import PhotoUpload from "./pages/PhotoUpload";
import BookPreview from "./pages/BookPreview";
import BookGenerated from "./pages/BookGenerated";
import BookAccess from "./pages/BookAccess";
import MyBooks from "./pages/MyBooks";

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
          <Route path="/occasion-selection" element={<OccasionSelection />} />
          <Route path="/character-selection" element={<CharacterSelection />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/genre-selection" element={<GenreSelection />} />
          <Route path="/email-capture" element={<EmailCapture />} />
          <Route path="/title-selection" element={<TitleSelection />} />
          <Route path="/cover-selection" element={<CoverSelection />} />
          <Route path="/photo-upload" element={<PhotoUpload />} />
          <Route path="/book-preview" element={<BookPreview />} />
          <Route path="/book-generated" element={<BookGenerated />} />
          <Route path="/book-access" element={<BookAccess />} />
          <Route path="/i-miei-libri" element={<MyBooks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
