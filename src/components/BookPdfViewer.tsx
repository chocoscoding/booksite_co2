import { useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { BookPdfDocument } from "./BookPdfDocument";
import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewPage {
  chapterNumber: number;
  title: string;
  content: string;
}

interface BookPdfViewerProps {
  title: string;
  subtitle?: string;
  previewPages: PreviewPage[];
  coverImageUrl?: string;
  isPreview?: boolean;
  className?: string;
}

export const BookPdfViewer = ({
  title,
  subtitle,
  previewPages,
  coverImageUrl,
  isPreview = true,
  className,
}: BookPdfViewerProps) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const documentProps = {
    title,
    subtitle,
    previewPages,
    coverImageUrl,
    isPreview,
  };

  const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_anteprima.pdf`;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Toggle PDF view button */}
      <div className="flex gap-2 justify-center flex-wrap">
        <Button
          variant="outline"
          onClick={() => setShowPdfViewer(!showPdfViewer)}
          className="rounded-xl"
        >
          {showPdfViewer ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Nascondi PDF
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Visualizza PDF
            </>
          )}
        </Button>

        {/* Download button using PDFDownloadLink */}
        <PDFDownloadLink
          document={<BookPdfDocument {...documentProps} />}
          fileName={fileName}
        >
          {({ loading }) => (
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Preparazione...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Scarica Anteprima PDF
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* PDF Viewer */}
      {showPdfViewer && (
        <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-lg">
          <PDFViewer
            width="100%"
            height={600}
            showToolbar={true}
            className="rounded-xl"
          >
            <BookPdfDocument {...documentProps} />
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

/**
 * Compact download-only button for use in smaller spaces
 */
export const BookPdfDownloadButton = ({
  title,
  subtitle,
  previewPages,
  coverImageUrl,
  isPreview = true,
  variant = "outline",
  size = "default",
}: BookPdfViewerProps & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}) => {
  const documentProps = {
    title,
    subtitle,
    previewPages,
    coverImageUrl,
    isPreview,
  };

  const fileName = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_anteprima.pdf`;

  return (
    <PDFDownloadLink
      document={<BookPdfDocument {...documentProps} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button
          variant={variant}
          size={size}
          className="rounded-xl"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Scarica PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default BookPdfViewer;
