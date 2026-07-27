import React, { useEffect, useRef } from 'react';
import './Ventures.css';
import lyfadsImg from '../../assets/lyfads.png';
import creatorsLabImg from '../../assets/creatorslab.png';

const Ventures = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      },
      {
        threshold: 0.15,
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
    <section className="ventures" id="ventures" ref={sectionRef}>
      <div className="ventures-container">
        {/* Section Heading */}
        <div className="ventures-header animate-element delay-1">
          <div className="ventures-label-group">
            <span className="ventures-number">04</span>
            <span className="ventures-divider">//</span>
            <h2 className="ventures-section-title">Ventures</h2>
          </div>
          {/* <h2 className="ventures-main-title">Ventures</h2> */}
          <div className="ventures-accent-line"></div>
        </div>

        {/* Venture Cards Grid */}
        <div className="ventures-grid">
          {/* Card 1: Lyfads */}
          <div className="venture-card animate-element delay-2">
            <span className="venture-category">Creative & Advertising Company</span>
            <h3 className="venture-name">Lyfads</h3>
            <p className="venture-description">
              Helping brands transform ideas into impactful campaigns, content, and stories.
            </p>
           <div className="venture-image-wrapper">
              {/* 2. Use imported image variable */}
              <img
                src={lyfadsImg}
                alt="Lyfads - Creative & Advertising"
                className="venture-image"
              />
            </div>
          </div>
          

          {/* Card 2: Creators Lab */}
          <div className="venture-card animate-element delay-3">
            <span className="venture-category">Creative Education Platform</span>
            <h3 className="venture-name">Creators Lab</h3>
            <p className="venture-description">
              Developing practical creative skills for the next generation of creators.
            </p>
            <div className="venture-image-wrapper">
              <img
                src={creatorsLabImg}
                alt="Creators Lab - Creative Education"
                className="venture-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ventures;