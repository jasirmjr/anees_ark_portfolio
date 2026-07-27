import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Anees Ark</div>
      
      <button 
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <a href="#about" onClick={(e) => scrollToSection(e, 'about')}>About</a>
        <a href="#ventures" onClick={(e) => scrollToSection(e, 'ventures')}>Ventures</a>
        <a href="#philosophy" onClick={(e) => scrollToSection(e, 'philosophy')}>VISION & MISSION</a>
        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
        <a 
          href="#contact" 
          className="navbar-connect mobile-only"
          onClick={(e) => scrollToSection(e, 'contact')}
        >
          Connect
        </a>
      </div>
      
      <a 
        href="#contact" 
        className="navbar-connect desktop-only"
        onClick={(e) => scrollToSection(e, 'contact')}
      >
        Connect
      </a>
    </nav>
  );
};

export default Navbar;