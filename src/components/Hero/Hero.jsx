import React, { useState, useEffect, useRef } from 'react';
import heroImage from '../../assets/anees.png';

export default function FounderPortfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const requestRef = useRef();

  // ──────────────────────────────────────────────
  // VENTURES DATA & INTERCEPTOR CONTROLS
  // ──────────────────────────────────────────────
  const ventures = [
    { id: "01", name: "ARK CAPITAL", role: "Venture Builder & Incubator", status: "Active", period: "2023 — Present" },
    { id: "02", name: "STUDIO VOID", role: "Creative Direction & Brand Architecture", status: "Active", period: "2021 — Present" },
    { id: "03", name: "KINETIC LABS", role: "Specialty Hardware & Experimental UI", status: "Scaling", period: "2024 — Present" },
    { id: "04", name: "MONO CRAFT", role: "Editorial Publication & Curated Editions", status: "Archived", period: "2019 — 2023" },
    { id: "05", name: "SPATIAL FORM", role: "Architectural & Spatial Research", status: "Active", period: "2024 — Present" }
  ];

  const [activeVentureIndex, setActiveVentureIndex] = useState(0);
  const [isNeedleTicking, setIsNeedleTicking] = useState(false);
  const venturesRef = useRef(null);
  const isCooldownRef = useRef(false);
  const ITEM_HEIGHT = 130;

  // Parallax scroll listener for hero & visual cards
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Wheel interceptor: locks scroll in place and advances one-by-one with haptic recoil
  useEffect(() => {
    const el = venturesRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const rect = el.getBoundingClientRect();
      const inViewThreshold = 90;
      const isInFocus = rect.top <= inViewThreshold && rect.bottom >= (window.innerHeight - inViewThreshold);

      if (!isInFocus) return;

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // Allow natural scroll escape once you hit the bounds
      if (goingDown && activeVentureIndex >= ventures.length - 1) return;
      if (goingUp && activeVentureIndex <= 0) return;

      // Intercept scroll to tick through items
      e.preventDefault();

      if (isCooldownRef.current || Math.abs(e.deltaY) < 18) return;

      isCooldownRef.current = true;
      setTimeout(() => {
        isCooldownRef.current = false;
      }, 380);

      // Trigger mechanical vibration/kick
      setIsNeedleTicking(true);
      if (typeof window !== 'undefined' && window.navigator?.vibrate) {
        window.navigator.vibrate(15);
      }
      setTimeout(() => setIsNeedleTicking(false), 220);

      if (goingDown) {
        setActiveVentureIndex((prev) => Math.min(prev + 1, ventures.length - 1));
      } else if (goingUp) {
        setActiveVentureIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeVentureIndex, ventures.length]);

  // Smooth continuous auto-spin for 3D Arc
  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        setRotation((prev) => prev - 0.12);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDragging]);

  // Drag Handlers for 3D Arc
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
  const radius = 434;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e8e8] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-black antialiased overflow-x-clip">

      {/* Needle Mechanical Vibration & Recoil Keyframes */}
      <style>{`
        @keyframes needleVibrate {
          0% { transform: translateY(-50%) translateX(0px) scale(1); }
          25% { transform: translateY(-50%) translateX(12px) scale(1.14); }
          50% { transform: translateY(-50%) translateX(-4px) scale(0.96); }
          75% { transform: translateY(-50%) translateX(2px) scale(1.02); }
          100% { transform: translateY(-50%) translateX(0px) scale(1); }
        }
        .needle-tick-active {
          animation: needleVibrate 0.22s cubic-bezier(0.25, 1, 0.5, 1);
        }
      `}</style>

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

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
          SECTION 3: VENTURES (NEEDLE SNAPPING TICKER)
      ────────────────────────────────────────────── */}
      <section 
        id="ventures" 
        ref={venturesRef}
        className="relative min-h-screen bg-[#050505] border-t border-neutral-900/80 flex flex-col justify-between py-16 sm:py-24 px-6 sm:px-16 select-none overflow-hidden"
      >
        {/* Top Header */}
        <div className="max-w-6xl mx-auto w-full flex justify-between items-baseline border-b border-neutral-900/80 pb-6">
          <div>
            <span className="text-[10px] font-extralight tracking-[0.4em] uppercase text-neutral-500 block mb-2">
              02 / ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-5xl font-thin tracking-wide uppercase text-neutral-100">
              VENTURES
            </h2>
          </div>
          <div className="text-right text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            <span>INDEX [{String(activeVentureIndex + 1).padStart(2, '0')} / {String(ventures.length).padStart(2, '0')}]</span>
          </div>
        </div>

        {/* Central Viewport */}
        <div className="relative max-w-6xl mx-auto w-full h-[400px] flex items-center overflow-hidden">
          
          {/* Stationary Needle (Center Locked) */}
          <div 
            className={`absolute left-2 sm:left-6 z-30 flex items-center gap-4 pointer-events-none transition-transform ${
              isNeedleTicking ? 'needle-tick-active' : ''
            }`}
            style={{
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <span className="text-4xl sm:text-6xl font-thin text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              →
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </div>

          {/* Scrolling List: Item 0 starts centered on needle */}
          <div 
            className="w-full pl-20 sm:pl-32 transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)]"
            style={{
              transform: `translateY(calc(200px - ${ITEM_HEIGHT / 2}px - ${activeVentureIndex * ITEM_HEIGHT}px))`
            }}
          >
            {ventures.map((venture, idx) => {
              const distance = Math.abs(idx - activeVentureIndex);
              const isCurrent = idx === activeVentureIndex;

              return (
                <div
                  key={idx}
                  style={{ height: `${ITEM_HEIGHT}px` }}
                  onClick={() => {
                    setActiveVentureIndex(idx);
                    setIsNeedleTicking(true);
                    setTimeout(() => setIsNeedleTicking(false), 220);
                  }}
                  className={`flex flex-col justify-center cursor-pointer transition-all duration-500 origin-left ${
                    isCurrent
                      ? 'opacity-100 blur-0 scale-100 text-white font-normal'
                      : distance === 1
                      ? 'opacity-25 blur-[2.5px] scale-95 text-neutral-400 font-extralight'
                      : 'opacity-10 blur-[5px] scale-90 text-neutral-600 font-thin'
                  }`}
                >
                  <div className="flex items-baseline gap-6 sm:gap-10">
                    <span className="font-mono text-xs sm:text-sm tracking-widest text-neutral-500">
                      {venture.id}
                    </span>
                    <h3 className="text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight">
                      {venture.name}
                    </h3>
                  </div>

                  <div 
                    className={`flex items-center gap-6 pl-10 sm:pl-16 mt-2 transition-all duration-300 ${
                      isCurrent ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                  >
                    <span className="text-xs font-extralight tracking-[0.2em] text-neutral-300 uppercase">
                      {venture.role}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-neutral-600">
                      // {venture.period}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 border border-neutral-800 text-neutral-300 tracking-widest uppercase bg-neutral-950">
                      {venture.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top & Bottom Depth Vignettes */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />
        </div>

        {/* Footer info & clickable index dots */}
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center pt-6 border-t border-neutral-900/80 text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-600">
          <span>SCROLL WHEEL OR CLICK TO STEP</span>
          <div className="flex gap-2 items-center">
            {ventures.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveVentureIndex(i)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === activeVentureIndex ? 'w-8 bg-white' : 'w-2 bg-neutral-800 hover:bg-neutral-600'
                }`}
              />
            ))}
          </div>
          <span>SPRING KINEMATICS // 60 FPS</span>
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
      <section id="index" className="relative py-44 px-8 sm:px-16 border-t border-neutral-900/80 bg-[#050505] overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-[18vw] font-thin text-white/[0.015] pointer-events-none select-none uppercase tracking-tighter leading-none">
          IMPACT
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
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
                <span className="absolute top-4 left-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>
                <span className="absolute top-4 right-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>
                <span className="absolute bottom-4 left-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>
                <span className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-700 group-hover:text-neutral-400 transition-colors">+</span>

                <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-500 mb-10">
                  <span>{metric.id}</span>
                  <span className="uppercase tracking-[0.2em] group-hover:text-neutral-200 transition-colors">
                    {metric.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-6 mb-4">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-thin tracking-tighter uppercase text-neutral-100 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                    {metric.val}
                  </span>

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

                <h3 className="text-sm font-light tracking-[0.25em] uppercase text-neutral-200 mb-2">
                  {metric.label}
                </h3>
                <p className="text-xs font-extralight tracking-wide text-neutral-500 group-hover:text-neutral-400 transition-colors max-w-sm leading-relaxed">
                  {metric.meta}
                </p>

                <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-white/[0.03] rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            ))}
          </div>

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