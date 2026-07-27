import React from 'react';
import './QuoteBanner.css';

const QuoteBanner = () => {
  const quoteText = "Creativity doesn't just create content. It creates possibilities.";

  return (
    <section className="quote-banner">
      <div className="quote-track">
        {/* Repeating the quote multiple times ensures a seamless, infinite loop */}
        <div className="quote-content">
          <span>"{quoteText}"</span>
          <span className="quote-star">✦</span>
          <span>"{quoteText}"</span>
          <span className="quote-star">✦</span>
        </div>
        <div className="quote-content" aria-hidden="true">
          <span>"{quoteText}"</span>
          <span className="quote-star">✦</span>
          <span>"{quoteText}"</span>
          <span className="quote-star">✦</span>
        </div>
      </div>
    </section>
  );
};

export default QuoteBanner;