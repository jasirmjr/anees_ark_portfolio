import React, { useEffect, useRef } from 'react';
import './VisionMission.css';

const VisionMission = () => {
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
    <section className="vision-mission" id="philosophy" ref={sectionRef}>
      <div className="vm-container">
        
        {/* Section Header matching About & Ventures */}
        <div className="vm-header animate-element delay-1">
          <div className="vm-label-group">
            <span className="vm-number">02</span>
            <span className="vm-divider">//</span>
            <h2 className="vm-section-title">VISION & MISSION</h2>
          </div>
          {/* <h2 className="vm-main-title">Vision & Mission</h2> */}
          <div className="vm-accent-line"></div>
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="vm-grid">
          {/* Vision Card */}
          <div className="vm-card animate-element delay-2">
            <span className="vm-tag">CORE VISION</span>
            <h3 className="vm-title">Vision</h3>
            <p className="vm-description">
              To build a creator-first ecosystem where creativity becomes careers, businesses, and lasting opportunities.
            </p>
          </div>

          {/* Mission Card */}
          <div className="vm-card animate-element delay-3">
            <span className="vm-tag">CORE MISSION</span>
            <h3 className="vm-title">Mission</h3>
            <p className="vm-description">
              Empower creative talent through education, innovation, and entrepreneurship while building ventures that shape the future of the creative economy.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VisionMission;