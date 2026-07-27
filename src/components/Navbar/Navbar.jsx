import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Anees Ark</div>
      <div className="navbar-links">
        <a href="#about">About</a>
        <a href="#ventures">Ventures</a>
        <a href="#philosophy">VISION & MISSION</a>
        <a href="#contact">Contact</a>
      </div>
      {/* <button className="navbar-connect">Connect</button> */}
      <a 
        href="#contact" 
        className="navbar-connect"
        onClick={(e) => scrollToSection(e, 'contact')}
      >
        Connect
      </a>
    </nav>
  );
};

export default Navbar;