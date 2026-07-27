import React from 'react';
import './Hero.css';
import heroImage from '../../assets/anees.png';

const Hero = () => {
  const scrollToVentures = () => {
    const venturesSection = document.getElementById('ventures');
    if (venturesSection) {
      venturesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1 className="hero-headline">
          Architecting ideas into meaningful ventures.
        </h1>
        <p className="hero-description">
          Anees Ark is a portfolio of creative and technological endeavors dedicated to building
          beyond content. We explore the intersection of design, strategy, and innovation.
        </p>
        <button className="hero-cta" onClick={scrollToVentures}>
          Explore Ventures
        </button>
      </div>

      <div className="hero-image-container">
        {/* Transparent background cutout placeholder */}
        <div className="hero-portrait-wrapper">
          {/* 2. Render your local image here */}
          <img 
            src={heroImage} 
            alt="Anees" 
            className="hero-portrait-img" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;