import React, { useState, useEffect, useRef } from 'react';
import './Contact.css';

const Contact = () => {
  const [status, setStatus] = useState('');
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
      { threshold: 0.15 }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    setStatus('SENDING');

    // Replace YOUR_FORMSPREE_ID with your Formspree endpoint ID
    const response = await fetch('https://formspree.io/f/mlgqawbv', {
    method: 'POST',
    body: data,
    headers: {
        Accept: 'application/json',
    },
    });

    if (response.ok) {
      setStatus('SUCCESS');
      form.reset();
    } else {
      setStatus('ERROR');
    }
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-container">
        
        {/* Section Header */}
        <div className="contact-header animate-element delay-1">
          <div className="contact-label-group">
            <span className="contact-number">05</span>
            <span className="contact-divider">//</span>
            <h2 className="contact-section-title">CONTACT</h2>
          </div>
          <div className="contact-accent-line"></div>
        </div>

        {/* Form Container with Title Text at Top */}
        <div className="contact-content-wrapper animate-element delay-2">
          
          <div className="contact-intro">
            <h2 className="contact-main-heading">
              Let's Build Something<br />Meaningful
            </h2>
            <p className="contact-subtext">
              Open for collaborations, venture partnerships, and architectural design inquiries.
            </p>
          </div>

          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="hello@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Your inquiry..."
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-btn">
              {status === 'SENDING' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'SUCCESS' && (
              <p className="status-msg success">Thank you! Your message has been sent.</p>
            )}
            {status === 'ERROR' && (
              <p className="status-msg error">Something went wrong. Please try again.</p>
            )}
          </form>

          {/* Social Media Links */}
          <div className="contact-socials">
            <span className="socials-label">Connect directly:</span>
            <div className="socials-buttons">
              <a 
                href="https://www.instagram.com/anees_ark/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                Instagram
              </a>

              <a 
                href="https://www.linkedin.com/in/anees-ark-bb77a1265?utm_source=share_via&utm_content=profile&utm_medium=member_ios" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-btn"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;