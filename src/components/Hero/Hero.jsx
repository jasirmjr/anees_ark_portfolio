import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import heroImage from '../../assets/anees.png';

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
  const [portraitIndex, setPortraitIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);

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
      subtitle: "Creative Advertising, Brand Architecture & Digital Media Studio",
      category: "Creative Advertising & Brand Studio",
      period: "2018 — Present",
      status: "Active", 
      badge: "SCALING GLOBALLY",
      logo: "/LYFADS_Identity__1.png",
      url: "https://lyfads.com",
      description: "Founded in 2018, LYF ADS is a premier visual design and creative advertising agency built to transform bold ideas into distinctive market leaders. Operating at the confluence of design architecture, strategic brand storytelling, and high-conversion commercial media, the agency crafts comprehensive brand identities, omnichannel marketing campaigns, and bespoke visual assets that resonate across competitive global markets.",
      highlights: [
        { label: "Established", value: "2018" },
        { label: "Client Impact", value: "150+ Brands" },
        { label: "Reach", value: "Multi-Market" },
        { label: "Specialty", value: "Full-Stack Creative" }
      ],
      capabilities: [
        {
          title: "Brand Architecture & Identity",
          detail: "End-to-end design systems, logotypes, typography guidelines, packaging, and comprehensive visual language standards."
        },
        {
          title: "Campaign Direction & Strategy",
          detail: "Omnichannel launch campaigns, creative copywriting, commercial concepting, and high-impact consumer engagement."
        },
        {
          title: "Visual Media & Motion Graphics",
          detail: "3D product rendering, brand animations, broadcast graphics, and cinematic promotional content production."
        },
        {
          title: "Performance & Growth Creative",
          detail: "High-converting digital ad creatives, performance media assets, and data-informed visual storytelling."
        }
      ],
      tags: ["Brand Architecture", "Campaign Direction", "Visual Media", "Omnichannel Creative", "Packaging Design", "Motion Systems"]
    },
    { 
      id: "02", 
      name: "SEKRICK", 
      role: "Founder & Executive Director",
      subtitle: "Cinematic Storytelling, Film Production & Commercial Studio",
      category: "Film & Commercial Production House",
      period: "2026 — Present",
      status: "Active", 
      badge: "NEW VENTURE",
      logo: "/black logo.png",
      url: "https://sekrick.com",
      description: "SEKRICK is an avant-garde creative production house and film direction studio dedicated to cinematic excellence and visual narrative depth. Engineered to push the boundaries of modern media, SEKRICK conceptualizes, directs, and produces high-caliber broadcast commercials, narrative brand films, digital docuseries, and visual campaigns that elevate brands into cultural touchstones.",
      highlights: [
        { label: "Founded", value: "2026" },
        { label: "Format", value: "Cinema 4K/8K" },
        { label: "Discipline", value: "Film Direction" },
        { label: "Production", value: "End-to-End" }
      ],
      capabilities: [
        {
          title: "Commercial & Brand Films",
          detail: "Flagship television commercials, digital manifestos, cinematic product showcases, and high-production brand films."
        },
        {
          title: "Cinematography & Directing",
          detail: "Holistic film direction, technical cinematography, specialized anamorphic optics, lighting choreography, and set direction."
        },
        {
          title: "Post-Production & VFX",
          detail: "Precision film editing, Hollywood-grade color grading (DaVinci/ACES), immersive sound design, and custom visual effects."
        },
        {
          title: "Creative Storyboarding & Concept",
          detail: "Script writing, narrative development, visual treatments, and director's pitch books crafted from first principles."
        }
      ],
      tags: ["Commercial Production", "Cinematic Direction", "Film Production", "Post-Production & VFX", "Color Grading", "Content Strategy"]
    },
    { 
      id: "03", 
      name: "CREATER'S LAB", 
      role: "Founder & Product Architect",
      subtitle: "Tangible Human-Computer Interfaces, Experimental Hardware & Creator Tools",
      category: "Hardware Incubator & Tooling Lab",
      period: "2026 — Present",
      status: "Active", 
      badge: "IN CUBATION",
      logo: "/Logo-Creators-Lab.png",
      url: "https://createrslab.com",
      description: "CREATER'S LAB is a next-generation experimental innovation lab and specialty hardware incubator focused on tangible user interfaces and physical creative instruments. Bridging the divide between tactile hardware and digital software workflows, the lab designs and prototypes dedicated creator devices, ergonomic input surfaces, and tactile controllers that give makers intimate physical agency over their digital craft.",
      highlights: [
        { label: "Founded", value: "2026" },
        { label: "Domain", value: "Tangible UI / HW" },
        { label: "Focus", value: "Creator Workflows" },
        { label: "R&D", value: "Rapid Prototyping" }
      ],
      capabilities: [
        {
          title: "Tangible Human-Computer Interfaces",
          detail: "Physical knobs, weighted rotary encoders, mechanical sliders, and tactile input surfaces designed for workflow speed."
        },
        {
          title: "Hardware Prototyping & CAD",
          detail: "Industrial enclosure design, CNC aluminum fabrication, 3D printing rapid prototyping, and ergonomics testing."
        },
        {
          title: "Firmware & Embedded Systems",
          detail: "Custom ultra-low latency firmware, high-precision microcontroller programming, and USB HID/MIDI protocol integration."
        },
        {
          title: "Creator Instruments & Tooling",
          detail: "Specialized modular decks, dedicated video/audio control surfaces, and companion desktop software ecosystems."
        }
      ],
      tags: ["Experimental Hardware", "Tangible Interfaces", "Industrial CAD", "Firmware Architecture", "Product Prototyping", "Creator Tools"]
    }
  ];

  // ──────────────────────────────────────────────
  // SECTION 3: VENTURE INTERACTIVE STATE & CLEAN SCROLL CYCLING
  // ──────────────────────────────────────────────
  const [activeVenture, setActiveVenture] = useState(0);
  const venturesSectionRef = useRef(null);
  const isCooldownRef = useRef(false);
  const activeVentureRef = useRef(0);
  activeVentureRef.current = activeVenture;

  const wheelAccumulatorRef = useRef(0);
  const isNavigatingRef = useRef(false);

  const selectVenture = (index) => {
    setActiveVenture(index);
    const el = venturesSectionRef.current;
    if (el) {
      const navHeight = window.innerWidth < 640 ? 68 : 72;
      const targetY = window.scrollY + el.getBoundingClientRect().top - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (activeVenture < ventures.length - 1) {
      setActiveVenture((prev) => prev + 1);
    } else {
      // Completed all ventures -> smooth scroll to bottom section
      const nextSection = document.getElementById('philosophy');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (activeVenture > 0) {
      setActiveVenture((prev) => prev - 1);
    } else {
      // At first venture -> smooth scroll to top section
      const prevSection = document.getElementById('about');
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Keep activeVenture synchronized when browsing other sections
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const el = venturesSectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const navHeight = window.innerWidth < 640 ? 68 : 72;

      // When above Section 3 (in Section 1 or 2), prime activeVenture to 0
      if (rect.top > navHeight + 80) {
        if (activeVentureRef.current !== 0) {
          setActiveVenture(0);
        }
      }
      // When below Section 3 (in Section 4, 5, etc.), prime activeVenture to last
      else if (rect.bottom < -80) {
        if (activeVentureRef.current !== ventures.length - 1) {
          setActiveVenture(ventures.length - 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ventures.length]);

  useEffect(() => {
    const el = venturesSectionRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // During active programmatic smooth scroll transition between sections, ignore wheel
      if (isNavigatingRef.current) {
        return;
      }

      const rect = el.getBoundingClientRect();
      const navHeight = window.innerWidth < 640 ? 68 : 72;
      const targetY = window.scrollY + rect.top - navHeight;

      // ─── STRICT SECTION BOUNDARY GUARD ───
      // If Section 3 is not docked under the navbar (user is in Section 1, 2, 4, 5, etc.),
      // NEVER intercept! Let the user access all other sections freely.
      const isDocked = Math.abs(rect.top - navHeight) <= 35;
      if (!isDocked) {
        wheelAccumulatorRef.current = 0;
        return;
      }

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;
      const currentIdx = activeVentureRef.current;

      // ─── EXIT TO NEXT SECTION WHEN ON LAST VENTURE ───
      if (goingDown && currentIdx >= ventures.length - 1) {
        // If cooldown is active (card just finished entering), prevent immediate fly-through
        if (isCooldownRef.current) {
          e.preventDefault();
          return;
        }

        if (Math.abs(e.deltaY) < 8) return;
        wheelAccumulatorRef.current += e.deltaY;

        if (wheelAccumulatorRef.current > 20) {
          wheelAccumulatorRef.current = 0;
          isNavigatingRef.current = true;
          isCooldownRef.current = true;
          setTimeout(() => {
            isCooldownRef.current = false;
            isNavigatingRef.current = false;
          }, 950);

          const nextSec = document.getElementById('philosophy');
          if (nextSec) {
            nextSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
        return;
      }

      // ─── EXIT TO PREVIOUS SECTION WHEN ON FIRST VENTURE ───
      if (goingUp && currentIdx <= 0) {
        if (isCooldownRef.current) {
          e.preventDefault();
          return;
        }

        if (Math.abs(e.deltaY) < 8) return;
        wheelAccumulatorRef.current += e.deltaY;

        if (wheelAccumulatorRef.current < -20) {
          wheelAccumulatorRef.current = 0;
          isNavigatingRef.current = true;
          isCooldownRef.current = true;
          setTimeout(() => {
            isCooldownRef.current = false;
            isNavigatingRef.current = false;
          }, 950);

          const prevSec = document.getElementById('about');
          if (prevSec) {
            prevSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
        return;
      }

      // ─── CYCLING BETWEEN VENTURES (EACH SCROLL LOADS NEXT VENTURE) ───
      e.preventDefault();

      // Pin securely under navbar while cycling
      if (Math.abs(rect.top - navHeight) > 1) {
        window.scrollTo({ top: targetY, behavior: 'instant' });
      }

      if (isCooldownRef.current) {
        return;
      }

      if (Math.abs(e.deltaY) < 8) return;
      wheelAccumulatorRef.current += e.deltaY;

      if (wheelAccumulatorRef.current > 20) {
        // Scroll Down -> Next Venture
        wheelAccumulatorRef.current = 0;
        isCooldownRef.current = true;
        setTimeout(() => {
          isCooldownRef.current = false;
        }, 500);
        setActiveVenture((prev) => Math.min(prev + 1, ventures.length - 1));
      } else if (wheelAccumulatorRef.current < -20) {
        // Scroll Up -> Prev Venture
        wheelAccumulatorRef.current = 0;
        isCooldownRef.current = true;
        setTimeout(() => {
          isCooldownRef.current = false;
        }, 500);
        setActiveVenture((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [ventures.length]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#0a0a0a] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-neutral-900 selection:text-white antialiased overflow-x-clip">

      {/* Keyframes for Section 1 Marquee & Section 4 Living Motion */}
      <style>{`
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
      `}</style>

      {/* ──────────────────────────────────────────────
          SECTION 1: EDITORIAL EXECUTIVE HERO
      ────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-68px)] flex flex-col justify-between py-10 sm:py-12 md:py-14 lg:py-16 px-5 sm:px-10 md:px-[6%] border-b border-neutral-200 bg-white overflow-hidden">
        
        {/* Ambient Subtle Architectural Mesh Lighting */}
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-neutral-100/90 rounded-full blur-[140px] pointer-events-none -z-0" />
        <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] bg-[#ff5500]/[0.035] rounded-full blur-[120px] pointer-events-none -z-0" />

        {/* Low-Opacity Animated ANEES ARK Background Typography (Right to Left) */}
        <div className="absolute top-[32%] sm:top-[30%] lg:top-[32%] -translate-y-1/2 inset-x-0 w-full overflow-hidden pointer-events-none select-none z-0">
          <div className="flex whitespace-nowrap w-max animate-[aneesMarqueeRTL_32s_linear_infinite] will-change-transform">
            {/* Set 1 */}
            <div className="flex items-center gap-12 sm:gap-20 shrink-0 pr-12 sm:pr-20">
              <span className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-black italic tracking-tighter uppercase text-neutral-950/[0.065] leading-none">
                ANEES ARK
              </span>
              <span className="text-[2.5rem] sm:text-[4.5rem] md:text-[6rem] text-neutral-950/[0.05]">✦</span>
              <span className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-black italic tracking-tighter uppercase text-neutral-950/[0.065] leading-none">
                ANEES ARK
              </span>
              <span className="text-[2.5rem] sm:text-[4.5rem] md:text-[6rem] text-neutral-950/[0.05]">✦</span>
              <span className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-black italic tracking-tighter uppercase text-neutral-950/[0.065] leading-none">
                ANEES ARK
              </span>
              <span className="text-[2.5rem] sm:text-[4.5rem] md:text-[6rem] text-neutral-950/[0.05]">✦</span>
            </div>
            {/* Set 2 (Identical duplicate for seamless infinite loop) */}
            <div className="flex items-center gap-12 sm:gap-20 shrink-0 pr-12 sm:pr-20" aria-hidden="true">
              <span className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-black italic tracking-tighter uppercase text-neutral-950/[0.065] leading-none">
                ANEES ARK
              </span>
              <span className="text-[2.5rem] sm:text-[4.5rem] md:text-[6rem] text-neutral-950/[0.05]">✦</span>
              <span className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-black italic tracking-tighter uppercase text-neutral-950/[0.065] leading-none">
                ANEES ARK
              </span>
              <span className="text-[2.5rem] sm:text-[4.5rem] md:text-[6rem] text-neutral-950/[0.05]">✦</span>
              <span className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[14rem] xl:text-[16rem] font-black italic tracking-tighter uppercase text-neutral-950/[0.065] leading-none">
                ANEES ARK
              </span>
              <span className="text-[2.5rem] sm:text-[4.5rem] md:text-[6rem] text-neutral-950/[0.05]">✦</span>
            </div>
          </div>
        </div>

       

        {/* Central 2-Column Split: Editorial Masthead + Executive Portrait */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          
          {/* Left Column: Bold Display & Action */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5">
            
            

            <div className="relative inline-block w-fit">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight uppercase leading-none text-neutral-950 whitespace-nowrap">
                ANEES <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-transparent">ARK.</span>
              </h1>
            </div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-neutral-300/80 bg-neutral-50 shadow-2xs text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-700 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
              FOUNDER & CREATIVE DIRECTOR
            </div>

            <p className="text-sm sm:text-base md:text-lg font-medium tracking-[0.08em] uppercase text-neutral-800 leading-relaxed max-w-xl">
              Architecting ideas into meaningful ventures.
            </p>

            <p className="text-xs sm:text-sm font-light text-neutral-600 leading-relaxed max-w-lg">
              Operating at the convergence of creative media, venture architecture, and digital systems. Empowering creative talent and incubating companies that shape the modern economy.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a 
                href="#ventures" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('ventures')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm hover:shadow-lg active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Explore Ventures</span>
                <span className="relative z-10 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:translate-y-0.5 transition-transform">
                  ↓
                </span>
              </a>

              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-neutral-300 bg-white hover:border-neutral-950 text-neutral-900 text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs hover:shadow-sm active:scale-95"
              >
                <span>Dispatch Inquiry</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Key Metrics */}
            <div ref={metricsRef} className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-neutral-200/80 max-w-sm sm:max-w-md">
              <div className="p-3 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60 hover:bg-white hover:border-neutral-300 hover:shadow-xs transition-all group">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-light text-neutral-950 tracking-tight">
                    <AnimatedCounter target={3} padZero={true} isVisible={isMetricsVisible} />
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="block text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-400 uppercase">ENTITIES</span>
                <div className="w-full h-0.5 bg-neutral-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    style={{ width: isMetricsVisible ? '100%' : '0%' }}
                    className="h-full bg-neutral-900 rounded-full group-hover:bg-[#ff5500] transition-all duration-1000 ease-out" 
                  />
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60 hover:bg-white hover:border-neutral-300 hover:shadow-xs transition-all group">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-light text-neutral-950 tracking-tight">
                    <AnimatedCounter target={8} suffix="+" padZero={true} isVisible={isMetricsVisible} />
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 group-hover:bg-neutral-900 transition-colors" />
                </div>
                <span className="block text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-400 uppercase">YEARS CRAFT</span>
                <div className="w-full h-0.5 bg-neutral-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    style={{ width: isMetricsVisible ? '80%' : '0%' }}
                    className="h-full bg-neutral-900 rounded-full group-hover:bg-neutral-950 transition-all duration-1000 ease-out" 
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Framed Executive Portrait with Dual-Lens Switcher */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-neutral-200 bg-gradient-to-b from-[#fafafa] to-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] group">
              {/* Corner Telemetry Marks */}
              <span className="absolute top-4 left-4 text-[9px] font-mono text-neutral-400 z-20 pointer-events-none">+</span>
              <span className="absolute top-4 right-4 text-[9px] font-mono text-neutral-400 z-20 pointer-events-none">+</span>
              <span className="absolute bottom-4 left-4 text-[9px] font-mono text-neutral-400 z-20 pointer-events-none">+</span>
              <span className="absolute bottom-4 right-4 text-[9px] font-mono text-neutral-400 z-20 pointer-events-none">+</span>

              {/* Floating Badges */}
              <div className="absolute top-5 inset-x-5 flex justify-between items-center z-20">
                <span className="text-[9px] font-mono tracking-widest px-3 py-1 rounded-full border border-neutral-200/80 bg-white/90 backdrop-blur-md text-neutral-800 uppercase font-medium shadow-2xs">
                  ANEES ARK // 2026
                </span>
                
                {/* Interactive Dual-Lens Switcher Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPortraitIndex((prev) => (prev === 0 ? 1 : 0));
                  }}
                  className="text-[9px] font-mono tracking-wider px-3 py-1 rounded-full border border-neutral-300 bg-white/95 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all shadow-2xs text-neutral-800 uppercase font-medium flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="Toggle portrait lens"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                  <span>{portraitIndex === 0 ? 'VIEW 02 →' : 'VIEW 01 →'}</span>
                </button>
              </div>

              {/* Founder Image Crossfade */}
              <img 
                src={portraitIndex === 0 ? heroImage : '/anees (2).png'} 
                alt="Anees Ark" 
                className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02] group-hover:scale-102 transition-all duration-700 ease-out"
              />

              {/* Subtle Bottom Scrim Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Floating Card: Ecosystem Link */}
              <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-lg flex items-center justify-between gap-3 z-20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-mono tracking-[0.2em] uppercase text-neutral-400">
                      FOUNDED ECOSYSTEM // 3 ACTIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['LYF ADS', 'SEKRICK', "CREATER'S LAB"].map((name, i) => (
                      <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <a 
                  href="#ventures" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('ventures')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="shrink-0 w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center hover:bg-[#ff5500] transition-colors shadow-xs group-hover:translate-x-0.5"
                  aria-label="View Ventures"
                >
                  →
                </a>
              </div>

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
        className="py-10 sm:py-12 md:py-14 lg:py-16 px-5 sm:px-10 md:px-16 border-t border-neutral-200 bg-white overflow-hidden"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Video with smooth scroll-down entrance */}
          <div className={`md:col-span-5 lg:col-span-4 flex justify-center md:justify-start transition-all duration-1000 ease-out transform ${
            isSection2Visible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-16 scale-[0.96]'
          }`}>
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] md:max-w-none aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-950 shadow-md group">
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
                className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/25 text-white transition-all active:scale-95 cursor-pointer shadow-sm hover:border-white/40"
                title={isVideoMuted ? "Click to unmute sound" : "Click to mute sound"}
                aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
              >
                {isVideoMuted ? (
                  <svg className="w-4 h-4 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Statement with staggered scroll-down entrance */}
          <div className={`md:col-span-7 lg:col-span-8 flex flex-col justify-center space-y-4 sm:space-y-5 transition-all duration-1000 delay-150 ease-out transform ${
            isSection2Visible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-[1.2] text-neutral-950">
              BUILDING THE FUTURE OF <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-transparent">CREATIVE ENTREPRENEURSHIP.</span>
            </h2>
            <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm md:text-base font-light text-neutral-600 leading-relaxed">
              <p>
                I’m Anees Ark, an entrepreneur driven by curiosity, creativity, technology, and the desire to build things that create real value. My work sits at the intersection of creative media, technology, design, and entrepreneurship, where I explore how ideas can evolve into meaningful experiences, products, and ventures.
              </p>
              <p>
                I don’t see creativity and technology as separate worlds. For me, they are two sides of the same process imagining something, finding a way to build it, and creating an impact through it. This perspective has shaped the way I approach every project, whether I’m working on a digital product, exploring a creative concept, developing a web experience, or experimenting with a new business idea.
              </p>
              <p>
                My journey is driven by a constant desire to learn, experiment, and build. I enjoy moving between different disciplines, understanding how they connect, and bringing them together to create something unique. From visual storytelling and creative production to digital products, web technologies, and business strategy, I’m always looking for new ways to expand what I can create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 3: VENTURES & PORTFOLIO (DETAILED MULTI-ROW SHOWCASE)
      ────────────────────────────────────────────── */}
      {/* ──────────────────────────────────────────────
          SECTION 3: VENTURES & PORTFOLIO (CENTERED STAGE WITH RIGHT-TO-TOP CHOREOGRAPHY)
      ────────────────────────────────────────────── */}
      <section 
        id="ventures" 
        ref={venturesSectionRef}
        className="relative bg-[#fafafa] border-t border-neutral-200 scroll-mt-[68px] sm:scroll-mt-[72px] h-[calc(100vh-72px)] max-h-[calc(100vh-72px)] w-full flex flex-col justify-between py-10 sm:py-12 md:py-14 lg:py-16 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden select-none"
      >
        {/* Top Section Header with Interactive Switcher */}
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/90 pb-2 mb-1.5 gap-2 shrink-0">
          <div>
           
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase text-neutral-950">
              COMPANIES & <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-transparent">ENTITIES.</span>
            </h2>
          </div>

        </div>

        {/* Card Deck Stage - Perfectly Centered */}
        <div className="relative max-w-6xl mx-auto w-full flex-1 min-h-0 flex items-center justify-center my-auto">
          {ventures.map((venture, idx) => {
            const isCurrent = idx === activeVenture;
            const isPast = idx < activeVenture;

            return (
              <div 
                key={venture.id}
                style={{
                  transform: isCurrent 
                    ? 'translate3d(0, 0, 0) scale(1)' 
                    : isPast 
                    ? 'translate3d(calc(-100% - 60px), 0, 0) scale(0.96)' 
                    : 'translate3d(calc(100% + 60px), 0, 0) scale(0.96)',
                  opacity: isCurrent ? 1 : 0,
                  zIndex: isCurrent ? 30 : 10,
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease'
                }}
                className="absolute inset-0 w-full h-full max-h-[420px] sm:max-h-[450px] lg:max-h-[470px] my-auto rounded-3xl border border-neutral-200 bg-white p-3.5 sm:p-4 md:p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col justify-between"
              >
                {/* Top orange accent stripe */}
                <div className="absolute top-0 inset-x-0 h-1 bg-[#ff5500]" />

                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-950 text-white font-semibold text-[8px] sm:text-[9px]">
                      [{venture.id} / 03]
                    </span>
                    <span className="text-neutral-500 font-medium tracking-widest text-[9px] sm:text-[10px]">
                      {venture.category}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] sm:text-[9px] font-semibold">{venture.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 text-neutral-400 text-[8px] sm:text-[9px]">
                    <span>{venture.period}</span>
                    <span className="hidden sm:inline text-neutral-300">•</span>
                    <span className="hidden sm:inline text-neutral-800 font-medium">{venture.role}</span>
                  </div>
                </div>

                {/* Two-Column Deep Showcase Grid - No Internal Scrollbar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-7 pt-2 items-center flex-1 min-h-0 overflow-hidden">
                  
                  {/* Left Column: Brand Logo & Link Button Only */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4 h-full">
                    {/* Brand Logo Showcase Box - High Visibility */}
                    <div className="relative flex-1 min-h-[150px] sm:min-h-[170px] md:min-h-[190px] bg-gradient-to-b from-[#fafafa] to-neutral-50 rounded-2xl border-2 border-neutral-200/90 p-4 sm:p-6 flex items-center justify-center overflow-hidden transition-all group-hover:border-neutral-400 group-hover:shadow-xs">
                      <span className="absolute top-2 left-2.5 text-[8px] font-mono text-neutral-300 select-none">+</span>
                      <span className="absolute top-2 right-2.5 text-[8px] font-mono text-neutral-300 select-none">+</span>
                      <span className="absolute bottom-2 left-2.5 text-[8px] font-mono text-neutral-300 select-none">+</span>
                      <span className="absolute bottom-2 right-2.5 text-[8px] font-mono text-neutral-300 select-none">+</span>

                      <img
                        src={venture.logo}
                        alt={venture.name}
                        className="max-h-20 sm:max-h-24 md:max-h-28 w-auto max-w-[85%] object-contain filter drop-shadow-xs transition-all duration-500 ease-out"
                      />
                    </div>

                    {/* Primary Website CTA Button */}
                    <a
                      href={venture.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-neutral-950 hover:bg-[#ff5500] text-white text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-all duration-300 shadow-sm hover:shadow-md group/btn cursor-pointer shrink-0"
                      title={`Visit ${venture.name} website in new tab`}
                    >
                      <span>VISIT {venture.name} WEBSITE</span>
                      <span className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">↗</span>
                    </a>
                  </div>

                  {/* Right Column: About the Company Only */}
                  <div className="lg:col-span-7 flex flex-col justify-center h-full space-y-2.5 sm:space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-950">
                          {venture.name}
                        </h3>
                        <span className="text-[8.5px] sm:text-[9.5px] font-mono px-3 py-0.5 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 font-semibold uppercase tracking-wider">
                          {venture.badge}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs font-mono tracking-wider uppercase text-[#ff5500] font-semibold mb-1 sm:mb-2">
                        {venture.subtitle}
                      </p>
                    </div>

                    {/* About Narrative Block */}
                    <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-[#fafafa] via-white to-neutral-50/60 shadow-xs">
                      <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-mono tracking-[0.25em] uppercase text-neutral-400 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500]" />
                        <span>ABOUT THE COMPANY</span>
                      </div>
                      <p className="text-xs sm:text-[13.5px] md:text-sm font-light text-neutral-700 leading-relaxed">
                        {venture.description}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Ventures Logo Ecosystem Strip ("JUST BELOW THE DETAILS") - High Visibility */}
        <div className="max-w-6xl mx-auto w-full pt-2 pb-1 shrink-0">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
            {ventures.map((v, vIdx) => {
              const isActive = vIdx === activeVenture;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectVenture(vIdx)}
                  className={`group relative flex flex-col justify-between p-2.5 sm:p-3 md:p-3.5 rounded-2xl border-2 transition-all duration-500 ease-out cursor-pointer text-left overflow-hidden ${
                    isActive
                      ? 'bg-white border-[#ff5500] shadow-[0_12px_28px_-4px_rgba(255,85,0,0.22)] -translate-y-1 scale-[1.02]'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs opacity-90 hover:opacity-100 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top Animated Orange Accent Indicator */}
                  <div
                    className={`absolute top-0 inset-x-0 h-1.5 bg-[#ff5500] shadow-[0_2px_8px_rgba(255,85,0,0.4)] transition-transform duration-500 ease-out origin-left ${
                      isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    }`}
                  />

                  {/* Header: ID & Live Status */}
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[9px] sm:text-[10px] font-mono font-bold transition-colors duration-300 ${
                      isActive ? 'text-[#ff5500]' : 'text-neutral-500'
                    }`}>
                      [{v.id}]
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isActive ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]" />
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#ff5500] font-bold">
                            VIEWING
                          </span>
                        </>
                      ) : (
                        <span className="text-[8px] sm:text-[9px] font-mono tracking-wider text-neutral-400 group-hover:text-neutral-700 transition-colors">
                          VIEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* High-Visibility Centered Animated Logo */}
                  <div className="h-10 sm:h-12 md:h-13 w-full flex items-center justify-center py-1 overflow-hidden bg-neutral-50/70 rounded-xl border border-neutral-100 group-hover:bg-white transition-colors">
                    <img
                      src={v.logo}
                      alt={`${v.name} logo`}
                      className={`max-h-8 sm:max-h-10 md:max-h-11 w-auto max-w-[85%] object-contain transition-all duration-500 ease-out filter drop-shadow-xs ${
                        isActive
                          ? 'opacity-100 scale-105'
                          : 'opacity-85 group-hover:opacity-100 scale-95 group-hover:scale-100'
                      }`}
                    />
                  </div>

                  {/* Bottom Meta Row */}
                  <div className="w-full flex items-baseline justify-between pt-1.5 mt-1 border-t border-neutral-100 text-[8.5px] sm:text-[9.5px] font-mono">
                    <span className={`font-bold tracking-tight transition-colors duration-300 truncate ${
                      isActive ? 'text-neutral-950' : 'text-neutral-700'
                    }`}>
                      {v.name}
                    </span>
                    <span className="text-[7.5px] sm:text-[8.5px] text-neutral-400 font-medium truncate hidden sm:inline">
                      {v.period}
                    </span>
                  </div>

                  {/* Subtle Glow on Active */}
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-tr from-[#ff5500]/10 via-transparent to-transparent rounded-2xl blur-md pointer-events-none -z-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Prev/Next & Progress Track */}
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between pt-2 pb-1 sm:pb-2 border-t border-neutral-200/80 text-[10px] font-mono tracking-widest text-neutral-400 uppercase shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="px-3 py-1 rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-900 hover:text-white text-[9px] sm:text-[10px] transition-all cursor-pointer"
            >
              ← PREV
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1 rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-900 hover:text-white text-[9px] sm:text-[10px] transition-all cursor-pointer"
            >
              {activeVenture === ventures.length - 1 ? 'CONTINUE ↓' : 'NEXT →'}
            </button>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {ventures.map((_, i) => (
              <button
                key={i}
                onClick={() => selectVenture(i)}
                aria-label={`Go to venture ${i + 1}`}
                className={`h-1.5 transition-all duration-700 rounded-full cursor-pointer ${
                  i === activeVenture ? 'w-8 sm:w-10 bg-[#ff5500]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>

          <span className="hidden sm:inline text-[9px]">
           
          </span>
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
          className="absolute bottom-1/4 -right-48 w-[480px] h-[480px] bg-gradient-to-bl from-[#ff5500]/[0.05] to-[#ff5500]/[0.015] rounded-full blur-[130px] pointer-events-none -z-0"
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
                VISION & <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-transparent">MISSION.</span>
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
                  ? '0 30px 65px -15px rgba(255, 85, 0, 0.14), 0 20px 40px -10px rgba(0, 0, 0, 0.07)' 
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
                  className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-[#ff5500]/14 to-transparent blur-md"
                  style={{ animation: 'cardSheenSweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards' }}
                />
              </div>

              {/* Living Autonomous Ambient Drift Spotlight (Active when not hovering) */}
              <div 
                className="pointer-events-none absolute -inset-10 blur-3xl transition-opacity duration-700 z-0"
                style={{
                  opacity: card1Tilt.isHovered ? 0 : 0.65,
                  background: 'radial-gradient(circle, rgba(255, 85, 0, 0.08) 0%, transparent 60%)',
                  animation: 'idleSpotDrift1 14s ease-in-out infinite'
                }}
              />

              {/* Dynamic Luminous Mouse Spotlight Sheen (Active on hover) */}
              <div 
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
                style={{
                  opacity: card1Tilt.isHovered ? 1 : 0,
                  background: `radial-gradient(550px circle at ${card1Tilt.spotX}px ${card1Tilt.spotY}px, rgba(255, 85, 0, 0.09), transparent 65%)`
                }}
              />

              {/* Glowing Top Shimmer Beam */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5500]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

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
                      className="absolute left-0 -bottom-1 h-[2.5px] bg-gradient-to-r from-[#ff5500] via-[#ff7722] to-[#ff5500] rounded-full shadow-[0_0_10px_rgba(255,85,0,0.5)]" 
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
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ff5500] scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-center" />
                      <span className="text-[10px] font-mono tracking-wider text-neutral-400 group-hover/item:text-[#ff5500] transition-colors mt-0.5 min-w-[70px] sm:min-w-[85px]">
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
                  ? '0 30px 65px -15px rgba(255, 85, 0, 0.14), 0 20px 40px -10px rgba(0, 0, 0, 0.07)' 
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
                  className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-[#ff5500]/14 to-transparent blur-md"
                  style={{ animation: 'cardSheenSweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards' }}
                />
              </div>

              {/* Living Autonomous Ambient Drift Spotlight (Active when not hovering) */}
              <div 
                className="pointer-events-none absolute -inset-10 blur-3xl transition-opacity duration-700 z-0"
                style={{
                  opacity: card2Tilt.isHovered ? 0 : 0.65,
                  background: 'radial-gradient(circle, rgba(255, 85, 0, 0.08) 0%, transparent 60%)',
                  animation: 'idleSpotDrift2 16s ease-in-out infinite'
                }}
              />

              {/* Dynamic Luminous Mouse Spotlight Sheen (Active on hover) */}
              <div 
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
                style={{
                  opacity: card2Tilt.isHovered ? 1 : 0,
                  background: `radial-gradient(550px circle at ${card2Tilt.spotX}px ${card2Tilt.spotY}px, rgba(255, 85, 0, 0.09), transparent 65%)`
                }}
              />

              {/* Glowing Top Shimmer Beam */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5500]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

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
                      className="absolute left-0 -bottom-1 h-[2.5px] bg-gradient-to-r from-[#ff5500] via-[#ff7722] to-[#ff5500] rounded-full shadow-[0_0_10px_rgba(255,85,0,0.5)]" 
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
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ff5500] scale-y-0 group-hover/item:scale-y-100 transition-transform duration-300 origin-center" />
                      <span className="text-[10px] font-mono tracking-wider text-neutral-400 group-hover/item:text-[#ff5500] transition-colors mt-0.5 min-w-[70px] sm:min-w-[85px]">
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

          {/* Bottom Philosophical Quote Bar with Staggered Entrance & Interactive Elevation */}
          <div 
            className={`group mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl border border-neutral-200 bg-[#fafafa] hover:bg-white hover:border-neutral-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-5 transition-all duration-800 delay-500 ${
              isSection4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl text-[#ff5500] font-serif leading-none group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">“</span>
              <p className="text-xs sm:text-sm font-light text-neutral-700 tracking-wide leading-relaxed">
                Bridging radical creative expression with scalable business infrastructure to make creativity permanent.
              </p>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase shrink-0 group-hover:text-neutral-700 transition-colors">
              ANEES ARK
            </span>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          SECTION 6: ADVISORY, CONTACT & TRANSMISSION
      ────────────────────────────────────────────── */}
      <footer ref={contactRef} id="contact" className="relative py-10 sm:py-12 md:py-14 lg:py-16 px-5 sm:px-10 md:px-16 border-t border-neutral-200 bg-[#fafafa] overflow-hidden">
        {/* Ambient Subtle Architectural Lighting */}
        <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] bg-gradient-to-bl from-neutral-200/50 to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />
        <div className="absolute bottom-1/4 -left-48 w-[500px] h-[500px] bg-gradient-to-tr from-[#ff5500]/[0.035] to-transparent rounded-full blur-[130px] pointer-events-none -z-0" />

        <div key={contactAnimKey} className="max-w-6xl mx-auto w-full relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-6 sm:mb-8 items-center">
            
            {/* ────────── LEFT COLUMN: EXECUTIVE DIRECT COMMUNICATIONS HUB ────────── */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6">
              
              {/* Header Group */}
              <div style={{ animation: 'contactHeaderRise 0.85s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] uppercase text-neutral-950 mb-3 sm:mb-5">
                  LET’S BUILD <br />
                  SOMETHING <br />
                  <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-transparent">
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
                    className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-[#ff5500]/10 to-transparent blur-md"
                    style={{ animation: 'contactSheenSweep 2s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards' }}
                  />
                </div>

                {/* Glowing Top Shimmer Beam */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff5500] to-transparent" />

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
                      className="mt-3 inline-block text-xs font-mono tracking-wider uppercase text-neutral-800 hover:text-[#ff5500] underline underline-offset-4 cursor-pointer transition-colors"
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
                          className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-neutral-50/70 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/15 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
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
                          className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-neutral-50/70 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/15 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
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
                        className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-neutral-50/70 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#ff5500] focus:ring-2 focus:ring-[#ff5500]/15 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400 resize-none"
                      />
                    </div>

                    {formErrorMessage && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                        <span>{formErrorMessage}</span>
                        <button type="button" onClick={() => setFormErrorMessage('')} className="text-red-500 font-bold ml-2">×</button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full group/btn relative flex items-center justify-center gap-2.5 rounded-xl bg-neutral-950 hover:bg-[#ff5500] text-white py-3 text-xs font-mono font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-60 shadow-sm hover:shadow-[0_6px_20px_rgba(255,85,0,0.3)] active:scale-[0.99] cursor-pointer overflow-hidden"
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
                  CONNECT ACROSS <span className="font-bold italic bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-400 bg-clip-text text-transparent">PLATFORMS.</span>
                </h3>
              </div>
            </div>

            {/* 2-Column Grid for Instagram & LinkedIn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* ─── INSTAGRAM SPOTLIGHT CARD (PURE LUXURY TYPOGRAPHY + LIGHT SWEEP) ─── */}
              <a
                href="https://www.instagram.com/anees_ark/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ animation: 'contactRiseLeft 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both' }}
                className="group relative block p-5 sm:p-6 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-400 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden cursor-pointer"
              >
                {/* Diagonal Light Sweep Beam upon Arrival */}
                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
                  <div 
                    className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-[#ff5500]/12 to-transparent blur-md"
                    style={{ animation: 'contactSheenSweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards' }}
                  />
                </div>

                {/* Subtle Ambient Radial Glow on Hover */}
                <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-[#ff5500]/[0.08] to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top Meta Bar */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 group-hover:text-neutral-700 transition-colors">
                    INSTAGRAM
                  </span>
                  <span className="text-xs font-mono text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-300">
                    →
                  </span>
                </div>

                {/* Primary Handle */}
                <div className="mb-1.5">
                  <h4 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-950 group-hover:text-black transition-colors">
                    @anees_ark
                  </h4>
                </div>

                {/* Editorial Context */}
                <p className="text-xs text-neutral-600 font-light leading-relaxed mb-4">
                  Behind-the-scenes venture building, creative direction, cinematography, and live founder updates.
                </p>

                {/* Direct Text Prompt */}
                <div className="flex items-center gap-2 text-xs font-mono font-medium tracking-widest uppercase text-neutral-900 group-hover:text-[#ff5500] transition-colors">
                  <span>EXPLORE ARCHIVE</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </a>

              {/* ─── LINKEDIN SPOTLIGHT CARD (PURE LUXURY TYPOGRAPHY + LIGHT SWEEP) ─── */}
              <a
                href="https://www.linkedin.com/in/anees-ark-bb77a1265/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ animation: 'contactRiseLeft 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both' }}
                className="group relative block p-5 sm:p-6 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-400 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden cursor-pointer"
              >
                {/* Diagonal Light Sweep Beam upon Arrival */}
                <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
                  <div 
                    className="w-2/3 h-[200%] -top-1/2 bg-gradient-to-r from-transparent via-[#ff5500]/12 to-transparent blur-md"
                    style={{ animation: 'contactSheenSweep 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards' }}
                  />
                </div>

                {/* Subtle Ambient Radial Glow on Hover */}
                <div className="absolute -right-12 -top-12 w-36 h-36 bg-gradient-to-br from-[#ff5500]/[0.08] to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top Meta Bar */}
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 group-hover:text-neutral-700 transition-colors">
                    LINKEDIN
                  </span>
                  <span className="text-xs font-mono text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-300">
                    →
                  </span>
                </div>

                {/* Primary Profile Name */}
                <div className="mb-1.5">
                  <h4 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-950 group-hover:text-black transition-colors">
                    Anees Ark
                  </h4>
                </div>

                {/* Editorial Context */}
                <p className="text-xs text-neutral-600 font-light leading-relaxed mb-4">
                  Strategic venture advisory, executive board affiliations, founder partnerships, and investment syndication.
                </p>

                {/* Direct Text Prompt */}
                <div className="flex items-center gap-2 text-xs font-mono font-medium tracking-widest uppercase text-neutral-900 group-hover:text-[#ff5500] transition-colors">
                  <span>EXPAND NETWORK</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
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
            <span className="text-neutral-400 group-hover:text-[#ff5500] group-hover:-translate-y-0.5 transition-transform">↑</span>
          </button>
        </div>

      </footer>

    </div>
  );
}