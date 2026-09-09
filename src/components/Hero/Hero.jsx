import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import heroImage from '../../assets/anees.png';

export default function FounderPortfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const requestRef = useRef();

  // ──────────────────────────────────────────────
  // CONTACT FORM STATE & HANDLER (WEB3FORMS)
  // ──────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Venture Advisory',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormErrorMessage('Please fill in all required fields.');
      setFormStatus('error');
      return;
    }

    setFormStatus('submitting');
    setFormErrorMessage('');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

    if (!accessKey || accessKey === 'your_web3forms_access_key_here') {
      setFormStatus('error');
      setFormErrorMessage('Web3Forms Access Key is not configured. Please add your key to the .env file.');
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: `Portfolio Dispatch [${formData.subject}] from ${formData.name.trim()}`,
          message: formData.message.trim(),
          from_name: 'Anees Ark Portfolio',
          botcheck: ''
        })
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', subject: 'Venture Advisory', message: '' });
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.85 }
          });
        }
      } else {
        setFormStatus('error');
        setFormErrorMessage(data.message || 'Submission failed. Please try again or email directly.');
      }
    } catch (err) {
      setFormStatus('error');
      setFormErrorMessage('Network error while transmitting dispatch. Please try again or email directly.');
    }
  };

  // ──────────────────────────────────────────────
  // VENTURES DATA & INTERCEPTOR CONTROLS
  // ──────────────────────────────────────────────
  const ventures = [
    { 
      id: "01", 
      name: "LYF ADS", 
      role: "Visual Design & Direction", 
      status: "Active", 
      period: "2018 — Present",
      logo: "/LYFADS_Identity__1.png"
    },
    { 
      id: "02", 
      name: "SEKRICK", 
      role: "A creative production house and agency", 
      status: "Active", 
      period: "2026 — Present",
      logo: "/black logo.png"
    },
    { 
      id: "03", 
      name: "CREATER'S LAB", 
      role: "Specialty Hardware & Experimental UI", 
      status: "Active", 
      period: "2026 — Present",
      logo: "/Logo-Creators-Lab.png"
    },
    { 
      id: "04", 
      name: "PITCH STUDIO", 
      role: "Editorial Publication & Curated Editions", 
      status: "Active", 
      period: "2026 — Present",
      logo: "/IMG_7154(1).png"
    }
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
    { type: 'image', src: '/anees (2).png', title: 'STUDIO VOID' },
    { type: 'image', src: '/anees (2).png', title: 'ARK CAPITAL' },
    { type: 'video', src: '/anees (2).png', title: 'KINETIC LABS' },
    { type: 'image', src: '/anees (2).png', title: 'MONO CRAFT' },
    { type: 'image', src: '/anees (2).png', title: 'SPATIAL FORM' },
    { type: 'image', src: '/anees (2).png', title: 'EDITION NO. 07' },
  ];

  const totalCards = arcCards.length;
  const radius = 434;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-neutral-900 selection:text-white antialiased overflow-x-clip">

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
        className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center pt-8 sm:pt-12 pb-10 sm:pb-14 px-4 sm:px-12 overflow-hidden select-none gap-4 sm:gap-6"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-neutral-200/40 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-20 text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-300 bg-white/80 shadow-xs text-[10px] tracking-[0.3em] uppercase text-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
            FOUNDER & CREATIVE DIRECTOR
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-thin tracking-tight uppercase leading-[0.92] text-neutral-950">
            ANEES<br />
            <span className="font-light italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 bg-clip-text text-transparent">
              ARK 
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-normal tracking-[0.2em] text-neutral-600 max-w-xl mx-auto uppercase leading-relaxed">
            Architecting ideas into meaningful ventures.
          </p>
        </div>

        <div 
          className="relative w-full max-w-5xl h-[260px] sm:h-[300px] md:h-[320px] flex items-center justify-center mt-1 sm:mt-2"
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
                  className="absolute w-32 sm:w-40 md:w-44 h-44 sm:h-56 md:h-64 rounded-xl overflow-hidden border border-neutral-200/90 bg-white shadow-xl transition-all duration-100 ease-out pointer-events-none"
                  style={{
                    transform: `translate3d(${x}px, ${yArch}px, ${z}px) rotateY(${angle}deg)`,
                    opacity: isFacingFront ? opacity : 0.05,
                    zIndex: Math.round(z + radius),
                    filter: `brightness(${Math.max(0.7, (z + radius) / (radius * 1.3))}) contrast(105%)`
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
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[8px] tracking-widest uppercase font-medium text-white">
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
      <section id="about" className="py-40 px-8 sm:px-16 border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
          <div className="md:col-span-4">
            <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-neutral-400 block mb-6">
              01 / PERSPECTIVE
            </span>
            <p className="text-xs font-normal tracking-[0.25em] uppercase text-neutral-600 leading-relaxed">
              CREATIVE DIRECTION <br />
              VENTURE ARCHITECTURE <br />
              CULTURAL EQUITY
            </p>
          </div>

          <div className="md:col-span-8 space-y-12">
            <p className="text-3xl sm:text-4xl md:text-5xl font-light leading-[1.3] text-neutral-950">
              Building the Future of Creative Entrepreneurship
            </p>
            <p className="text-sm sm:text-base font-light text-neutral-600 leading-loose max-w-2xl">
              I’m Anees Ark, an entrepreneur driven by curiosity, creativity, technology, and the desire to build things that create real value. My work sits at the intersection of creative media, technology, design, and entrepreneurship, where I explore how ideas can evolve into meaningful experiences, products, and ventures.
              I don’t see creativity and technology as separate worlds. For me, they are two sides of the same process imagining something, finding a way to build it, and creating an impact through it. This perspective has shaped the way I approach every project, whether I’m working on a digital product, exploring a creative concept, developing a web experience, or experimenting with a new business idea.
              My journey is driven by a constant desire to learn, experiment, and build. I enjoy moving between different disciplines, understanding how they connect, and bringing them together to create something unique. From visual storytelling and creative production to digital products, web technologies, and business strategy, I’m always looking for new ways to expand what I can create.

            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 3: VENTURES & PORTFOLIO (MERGED ECOSYSTEM)
      ────────────────────────────────────────────── */}
      <section 
        id="ventures" 
        ref={venturesRef}
        className="relative bg-[#fafafa] border-t border-neutral-200 py-20 sm:py-28 px-6 sm:px-16 select-none overflow-hidden"
      >
        {/* Top Header */}
        <div className="max-w-6xl mx-auto w-full flex justify-between items-baseline border-b border-neutral-200 pb-6 mb-12">
          <div>
            <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-neutral-400 block mb-2">
              02 / ECOSYSTEM
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-wide uppercase text-neutral-950">
              VENTURES & PORTFOLIO
            </h2>
          </div>
          <div className="text-right text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
            <span>INDEX [{String(activeVentureIndex + 1).padStart(2, '0')} / {String(ventures.length).padStart(2, '0')}]</span>
          </div>
        </div>

        {/* Central Viewport with Live Logo Brand Display */}
        <div className="relative max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 my-4">
          
          {/* Left: Needle Ticker */}
          <div className="relative w-full lg:w-3/5 h-[380px] flex items-center overflow-hidden">
            {/* Stationary Needle (Center Locked) */}
            <div 
              className={`absolute left-2 sm:left-4 z-30 flex items-center gap-4 pointer-events-none transition-transform ${
                isNeedleTicking ? 'needle-tick-active' : ''
              }`}
              style={{
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              <span className="text-4xl sm:text-5xl font-light text-neutral-950 leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                →
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-ping" />
            </div>

            {/* Scrolling List: Item 0 starts centered on needle */}
            <div 
              className="w-full pl-16 sm:pl-28 transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)]"
              style={{
                transform: `translateY(calc(190px - ${ITEM_HEIGHT / 2}px - ${activeVentureIndex * ITEM_HEIGHT}px))`
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
                        ? 'opacity-100 blur-0 scale-100 text-neutral-950 font-normal'
                        : distance === 1
                        ? 'opacity-30 blur-[1.5px] scale-95 text-neutral-500 font-light'
                        : 'opacity-15 blur-[3px] scale-90 text-neutral-400 font-light'
                    }`}
                  >
                    <div className="flex items-baseline gap-4 sm:gap-8">
                      <span className="font-mono text-xs sm:text-sm tracking-widest text-neutral-400">
                        {venture.id}
                      </span>
                      <h3 className="text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight">
                        {venture.name}
                      </h3>
                    </div>

                    <div 
                      className={`flex items-center gap-4 sm:gap-6 pl-8 sm:pl-14 mt-2 transition-all duration-300 ${
                        isCurrent ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 overflow-hidden'
                      }`}
                    >
                     
                      <span className="text-[10px] font-mono tracking-widest text-neutral-400">
                        // {venture.period}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 border border-neutral-300 text-neutral-700 tracking-widest uppercase bg-white shadow-xs">
                        {venture.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top & Bottom Depth Vignettes */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#fafafa] to-transparent pointer-events-none z-20" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none z-20" />
          </div>

          {/* Right: Active Venture Brand Showcase Card */}
          <div className="w-full lg:w-2/5 flex flex-col items-center">
            <div className="w-full max-w-sm aspect-[4/3] rounded-2xl border border-neutral-200 bg-white p-8 flex items-center justify-center shadow-xs transition-all duration-500 relative group overflow-hidden">
              <span className="absolute top-3.5 left-4 text-[9px] font-mono tracking-widest text-neutral-400 uppercase">
                {ventures[activeVentureIndex].id} // BRAND IDENTITY
              </span>
              <span className="absolute top-3.5 right-4 text-[9px] font-mono px-2 py-0.5 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600 uppercase font-medium">
                {ventures[activeVentureIndex].status}
              </span>
              <img
                key={activeVentureIndex}
                src={ventures[activeVentureIndex].logo}
                alt={ventures[activeVentureIndex].name}
                className="w-full h-full object-contain transition-all duration-500 ease-out"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-500">
                ACTIVE FOCUS: <span className="text-neutral-900 font-medium">{ventures[activeVentureIndex].name}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Stepper info & dots */}
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center pt-6 border-t border-neutral-200 text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400">
          <span>SCROLL WHEEL OR CLICK TO STEP</span>
          <div className="flex gap-2 items-center">
            {ventures.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveVentureIndex(i)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === activeVentureIndex ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
          <span>SPRING KINEMATICS // 60 FPS</span>
        </div>

        {/* Unified Venture Cards Grid */}
        <div className="max-w-6xl mx-auto w-full mt-20 pt-16 border-t border-neutral-200">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-neutral-400 block mb-2">
                VENTURE PORTFOLIO
              </span>
              <h3 className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-neutral-950">
                COMPANIES & ENTITIES
              </h3>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              04 FOUNDED ENTITIES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {ventures.map((item, idx) => {
              const isSelected = idx === activeVentureIndex;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveVentureIndex(idx);
                    setIsNeedleTicking(true);
                    setTimeout(() => setIsNeedleTicking(false), 220);
                  }}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-neutral-900 shadow-md ring-1 ring-neutral-900'
                      : 'bg-white/70 border-neutral-200 hover:border-neutral-400 hover:bg-white shadow-xs'
                  }`}
                >
                  <div>
                    <div className="relative aspect-[3/4] bg-neutral-50 rounded-xl overflow-hidden mb-6 border border-neutral-100 flex items-center justify-center p-6 transition-all">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 ease-out"
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-2">
                      <span>{item.id}</span>
                      <span className="px-2 py-0.5 rounded-full border border-neutral-200 bg-neutral-100 text-neutral-700 text-[9px] uppercase font-medium">
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-medium tracking-tight text-neutral-950 mb-1">
                      {item.name}
                    </h4>

                    <p className="text-xs font-light text-neutral-600 leading-relaxed">
                      {item.role}
                    </p>
                  </div>

                  <p className="text-[10px] font-mono tracking-wider text-neutral-400 pt-4 mt-4 border-t border-neutral-100">
                    {item.period}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* ──────────────────────────────────────────────
          SECTION 5: MILESTONES & LEADERSHIP INDEX
      ────────────────────────────────────────────── */}
      <section id="index" className="relative py-44 px-8 sm:px-16 border-t border-neutral-200 bg-[#fafafa] overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 text-[18vw] font-thin text-neutral-950/[0.03] pointer-events-none select-none uppercase tracking-tighter leading-none">
          IMPACT
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-16 border-b border-neutral-200 gap-8">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.45em] uppercase text-neutral-400 mb-4">
                <span className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-ping" />
                <span>03 / TELEMETRY & METRICS</span>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase text-neutral-950">
                TRACK <span className="font-light italic text-neutral-400">RECORD.</span>
              </h2>
            </div>

            <div className="text-left md:text-right flex flex-col md:items-end text-[10px] font-medium tracking-[0.3em] uppercase text-neutral-400">
              <span>SYSTEM AUDIT: VERIFIED</span>
              <span className="text-neutral-700 mt-1">2018 — 2026 CUMULATIVE SCALE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 border-b border-neutral-200 bg-white shadow-xs">
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
                className={`group relative p-10 sm:p-14 transition-all duration-500 hover:bg-neutral-50/80 cursor-crosshair overflow-hidden ${
                  idx >= 2 ? 'md:border-t border-neutral-200' : ''
                }`}
              >
                <span className="absolute top-4 left-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
                <span className="absolute top-4 right-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
                <span className="absolute bottom-4 left-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
                <span className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>

                <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-400 mb-10">
                  <span>{metric.id}</span>
                  <span className="uppercase tracking-[0.2em] text-neutral-500 group-hover:text-neutral-900 transition-colors font-medium">
                    {metric.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-6 mb-4">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-light tracking-tighter uppercase text-neutral-950 group-hover:text-black transition-all duration-300 group-hover:translate-x-1">
                    {metric.val}
                  </span>

                  <div className="flex items-end gap-1 h-10 pb-2">
                    {metric.bars.map((bar, barIdx) => (
                      <div
                        key={barIdx}
                        className="w-1 bg-neutral-200 group-hover:bg-neutral-900 transition-all duration-500 rounded-full"
                        style={{
                          height: `${bar * 0.45}%`,
                          transitionDelay: `${barIdx * 35}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-sm font-medium tracking-[0.25em] uppercase text-neutral-900 mb-2">
                  {metric.label}
                </h3>
                <p className="text-xs font-normal tracking-wide text-neutral-500 group-hover:text-neutral-700 transition-colors max-w-sm leading-relaxed">
                  {metric.meta}
                </p>

                <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-neutral-100 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400 gap-4">
            <span>SOURCE: INDEPENDENT ENTERPRISE VALUATION & AUDIT RECORDS</span>
            <span>CURRENCY: USD // REAL-TIME METRIC CACHE</span>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 6: VISION & MISSION (ENHANCED EDITORIAL DESIGN)
      ────────────────────────────────────────────── */}
      <section id="philosophy" className="relative py-40 px-8 sm:px-16 border-t border-neutral-200 bg-white overflow-hidden">
        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-neutral-100/70 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#ff5500]/[0.025] rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-16 border-b border-neutral-200 gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.45em] uppercase text-neutral-400 mb-4">
                <span className="w-1.5 h-1.5 bg-[#ff5500] rounded-full animate-pulse" />
                <span>04 / GUIDING PRINCIPLES</span>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight uppercase text-neutral-950">
                VISION & <span className="font-light italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-transparent">MISSION.</span>
              </h2>
            </div>

            <div className="text-left md:text-right flex flex-col md:items-end text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400">
              <span>ETHOS // CORE PILLARS</span>
              <span className="text-neutral-800 font-medium mt-1">THE FOUNDATIONAL BLUEPRINT</span>
            </div>
          </div>

          {/* Cards Grid: Core Vision & Core Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            
            {/* ────────── CARD 1: CORE VISION ────────── */}
            <div className="group relative p-10 sm:p-14 rounded-3xl border border-neutral-200 bg-gradient-to-b from-[#fafafa] to-white hover:border-neutral-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col justify-between">
              {/* Architectural Watermark */}
              <div className="absolute -right-4 -bottom-6 text-[11rem] font-thin text-neutral-950/[0.025] pointer-events-none select-none uppercase tracking-tighter leading-none">
                VISION
              </div>

              {/* Corner Telemetry Marks */}
              <span className="absolute top-4 left-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
              <span className="absolute top-4 right-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
              <span className="absolute bottom-4 left-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
              <span className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>

              <div>
                {/* Header Tag Bar */}
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-white text-[10px] font-mono">
                      01
                    </span>
                    <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-400">
                      FOUNDATIONAL HORIZON
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest px-3.5 py-1 rounded-full border border-neutral-300 bg-white text-neutral-800 uppercase font-medium shadow-2xs">
                    CORE VISION
                  </span>
                </div>

                {/* Main Statement */}
                <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-light leading-[1.3] text-neutral-950 tracking-tight mb-8">
                  To build a <span className="font-medium underline decoration-[#ff5500]/40 decoration-2 underline-offset-8">creator-first ecosystem</span> where creativity becomes careers, businesses, and lasting opportunities.
                </h3>

                {/* Sub-Pillars / Breakdown */}
                <div className="space-y-3.5 pt-8 border-t border-neutral-200/80">
                  {[
                    { tag: "CAREERS", desc: "Transforming raw creative talent into sustainable, long-term careers." },
                    { tag: "BUSINESSES", desc: "Empowering creators to establish scalable, independent businesses." },
                    { tag: "OPPORTUNITY", desc: "Creating durable networks that unlock continuous, lasting opportunities." }
                  ].map((pillar, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-100/60 transition-colors">
                      <span className="text-[10px] font-mono tracking-wider text-neutral-400 mt-0.5 min-w-[85px]">
                        [{pillar.tag}]
                      </span>
                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Telemetry */}
              <div className="pt-8 mt-8 border-t border-neutral-200/60 flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                <span>FOCUS // ECOSYSTEM SCALE</span>
                <span className="group-hover:text-neutral-900 transition-colors">ACTIVE DIRECTIVE →</span>
              </div>
            </div>

            {/* ────────── CARD 2: CORE MISSION ────────── */}
            <div className="group relative p-10 sm:p-14 rounded-3xl border border-neutral-200 bg-gradient-to-b from-[#fafafa] to-white hover:border-neutral-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col justify-between">
              {/* Architectural Watermark */}
              <div className="absolute -right-4 -bottom-6 text-[11rem] font-thin text-neutral-950/[0.025] pointer-events-none select-none uppercase tracking-tighter leading-none">
                MISSION
              </div>

              {/* Corner Telemetry Marks */}
              <span className="absolute top-4 left-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
              <span className="absolute top-4 right-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
              <span className="absolute bottom-4 left-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>
              <span className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-300 group-hover:text-neutral-500 transition-colors">+</span>

              <div>
                {/* Header Tag Bar */}
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 text-white text-[10px] font-mono">
                      02
                    </span>
                    <span className="text-xs font-mono tracking-[0.25em] uppercase text-neutral-400">
                      OPERATIONAL VECTOR
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest px-3.5 py-1 rounded-full border border-neutral-300 bg-white text-neutral-800 uppercase font-medium shadow-2xs">
                    CORE MISSION
                  </span>
                </div>

                {/* Main Statement */}
                <h3 className="text-2xl sm:text-3xl lg:text-[2rem] font-light leading-[1.3] text-neutral-950 tracking-tight mb-8">
                  <span className="font-medium underline decoration-[#ff5500]/40 decoration-2 underline-offset-8">Empower creative talent</span> through education, innovation, and entrepreneurship while building ventures that shape the future of the creative economy.
                </h3>

                {/* Sub-Pillars / Breakdown */}
                <div className="space-y-3.5 pt-8 border-t border-neutral-200/80">
                  {[
                    { tag: "EDUCATION", desc: "Imparting cutting-edge craft, design leadership, and digital literacy." },
                    { tag: "INNOVATION", desc: "Pioneering novel tools, creative interfaces, and technical systems." },
                    { tag: "VENTURES", desc: "Incubating dynamic companies that redefine the creative industry." }
                  ].map((pillar, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-neutral-100/60 transition-colors">
                      <span className="text-[10px] font-mono tracking-wider text-neutral-400 mt-0.5 min-w-[85px]">
                        [{pillar.tag}]
                      </span>
                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Telemetry */}
              <div className="pt-8 mt-8 border-t border-neutral-200/60 flex justify-between items-center text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                <span>EXECUTION // VENTURE CATALYST</span>
                <span className="group-hover:text-neutral-900 transition-colors">ACTIVE VECTOR →</span>
              </div>
            </div>

          </div>

          {/* Bottom Philosophical Quote Bar */}
          <div className="mt-14 p-8 sm:p-10 rounded-2xl border border-neutral-200 bg-[#fafafa] flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl text-[#ff5500] font-serif leading-none">“</span>
              <p className="text-xs sm:text-sm font-light text-neutral-700 tracking-wide leading-relaxed">
                Bridging radical creative expression with scalable business infrastructure to make creativity permanent.
              </p>
            </div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase shrink-0">
              ANEES ARK // THESIS
            </span>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 7: ADVISORY, CONTACT & TRANSMISSION
      ────────────────────────────────────────────── */}
      <footer id="contact" className="pt-36 pb-16 px-8 sm:px-16 border-t border-neutral-200 bg-[#fafafa] flex flex-col justify-between min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
          <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-neutral-400 block mb-8">
            05 / INQUIRIES & ADVISORY
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 mb-20">
            {/* Left Column: Vision & Direct Channel */}
            <div className="lg:col-span-5 space-y-10">
              <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-[1.05] uppercase text-neutral-950">
                LET’S BUILD <br />
                SOMETHING <br />
                <span className="font-light italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 bg-clip-text text-transparent">
                  Meaningful.
                </span>
              </h2>

              <p className="text-sm font-light text-neutral-600 leading-relaxed max-w-md">
                Available for creative production, venture architecture, and strategic advisory. Dispatch a direct transmission or contact via primary channel.
              </p>

              <div className="space-y-4 pt-6 border-t border-neutral-200">
                <p className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">Direct Channel</p>
                <a
                  href="mailto:contact@aneesark.com"
                  className="inline-block text-xl sm:text-2xl font-light tracking-wider text-neutral-900 hover:text-black border-b border-neutral-300 hover:border-black pb-1 transition-all"
                >
                  CONTACT@ANEESARK.COM
                </a>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ACCEPTING SELECT VENTURE INQUIRIES</span>
              </div>
            </div>

            {/* Right Column: Transmission Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-2xl border border-neutral-200 bg-white shadow-xs">
                <div className="flex justify-between items-baseline border-b border-neutral-100 pb-5 mb-8">
                  <div>
                    <h3 className="text-lg font-normal text-neutral-900 tracking-tight">TRANSMIT INQUIRY</h3>
                    <p className="text-xs font-light text-neutral-500 mt-0.5">Dispatched directly to primary inbox</p>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                    DIRECT DISPATCH
                  </span>
                </div>

                {formStatus === 'success' ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-xl font-light">
                      ✓
                    </div>
                    <h4 className="text-xl font-light text-neutral-900">Message Received</h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. Your dispatch has been transmitted to Anees Ark and will be reviewed shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus('idle')}
                      className="mt-4 inline-block text-xs font-mono tracking-wider uppercase text-neutral-600 hover:text-black underline underline-offset-4"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Inquiry Scope Chips */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase mb-2.5">
                        Inquiry Scope
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Venture Advisory', 'Creative Direction', 'Platform Architecture', 'General'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, subject: type })}
                            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                              formData.subject === type
                                ? 'bg-neutral-900 border-neutral-900 text-white font-normal'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-400'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Name"
                          className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase mb-2">
                        Message / Project Brief *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Outline the scope, thesis, or collaboration..."
                        className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400 resize-none"
                      />
                    </div>

                    {formErrorMessage && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                        <span>{formErrorMessage}</span>
                        <button type="button" onClick={() => setFormErrorMessage('')} className="text-red-500 font-bold ml-2">×</button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full group flex items-center justify-center gap-3 rounded-full bg-[#ff5500] hover:bg-[#e04b00] text-white py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 disabled:opacity-60 shadow-xs hover:shadow-[0_4px_20px_rgba(255,85,0,0.35)] active:scale-[0.99]"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Transmitting Dispatch...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full pt-16 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-[0.35em] text-neutral-500 uppercase gap-6">
          <span>© {new Date().getFullYear()} ANEES ARK — ALL RIGHTS RESERVED</span>
          <div className="flex gap-8">
            <a 
              href="https://www.instagram.com/anees_ark/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-black transition-colors"
            >
              INSTAGRAM
            </a>
            <a 
              href="https://www.linkedin.com/in/anees-ark-bb77a1265/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-black transition-colors"
            >
              LINKEDIN
            </a>
          </div>
          <span>BERLIN / LONDON</span>
        </div>
      </footer>

    </div>
  );
}