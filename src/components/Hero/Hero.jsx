import React from 'react';
import heroImage from '../../assets/anees.png';

export default function FounderPortfolio() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e8e8] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-white selection:text-black antialiased">

      {/* ──────────────────────────────────────────────
          TOP MINIMAL EDITORIAL BAR
      ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md px-8 sm:px-16 py-8 flex items-center justify-between text-[11px] font-extralight tracking-[0.35em] uppercase border-b border-neutral-900/50">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">
          ANEES ARK
        </button>
        <div className="flex items-center gap-10 sm:gap-14">
          <button onClick={() => scrollTo('ventures')} className="hover:text-white transition-colors">COMPANIES</button>
          <button onClick={() => scrollTo('works')} className="hover:text-white transition-colors">WORKS</button>
          <button onClick={() => scrollTo('index')} className="hover:text-white transition-colors">INDEX</button>
          <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">CONTACT</button>
        </div>
      </nav>


      {/* ──────────────────────────────────────────────
          SECTION 1: HERO POSTER (Francesco Gioia Composition)
      ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-between pt-36 pb-16 px-8 sm:px-16">
        {/* Editorial Sub-headers */}
        <div className="flex justify-between items-center text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-extralight">
          <span>FOUNDER & CREATIVE DIRECTOR</span>
          <span>EST. 2018</span>
        </div>

        {/* Central High-Impact Typography & Cutout Composition */}
        <div className="relative my-auto flex flex-col items-center justify-center text-center py-20">
          
          {/* Overlapping Floating Portrait */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 md:w-80 h-64 sm:h-80 md:h-96 z-0 overflow-hidden pointer-events-none opacity-85">
            <img
              src={heroImage}
              alt="Anees Ark"
              className="w-full h-full object-cover grayscale contrast-125 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
          </div>

          {/* Huge Thin Stacked Name */}
          <h1 className="relative z-10 text-6xl sm:text-8xl md:text-[11rem] font-thin tracking-tight leading-[0.88] uppercase select-none mix-blend-difference">
            HELLO, I’M <br />
            <span className="font-light">ANEES</span> <br />
            ARK
          </h1>
        </div>

        {/* Hero Bottom Navigation Hint */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-[0.3em] uppercase text-neutral-500 font-extralight gap-4">
          <span>LONDON / WORLDWIDE</span>
          <span>SCALING CREATIVE CAPITAL</span>
          <button onClick={() => scrollTo('thesis')} className="text-neutral-300 hover:text-white transition-colors">
            EXPLORE ↓
          </button>
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

          {/* Minimal Venture List */}
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
          (Mimicking the 4-card catalog from Behance)
      ────────────────────────────────────────────── */}
      <section id="works" className="py-40 px-8 sm:px-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto">
          {/* Exact Francesco Header Style */}
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

          {/* 4 Cards with Tall Aspect Ratio */}
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
      <section id="index" className="py-40 px-8 sm:px-16 border-t border-neutral-900/60">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4">
            <span className="text-[10px] font-extralight tracking-[0.4em] uppercase text-neutral-500 block mb-4">04 / METRICS</span>
            <h2 className="text-3xl sm:text-5xl font-thin tracking-wide uppercase">TRACK RECORD</h2>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-2 gap-12 sm:gap-16">
            <div>
              <span className="text-4xl sm:text-6xl font-thin tracking-tight block mb-2">$42M+</span>
              <p className="text-[11px] font-extralight tracking-[0.25em] uppercase text-neutral-400">Total Capital Raised</p>
            </div>
            <div>
              <span className="text-4xl sm:text-6xl font-thin tracking-tight block mb-2">3</span>
              <p className="text-[11px] font-extralight tracking-[0.25em] uppercase text-neutral-400">Companies Founded</p>
            </div>
            <div>
              <span className="text-4xl sm:text-6xl font-thin tracking-tight block mb-2">12</span>
              <p className="text-[11px] font-extralight tracking-[0.25em] uppercase text-neutral-400">Global Design Honors</p>
            </div>
            <div>
              <span className="text-4xl sm:text-6xl font-thin tracking-tight block mb-2">100K+</span>
              <p className="text-[11px] font-extralight tracking-[0.25em] uppercase text-neutral-400">Active Platform Users</p>
            </div>
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