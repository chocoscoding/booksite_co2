import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  XCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { getBookSession, setPhotoUrl, getAuthHeaders } from "@/lib/bookSession";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PhotoUpload = () => {
  const navigate = useNavigate();
  const session = getBookSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [useSample, setUseSample] = useState(false);

  const bookId = session?.bookId;
  const name = session?.character?.name || "il protagonista";

  const handleBack = () => {
    navigate(-1);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Per favore seleziona un'immagine (PNG o JPG)");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("L'immagine deve essere inferiore a 10MB");
        return;
      }

      setSelectedFile(file);
      setUseSample(false);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUseSample = () => {
    setUseSample(true);
    setSelectedFile(null);
    setPreviewUrl("/sample-photo.jpg"); // Placeholder sample image
  };

  const handleContinue = async () => {
    if (!selectedFile && !useSample) return;

    setIsUploading(true);

    try {
      let photoUrl = "";

      if (selectedFile) {
        // Upload the photo
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("type", "cover-photo");
        if (bookId) formData.append("bookId", bookId);

        const uploadResponse = await fetch(`${API_URL}/api/upload/image`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Errore nel caricamento della foto");
        }

        const uploadData = await uploadResponse.json();
        photoUrl = uploadData.data.url;
      } else if (useSample) {
        // Use sample photo URL
        photoUrl = "sample";
      }

      // Save photo URL to session
      if (photoUrl) {
        setPhotoUrl(photoUrl);
      }

      // Update book with cover photo
      if (bookId && photoUrl) {
        await fetch(`${API_URL}/api/books/${bookId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            customization: {
              coverType: "photo",
              coverPhotoUrl: photoUrl,
            },
          }),
        });
      }

      // Navigate to book preview (no URL params needed)
      navigate("/book-preview");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Errore nel caricamento");
    } finally {
      setIsUploading(false);
    }
  };

  const canContinue = selectedFile || useSample;

  const photoTips = [
    { text: "Foto chiara e ben illuminata con buona messa a fuoco", good: true },
    { text: "Una sola persona chiaramente visibile nell'inquadratura", good: true },
    { text: "Viso chiaramente visibile (frontale o 3/4)", good: true },
    { text: "Evita foto di gruppo o sfondi disordinati", good: false },
    { text: "Evita foto sfocate, scure o con filtri pesanti", good: false },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Carica una foto di {name}
            </h1>
            <p className="text-gray-600">
              La useremo per progettare la copertina del tuo libro.
            </p>
          </div>

          {/* Upload area */}
          <Card
            onClick={handleClickUpload}
            className="mb-6 p-8 border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
            />

            {previewUrl && !useSample ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600">
                  Clicca per cambiare foto
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <Upload className="w-10 h-10 text-gray-400 mb-4" />
                <p className="text-primary font-medium mb-1">
                  Clicca per caricare una foto
                </p>
                <p className="text-sm text-gray-500">PNG o JPG</p>
                <p className="text-xs text-gray-400 mt-2">
                  Foto chiara con una sola persona funziona meglio
                </p>
              </div>
            )}
          </Card>

          {/* Photo tips */}
          <Card className="mb-6 p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Consigli per le foto per i migliori risultati:
            </h3>
            <ul className="space-y-2">
              {photoTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  {tip.good ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm text-gray-600">{tip.text}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">OPPURE</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sample option */}
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Non hai una foto? Inizia con un esempio.
            </p>
            <button
              onClick={handleUseSample}
              className={`inline-block rounded-lg overflow-hidden border-2 transition-all ${
                useSample ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="Sample photo"
                className="w-24 h-24 object-cover"
              />
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Clicca l'immagine per usarla. Puoi cambiarla dopo.
            </p>
          </div>

          {/* Continue button */}
          <Button
            onClick={handleContinue}
            disabled={!canContinue || isUploading}
            size="lg"
            className="w-full py-6 bg-primary hover:bg-coral-dark text-white rounded-xl text-lg disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Caricamento...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Vedi la Magia
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
