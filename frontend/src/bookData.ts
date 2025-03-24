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
  category: "impresso" | "ebook" | "audiobook" | "bundle";
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
    description: "O desenvolvimento da motricidade fina é essencial para a interação da criança com o meio e acontece quando a criança se relaciona com objetos e usa ferramentas, por exemplo nas atividades da vida diária.",
    price: 16,
    originalPrice: 12.60,
    discount: 25,
    category: "impresso",
    rating: 4.5,
    reviews: 28,
    featured: true,
    author: "Paula Serrano",
    publicationDate: "2016-09-15",
    publisher: "Papa-Letras",
    language: "Português",
    pages: 120,
    isbn: "9789898214591",
    tags: ["desenvolvimento infantil", "educação", "motricidade", "habilidades manuais"],
    dimensions: "172 x 245 x 7 mm",
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
    description: "A integração sensorial é o processo neurológico que organiza as nossas sensações, é a base para todas as formas de aprendizagem para que possamos viver no mundo e este faça sentido. É o alicerce para a aprendizagem académica, para as competências necessárias à realização das atividades da vida diária e sociais, e mesmo para a capacidade de ter empatia pelo outro. ",
    price: 14.90,
    category: "impresso",
    rating: 5,
    reviews: 42,
    author: "Paula Serrano",
    publicationDate: "2018-09-20",
    publisher: "Papa-Letras",
    language: "Português",
    pages: 168,
    format: "Livro",
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
    description: "As crianças aprendem a andar, a falar, a comunicar, a autorregular-se, a partilhar e a resolver problemas enquanto experimentam brincadeiras com os outros e com o meio. Ao brincar, recebem informação do corpo e do ambiente circundante através dos seus sistemas sensoriais.",
    price: 19.99,
    originalPrice: 24.99,
    discount: 20,
    category: "impresso",
    rating: 5,
    reviews: 15,
    author: "Paula Serrano",
    publicationDate: "2024-03-30",
    publisher: "Papa Letras",
    language: "Português",
    pages: 240,
    format: "Livro",
    fileSize: "6.5 MB",
    tags: ["integração sensorial", "brincadeiras", "primeiros anos", "atividades práticas"],
    availability: "in-stock",
    previewLink: "https://example.com/preview/brincar-integracao",
    recommendedAge: "Pais e educadores de crianças de 0-3 anos",
    relatedBooks: [2, 4],
    bestSeller: false,
    newRelease: true
  },
  {
    id: 4,
    image: book4,
    title: "O Desenvolvimento da Autonomia dos 0 aos 3 anos",
    description: "Desenvolvimento é o termo usado para descrever as mudanças no crescimento físico da criança e na sua capacidade de aprender em termos de comportamento sensório-motor, socioemocional, cognitivo e em competências de comunicação. ",
    price: 18.00,
    category: "impresso",
    rating: 4.5,
    reviews: 36,
    featured: true,
    author: "Paula Serrano",
    publicationDate: "2017-04-10",
    publisher: "Papa Letras",
    language: "Português",
    pages: 200,
    isbn: "9789898214645",
    tags: ["autonomia infantil", "desenvolvimento", "metodologia montessori", "primeira infância"],
    dimensions: "188 x 258 x 15 mm",
    weight: "380g",
    availability: "in-stock",
    stock: 12,
    recommendedAge: "Pais e cuidadores de crianças de 0-3 anos",
    relatedBooks: [1, 3],
    bestSeller: false,
    newRelease: false
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
