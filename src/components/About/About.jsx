import React, { useEffect, useRef } from 'react';
import './About.css';

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add visible class when scrolled INTO view
          entry.target.classList.add('is-visible');
        } else {
          // Remove class when scrolled OUT of view (allows re-trigger on scroll up/down)
          entry.target.classList.remove('is-visible');
        }
      },
      {
        threshold: 0.25, // Triggers when 25% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about-container">
        
        {/* Animated Heading Section */}
        <div className="about-header animate-element delay-1">
          <div className="about-label-group">
            <span className="about-number">01</span>
            <span className="about-divider">//</span>
            <h2 className="about-title">ABOUT ME</h2>
          </div>
          <div className="about-accent-line"></div>
        </div>

        {/* Animated Content Section */}
        <div className="about-content animate-element delay-2">
          <p className="about-text">
            Entrepreneur building businesses at the intersection of <span className="highlight">creativity</span>, <span className="highlight">media</span>, <span className="highlight">technology</span>, and entrepreneurship. Focused on creating an ecosystem where creators learn, build, collaborate, and grow into successful entrepreneurs.
          </p>
        </div>

      </div>
    </section>
  );
};

export default About;