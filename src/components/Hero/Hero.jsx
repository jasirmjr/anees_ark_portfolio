import React, { useState, useEffect, useRef } from 'react';
import heroImage from '../../assets/anees.png';

export default function FounderPortfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const requestRef = useRef();

  // Scroll listener for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth continuous auto-spin when not dragging
  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        setRotation((prev) => prev - 0.12); // Continuous auto-slide speed
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDragging]);

  // Mouse / Touch Drag Handlers for the 3D Arc
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX || e.touches?.[0].pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.pageX || e.touches?.[0].pageX;
    const delta = (currentX - startX) * 0.35;
    setRotation((prev) => prev + delta);
    setStartX(currentX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3D Arc Cards (Mix of video & high-contrast stills)
  const arcCards = [
    { type: 'image', src: heroImage, title: 'ANEES ARK' },
    { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-ink-swirling-in-water-in-slow-motion-42502-large.mp4', title: 'STUDIO VOID' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', title: 'ARK CAPITAL' },
    { type: 'video', src: 'https://assets.mixkit.co/videos/preview/mixkit-black-and-white-city-aerial-view-39828-large.mp4', title: 'KINETIC LABS' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', title: 'MONO CRAFT' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', title: 'SPATIAL FORM' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80', title: 'EDITION NO. 07' },
  ];

  const totalCards = arcCards.length;
  // Scaled down 30% from 620 to 434 to keep perfect proportional spacing
  const radius = 434;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e8e8] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-black antialiased overflow-x-hidden">

      {/* ──────────────────────────────────────────────
          TOP MINIMAL EDITORIAL BAR
      ────────────────────────────────────────────── */}
     


      {/* ──────────────────────────────────────────────
          SECTION 1: 3D CYLINDRICAL CURVED ARC HERO
      ────────────────────────────────────────────── */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-between pt-36 pb-16 px-4 sm:px-12 overflow-hidden select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

        {/* Central Headlines & Call To Action */}
        <div className="relative z-20 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950/60 text-[10px] tracking-[0.3em] uppercase text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            FOUNDER & CREATIVE DIRECTOR
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-thin tracking-tight uppercase leading-[0.92] text-neutral-100">
           ANEES<br />
            <span className="font-light italic bg-gradient-to-r from-neutral-100 via-neutral-400 to-neutral-600 bg-clip-text text-transparent">
            ARK 
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-extralight tracking-[0.2em] text-neutral-400 max-w-xl mx-auto uppercase leading-relaxed">
            Directing platforms, hardware ventures, and minimal visual systems.
          </p>

        
        </div>

        {/* 3D Arc Viewport (Proportionally tightened) */}
        <div 
          className="relative w-full max-w-5xl h-[300px] sm:h-[360px] flex items-center justify-center my-4"
          style={{ 
            perspective: '1000px',
            transform: `translateY(${scrollY * 0.08}px)`
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${-4 + scrollY * 0.02}deg)`
            }}
          >
            {arcCards.map((card, idx) => {
              const angle = (idx * (360 / totalCards)) + rotation;
              const rad = (angle * Math.PI) / 180;
              const z = Math.cos(rad) * radius;
              const x = Math.sin(rad) * radius;
              
              const isFacingFront = z > -120;
              const opacity = Math.max(0.15, (z + 160) / (radius + 160));
              const yArch = Math.pow(Math.abs(Math.sin(rad)), 2) * 25;

              return (
                <div
                  key={idx}
                  className="absolute w-32 sm:w-40 md:w-44 h-44 sm:h-56 md:h-64 rounded-xl overflow-hidden border border-neutral-700/60 bg-neutral-900 shadow-xl transition-all duration-100 ease-out pointer-events-none"
                  style={{
                    transform: `translate3d(${x}px, ${yArch}px, ${z}px) rotateY(${angle}deg)`,
                    opacity: isFacingFront ? opacity : 0.05,
                    zIndex: Math.round(z + radius),
                    filter: `brightness(${Math.max(0.4, (z + radius) / (radius * 1.5))}) contrast(115%) grayscale(100%)`
                  }}
                >
                  {card.type === 'video' ? (
                    <video
                      src={card.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={card.src}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Card Vignette & Meta Tag */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[8px] tracking-widest uppercase font-extralight text-neutral-300">
                    <span className="truncate max-w-[80%]">{card.title}</span>
                    <span>0{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hero Bottom Navigation Hint */}
       
      </section>


      {/* ──────────────────────────────────────────────
          SECTION 2: FOUNDER'S THESIS & STATEMENT
      ────────────────────────────────────────────── */}
      <section id="thesis" className="py-40 px-8 sm:px-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
          <div className="md:col-span-4">
            <span className="text-[10px] font-extralight tracking-[0.4em] uppercase text-neutral-500 block mb-6">
              01 / PERSPECTIVE
            </span>
            <p className="text-xs font-light tracking-[0.25em] uppercase text-neutral-400 leading-relaxed">
              CREATIVE DIRECTION <br />
              VENTURE ARCHITECTURE <br />
              CULTURAL EQUITY
            </p>
          </div>

          <div className="md:col-span-8 space-y-12">
            <p className="text-3xl sm:text-4xl md:text-5xl font-thin leading-[1.3] text-neutral-100">
              We design entities that bridge radical creative expression with scalable business infrastructure.
            </p>
            <p className="text-sm sm:text-base font-extralight text-neutral-400 leading-loose max-w-2xl">
              As a founder, my focus is not on fleeting digital noise. I build lasting platforms, studios, and consumer brands that leverage minimal design, timeless typographic discipline, and enduring enterprise architecture.
            </p>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          SECTION 3: VENTURES & COMPANIES FOUNDED
      ────────────────────────────────────────────── */}
      <section id="ventures" className="py-40 px-8 sm:px-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-baseline mb-24">
            <div>
              <span className="text-[10px] font-extralight tracking-[0.4em] uppercase text-neutral-500 block mb-3">02 / ECOSYSTEM</span>
              <h2 className="text-4xl sm:text-6xl font-thin tracking-wide uppercase">VENTURES</h2>
            </div>
            <span className="text-[10px] font-extralight tracking-[0.3em] uppercase text-neutral-500 hidden sm:block">
              FOUNDED & OPERATED
            </span>
          </div>

          <div className="divide-y divide-neutral-900">
            {[
              { id: "01", name: "ARK CAPITAL", role: "Venture Builder & Incubator", status: "Active", period: "2023 — Present" },
              { id: "02", name: "STUDIO VOID", role: "Creative Direction & Brand Architecture", status: "Active", period: "2021 — Present" },
              { id: "03", name: "KINETIC LABS", role: "Specialty Hardware & Experimental UI", status: "Scaling", period: "2024 — Present" },
              { id: "04", name: "MONO CRAFT", role: "Editorial Publication & Curated Editions", status: "Archived", period: "2019 — 2023" }
            ].map((venture, i) => (
              <div key={i} className="py-12 group flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-950/40 px-4 transition-colors">
                <div className="flex items-baseline gap-8 md:gap-16">
                  <span className="text-[11px] font-extralight tracking-widest text-neutral-600">{venture.id}</span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-thin uppercase tracking-wider group-hover:text-white transition-colors">{venture.name}</h3>
                    <p className="text-xs font-extralight text-neutral-400 tracking-wide mt-1">{venture.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-10 text-[10px] font-extralight tracking-[0.3em] uppercase text-neutral-500">
                  <span>{venture.status}</span>
                  <span>{venture.period}</span>
                  <span className="text-neutral-400 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          SECTION 4: CURATED GALLERY / VISUAL WORKS
      ────────────────────────────────────────────── */}
      <section id="works" className="py-40 px-8 sm:px-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <span className="text-[10px] font-extralight tracking-[0.4em] uppercase text-neutral-500 block mb-3">03 / CURATION</span>
              <h2 className="text-4xl sm:text-6xl font-thin tracking-wide uppercase">SELECTED WORKS</h2>
            </div>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-xs hover:border-white transition-colors">←</button>
              <button className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center text-xs hover:border-white transition-colors">→</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "NOTES ON VISION", count: "12 ARTIFACTS", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" },
              { title: "UNDESIGNATED", count: "09 EDITIONS", img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80" },
              { title: "FLORENCE STUDY", count: "20 IMAGES", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80" },
              { title: "COHERENCE", count: "15 EDITS", img: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80" }
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-6 border border-neutral-900 group-hover:border-neutral-700 transition-colors">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-light tracking-[0.3em] uppercase text-neutral-300">{item.title}</h3>
                  <p className="text-[10px] font-extralight tracking-widest text-neutral-500">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          SECTION 5: MILESTONES & LEADERSHIP INDEX
      ────────────────────────────────────────────── */}
 {/* ──────────────────────────────────────────────
          SECTION 5: MILESTONES & LEADERSHIP INDEX (IMPACT REDESIGN)
      ────────────────────────────────────────────── */}
      <section id="index" className="relative py-44 px-8 sm:px-16 border-t border-neutral-900/80 bg-[#050505] overflow-hidden">
        
        {/* Subtle Architectural Watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-[18vw] font-thin text-white/[0.015] pointer-events-none select-none uppercase tracking-tighter leading-none">
          IMPACT
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Header Row with Status Indicator */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-16 border-b border-neutral-900 gap-8">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-extralight tracking-[0.45em] uppercase text-neutral-500 mb-4">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                <span>04 / TELEMETRY & METRICS</span>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-thin tracking-tight uppercase text-neutral-100">
                TRACK <span className="font-light italic text-neutral-400">RECORD.</span>
              </h2>
            </div>

            <div className="text-left md:text-right flex flex-col md:items-end text-[10px] font-extralight tracking-[0.3em] uppercase text-neutral-500">
              <span>SYSTEM AUDIT: VERIFIED</span>
              <span className="text-neutral-300 mt-1">2018 — 2026 CUMULATIVE SCALE</span>
            </div>
          </div>

          {/* Precision 2x2 Architectural Metric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-900 border-b border-neutral-900">
            {[
              {
                id: "01 // CAPITAL",
                val: "$42M+",
                label: "Total Capital Raised",
                meta: "Across 3 institutional rounds (Seed to Series A)",
                status: "98.4% Efficiency",
                bars: [30, 55, 40, 80, 65, 90, 100]
              },
              {
                id: "02 // ECOSYSTEM",
                val: "03",
                label: "Companies Founded",
                meta: "Ark Capital, Studio Void, Kinetic Labs",
                status: "2 Active / 1 Scaling",
                bars: [45, 65, 50, 95, 80, 100, 90]
              },
              {
                id: "03 // HONORS",
                val: "12",
                label: "Global Design Honors",
                meta: "Cannes Lion, Red Dot Best, D&AD recognition",
                status: "Archived & Cataloged",
                bars: [25, 40, 60, 50, 75, 85, 100]
              },
              {
                id: "04 // AUDIENCE",
                val: "100K+",
                label: "Active Platform Users",
                meta: "Enterprise creators and interface architects",
                status: "+34% YoY Retention",
                bars: [35, 50, 70, 60, 80, 90, 100]
              }
            ].map((metric, idx) => (
              <div
                key={idx}
                className={`group relative p-10 sm:p-14 transition-all duration-500 hover:bg-white/[0.02] cursor-crosshair overflow-hidden ${
                  idx >= 2 ? 'md:border-t border-neutral-900' : ''
                }`}
              >
                {/* Precision Corner Crosshairs (+) */}
                <span className="absolute top-4 left-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>
                <span className="absolute top-4 right-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>
                <span className="absolute bottom-4 left-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>
                <span className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>

                {/* Card Top Indicator */}
                <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-500 mb-10">
                  <span>{metric.id}</span>
                  <span className="uppercase tracking-[0.2em] group-hover:text-neutral-200 transition-colors">
                    {metric.status}
                  </span>
                </div>

                {/* Hero Numerical Value & Reactive Frequency Sparkline */}
                <div className="flex items-baseline justify-between gap-6 mb-4">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-thin tracking-tighter uppercase text-neutral-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                    {metric.val}
                  </span>

                  {/* Audio / Data Frequency Visualizer */}
                  <div className="flex items-end gap-1 h-10 pb-2">
                    {metric.bars.map((bar, barIdx) => (
                      <div
                        key={barIdx}
                        className="w-1 bg-neutral-800 group-hover:bg-white transition-all duration-500 rounded-full"
                        style={{
                          height: `${bar * 0.45}%`,
                          transitionDelay: `${barIdx * 35}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Metric Title & Deep Subtext */}
                <h3 className="text-sm font-light tracking-[0.25em] uppercase text-neutral-200 mb-2">
                  {metric.label}
                </h3>
                <p className="text-xs font-extralight tracking-wide text-neutral-500 group-hover:text-neutral-400 transition-colors max-w-sm leading-relaxed">
                  {metric.meta}
                </p>

                {/* Subtle Hover Radial Spotlight */}
                <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-white/[0.03] rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            ))}
          </div>

          {/* Bottom Ledger Details */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-600 gap-4">
            <span>SOURCE: INDEPENDENT ENTERPRISE VALUATION & AUDIT RECORDS</span>
            <span>CURRENCY: USD // REAL-TIME METRIC CACHE</span>
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          SECTION 6: ESSAYS & THOUGHT LEADERSHIP
      ────────────────────────────────────────────── */}
      <section id="writings" className="py-40 px-8 sm:px-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-baseline mb-20">
            <div>
              <span className="text-[10px] font-extralight tracking-[0.4em] uppercase text-neutral-500 block mb-3">05 / PERSPECTIVE</span>
              <h2 className="text-4xl sm:text-6xl font-thin tracking-wide uppercase">ESSAYS & NOTES</h2>
            </div>
            <span className="text-[10px] font-extralight tracking-[0.3em] uppercase text-neutral-500">PUBLIC ARCHIVE</span>
          </div>

          <div className="divide-y divide-neutral-900">
            {[
              { date: "AUG 2026", title: "THE ARCHITECTURE OF SILENCE: MINIMAL BRAND EQUITY", type: "ESSAY" },
              { date: "MAR 2026", title: "VENTURE CAPITAL THROUGH A CREATIVE DIRECTOR'S LENS", type: "THESIS" },
              { date: "OCT 2025", title: "WHY SOFTWARE CRAFT DEMANDS GRAPHIC DISCIPLINE", type: "COMMENTARY" },
              { date: "JAN 2025", title: "THE DEATH OF HOMOGENIZED DIGITAL EXPERIENCES", type: "MANIFESTO" }
            ].map((essay, idx) => (
              <div key={idx} className="py-8 flex flex-col sm:flex-row justify-between sm:items-center group cursor-pointer hover:px-2 transition-all">
                <div className="flex items-center gap-8">
                  <span className="text-[11px] font-extralight tracking-widest text-neutral-600">{essay.date}</span>
                  <span className="text-sm sm:text-base font-light tracking-wide text-neutral-300 group-hover:text-white transition-colors">{essay.title}</span>
                </div>
                <span className="text-[10px] font-extralight tracking-[0.3em] text-neutral-500 uppercase mt-2 sm:mt-0">{essay.type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          SECTION 7: ADVISORY, CONTACT & COLOPHON
      ────────────────────────────────────────────── */}
      <footer id="contact" className="pt-40 pb-16 px-8 sm:px-16 border-t border-neutral-900 flex flex-col justify-between min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
          <span className="text-[10px] font-extralight tracking-[0.4em] uppercase text-neutral-500 block mb-8">
            06 / INQUIRIES & ADVISORY
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-thin tracking-tight leading-none uppercase mb-12">
            LET’S BUILD <br />
            SOMETHING PERMANENT.
          </h2>

          <div className="space-y-6">
            <p className="text-xs font-extralight tracking-[0.25em] text-neutral-400 uppercase">Direct Channel</p>
            <a
              href="mailto:contact@aneesark.com"
              className="inline-block text-xl sm:text-3xl font-thin tracking-widest text-neutral-200 hover:text-white border-b border-neutral-800 hover:border-white pb-2 transition-all"
            >
              CONTACT@ANEESARK.COM
            </a>
          </div>
        </div>

        {/* Minimal Colophon Footer */}
        <div className="max-w-6xl mx-auto w-full pt-20 border-t border-neutral-950 flex flex-col sm:flex-row justify-between items-center text-[10px] font-extralight tracking-[0.35em] text-neutral-600 uppercase gap-6">
          <span>© ANEES ARK — ALL RIGHTS RESERVED</span>
          <div className="flex gap-8">
            <a href="#twitter" className="hover:text-white transition-colors">TWITTER (X)</a>
            <a href="#linkedin" className="hover:text-white transition-colors">LINKEDIN</a>
            <a href="#instagram" className="hover:text-white transition-colors">INSTAGRAM</a>
          </div>
          <span>BERLIN / LONDON</span>
        </div>
      </footer>

    </div>
  );
}