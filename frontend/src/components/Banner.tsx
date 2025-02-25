import React from "react";
import "../styles/Banner.css"; // Import styles
import bannerImage from "../assets/bannerImage.jpeg"; // Import the image

const Banner: React.FC = () => {
  return (
    <section className="banner">
      <div className="banner-content">
      <h1>Welcome to Our Website</h1>
        <p>Discover our amazing courses and mentorship programs.</p>
        <button className="cta-button">Get Started</button>
      </div>
      <img src={bannerImage} alt="" className="banner-image" />
    </section>
  );
};

export default Banner;
