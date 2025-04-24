import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check, Heart, ShoppingCart, X } from "lucide-react";
import { courses } from "../courseData";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {useTranslation} from "react-i18next";

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
  const {t} = useTranslation();
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

  // ✅ Utility to store data with expiry
  const setWithExpiry = (key: string, value: any, ttl: number) => {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

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
      showToast(t("remove_course_wishlist"), "success");
    } else {
      addToWishlist(Number(id), 'course');
      showToast(t("add_course_wishlist"));
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
      showToast(t("add_course_cart"), "success");
    }
  };

  const handleCheckout = async () => {
    try {
      // ✅ Save with expiry (1 hour = 3600000 ms)
      setWithExpiry("lastCheckedProduct", {
        courseId: id,
        title: course?.title,
        price: course?.price,
      }, 300000); // ✅ 5 minutes = 300000 ms

      console.log("Saved product to localStorage:", JSON.parse(localStorage.getItem("lastCheckedProduct") || 'null'));
      
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

      <h1>{t(`courses.${course.id}.title`)}</h1>

      <div className="course-image">
          {!imageLoaded && <div className="skeleton" style={{height: '300px'}}></div>}
          <img
              src={course.image}
              alt={course.title}
              onLoad={() => setImageLoaded(true)}
              style={{display: imageLoaded ? 'block' : 'none'}}
          />

        {/* Partner logos for course ID 5 */}
        {Number(id) === 5 && (
           <div className="partner-logos">
             <div className="partner-logos-container">
               
             </div>
           </div>
         )}
      </div>
      
      <div className="course-content">
        <div className="course-info">
          <section>
            <h2>{t(`courses.${course.id}.description_course`)}</h2>
            <div className="description-container">
              <div className={`description-text ${!isDescriptionExpanded ? 'collapsed' : ''}`}>
                <div className="description-structure">
                  {course.title?.includes("O Brincar na Terapia Ocupacional") && (
                    <>
                      <h3 className="description-subtitle">{t(`courses.${course.id}.about_course`)}</h3>
                      <p>{t(`courses.${course.id}.about_course_p`)}</p>

                                            <h3 className="description-subtitle">{t(`courses.${course.id}.equipaments`)}</h3>
                                            <p>{t(`courses.${course.id}.equipaments_p1`)}</p>
                                            <p>{t(`courses.${course.id}.equipaments_p2`)}</p>
                                            <p>{t(`courses.${course.id}.equipaments_p3`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.course_content_title1`)}</h3>
                      <div className="content-list">
                        <ul>
                                                    <li>{t(`courses.${course.id}.course_content_title1_li.1`)}</li>
                                                    <li>{t(`courses.${course.id}.course_content_title1_li.2`)}</li>
                                                    <li>{t(`courses.${course.id}.course_content_title1_li.3`)}</li>
                                                    <li>{t(`courses.${course.id}.course_content_title1_li.4`)}</li>
                                                    <li>{t(`courses.${course.id}.course_content_title1_li.5`)}</li>
                        </ul>
                      </div>
                      
                      <div className="content-subcategory">
                                                <h4 className="description-subtitle-secondary">{t(`courses.${course.id}.course_content_title2`)}</h4>
                        <div className="content-list">
                          <ul>
                                                        <li>{t(`courses.${course.id}.course_content_title2_li.1`)}</li>
                                                        <li>{t(`courses.${course.id}.course_content_title2_li.2`)}</li>
                                                        <li>{t(`courses.${course.id}.course_content_title2_li.3`)}</li>
                                                        <li>{t(`courses.${course.id}.course_content_title2_li.4`)}</li>
                                                        <li>{t(`courses.${course.id}.course_content_title2_li.5`)}</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="content-subcategory">
                                                <h4 className="description-subtitle-secondary">{t(`courses.${course.id}.course_content_title3`)}</h4>
                        <div className="content-list">
                          <ul>
                                                        <li>{t(`courses.${course.id}.course_content_title3_li.1`)}</li>
                                                        <li>{t(`courses.${course.id}.course_content_title3_li.2`)}</li>
                                                        <li>{t(`courses.${course.id}.course_content_title3_li.3`)}</li>
                          </ul>
                        </div>
                      </div>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.metodology_h`)}</h3>
                                            <p>{t(`courses.${course.id}.metodology_p`)}</p>
                    </>
                  )}
                  
                  {course.title?.includes("Raciocínio Clínico e Intervenção") && (
                    <>
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_1.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_1.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_2.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_2.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_3.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_3.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_4.title`)}</h3>
                      <div className="content-list">
                        <ul>
                                                    <li>{t(`courses.${course.id}.title_4.list.1`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.2`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.3`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.4`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.5`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.6`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.7`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.8`)}</li>
                        </ul>
                      </div>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_5.title`)}</h3>
                      <div className="content-list">
                        <ul>
                                                    <li>{t(`courses.${course.id}.title_5.list.1`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.2`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.3`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.4`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.5`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.6`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.7`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.8`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.9`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.10`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.11`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.12`)}</li>
                        </ul>
                      </div>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_6.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_6.p`)}</p>
                    </>
                  )}
                  
                  {course.title?.includes("Integração Sensorial: Avaliação") && (
                    <>
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_1.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_1.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_2.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_2.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_3.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_3.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_4.title`)}</h3>
                      <div className="content-list">
                        <ul>
                                                    <li>{t(`courses.${course.id}.title_4.list.1`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.2`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.3`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.4`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.list.5`)}</li>
                        </ul>
                      </div>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_5.title`)}</h3>
                      <div className="content-list">
                        <ul>
                                                    <li>{t(`courses.${course.id}.title_5.list.1`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.2`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.3`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.4`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.5`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.6`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.7`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.8`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.9`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.10`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.list.11`)}</li>
                        </ul>
                      </div>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_6.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_6.p`)}</p>
                    </>
                  )}
                  
                  {course.title?.includes("Avaliação e Raciocínio Clínico na Primeira Infância") && (
                    <div data-course="Avaliacao">
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_1.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_1.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_2.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_2.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_3.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_3.p`)}</p>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_4.title`)}</h3>
                      <div className="content-list">
                        <ul>
                                                    <li>{t(`courses.${course.id}.title_4.l1.1`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.l1.2`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.l1.3`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.l1.4`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.l1.5`)}</li>
                                                    <li>{t(`courses.${course.id}.title_4.l1.6`)}</li>
                        </ul>
                      </div>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_5.title`)}</h3>
                      <div className="content-list">
                        <ul>
                                                    <li>{t(`courses.${course.id}.title_5.l1.1`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.2`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.3`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.4`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.5`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.6`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.7`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.8`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.9`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.10`)}</li>
                                                    <li>{t(`courses.${course.id}.title_5.l1.11`)}</li>
                        </ul>
                      </div>
                      
                                            <h3 className="description-subtitle">{t(`courses.${course.id}.title_6.title`)}</h3>
                                            <p>{t(`courses.${course.id}.title_6.p`)}</p>
                    </div>
                  )}
                  
                                    {course.title?.includes("Programa Internacional") && (
                         <div className="programa-internacional">
                           <div className="programa-header">
                                                <h3 className="description-subtitle programa-title">{t("courses.5.title_1.title")}</h3>
                                                <div className="programa-badge">{t("courses.5.title_1.p")}</div>
                           <div className="programa-info-grid">
                             <div className="programa-info-item">
                               <h4 className="programa-info-title">{t(`courses.${course.id}.title_1.subtitle.1.title`)}</h4>
                               <p>{t(`courses.${course.id}.title_1.subtitle.1.p`)}</p>
                             </div>
                             
                             <div className="programa-info-item">
                               <h4 className="programa-info-title">{t(`courses.${course.id}.title_1.subtitle.3.title`)}</h4>
                               <p>{t(`courses.${course.id}.title_1.subtitle.3.p`)}</p>
                             </div>
                             
                             <div className="programa-info-item">
                               <h4 className="programa-info-title">{t(`courses.${course.id}.title_1.subtitle.2.title`)}</h4>
                               <p>{t(`courses.${course.id}.title_1.subtitle.2.p`)}</p>
                             </div>
                             
                             <div className="programa-info-item">
                               <h4 className="programa-info-title">{t(`courses.${course.id}.title_1.subtitle.4.title`)}</h4>
                               <p>{t(`courses.${course.id}.title_1.subtitle.4.p`)}</p>
                             </div>
                           </div>
                           
                           <div className="programa-section">
                                                    <h3 className="description-subtitle">{t("courses.5.title_2.title")}</h3>
                             <div className="programa-objetivos">
                               <ul>
                                                            <li>{t("courses.5.title_2.li.1")}</li>
                                                            <li>{t("courses.5.title_2.li.2")}</li>
                                                            <li>{t("courses.5.title_2.li.3")}</li>
                                                            <li>{t("courses.5.title_2.li.4")}</li>
                                                            <li>{t("courses.5.title_2.li.5")}</li>
                                                            <li>{t("courses.5.title_2.li.6")}</li>
                                                            <li>{t("courses.5.title_2.li.7")}</li>
                                                            <li>{t("courses.5.title_2.li.8")}</li>
                                                            <li>{t("courses.5.title_2.li.9")}</li>
                               </ul>
                             </div>
                           </div>
                           
                           <div className="programa-section">
                                                    <h3 className="description-subtitle">{t("courses.5.title_3.title")}</h3>
                                                    <div
                                                        className="programa-conteudos">
                               <ul>
                                                            <li>{t("courses.5.title_3.li.1")}</li>
                                                            <li>{t("courses.5.title_3.li.2")}</li>
                                                            <li>{t("courses.5.title_3.li.3")}</li>
                                 <li className="with-subitems">
                                                                {t("courses.5.title_3.li.4.title")}
                                   <ul className="subitems">
                                                                    <li>
                                                                        {t("courses.5.title_3.li.4.li.0")}
                                                                    </li>
                                                                    <li>
                                                                        {t("courses.5.title_3.li.4.li.1")}
                                                                    </li>
                                                                    <li>
                                                                        {t("courses.5.title_3.li.4.li.2")}
                                                                    </li>
                                   </ul>
                                 </li>
                                                            <li>
                                                                {t("courses.5.title_3.li.5")}
                                                            </li>
                                 <li className="with-subitems">
                                                                {t("courses.5.title_3.li.6.title")}
                                   <ul className="subitems">
                                                                    <li>
                                                                        {t("courses.5.title_3.li.6.li.0")}
                                                                    </li>
                                                                    <li>
                                                                        {t("courses.5.title_3.li.6.li.1")}
                                                                    </li>
                                   </ul>
                                 </li>
                                                            <li>
                                                                {t("courses.5.title_3.li.7")}
                                                            </li>
                                                            <li>
                                                                {t("courses.5.title_3.li.8")}
                                                            </li>
                               </ul>
                             </div>
                           </div>
                           
                           <div className="programa-metodologia">
                                                    <h3 className="description-subtitle">{t("courses.5.title_4.title")}</h3>
                                                    <p>{t("courses.5.title_4.p")}</p>
                           </div>
                                                <div
                                                    className="programa-inscricao">
                                                    <h3>{t("courses.5.title_5.title")}</h3>
                                                    <p>{t("courses.5.title_5.p")}</p>
                           </div>
                         </div>                       
                      </div>
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
                                        <span>{t("less_read")}</span>
                                        <ChevronUp className="h-4 w-4"/>
                  </>
                ) : (
                  <>
                                        <span>{t("more_read")}</span>
                                        <ChevronDown className="h-4 w-4"/>
                  </>
                )}
              </Button>
            </div>
          </section>

          <section>
                        <h2>{t(`courses.${course.id}.teacher`)}</h2>
                        <p>{t(`courses.${course.id}.instructor`)}</p>
          </section>

          <section>
                        <h2>{t(`courses.${course.id}.localization.title`)}</h2>
                        <p>{t(`courses.${course.id}.localization.description`)}</p>
          </section>

          <section>
                        <h2>{t(`courses.${course.id}.a_date.title`)}</h2>
                        <p>{t(`courses.${course.id}.a_date.description`)}</p>
          </section>
        </div>
        
        <div className="purchase-section">
          <div className="purchase-card">
            <div className="price-wishlist-container">
            <div className={`price ${Number(id) === 5 ? 'no-euro' : ''}`}>
                 {Number(id) === 5 
                   ? t("full_program") 
                   : course.price}
               </div>
               {Number(id) !== 5 && (
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
               )}
            </div>
            <div className="button-container">
              {Number(id) !== 5 ? (
                  <>
                    <button className="buy-button" onClick={handleCheckout}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H21L19 16H5L3 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 21C8.55228 21 9 20.5523 9 20C9 19.4477 8.55228 19 8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21Z" fill="currentColor"/>
                        <path d="M16 21C16.5523 21 17 20.5523 17 20C17 19.4477 16.5523 19 16 19C15.4477 19 15 19.4477 15 20C15 20.5523 15.4477 21 16 21Z" fill="currentColor"/>
                      </svg>
                                {t("buy_button")}
                    </button>
                    <button className="cart-button" onClick={handleAddToCart}>
                      <ShoppingCart size={20} />
                      {t("add_to_cart")}
                    </button>
                  </>
                ) : (
                  <a href="https://imersao.inclusaoeficiente.com.br/interessados-pos-is" target="_blank" rel="noopener noreferrer" className="inscrever-button">
                   {t("enroll_button")}
                 </a>
                )}
              
              <div className="disclaimer-text">
                {Number(id) === 5 
                   ? t("obs_course_5") 
                   : t("obs")}
              </div>
            </div>
            <div className="contact-info">
                            {t("contact_by_mail")} <a
                            href="mailto:paulaserranoeducacao@gmail.com"
                            className="email-link">paulaserranoeducacao@gmail.com</a>
            </div>
          </div>
          
          <div className="detalhes-adicionais">
                        <h2>{t("learning_on_course")}</h2>
            <ul>
              {course.learningOutcomes ? (
                course.learningOutcomes.map((outcome, index) => (
                  <li key={index}>
                                        <Check className="h-4 w-4 inline-block mr-2 text-green-600"/>
                                        {t(`courses.${course.id}.learningOutcomes.${index}`)}
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