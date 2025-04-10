import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check, Heart, ShoppingCart, X } from "lucide-react";
import { courses } from "../courseData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "../styles/pages/courseDetails.css";

//Stripe import
import { loadStripe } from "@stripe/stripe-js";
 
// Get the publishable key from Vite env variables
const stripePublicKey = import.meta.env.VITE_STRIPE_LIVE_PUBLISHABLE_KEY;

// Optional: check if key exists to avoid silent failure
if (!stripePublicKey) {
  throw new Error("Missing Stripe publishable key. Make sure VITE_STRIPE_LIVE_PUBLISHABLE_KEY is defined in your .env file.");
}

// Load Stripe with the publishable key
export const stripePromise = loadStripe(stripePublicKey);

const CourseDetails = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const course = courses.find((c) => c.id === Number(id));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Add notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState("");

  const [loading, setLoading] = useState(false); //for Stripe
  
  // Check if the course is in the wishlist using the type-aware isInWishlist function
  const courseInWishlist = isInWishlist(Number(id), 'course');

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // Hide notification after 3 seconds
    let timer: number;
    if (showNotification) {
      timer = window.setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showNotification]);

  const toggleWishlist = () => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      // Redirect to login page with return URL
      navigate("/login", { state: { from: window.location.pathname } });
      return; // Exit the function to prevent further execution
    }

    // Use the wishlist context to add/remove the course with 'course' type
    if (courseInWishlist) {
      removeFromWishlist(Number(id), 'course');
      showToast("Curso removido dos favoritos", "success");
    } else {
      addToWishlist(Number(id), 'course');
      showToast("Curso adicionado aos favoritos", "success");
    }
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Function to show toast notification
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  const handleAddToCart = () => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      // Redirect to login page with return URL
      navigate("/login", { state: { from: window.location.pathname } });
      return; // Exit the function to prevent further execution
    }

    // Add to cart using the context
    if (course) {
      addToCart(course, 'course');
      // Show toast notification instead of alert
      showToast("Curso adicionado ao carrinho!", "success");
    }
  };

  const handleCheckout = async () => {
    try {
      // 🚨 Save product details in localStorage for retrying later if the checkout is canceled
      localStorage.setItem("lastCheckedProduct", JSON.stringify({
        courseId: id,
        title: course?.title,
        price: course?.price,
      }));
      
      // Send request to backend to create a Checkout Session
      const response = await fetch("https://websitedrapaula-v2.onrender.com/payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          cartItems: [
            {
              courseId: id,
              title: course.title,
              price: course.price * 100,
              //subscription: true, for Stripe
            }
          ]
         }), // Send course ID
      });

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;  // ✅ Redirect to Stripe
      } else {
          console.error("Failed to create Checkout Session:", data);
      }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="course-details">
        <h1>Curso não encontrado</h1>
        <p>O curso que você está procurando não está disponível.</p>
      </div>
    );
  }

  return (
    <div className="course-details" data-course-id={id}>
      {/* Toast Notification */}
      {showNotification && (
        <div className={`toast-notification ${notificationType}`}>
          <div className="toast-content">
            {notificationType === 'success' ? (
              <Check size={18} className="toast-icon" />
            ) : (
              <X size={18} className="toast-icon" />
            )}
            <span>{notificationMessage}</span>
          </div>
          <button 
            className="toast-close" 
            onClick={() => setShowNotification(false)}
            aria-label="Fechar notificação"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <h1>{course.title}</h1>
      
      <div className="course-image">
        {!imageLoaded && <div className="skeleton" style={{ height: '300px' }}></div>}
        <img 
          src={course.image} 
          alt={course.title} 
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
      
      <div className="course-content">
        <div className="course-info">
          <section>
            <h2>Descrição do Curso</h2>
            <div className="description-container">
              <div className={`description-text ${!isDescriptionExpanded ? 'collapsed' : ''}`}>
                <div className="description-structure">
                  {course.title?.includes("O Brincar na Terapia Ocupacional") && (
                    <>
                      <h3 className="description-subtitle">Sobre o Curso</h3>
                      <p>Formação 4 dias presenciais com a Terapeuta Ocupacional Paula Serrano.</p>
                      
                      <h3 className="description-subtitle">Enquadramento</h3>
                      <p>Os terapeutas ocupacionais usam o brincar na prática tanto para avaliação quanto para intervenção, mas o uso específico do brincar na terapia ocupacional pediátrica varia. Na literatura da terapia ocupacional sobre o brincar são referidas preocupações relativamente à forma como os terapeutas ocupacionais abordam o papel do brincar na sua intervenção.</p>
                      <p>Vários artigos sugerem restrições e falta de ênfase à abordagem dirigida ao brincar por terapeutas ocupacionais pediátricos. Essas restrições incluem atitudes de desvalorização em relação ao brincar, enquanto se dá maior ênfase no desenvolvimento de competências não relacionadas ao brincar (ex. competências motoras, sociais), falha na avaliação do brincar e dificuldade na definição de um plano de intervenção dirigido à ocupação do brincar.</p>
                      <p>No entanto a avaliação do brincar e a intervenção dirigida à ocupação do brincar é vital para o desenvolvimento infantil, para a saúde e respeito pela infância.</p>
                      
                      <h3 className="description-subtitle">Conteúdos Programáticos</h3>
                      <div className="content-list">
                        <ul>
                          <li>Definindo o brincar</li>
                          <li>Revisão das diferentes teorias do brincar</li>
                          <li>A evolução do brincar na terapia ocupacional</li>
                          <li>Quadros de referência do brincar na terapia ocupacional</li>
                          <li>A sequência de desenvolvimento do brincar ao longo da infância</li>
                          <li>Desenvolvimento das competências do brincar com o corpo, com objetos e simbólico</li>
                        </ul>
                      </div>
                      
                      <div className="content-subcategory">
                        <h4 className="description-subtitle-secondary">Avaliação do brincar</h4>
                        <div className="content-list">
                          <ul>
                            <li>Entrevista</li>
                            <li>Questionários: The Play History (Takata)</li>
                            <li>Organização da observação em contexto natural</li>
                            <li>Instrumentos: Revised Knox Preschool Play scale (Knox); Test of Playfulness (TOP) (Bundy)</li>
                            <li>Definição dos objetivos terapêuticos</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="content-subcategory">
                        <h4 className="description-subtitle-secondary">Promover o brincar</h4>
                        <div className="content-list">
                          <ul>
                            <li>O papel do Terapeuta Ocupacional</li>
                            <li>A intervenção terapêutica</li>
                            <li>Intervenção no contexto da criança</li>
                          </ul>
                        </div>
                      </div>
                      
                      <h3 className="description-subtitle">Metodologia</h3>
                      <p>Exposição teórica discussão de grupos e exercícios práticos</p>
                    </>
                  )}
                  
                  {course.title?.includes("Raciocínio Clínico e Intervenção") && (
                    <>
                      <h3 className="description-subtitle">Sobre o Curso</h3>
                      <p>Duração - 24 horas com a Terapeuta Ocupacional Paula Serrano.</p>
                      
                      <h3 className="description-subtitle">Área de Intervenção</h3>
                      <p>Integração Sensorial</p>
                      
                      <h3 className="description-subtitle">Destinatários</h3>
                      <p>Terapeutas ocupacionais com certificação em Integração Sensorial</p>
                      
                      <h3 className="description-subtitle">Objetivos Gerais</h3>
                      <div className="content-list">
                        <ul>
                          <li>Refletir sobre o desenvolvimento nos primeiros anos de vida e os fatores que o condicionam</li>
                          <li>Analisar o contributo das teorias de desenvolvimento e das neurociências para a nossa compreensão do desenvolvimento infantil</li>
                          <li>Analisar a evidencia científica atual sobre os sistemas sensoriais que suportam a abordagem da integração sensorial de Ayres</li>
                          <li>Explorar a importância da avaliação de integração sensorial, as metodologias e os diversos instrumentos disponíveis</li>
                          <li>Praticar o raciocínio clínico interpretando os dados da avaliação</li>
                          <li>Elaborar objetivos terapêuticos com base na avaliação</li>
                          <li>Planear a intervenção</li>
                          <li>Analisar a intervenção terapêutica usando a abordagem de integração sensorial de Ayres</li>
                        </ul>
                      </div>
                      
                      <h3 className="description-subtitle">Conteúdos Programáticos</h3>
                      <div className="content-list">
                        <ul>
                          <li>O desenvolvimento infantil e os fatores de suporte</li>
                          <li>A integração sensorial de Ayres e a evidencia científica do impacto dos sistemas sensoriais no desenvolvimento</li>
                          <li>A autorregulação e a disfunção sensorial</li>
                          <li>Praxis e o conceito de Affordance</li>
                          <li>Desenvolvimento da praxis e os sinais precoces de dispraxia</li>
                          <li>Classificação das perturbações de processamento sensorial na primeira infância</li>
                          <li>Instrumentos de avaliação da disfunção de integração sensorial</li>
                          <li>Analise de uma escala de desenvolvimento sob a perspetiva da integração sensorial</li>
                          <li>A organização da observação não estruturada e estruturada do processamento sensorial</li>
                          <li>Análise dos dados da avaliação e Raciocínio clínico</li>
                          <li>Planeamento da intervenção: Objetivos, organização da sessão</li>
                          <li>Fidelidade à integração sensorial de Ayres na prática clínica</li>
                        </ul>
                      </div>
                      
                      <h3 className="description-subtitle">Metodologia</h3>
                      <p>As sessões de trabalho serão presenciais, teóricas e práticas com analise de vídeos de casos clínicos.</p>
                    </>
                  )}
                  
                  {course.title?.includes("Integração Sensorial: Avaliação") && (
                    <>
                      <h3 className="description-subtitle">Sobre o Curso</h3>
                      <p>Formação de 24 horas com Paula Serrano – Mestre em Terapia Ocupacional- área de especialização Integração Sensorial.</p>
                      
                      <h3 className="description-subtitle">Área de Intervenção</h3>
                      <p>Integração Sensorial</p>
                      
                      <h3 className="description-subtitle">Destinatários</h3>
                      <p>Terapeutas ocupacionais com formação pós graduada em Integração Sensorial</p>
                      
                      <h3 className="description-subtitle">Objetivos Gerais</h3>
                      <div className="content-list">
                        <ul>
                          <li>Analisar a disfunção de integração sensorial e a relação com os motivos de referenciação</li>
                          <li>Explorar a importância da avaliação de integração sensorial, as metodologias e os diversos instrumentos disponíveis</li>
                          <li>Praticar o raciocínio clínico interpretando os dados da avaliação</li>
                          <li>Definir objetivos de desempenho ocupacional e objetivos de integração sensorial</li>
                          <li>Analisar vários formatos de relatório que documentem as dificuldades de integração sensorial e a relação com o desempenho ocupacional</li>
                        </ul>
                      </div>
                      
                      <h3 className="description-subtitle">Conteúdos Programáticos</h3>
                      <div className="content-list">
                        <ul>
                          <li>Disfunção da Integração Sensorial</li>
                          <li>Motivos de referenciação que levam à avaliação em integração sensorial</li>
                          <li>O processo de avaliação em integração sensorial</li>
                          <li>Metodologias de avaliação</li>
                          <li>Aplicação, e análise da História Sensorial</li>
                          <li>As observações não estruturadas e as observações estruturadas</li>
                          <li>Análise e interpretação de instrumentos de avaliação – SPM, SPMp, perfil sensorial Dunn</li>
                          <li>Interpretação de uma escala de desenvolvimento à luz da integração sensorial</li>
                          <li>Raciocínio clínico</li>
                          <li>Definição de objetivos de desempenho ocupacional e objetivos de integração sensorial</li>
                          <li>A elaboração do relatório</li>
                        </ul>
                      </div>
                      
                      <h3 className="description-subtitle">Metodologia</h3>
                      <p>As sessões de trabalho serão teóricas e práticas com análise de vídeos.</p>
                    </>
                  )}
                  
                  {course.title?.includes("Avaliação e Raciocínio Clínico na Primeira Infância") && (
                    <div data-course="Avaliacao">
                      <h3 className="description-subtitle">Sobre o Curso</h3>
                      <p>Duração – 21 horas com a Terapeuta Ocupacional Paula Serrano.</p>
                      
                      <h3 className="description-subtitle">Área de Intervenção</h3>
                      <p>Integração Sensorial e Brincar</p>
                      
                      <h3 className="description-subtitle">Destinatários</h3>
                      <p>Terapeutas ocupacionais com formação pós graduada em Integração Sensorial</p>
                      
                      <h3 className="description-subtitle">Objetivos Gerais</h3>
                      <div className="content-list">
                        <ul>
                          <li>Analisar a investigação e as etapas do brincar com o corpo, com os objetos e social/emocional na primeira infância</li>
                          <li>Analisar os elementos da ludicidade (playfulness) na primeira Infância</li>
                          <li>Analisar a importância da integração sensorial e a classificação das perturbações regulatórias do processamento sensorial na primeira infância</li>
                          <li>Explorar a importância da avaliação de integração sensorial, e do brincar, as metodologias e os diversos instrumentos disponíveis</li>
                          <li>Praticar o raciocínio clínico interpretando os dados da avaliação</li>
                          <li>Elaborar objetivos terapêuticos com base na avaliação</li>
                        </ul>
                      </div>
                      
                      <h3 className="description-subtitle">Conteúdos Programáticos</h3>
                      <div className="content-list">
                        <ul>
                          <li>O Brincar na Terapia Ocupacional</li>
                          <li>O desenvolvimento do brincar dos 0 aos 3 anos: as etapas e os sinais de alarme do brincar com o corpo, com os objetos e simbólico</li>
                          <li>O desenvolvimento do comportamento lúdico</li>
                          <li>A avaliação do Brincar</li>
                          <li>Instrumentos de avaliação do brincar</li>
                          <li>A Integração Sensorial na primeira infância e a disfunção de integração sensorial</li>
                          <li>Classificação das perturbações de processamento sensorial na primeira infância</li>
                          <li>As Neurociências, o brincar e a integração sensorial</li>
                          <li>Instrumentos de avaliação de integração sensorial dos 0 aos 3 anos</li>
                          <li>Raciocínio clínico</li>
                          <li>Avaliação, raciocínio clínico e o planeamento da intervenção</li>
                        </ul>
                      </div>
                      
                      <h3 className="description-subtitle">Metodologia</h3>
                      <p>As sessões de trabalho serão teóricas e praticas, com analise de vídeos de casos clínicos.</p>
                    </div>
                  )}
                  
                  {!course.title?.includes("Brincar e TO") && 
                   !course.title?.includes("Raciocinio clinico e intervencao") && 
                   !course.title?.includes("Integracao Sensorial: Avaliacao") && 
                   !course.title?.includes("Avaliação e Raciocínio clínico na primeira Infância") && (
                    <p>{course.description}</p>
                  )}
                </div>
              </div>
              <Button 
                variant="text" 
                size="small" 
                className="expand-button"
                onClick={toggleDescription}
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Ler menos</span>
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Ler mais</span>
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </section>

          <section>
            <h2>Professor(a)</h2>
            <p>{course.instructor}</p>
          </section>

          <section>
            <h2>Localização</h2>
            <p>{course.Localizacao}</p>
          </section>

          <section>
            <h2>Data</h2>
            <p>{course.date}</p>
          </section>
        </div>
        
        <div className="purchase-section">
          <div className="purchase-card">
            <div className="price-wishlist-container">
              <div className="price">{course.price}</div>
              <button 
                className="wishlist-button"
                onClick={toggleWishlist}
                aria-label={courseInWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Heart 
                  size={24} 
                  fill={courseInWishlist ? "#ff6b6b" : "none"} 
                  color={courseInWishlist ? "#ff6b6b" : "#757575"} 
                />
              </button>
            </div>
            <div className="button-container">
              <button className="buy-button" onClick={handleCheckout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H21L19 16H5L3 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 21C8.55228 21 9 20.5523 9 20C9 19.4477 8.55228 19 8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21Z" fill="currentColor"/>
                  <path d="M16 21C16.5523 21 17 20.5523 17 20C17 19.4477 16.5523 19 16 19C15.4477 19 15 19.4477 15 20C15 20.5523 15.4477 21 16 21Z" fill="currentColor"/>
                </svg>
                Comprar Agora
              </button>
              <button className="cart-button" onClick={handleAddToCart}>
                <ShoppingCart size={20} />
                Adicionar ao Carrinho
              </button>
              
              <div className="disclaimer-text">
                Obs.: O valor final pode sofrer variações devido à taxa de câmbio e/ou impostos locais, conforme a política do meio de pagamento escolhido.
              </div>
            </div>
            <div className="contact-info">
            Para esclarecimento de qualquer duvida, contate a Paula Serrano por email: <a href="mailto:paulaserranoeducacao@gmail.com" className="email-link">paulaserranoeducacao@gmail.com</a>
            </div>
          </div>
          
          <div className="detalhes-adicionais">
            <h2>O que você vai aprender</h2>
            <ul>
              {course.learningOutcomes ? (
                course.learningOutcomes.map((outcome, index) => (
                  <li key={index}>
                    <Check className="h-4 w-4 inline-block mr-2 text-green-600" />
                    {outcome}
                  </li>
                ))
              ) : (
                <li>
                  <Check className="h-4 w-4 inline-block mr-2 text-green-600" />
                  Informações sobre o conteúdo do curso em breve.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;