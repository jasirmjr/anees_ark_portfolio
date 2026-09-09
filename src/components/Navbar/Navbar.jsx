import { useState } from 'react';

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
    <nav className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-neutral-200/80 px-6 py-5 text-neutral-900 transition-all md:px-[6%] md:py-5">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        
        {/* Logo / Brand Name */}
        <a 
          href="#" 
          className="text-xl font-extrabold tracking-tight text-neutral-950 transition-opacity hover:opacity-80 md:text-2xl"
        >
          Anees Ark<span className="text-[#ff5500]">.</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a 
            href="#about" 
            onClick={(e) => scrollToSection(e, 'about')}
            className="text-sm font-medium text-neutral-600 transition-colors duration-300 hover:text-black"
          >
            About
          </a>
          <a 
            href="#ventures" 
            onClick={(e) => scrollToSection(e, 'ventures')}
            className="text-sm font-medium text-neutral-600 transition-colors duration-300 hover:text-black"
          >
            Ventures
          </a>
          <a 
            href="#philosophy" 
            onClick={(e) => scrollToSection(e, 'philosophy')}
            className="text-sm font-medium text-neutral-600 transition-colors duration-300 hover:text-black"
          >
            Vision & Mission
          </a>
          <a 
            href="#contact" 
            onClick={(e) => scrollToSection(e, 'contact')}
            className="text-sm font-medium text-neutral-600 transition-colors duration-300 hover:text-black"
          >
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <a 
          href="#contact" 
          onClick={(e) => scrollToSection(e, 'contact')}
          className="group hidden items-center gap-2.5 rounded-full bg-[#ff5500] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#e04b00] hover:shadow-[0_4px_16px_rgba(255,85,0,0.3)] md:flex"
        >
          <span>Get in touch</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </a>

        {/* Mobile Hamburger Button */}
        <button 
          className="z-50 flex h-6 w-6 flex-col justify-center gap-1.5 border-0 bg-transparent p-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-neutral-900 transition-all duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-neutral-900 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-neutral-900 transition-all duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      <div className={`fixed inset-x-0 top-[73px] z-40 flex flex-col gap-6 border-b border-neutral-200 bg-white/95 px-6 py-8 shadow-xl backdrop-blur-xl transition-all duration-300 md:hidden ${
        isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
      }`}>
        <a 
          className="text-lg font-medium text-neutral-700 transition-colors hover:text-black" 
          href="#about" 
          onClick={(e) => scrollToSection(e, 'about')}
        >
          About
        </a>
        <a 
          className="text-lg font-medium text-neutral-700 transition-colors hover:text-black" 
          href="#ventures" 
          onClick={(e) => scrollToSection(e, 'ventures')}
        >
          Ventures
        </a>
        <a 
          className="text-lg font-medium text-neutral-700 transition-colors hover:text-black" 
          href="#philosophy" 
          onClick={(e) => scrollToSection(e, 'philosophy')}
        >
          Vision & Mission
        </a>
        <a 
          className="text-lg font-medium text-neutral-700 transition-colors hover:text-black" 
          href="#contact" 
          onClick={(e) => scrollToSection(e, 'contact')}
        >
          Contact
        </a>
        
        <a 
          href="#contact" 
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#ff5500] py-3 text-sm font-semibold text-white transition-all active:scale-[0.98]"
          onClick={(e) => scrollToSection(e, 'contact')}
        >
          <span>Get in touch</span>
          <span>→</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;