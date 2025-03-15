import book1 from "./assets/courses/image1.png";
import book2 from "./assets/courses/image2.png";
import book3 from "./assets/courses/image3.png";
import book4 from "./assets/courses/image4.jpg";

export const books = [
  {
    id: 1,
    image: book1,
    title: "A criança e a Motricidade Fina",
    description: "Um guia essencial para desenvolver habilidades motoras finas em crianças pequenas.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: "printed",
    rating: 4.5,
    reviews: 28,
    featured: true,
  },
  {
    id: 2,
    image: book2,
    title: "Brincar e Integração Sensorial nos Primeiros Anos",
    description: "Explora como brincadeiras ajudam na integração sensorial durante os primeiros anos.",
    price: 39.99,
    category: "ebook",
    rating: 5,
    reviews: 42,
  },
  {
    id: 3,
    image: book3,
    title: "A Integração Sensorial",
    description: "Uma introdução prática aos conceitos de integração sensorial para pais e educadores.",
    price: 19.99,
    originalPrice: 24.99,
    discount: 20,
    category: "ebook",
    rating: 4,
    reviews: 15,
  },
  {
    id: 4,
    image: book4,
    title: "O Desenvolvimento da Autonomia dos 0 aos 3 anos",
    description: "Estratégias para fomentar a independência em bebês e crianças pequenas.",
    price: 24.99,
    category: "printed",
    rating: 4.5,
    reviews: 36,
    featured: true,
  },
];