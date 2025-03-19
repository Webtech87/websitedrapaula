// Import book cover images
import book1 from "./assets/courses/image1.png";
import book2 from "./assets/courses/image2.png";
import book3 from "./assets/courses/image3.png";
import book4 from "./assets/courses/image4.jpg";

export interface Book {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: "printed" | "ebook" | "audiobook" | "bundle";
  rating: number;
  reviews: number;
  featured?: boolean;
  author: string;
  publicationDate: string;
  publisher: string;
  language: string;
  pages?: number;
  isbn?: string;
  tags: string[];
  dimensions?: string;
  weight?: string;
  format?: string;
  fileSize?: string;
  duration?: string;
  previewLink?: string;
  availability: "in-stock" | "pre-order" | "out-of-stock" | "limited";
  stock?: number;
  recommendedAge?: string;
  relatedBooks?: number[];
  bestSeller?: boolean;
  newRelease?: boolean;
}

export const books: Book[] = [
  {
    id: 1,
    image: book1,
    title: "A crianca e a Motricidade Fina",
    description: "Um guia essencial para desenvolver habilidades motoras finas em crianças pequenas. Este livro apresenta técnicas comprovadas e atividades práticas que educadores e pais podem implementar facilmente.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: "printed",
    rating: 4.5,
    reviews: 28,
    featured: true,
    author: "Dra. Paula Serrano",
    publicationDate: "2022-05-15",
    publisher: "Editora Educação Infantil",
    language: "Português",
    pages: 180,
    isbn: "978-3-16-148410-0",
    tags: ["desenvolvimento infantil", "educação", "motricidade", "habilidades manuais"],
    dimensions: "21 x 15 x 1.5 cm",
    weight: "320g",
    availability: "in-stock",
    stock: 45,
    recommendedAge: "Educadores e pais de crianças de 2-7 anos",
    relatedBooks: [4, 3],
    bestSeller: true,
    newRelease: false
  },
  {
    id: 2,
    image: book2,
    title: "A Integracao Sensorial",
    description: "Explora como brincadeiras ajudam na integração sensorial durante os primeiros anos. Este livro combina pesquisas científicas com aplicações práticas, ideal para profissionais da área de educação infantil.",
    price: 39.99,
    category: "ebook",
    rating: 5,
    reviews: 42,
    author: "Dra. paula Serrano",
    publicationDate: "2023-01-20",
    publisher: "Neurociência Aplicada",
    language: "Português",
    pages: 250,
    format: "PDF, EPUB",
    fileSize: "8.2 MB",
    tags: ["integração sensorial", "desenvolvimento infantil", "brincadeiras", "neuroeducação"],
    availability: "in-stock",
    previewLink: "https://example.com/preview/integracao-sensorial",
    recommendedAge: "Profissionais e pais de crianças de 0-5 anos",
    relatedBooks: [3, 1],
    bestSeller: true,
    newRelease: true
  },
  {
    id: 3,
    image: book3,
    title: "Brincar e Integracao Sensorial Nos Primeiros Anos",
    description: "Uma introdução prática aos conceitos de integração sensorial para pais e educadores. Inclui 50 atividades práticas e estudos de caso reais que demonstram a importância da brincadeira estruturada.",
    price: 19.99,
    originalPrice: 24.99,
    discount: 20,
    category: "ebook",
    rating: 4,
    reviews: 15,
    author: "Dra. Paula Serrano",
    publicationDate: "2021-11-30",
    publisher: "Editora Desenvolvimento Infantil",
    language: "Português",
    pages: 150,
    format: "PDF, EPUB, MOBI",
    fileSize: "6.5 MB",
    tags: ["integração sensorial", "brincadeiras", "primeiros anos", "atividades práticas"],
    availability: "in-stock",
    previewLink: "https://example.com/preview/brincar-integracao",
    recommendedAge: "Pais e educadores de crianças de 0-3 anos",
    relatedBooks: [2, 4],
    bestSeller: false,
    newRelease: false
  },
  {
    id: 4,
    image: book4,
    title: "O Desenvolvimento da Autonomia dos 0 aos 3 anos",
    description: "Estratégias para fomentar a independência em bebês e crianças pequenas. Baseado em metodologias montessorianas e na abordagem RIE, este livro oferece orientações passo a passo para criar ambientes que promovam a autonomia.",
    price: 24.99,
    category: "printed",
    rating: 4.5,
    reviews: 36,
    featured: true,
    author: "Dra. Paula Serrano",
    publicationDate: "2022-09-10",
    publisher: "Editora Crescer",
    language: "Português",
    pages: 210,
    isbn: "978-3-16-148411-7",
    tags: ["autonomia infantil", "desenvolvimento", "metodologia montessori", "primeira infância"],
    dimensions: "23 x 16 x 1.8 cm",
    weight: "380g",
    availability: "limited",
    stock: 12,
    recommendedAge: "Pais e cuidadores de crianças de 0-3 anos",
    relatedBooks: [1, 3],
    bestSeller: false,
    newRelease: true
  },
];

// Helper functions to filter books by different criteria
export const getFeaturedBooks = () => books.filter(book => book.featured);
export const getNewReleases = () => books.filter(book => book.newRelease);
export const getBestSellers = () => books.filter(book => book.bestSeller);
export const getBooksByCategory = (category: Book['category']) => books.filter(book => book.category === category);
export const getRelatedBooks = (bookId: number) => {
  const book = books.find(b => b.id === bookId);
  if (!book || !book.relatedBooks) return [];
  return books.filter(b => book.relatedBooks?.includes(b.id));
};
