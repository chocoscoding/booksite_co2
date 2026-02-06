import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register fonts (optional - using default sans-serif by default)
// You can register custom fonts for better typography
Font.register({
  family: "Lora",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787z5vBJBkq0.ttf",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Inter",
  },
  coverPage: {
    flexDirection: "column",
    backgroundColor: "#F97316", // coral/orange
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Lora",
  },
  coverSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    fontFamily: "Inter",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 40,
  },
  pageHeader: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  pageNumber: {
    fontSize: 11,
    color: "#F97316",
    fontWeight: 600,
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1F2937",
    fontFamily: "Lora",
  },
  content: {
    flex: 1,
    fontSize: 12,
    lineHeight: 1.7,
    color: "#374151",
    textAlign: "justify",
  },
  pageFooter: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  previewWatermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 48,
    color: "rgba(249, 115, 22, 0.1)",
    fontWeight: 700,
  },
  decorativeLine: {
    width: 60,
    height: 3,
    backgroundColor: "#F97316",
    marginTop: 8,
    borderRadius: 2,
  },
});

interface PreviewPage {
  chapterNumber: number;
  title: string;
  content: string;
}

interface BookPdfDocumentProps {
  title: string;
  subtitle?: string;
  previewPages: PreviewPage[];
  coverImageUrl?: string;
  isPreview?: boolean;
}

export const BookPdfDocument = ({
  title,
  subtitle,
  previewPages,
  coverImageUrl,
  isPreview = true,
}: BookPdfDocumentProps) => (
  <Document
    title={title}
    author="BookSite"
    subject="Libro personalizzato"
    creator="BookSite AI"
  >
    {/* Cover Page */}
    <Page size="A4" style={coverImageUrl ? { padding: 0 } : styles.coverPage}>
      {coverImageUrl ? (
        <>
          <View style={styles.coverImageContainer}>
            <Image src={coverImageUrl} style={styles.coverImage} />
          </View>
          <View style={styles.coverOverlay}>
            <Text style={styles.coverTitle}>{title}</Text>
            {subtitle && <Text style={styles.coverSubtitle}>{subtitle}</Text>}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.coverTitle}>{title}</Text>
          {subtitle && <Text style={styles.coverSubtitle}>{subtitle}</Text>}
          <View style={styles.decorativeLine} />
        </>
      )}
    </Page>

    {/* Content Pages */}
    {previewPages.map((page, index) => (
      <Page key={index} size="A4" style={styles.page}>
        {/* Preview watermark */}
        {isPreview && <Text style={styles.previewWatermark}>ANTEPRIMA</Text>}

        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageNumber}>Pagina {page.chapterNumber}</Text>
          <Text style={styles.chapterTitle}>{page.title}</Text>
        </View>

        {/* Content */}
        <Text style={styles.content}>{page.content}</Text>

        {/* Footer */}
        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>
            {index + 1} / {previewPages.length}
          </Text>
        </View>
      </Page>
    ))}
  </Document>
);

export default BookPdfDocument;
