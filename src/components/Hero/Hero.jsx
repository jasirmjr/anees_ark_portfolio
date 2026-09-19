import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import heroPortrait from '../../assets/anees_portrait.png';

function AnimatedCounter({ target, suffix = '', padZero = true, isVisible, duration = 1300 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTimestamp = null;
    let reqId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic curve
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));

      if (progress < 1) {
        reqId = requestAnimationFrame(step);
      }
    };

    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [isVisible, target, duration]);

  const formatted = padZero ? String(count).padStart(2, '0') : String(count);
  return <>{formatted}{suffix}</>;
}

export default function FounderPortfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);

  // Section 1 (Hero) entrance animations observer (re-triggers every time user enters Section 1)
  const heroRef = useRef(null);
  const [heroAnimKey, setHeroAnimKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroAnimKey((prev) => prev + 1);
        }
      },
      { threshold: 0.15 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Re-triggering counter animation observer
  const [isMetricsVisible, setIsMetricsVisible] = useState(false);
  const metricsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMetricsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Section 2 scroll-down visibility observer (re-triggers every time user enters Section 2)
  const [isSection2Visible, setIsSection2Visible] = useState(false);
  const section2Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSection2Visible(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleVideoAudio = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsVideoMuted(nextMuted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // ──────────────────────────────────────────────
  // SECTION 3: VENTURES ENTRANCE ANIMATION OBSERVER
  // Re-triggers every time user scrolls into Section 3
  // ──────────────────────────────────────────────
  const venturesRef = useRef(null);
  const [venturesAnimKey, setVenturesAnimKey] = useState(0);
  const [isVenturesVisible, setIsVenturesVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVenturesVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setVenturesAnimKey((prev) => prev + 1);
        }
      },
      { threshold: 0.08 }
    );

    if (venturesRef.current) {
      observer.observe(venturesRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ──────────────────────────────────────────────
  // SECTION 4: VISION & MISSION INTERACTIVE 3D MOTION & SPOTLIGHT
  // ──────────────────────────────────────────────
  const section4Ref = useRef(null);
  const [isSection4Visible, setIsSection4Visible] = useState(false);
  const [section4AnimKey, setSection4AnimKey] = useState(0);
  const [card1Tilt, setCard1Tilt] = useState({ rotateX: 0, rotateY: 0, spotX: 0, spotY: 0, isHovered: false });
  const [card2Tilt, setCard2Tilt] = useState({ rotateX: 0, rotateY: 0, spotX: 0, spotY: 0, isHovered: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSection4Visible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setSection4AnimKey((prev) => prev + 1);
        }
      },
      { threshold: 0.15 }
    );

    if (section4Ref.current) {
      observer.observe(section4Ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // ──────────────────────────────────────────────
  // CONTACT SECTION: SCROLL-TRIGGERED MAXIMUM ANIMATION OBSERVER
  // ──────────────────────────────────────────────
  const contactRef = useRef(null);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [contactAnimKey, setContactAnimKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContactVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setContactAnimKey((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardMouseMove = (e, setTilt) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate 3D tilt: smooth -7deg to +7deg
    const rotateY = ((x - centerX) / centerX) * 7.5;
    const rotateX = -((y - centerY) / centerY) * 7.5;
    setTilt({
      rotateX,
      rotateY,
      spotX: x,
      spotY: y,
      isHovered: true,
    });
  };

  const handleCardMouseLeave = (setTilt) => {
    setTilt(prev => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    }));
  };

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
  // VENTURES & ECOSYSTEM DATA
  // ──────────────────────────────────────────────
  const ventures = [
    { 
      id: "01", 
      name: "LYF ADS", 
      role: "Founder & Creative Director",
      subtitle: "Creative Advertising Studio",
      category: "Creative Advertising Studio",
      period: "2018 — Present",
      status: "Active", 
      badge: "SCALING GLOBALLY",
      logo: "/LYFADS_Identity__1.png",
      image: "/ventures/lyfads.jpg",
      url: "https://lyfads.com",
      description: "Founded in 2018, LYF ADS is a premier visual design and creative advertising agency built to transform bold ideas into distinctive market leaders through brand architecture, visual media, and commercial campaigns.",
      shortDescription: "Premier creative advertising and brand architecture agency crafting comprehensive visual identities, omnichannel campaigns, and commercial media.",
      stat1: { label: "ESTABLISHED", value: "2018" },
      stat2: { label: "CLIENT IMPACT", value: "150+ Brands" },
      tags: ["Brand Architecture", "Campaign Direction", "Visual Media", "Omnichannel"]
    },
    { 
      id: "02", 
      name: "SEKRICK", 
      role: "Founder & Executive Director",
      subtitle: "Film Production & Commercial Studio",
      category: "Film Production House",
      period: "2026 — Present",
      status: "Active", 
      badge: "NEW VENTURE",
      logo: "/black logo.png",
      image: "/ventures/sekrick.jpg",
      url: "https://sekrick.com",
      description: "SEKRICK is an avant-garde creative production house and film direction studio dedicated to cinematic excellence, commercial brand films, and narrative depth.",
      shortDescription: "Avant-garde creative production house conceptualizing and directing broadcast commercials, cinema brand films, and visual campaigns.",
      stat1: { label: "DISCIPLINE", value: "Film Direction" },
      stat2: { label: "FORMAT", value: "Cinema 4K/8K" },
      tags: ["Commercial Production", "Cinematic Direction", "Film Production", "Post-VFX"]
    },
    { 
      id: "03", 
      name: "CREATER'S LAB", 
      role: "Founder & Product Architect",
      subtitle: "Hardware & Tooling Lab",
      category: "Hardware Incubator",
      period: "2026 — Present",
      status: "Active", 
      badge: "IN CUBATION",
      logo: "/Logo-Creators-Lab.png",
      image: "/ventures/createrslab.jpg",
      url: "https://createrslab.com",
      description: "CREATER'S LAB is a next-generation experimental innovation lab and specialty hardware incubator focused on tangible user interfaces and physical creative instruments.",
      shortDescription: "Experimental hardware innovation lab and incubator prototyping tangible user interfaces, tactile controllers, and dedicated creator instruments.",
      stat1: { label: "DOMAIN", value: "Tangible UI" },
      stat2: { label: "FOCUS", value: "Creator Tools" },
      tags: ["Experimental Hardware", "Tangible Interfaces", "Industrial CAD", "Prototyping"]
    }
  ];



  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-neutral-900 selection:text-white antialiased overflow-x-clip">

      {/* Keyframes for Section 1 Marquee & Section 4 Living Motion */}
      <style>{`
        @keyframes ventureFadeIn {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroNameFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -220px, 0);
          }
          65% {
            opacity: 1;
            transform: translate3d(0, 12px, 0);
          }
          85% {
            transform: translate3d(0, -4px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes heroTaglineFadeIn {
          0% {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes heroRightSlideIn {
          0% {
            opacity: 0;
            transform: translate3d(65px, 0, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes aneesMarqueeRTL {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(45px, -35px, 0) scale(1.12); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-40px, 45px, 0) scale(1.15); }
        }
        @keyframes cardRiseLeft {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateY(-8deg) translateY(50px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) translateY(0) scale(1);
          }
        }
        @keyframes cardRiseRight {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateY(8deg) translateY(50px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) translateY(0) scale(1);
          }
        }
        @keyframes cardSheenSweep {
          0% {
            transform: translateX(-130%) skewX(-22deg);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          65% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(280%) skewX(-22deg);
            opacity: 0;
          }
        }
        @keyframes contactRiseLeft {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateY(-8deg) translateY(55px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) translateY(0) scale(1);
          }
        }
        @keyframes contactRiseRight {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateY(8deg) translateY(55px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) translateY(0) scale(1);
          }
        }
        @keyframes contactHeaderRise {
          0% {
            opacity: 0;
            transform: translateY(35px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes underlineExpand {
          0% {
            width: 0%;
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }
        @keyframes pillarSlideIn {
          0% {
            opacity: 0;
            transform: translateX(-24px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes floatWatermark1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-14px, -12px, 0) scale(1.03);
          }
        }
        @keyframes floatWatermark2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(12px, -14px, 0) scale(1.03);
          }
        }
        @keyframes idleSpotDrift1 {
          0% {
            transform: translate3d(10%, 15%, 0);
          }
          33% {
            transform: translate3d(65%, 35%, 0);
          }
          66% {
            transform: translate3d(30%, 75%, 0);
          }
          100% {
            transform: translate3d(10%, 15%, 0);
          }
        }
        @keyframes idleSpotDrift2 {
          0% {
            transform: translate3d(70%, 65%, 0);
          }
          33% {
            transform: translate3d(25%, 45%, 0);
          }
          66% {
            transform: translate3d(60%, 15%, 0);
          }
          100% {
            transform: translate3d(70%, 65%, 0);
          }
        }

        /* ─── SECTION 3: VENTURE CARDS REVEAL ANIMATIONS (CENTER EMERGE + FLANK SLIDE OUT) ─── */
        @keyframes centerCardEmerge {
          0% {
            opacity: 0;
            transform: translate3d(0, 45px, 0) scale(0.90);
          }
          60% {
            opacity: 1;
            transform: translate3d(0, -6px, 0) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes leftCardSlideDesktop {
          0% {
            opacity: 0;
            transform: translate3d(calc(100% + 2rem), 0, 0) scale(0.88);
          }
          25% {
            opacity: 0.85;
          }
          80% {
            transform: translate3d(-8px, 0, 0) scale(1.015);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes rightCardSlideDesktop {
          0% {
            opacity: 0;
            transform: translate3d(calc(-100% - 2rem), 0, 0) scale(0.88);
          }
          25% {
            opacity: 0.85;
          }
          80% {
            transform: translate3d(8px, 0, 0) scale(1.015);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes leftCardSlideMobile {
          0% {
            opacity: 0;
            transform: translate3d(0, calc(100% + 1.5rem), 0) scale(0.9);
          }
          35% {
            opacity: 0.85;
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes rightCardSlideMobile {
          0% {
            opacity: 0;
            transform: translate3d(0, calc(-100% - 1.5rem), 0) scale(0.9);
          }
          35% {
            opacity: 0.85;
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @media (min-width: 768px) {
          .venture-anim-center {
            animation: centerCardEmerge 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
            position: relative;
            z-index: 30;
            will-change: transform, opacity;
          }
          .venture-anim-left {
            animation: leftCardSlideDesktop 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
            position: relative;
            z-index: 10;
            will-change: transform, opacity;
          }
          .venture-anim-right {
            animation: rightCardSlideDesktop 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
            position: relative;
            z-index: 10;
            will-change: transform, opacity;
          }
        }
        @media (max-width: 767px) {
          .venture-anim-center {
            animation: centerCardEmerge 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
            position: relative;
            z-index: 30;
            will-change: transform, opacity;
          }
          .venture-anim-left {
            animation: leftCardSlideMobile 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
            position: relative;
            z-index: 10;
            will-change: transform, opacity;
          }
          .venture-anim-right {
            animation: rightCardSlideMobile 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
            position: relative;
            z-index: 10;
            will-change: transform, opacity;
          }
        }

        

        
      `}</style>

      {/* ──────────────────────────────────────────────
          SECTION 1: EDITORIAL EXECUTIVE HERO
      ────────────────────────────────────────────── */}
      {/* ──────────────────────────────────────────────
          SECTION 1: EDITORIAL EXECUTIVE HERO (3D LAYERED REFERENCE)
      ────────────────────────────────────────────── */}
      <section 
        ref={heroRef}
        className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-5 sm:py-6 md:py-8 px-4 sm:px-8 md:px-12 lg:px-16 border-b border-neutral-200 bg-[#fafafa] overflow-hidden select-none"
      >
        
        {/* Subtle Architectural Drafting Dot-Grid Background (Matching reference) */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60 pointer-events-none z-0" />

        {/* Ambient Subtle Architectural Mesh Lighting */}
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-neutral-200/50 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] bg-[#e5252a]/[0.04] rounded-full blur-[120px] pointer-events-none z-0" />


        {/* ─── DESKTOP STAGE (lg:flex): EXACT LAPTOP VIEW FROM REFERENCE ─── */}
        <div className="hidden lg:flex relative z-10 max-w-7xl mx-auto w-full flex-1 flex-col justify-center my-auto min-h-[640px] xl:min-h-[700px]">
          
          {/* LAYER 1: GIANT NAME TYPOGRAPHY IN THE BACK (Falling from top behind Model z-10) */}
          <div 
            key={`hero-name-layer-desktop-${heroAnimKey}`}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none z-10 overflow-hidden py-4 sm:py-6"
          >
            {/* Top Row: ANEES */}
            <div className="flex items-baseline justify-start">
              <span 
                style={{ animation: 'heroNameFall 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both' }}
                className="text-[13.5rem] xl:text-[16rem] font-black uppercase tracking-tighter leading-[0.80] text-neutral-950/95 font-sans will-change-transform"
              >
                ANEES
              </span>
            </div>

            {/* Middle Row: ARK */}
            <div className="flex items-baseline justify-start pl-[5rem]">
              <span 
                style={{ animation: 'heroNameFall 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both' }}
                className="text-[13.5rem] xl:text-[16rem] font-black uppercase tracking-tighter leading-[0.80] text-[#e5252a] font-sans will-change-transform"
              >
                ARK
              </span>
            </div>

            {/* Tagline Row: VENTURES */}
            <div className="flex items-center justify-start pt-3 pl-[5.5rem]">
              <div 
                style={{ animation: 'heroTaglineFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.2s both' }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white/95 shadow-2xs backdrop-blur-sm will-change-transform"
              >
                <span className="w-2 h-2 rounded-full bg-[#e5252a] animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-700 font-bold">
                  VENTURES // CREATIVE ARCHITECT
                </span>
              </div>
            </div>
          </div>

          {/* LAYER 2: MODEL CUTOUT (In Front of All Text z-20 - Grounded & Static) */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-20 overflow-visible">
            <div className="relative h-full max-h-[820px] aspect-[1827/3658] pointer-events-auto flex items-end justify-center">
              <img
                src={heroPortrait}
                alt="Anees Ark"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
                }}
                className="w-full h-full object-contain object-bottom filter brightness-[1.02] contrast-[1.03]"
              />
            </div>
          </div>

          {/* LAYER 3: FOREGROUND EDITORIAL CONTENT ON THE RIGHT (z-30) */}
          <div className="relative z-30 w-full grid grid-cols-12 gap-6 pointer-events-none items-end">
            <div className="col-span-7 xl:col-span-8" />

            {/* Right side editorial panel */}
            <div 
              key={`hero-right-card-${heroAnimKey}`}
              style={{ animation: 'heroRightSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
              className="col-span-5 xl:col-span-4 flex flex-col justify-end space-y-3.5 pointer-events-auto p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-neutral-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.06)] will-change-transform"
            >
              

              <div>
                <h2 
                  style={{ animation: 'heroRightSlideIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}
                  className="text-2xl xl:text-3xl font-black uppercase tracking-tight text-neutral-950 leading-tight"
                >
                  Creative Entrepreneur & Venture Architect
                </h2>
              </div>

              <p 
                style={{ animation: 'heroRightSlideIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both' }}
                className="text-xs xl:text-sm font-light text-neutral-600 leading-relaxed"
              >
                Operating at the convergence of creative media, venture architecture, and digital systems. Empowering creative talent and incubating companies that shape the modern economy.
              </p>

             

              {/* CTAs */}
              <div 
                style={{ animation: 'heroRightSlideIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both' }}
                className="flex items-center gap-2.5 pt-1"
              >
                <a
                  href="#ventures"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('ventures')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#e5252a] hover:bg-[#cb1d22] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-[0_4px_16px_rgba(229,37,42,0.35)] active:scale-95 cursor-pointer"
                >
                  <span>Explore Ventures</span>
                  <span className="text-xs group-hover:translate-y-0.5 transition-transform">↓</span>
                </a>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Inquire</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MOBILE & TABLET STAGE (< lg): MAXIMUM PARITY WITH LAPTOP VIEW ─── */}
        <div className="lg:hidden relative z-10 max-w-lg mx-auto w-full flex-1 flex flex-col justify-center my-auto py-1 gap-1.5 sm:gap-2">
          
          {/* TOP VISUAL STAGE: TEXT ON LEFT, MODEL ON RIGHT (Exact composition of laptop view!) */}
          <div className="relative w-full h-[48vh] min-h-[330px] max-h-[440px] flex items-end overflow-hidden">
            
            {/* LAYER 1: NAME ON THE LEFT (Completely visible, not covered by model!) */}
            <div 
              key={`hero-mobile-name-${heroAnimKey}`}
              className="absolute left-1 inset-y-0 flex flex-col justify-center pointer-events-none select-none z-10 py-2"
            >
              {/* ANEES */}
              <div className="flex items-baseline justify-start">
                <span 
                  style={{ animation: 'heroNameFall 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both' }}
                  className="text-[16vw] xs:text-[14vw] sm:text-7xl font-black uppercase tracking-tighter leading-[0.80] text-neutral-950/95 font-sans will-change-transform"
                >
                  ANEES
                </span>
              </div>

              {/* ARK */}
              <div className="flex items-baseline justify-start pl-1 sm:pl-3">
                <span 
                  style={{ animation: 'heroNameFall 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both' }}
                  className="text-[17.5vw] xs:text-[15.5vw] sm:text-8xl font-black uppercase tracking-tighter leading-[0.80] text-[#e5252a] font-sans will-change-transform"
                >
                  ARK
                </span>
              </div>

              {/* Tagline Pill */}
              <div className="flex items-center justify-start pt-2 pl-1 sm:pl-3">
                <div 
                  style={{ animation: 'heroTaglineFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both' }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-300 bg-white/95 shadow-2xs backdrop-blur-sm will-change-transform"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5252a] animate-pulse" />
                  <span className="text-[8.5px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-700 font-bold">
                    VENTURES // CREATIVE ARCHITECT
                  </span>
                </div>
              </div>
            </div>

            {/* LAYER 2: MODEL ON THE RIGHT (Overlaps right side of text in 3D!) */}
            <div className="absolute right-0 bottom-0 top-0 w-[58%] max-w-[260px] flex items-end justify-end pointer-events-none z-20 overflow-visible">
              <div className="relative h-full aspect-[1827/3658] pointer-events-auto flex items-end justify-end">
                <img
                  src={heroPortrait}
                  alt="Anees Ark"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                  }}
                  className="w-full h-full object-contain object-bottom filter brightness-[1.02] contrast-[1.03]"
                />
              </div>
            </div>

          </div>

          {/* EDITORIAL CARD ON MOBILE (Directly connected below model image - zero blank space!) */}
          <div 
            key={`hero-mobile-card-${heroAnimKey}`}
            style={{ animation: 'heroRightSlideIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}
            className="relative z-30 -mt-3 sm:-mt-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.05)] space-y-2.5 pointer-events-auto"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#e5252a] uppercase font-bold">
                DISCIPLINE // DIRECTION
              </span>
              <div className="flex gap-1">
                {["Media", "Tools", "Ventures"].map((t) => (
                  <span key={t} className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-neutral-950 leading-snug">
                Creative Entrepreneur & Venture Architect
              </h2>
              <p className="text-[11px] sm:text-xs font-light text-neutral-600 leading-relaxed mt-1">
                Operating at the convergence of creative media, venture architecture, and digital systems. Empowering creative talent and incubating companies.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 pt-0.5">
              <a
                href="#ventures"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('ventures')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 group relative inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#e5252a] hover:bg-[#cb1d22] text-white text-[11px] font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer text-center"
              >
                <span>Explore Ventures</span>
                <span className="text-xs">↓</span>
              </a>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 group inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer text-center"
              >
                <span>Inquire</span>
                <span className="text-xs">→</span>
              </a>
            </div>
          </div>

        </div>


      </section>

      {/* ──────────────────────────────────────────────
          SECTION 2: FOUNDER'S THESIS & STATEMENT
      ────────────────────────────────────────────── */}
      <section 
        id="about" 
        ref={section2Ref}
        className="relative py-8 sm:py-12 md:py-14 lg:py-16 px-4 sm:px-8 md:px-12 lg:px-16 border-t border-neutral-200 bg-white overflow-hidden"
      >
        {/* Ambient Subtle Architectural Red Lighting */}
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-[#e5252a]/[0.035] rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] bg-[#e5252a]/[0.03] rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-12 gap-3 sm:gap-6 md:gap-8 lg:gap-12 items-start md:items-center">
          
          {/* Left Column: Video with smooth scroll-down entrance */}
          <div className={`col-span-5 md:col-span-5 lg:col-span-4 flex justify-center md:justify-start transition-all duration-1000 ease-out transform ${
            isSection2Visible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-16 scale-[0.96]'
          }`}>
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] md:max-w-none aspect-[9/16] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-neutral-200 hover:border-[#e5252a]/40 bg-neutral-950 shadow-md group transition-colors duration-300">
              {/* Subtle top red accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e5252a] to-transparent opacity-85 z-20" />

              <video
                ref={videoRef}
                src="/anees.mp4"
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Gradient scrim overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              {/* Sound Toggle Button (Mute / Unmute) */}
              <button
                type="button"
                onClick={toggleVideoAudio}
                className="absolute bottom-2 right-2 sm:bottom-3.5 sm:right-3.5 md:bottom-4 md:right-4 z-20 inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/25 hover:border-[#e5252a]/70 text-white transition-all active:scale-95 cursor-pointer shadow-sm"
                title={isVideoMuted ? "Click to unmute sound" : "Click to mute sound"}
                aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
              >
                {isVideoMuted ? (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e5252a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Statement with staggered scroll-down entrance */}
          <div className={`col-span-7 md:col-span-7 lg:col-span-8 flex flex-col justify-center space-y-2 sm:space-y-3.5 md:space-y-4.5 transition-all duration-1000 delay-150 ease-out transform ${
            isSection2Visible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}>
            {/* Kicker Tag: Red Brand Pill */}
            <div>
              

              {/* Heading: Highlighting the Founder & Vision with Red Accent */}
              <h2 className="text-xs sm:text-2xl md:text-3xl lg:text-5xl font-bold tracking-tight uppercase leading-tight sm:leading-[1.15] text-neutral-950">
                BUILDING THE FUTURE OF <span className="font-bold italic text-[#e5252a]">CREATIVE ENTREPRENEURSHIP.</span>
              </h2>
            </div>

            {/* Founder Lead Statement (High Priority to the Founder with Red Bar & Highlight) */}
            <div className="space-y-1.5 sm:space-y-2.5 md:space-y-3.5 text-neutral-700 leading-relaxed font-light">
              <div className="p-2 sm:p-3.5 rounded-xl bg-gradient-to-r from-red-500/[0.04] via-red-500/[0.01] to-transparent border-l-[3px] border-[#e5252a]">
                <p className="text-[10px] sm:text-sm md:text-base lg:text-[17px] font-normal text-neutral-950 leading-snug sm:leading-relaxed">
                  I’m <strong className="font-bold text-[#e5252a]">Anees Ark</strong>, an entrepreneur driven by curiosity, creativity, technology, and the desire to build things that create real value. My work sits at the intersection of creative media, technology, design, and entrepreneurship, where I explore how ideas can evolve into meaningful experiences, products, and ventures.
                </p>
              </div>
              
              <p className="text-[9px] sm:text-xs md:text-sm text-neutral-600 leading-normal sm:leading-relaxed">
                I don’t see creativity and technology as separate worlds. For me, they are two sides of the same process — imagining something, finding a way to build it, and creating an impact through it. This perspective has shaped the way I approach every project, whether I’m working on a digital product, exploring a creative concept, developing a web experience, or experimenting with a new business idea.
              </p>
              
              <p className="text-[9px] sm:text-xs md:text-sm text-neutral-600 leading-normal sm:leading-relaxed">
                My journey is driven by a constant desire to learn, experiment, and build. I enjoy moving between different disciplines, understanding how they connect, and bringing them together to create something unique. From visual storytelling and creative production to digital products, web technologies, and business strategy, I’m always looking for new ways to expand what I can create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 3: COMPANIES & ENTITIES — REFERENCE CARD STYLE WITH CENTER EMERGENCE
      ────────────────────────────────────────────── */}
      <section
        id="ventures"
        ref={venturesRef}
        className="relative bg-[#fafafa] border-t border-neutral-200 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
      >
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] bg-gradient-to-bl from-neutral-200/50 to-transparent rounded-full blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 -left-48 w-[500px] h-[500px] bg-[#e5252a]/[0.03] rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-5 mb-8 sm:mb-12 gap-4">
            <div>
              
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-neutral-950">
                COMPANIES & <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-[#e5252a]">ENTITIES.</span>
              </h2>
            </div>
            
          </div>

          {/* 3-Card Responsive Grid with Re-triggering Keyframe Choreography */}
          <div 
            key={`ventures-grid-${venturesAnimKey}`} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch"
          >
            {ventures.map((venture, idx) => {
              const animClass = isVenturesVisible
                ? (idx === 1 ? 'venture-anim-center' : idx === 0 ? 'venture-anim-left' : 'venture-anim-right')
                : 'opacity-0';

              return (
                <div
                  key={venture.id}
                  className={`group relative rounded-[32px] sm:rounded-[36px] border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-[0_15px_40px_-12px_rgba(0,0,0,0.07)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between overflow-hidden ${animClass}`}
                >
                  <div>
                    {/* Top Brand Logo Showcase Box (Replaces photo background) */}
                    <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-[24px] bg-gradient-to-b from-[#f9f9fb] via-[#f4f4f6] to-[#ededf0] border border-neutral-200/70 mb-4 flex items-center justify-center p-6 sm:p-8 overflow-hidden group-hover:border-neutral-300 group-hover:from-white group-hover:to-[#f5f5f7] transition-all duration-300 shadow-2xs">
                      {/* Subtle dot-grid architectural texture */}
                      <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                      

                      {/* Centered Brand Logo */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img
                          src={venture.logo}
                          alt={venture.name}
                          className="max-h-16 sm:max-h-20 w-auto max-w-[80%] object-contain filter drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Card Typography Content */}
                    <div className="px-1 space-y-2">
                      {/* Title and Subtitle */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#e5252a] uppercase leading-tight">
                          {venture.name}
                        </h3>
                        <p className="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wide mt-1">
                          {venture.subtitle}
                        </p>
                      </div>

                      {/* Concise Narrative Description */}
                      <p className="text-xs sm:text-[13px] font-light text-neutral-600 leading-relaxed pt-1">
                        {venture.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-1 pt-4">
                    

                    {/* Full-Width Bold Pill Button (Matching "Reserve" in Reference) */}
                    <a
                      href={venture.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn w-full py-3.5 px-5 rounded-full bg-neutral-950 hover:bg-[#e5252a] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-xs hover:shadow-[0_8px_25px_rgba(229,37,42,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Visit Website</span>
                      <span className="text-sm font-mono transition-transform duration-300 group-hover/btn:translate-x-1">
                        →
                      </span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          SECTION 5: VISION & MISSION (ENHANCED EDITORIAL DESIGN)
      ────────────────────────────────────────────── */}
      <section 
        id="philosophy" 
        ref={section4Ref}
        className="relative py-10 sm:py-12 md:py-14 lg:py-16 px-5 sm:px-10 md:px-16 border-t border-neutral-200 bg-white overflow-hidden"
      >
        {/* Living Kinetic Ambient Mesh Glow Orbs */}
        <div 
          className="absolute top-1/4 -left-48 w-[460px] h-[460px] bg-gradient-to-tr from-neutral-200/60 to-neutral-100/40 rounded-full blur-[110px] pointer-events-none -z-0"
          style={{ animation: 'floatOrb1 16s ease-in-out infinite' }}
        />
        <div 
          className="absolute bottom-1/4 -right-48 w-[480px] h-[480px] bg-gradient-to-bl from-[#e5252a]/[0.05] to-[#e5252a]/[0.015] rounded-full blur-[130px] pointer-events-none -z-0"
          style={{ animation: 'floatOrb2 20s ease-in-out infinite' }}
        />

        <div key={section4AnimKey} className="max-w-6xl mx-auto relative z-10">
          
          {/* Top Header with Staggered Entrance */}
          <div 
            className={`flex flex-col md:flex-row md:items-end justify-between pb-4 sm:pb-6 border-b border-neutral-200 gap-4 sm:gap-6 mb-6 sm:mb-8 transition-all duration-700 delay-100 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div>
              
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-neutral-950">
                VISION & <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-[#e5252a]">MISSION.</span>
              </h2>
            </div>
          </div>

          {/* Cards Grid: Core Vision & Core Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            
            {/* ────────── CARD 1: CORE VISION (SCROLL-TRIGGERED 3D RISE + SHEEN + AUTONOMOUS DRIFT + 3D TILT) ────────── */}
            <div 
              onMouseMove={(e) => handleCardMouseMove(e, setCard1Tilt)}
              onMouseLeave={() => handleCardMouseLeave(setCard1Tilt)}
              style={{
                animation: 'cardRiseLeft 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
                transform: card1Tilt.isHovered 
                  ? `perspective(1000px) rotateX(${card1Tilt.rotateX}deg) rotateY(${card1Tilt.rotateY}deg) translateZ(14px) translateY(-8px)` 
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
                boxShadow: card1Tilt.isHovered 
                  ? '0 30px 65px -15px rgba(229, 37, 42, 0.14), 0 20px 40px -10px rgba(0, 0, 0, 0.07)' 
                  : '0 10px 30px -10px rgba(0, 0, 0, 0.03)',
                transformStyle: 'preserve-3d',
                transition: card1Tilt.isHovered 
                  ? 'transform 0.12s ease-out, box-shadow 0.3s ease' 
                  : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease',
              }}
              className="group relative p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200 bg-gradient-to-b from-[#fafafa] to-white hover:border-neutral-400 overflow-hidden flex flex-col justify-between cursor-default"
            >
              {/* Luminous Diagonal Light Sweep Beam upon Arrival */}
              <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl sm:rounded-3xl">
                <div 
                  className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-[#e5252a]/14 to-transparent blur-md"
                  style={{ animation: 'cardSheenSweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards' }}
                />
              </div>

              {/* Living Autonomous Ambient Drift Spotlight (Active when not hovering) */}
              <div 
                className="pointer-events-none absolute -inset-10 blur-3xl transition-opacity duration-700 z-0"
                style={{
                  opacity: card1Tilt.isHovered ? 0 : 0.65,
                  background: 'radial-gradient(circle, rgba(229, 37, 42, 0.08) 0%, transparent 60%)',
                  animation: 'idleSpotDrift1 14s ease-in-out infinite'
                }}
              />

              {/* Dynamic Luminous Mouse Spotlight Sheen (Active on hover) */}
              <div 
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
                style={{
                  opacity: card1Tilt.isHovered ? 1 : 0,
                  background: `radial-gradient(550px circle at ${card1Tilt.spotX}px ${card1Tilt.spotY}px, rgba(229, 37, 42, 0.09), transparent 65%)`
                }}
              />

              {/* Glowing Top Shimmer Beam */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e5252a]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

              {/* Floating Counter-Parallax Kinetic Architectural Watermark */}
              <div 
                className="absolute -right-4 -bottom-6 text-7xl sm:text-9xl lg:text-[11rem] font-thin text-neutral-950/[0.03] pointer-events-none select-none uppercase tracking-tighter leading-none will-change-transform z-0"
                style={{
                  animation: 'floatWatermark1 14s ease-in-out infinite',
                  transform: card1Tilt.isHovered 
                    ? `translate3d(${card1Tilt.rotateY * -3.5}px, ${card1Tilt.rotateX * 3.5}px, 0)` 
                    : undefined,
                  transition: card1Tilt.isHovered ? 'transform 0.15s ease-out' : 'transform 0.6s ease-out'
                }}
              >
                VISION
              </div>

              <div className="relative z-10">
                {/* Header Tag Bar */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-400">
                      FOUNDATIONAL HORIZON
                    </span>
                  </div>
                </div>

                {/* Main Statement with Expanding Neon Underline */}
                <h3 className="text-xl sm:text-2xl lg:text-[2rem] font-light leading-snug text-neutral-950 tracking-tight mb-4 sm:mb-6">
                  To build a{' '}
                  <span className="relative inline-block font-medium">
                    creator-first ecosystem
                    <span 
                      className="absolute left-0 -bottom-1 h-[2.5px] bg-gradient-to-r from-[#e5252a] via-[#f84347] to-[#e5252a] rounded-full shadow-[0_0_10px_rgba(229,37,42,0.5)]" 
                      style={{ animation: 'underlineExpand 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both' }}
                    />
                  </span>{' '}
                  where creativity becomes careers, businesses, and lasting opportunities.
                </h3>

                {/* Sub-Pillars / Cascading Breakdown with Tactile Expansion Beams */}
                <div className="space-y-2 sm:space-y-2.5 pt-4 sm:pt-5 border-t border-neutral-200/80">
                  {[
                    { tag: "CAREERS", desc: "Transforming raw creative talent into sustainable, long-term careers." },
                    { tag: "BUSINESSES", desc: "Empowering creators to establish scalable, independent businesses." },
                    { tag: "OPPORTUNITY", desc: "Creating durable networks that unlock continuous, lasting opportunities." }
                  ].map((pillar, i) => (
                    <div 
                      key={i} 
                      style={{ animation: `pillarSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.45 + i * 0.14}s both` }}
                      className="group/item relative flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-2.5 sm:p-3.5 rounded-xl hover:bg-neutral-100/80 hover:translate-x-1.5 transition-all duration-300 cursor-default overflow-hidden"
                    >
                      {/* Left Accent Neon Beam */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#e5252a] scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-center" />
                      <span className="text-[10px] font-mono tracking-wider text-neutral-400 group-hover/item:text-[#e5252a] transition-colors mt-0.5 min-w-[70px] sm:min-w-[85px]">
                        [{pillar.tag}]
                      </span>
                      <p className="text-xs font-light text-neutral-600 group-hover/item:text-neutral-900 leading-relaxed transition-colors">
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ────────── CARD 2: CORE MISSION (SCROLL-TRIGGERED 3D RISE + SHEEN + AUTONOMOUS DRIFT + 3D TILT) ────────── */}
            <div 
              onMouseMove={(e) => handleCardMouseMove(e, setCard2Tilt)}
              onMouseLeave={() => handleCardMouseLeave(setCard2Tilt)}
              style={{
                animation: 'cardRiseRight 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
                transform: card2Tilt.isHovered 
                  ? `perspective(1000px) rotateX(${card2Tilt.rotateX}deg) rotateY(${card2Tilt.rotateY}deg) translateZ(14px) translateY(-8px)` 
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
                boxShadow: card2Tilt.isHovered 
                  ? '0 30px 65px -15px rgba(229, 37, 42, 0.14), 0 20px 40px -10px rgba(0, 0, 0, 0.07)' 
                  : '0 10px 30px -10px rgba(0, 0, 0, 0.03)',
                transformStyle: 'preserve-3d',
                transition: card2Tilt.isHovered 
                  ? 'transform 0.12s ease-out, box-shadow 0.3s ease' 
                  : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease',
              }}
              className="group relative p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl border border-neutral-200 bg-gradient-to-b from-[#fafafa] to-white hover:border-neutral-400 overflow-hidden flex flex-col justify-between cursor-default"
            >
              {/* Luminous Diagonal Light Sweep Beam upon Arrival */}
              <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl sm:rounded-3xl">
                <div 
                  className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-[#e5252a]/14 to-transparent blur-md"
                  style={{ animation: 'cardSheenSweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards' }}
                />
              </div>

              {/* Living Autonomous Ambient Drift Spotlight (Active when not hovering) */}
              <div 
                className="pointer-events-none absolute -inset-10 blur-3xl transition-opacity duration-700 z-0"
                style={{
                  opacity: card2Tilt.isHovered ? 0 : 0.65,
                  background: 'radial-gradient(circle, rgba(229, 37, 42, 0.08) 0%, transparent 60%)',
                  animation: 'idleSpotDrift2 16s ease-in-out infinite'
                }}
              />

              {/* Dynamic Luminous Mouse Spotlight Sheen (Active on hover) */}
              <div 
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
                style={{
                  opacity: card2Tilt.isHovered ? 1 : 0,
                  background: `radial-gradient(550px circle at ${card2Tilt.spotX}px ${card2Tilt.spotY}px, rgba(229, 37, 42, 0.09), transparent 65%)`
                }}
              />

              {/* Glowing Top Shimmer Beam */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e5252a]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

              {/* Floating Counter-Parallax Kinetic Architectural Watermark */}
              <div 
                className="absolute -right-4 -bottom-6 text-7xl sm:text-9xl lg:text-[11rem] font-thin text-neutral-950/[0.03] pointer-events-none select-none uppercase tracking-tighter leading-none will-change-transform z-0"
                style={{
                  animation: 'floatWatermark2 16s ease-in-out infinite',
                  transform: card2Tilt.isHovered 
                    ? `translate3d(${card2Tilt.rotateY * -3.5}px, ${card2Tilt.rotateX * 3.5}px, 0)` 
                    : undefined,
                  transition: card2Tilt.isHovered ? 'transform 0.15s ease-out' : 'transform 0.6s ease-out'
                }}
              >
                MISSION
              </div>

              <div className="relative z-10">
                {/* Header Tag Bar */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-400">
                      OPERATIONAL VECTOR
                    </span>
                  </div>
                </div>

                {/* Main Statement with Expanding Neon Underline */}
                <h3 className="text-xl sm:text-2xl lg:text-[2rem] font-light leading-snug text-neutral-950 tracking-tight mb-4 sm:mb-6">
                  <span className="relative inline-block font-medium">
                    Empower creative talent
                    <span 
                      className="absolute left-0 -bottom-1 h-[2.5px] bg-gradient-to-r from-[#e5252a] via-[#f84347] to-[#e5252a] rounded-full shadow-[0_0_10px_rgba(229,37,42,0.5)]" 
                      style={{ animation: 'underlineExpand 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.55s both' }}
                    />
                  </span>{' '}
                  through education, innovation, and entrepreneurship while building ventures that shape the future of the creative economy.
                </h3>

                {/* Sub-Pillars / Cascading Breakdown with Tactile Expansion Beams */}
                <div className="space-y-2 sm:space-y-2.5 pt-4 sm:pt-5 border-t border-neutral-200/80">
                  {[
                    { tag: "EDUCATION", desc: "Imparting cutting-edge craft, design leadership, and digital literacy." },
                    { tag: "INNOVATION", desc: "Pioneering novel tools, creative interfaces, and technical systems." },
                    { tag: "VENTURES", desc: "Incubating dynamic companies that redefine the creative industry." }
                  ].map((pillar, i) => (
                    <div 
                      key={i} 
                      style={{ animation: `pillarSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.55 + i * 0.14}s both` }}
                      className="group/item relative flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-2.5 sm:p-3.5 rounded-xl hover:bg-neutral-100/80 hover:translate-x-1.5 transition-all duration-300 cursor-default overflow-hidden"
                    >
                      {/* Left Accent Neon Beam */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#e5252a] scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-center" />
                      <span className="text-[10px] font-mono tracking-wider text-neutral-400 group-hover/item:text-[#e5252a] transition-colors mt-0.5 min-w-[70px] sm:min-w-[85px]">
                        [{pillar.tag}]
                      </span>
                      <p className="text-xs font-light text-neutral-600 group-hover/item:text-neutral-900 leading-relaxed transition-colors">
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>


        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 6: ADVISORY, CONTACT & TRANSMISSION
      ────────────────────────────────────────────── */}
      <footer ref={contactRef} id="contact" className="relative py-10 sm:py-12 md:py-14 lg:py-16 px-5 sm:px-10 md:px-16 border-t border-neutral-200 bg-[#fafafa] overflow-hidden">
        {/* Ambient Subtle Architectural Lighting */}
        <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] bg-gradient-to-bl from-neutral-200/50 to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />
        <div className="absolute bottom-1/4 -left-48 w-[500px] h-[500px] bg-gradient-to-tr from-neutral-100/50 to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />

        <div key={contactAnimKey} className="max-w-6xl mx-auto w-full relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-6 sm:mb-8 items-center">
            
            {/* ────────── LEFT COLUMN: EXECUTIVE DIRECT COMMUNICATIONS HUB ────────── */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5">
              
              {/* Header Group */}
              <div style={{ animation: 'contactHeaderRise 0.85s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] uppercase text-neutral-950 mb-3 sm:mb-4">
                  LET’S BUILD <br />
                  SOMETHING <br />
                  <span className="font-bold italic text-[#e5252a]">
                    MEANINGFUL.
                  </span>
                </h2>

                <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed max-w-md">
                  Available for strategic venture advisory, high-production creative media, and brand architecture. Direct inquiries are routed directly to Anees Ark.
                </p>
              </div>

            </div>

            {/* ────────── RIGHT COLUMN: LUXURY INTERACTIVE DISPATCH TERMINAL ────────── */}
            <div 
              className="lg:col-span-7"
              style={{ animation: 'contactRiseRight 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}
            >
              <div className="relative p-5 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                
                {/* Diagonal Light Sweep Beam upon Arrival */}
                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl sm:rounded-3xl">
                  <div 
                    className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-neutral-200/40 to-transparent blur-md"
                    style={{ animation: 'contactSheenSweep 2s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards' }}
                  />
                </div>

                {/* Corner Viewfinder Telemetry Reticles */}
                <span className="absolute top-3.5 left-4 text-[9px] font-mono text-neutral-300 select-none">+</span>
                <span className="absolute top-3.5 right-4 text-[9px] font-mono text-neutral-300 select-none">+</span>
                <span className="absolute bottom-3.5 left-4 text-[9px] font-mono text-neutral-300 select-none">+</span>
                <span className="absolute bottom-3.5 right-4 text-[9px] font-mono text-neutral-300 select-none">+</span>

                {/* Terminal Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3 mb-4 sm:mb-5">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-950">
                      DISPATCH INQUIRY
                    </h3>
                  </div>
                </div>

                {formStatus === 'success' ? (
                  <div className="py-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-xl font-light shadow-xs">
                      ✓
                    </div>
                    <h4 className="text-lg font-bold tracking-tight text-neutral-950">Transmission Successful</h4>
                    <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. Your transmission has been dispatched to Anees Ark and will be reviewed within the active response window.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormStatus('idle')}
                      className="mt-3 inline-block text-xs font-mono tracking-wider uppercase text-neutral-800 hover:text-[#e5252a] underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      Send another message →
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3.5 sm:space-y-4">
                    
                    {/* Inquiry Scope Chips */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase mb-2">
                        SELECT INQUIRY SCOPE
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "01", label: "Venture Advisory" },
                          { id: "02", label: "Creative Direction" },
                          { id: "03", label: "Platform Architecture" },
                          { id: "04", label: "General" }
                        ].map((scope) => {
                          const isSelected = formData.subject === scope.label;
                          return (
                            <button
                              key={scope.label}
                              type="button"
                              onClick={() => setFormData({ ...formData, subject: scope.label })}
                              className={`group/btn relative py-2 px-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                                isSelected
                                  ? 'bg-neutral-950 border-neutral-950 text-white shadow-xs'
                                  : 'bg-neutral-50/80 hover:bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                              }`}
                            >
                              <span className="block text-[10px] sm:text-[11px] font-medium leading-tight truncate">
                                {scope.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name & Email Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                          YOUR IDENTITY *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your Full Name"
                          className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-neutral-50/70 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                          DIRECT EMAIL *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-neutral-50/70 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
                        />
                      </div>

                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-[10px] font-mono tracking-[0.2em] text-neutral-400 uppercase mb-1.5">
                        PROJECT BRIEF *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Outline your venture scope, creative brief, or collaboration parameters..."
                        className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-neutral-50/70 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400 resize-none"
                      />
                    </div>

                    {formErrorMessage && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                        <span>{formErrorMessage}</span>
                        <button type="button" onClick={() => setFormErrorMessage('')} className="text-red-500 font-bold ml-2">×</button>
                      </div>
                    )}

                    {/* Submit Button - Vibrant Signature Red Button */}
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full group/btn relative flex items-center justify-center gap-2.5 rounded-xl bg-[#e5252a] hover:bg-[#cb1d22] text-white py-3 sm:py-3.5 text-xs font-mono font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-60 shadow-[0_6px_25px_rgba(229,37,42,0.3)] hover:shadow-[0_8px_32px_rgba(229,37,42,0.45)] active:scale-[0.99] cursor-pointer overflow-hidden"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>TRANSMITTING DISPATCH...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND</span>
                          <span className="text-sm font-mono transition-transform duration-300 group-hover/btn:translate-x-1">
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

          {/* ──────────────────────────────────────────────
              DEDICATED SEPARATE SECTION: OFFICIAL SOCIAL MEDIA ECOSYSTEM
          ────────────────────────────────────────────── */}
          <div 
            className="pt-5 sm:pt-6 border-t border-neutral-200/80 mb-6 sm:mb-8"
            style={{ animation: 'contactRiseLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both' }}
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-2.5 sm:pb-3 gap-2 mb-3 sm:mb-4">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight uppercase text-neutral-950">
                  CONNECT ACROSS <span className="font-bold italic text-[#e5252a]">PLATFORMS.</span>
                </h3>
              </div>
            </div>

            {/* 2-Column Grid for Instagram & LinkedIn - Minimal Luxury Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* ─── MINIMAL INSTAGRAM ─── */}
              <a
                href="https://www.instagram.com/anees_ark/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-neutral-200/90 bg-white/90 hover:border-neutral-400 hover:bg-white hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  {/* Minimal Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-neutral-700 group-hover:text-black group-hover:border-neutral-300 transition-all duration-300 shrink-0">
                    <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 group-hover:text-neutral-700 transition-colors leading-tight">
                      INSTAGRAM
                    </span>
                    <h4 className="text-sm sm:text-base font-medium text-neutral-950 group-hover:text-black transition-colors truncate">
                      @anees_ark
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 group-hover:text-neutral-950 transition-colors shrink-0 ml-3">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase font-semibold opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 hidden sm:inline">
                    VISIT
                  </span>
                  <span className="text-sm sm:text-base font-mono group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                    ↗
                  </span>
                </div>
              </a>

              {/* ─── MINIMAL LINKEDIN ─── */}
              <a
                href="https://www.linkedin.com/in/anees-ark-bb77a1265/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-neutral-200/90 bg-white/90 hover:border-neutral-400 hover:bg-white hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  {/* Minimal Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-neutral-700 group-hover:text-black group-hover:border-neutral-300 transition-all duration-300 shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 group-hover:text-neutral-700 transition-colors leading-tight">
                      LINKEDIN
                    </span>
                    <h4 className="text-sm sm:text-base font-medium text-neutral-950 group-hover:text-black transition-colors truncate">
                      Anees Ark
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 group-hover:text-neutral-950 transition-colors shrink-0 ml-3">
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase font-semibold opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 hidden sm:inline">
                    CONNECT
                  </span>
                  <span className="text-sm sm:text-base font-mono group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                    ↗
                  </span>
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* ────────── INTEGRATED ARCHITECTURAL FOOTER ────────── */}
        <div className="max-w-6xl mx-auto w-full pt-5 sm:pt-6 border-t border-neutral-200/90 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono tracking-[0.25em] sm:tracking-[0.35em] text-neutral-400 uppercase gap-3 sm:gap-4 text-center sm:text-left relative z-10">
          <span>© {new Date().getFullYear()} ANEES ARK — ALL RIGHTS RESERVED</span>
          
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-neutral-950 flex items-center gap-2 transition-colors cursor-pointer group"
          >
            <span>BACK TO TOP</span>
            <span className="text-neutral-400 group-hover:text-neutral-950 group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>
        </div>

      </footer>

    </div>
  );
}