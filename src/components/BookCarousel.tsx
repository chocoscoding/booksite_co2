import bookCover1 from "@/assets/book-cover-1.png";
import bookCover2 from "@/assets/book-cover-2.png";
import coupleBook1 from "@/assets/couple-book-1.jpg";
import coupleBook2 from "@/assets/couple-book-2.png";
import coupleBook3 from "@/assets/couple-book-3.jpg";
import coupleBook4 from "@/assets/couple-book-4.jpg";

const books = [
  { id: 1, src: bookCover1, alt: "Copertina libro personalizzato 1" },
  { id: 2, src: bookCover2, alt: "Copertina libro personalizzato 2" },
  { id: 3, src: coupleBook1, alt: "Libro di coppia 1" },
  { id: 4, src: coupleBook2, alt: "Libro di coppia 2" },
  { id: 5, src: coupleBook3, alt: "Libro di coppia 3" },
  { id: 6, src: coupleBook4, alt: "Libro di coppia 4" },
];

const BookCarousel = () => {
  return (
    <div className="relative overflow-hidden py-8">
      <div className="flex animate-scroll-books">
        {[...books, ...books].map((book, index) => (
          <div
            key={`${book.id}-${index}`}
            className="flex-shrink-0 mx-3 w-44 h-64 rounded-lg overflow-hidden shadow-medium hover:shadow-strong transition-shadow duration-300 hover:-translate-y-1"
          >
            <img
              src={book.src}
              alt={book.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCarousel;
