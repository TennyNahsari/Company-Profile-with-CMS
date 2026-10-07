import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customHeroBg, setCustomHeroBg] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [slidersData, heroSettingsData] = await Promise.all([
        apiService.getSliders(),
        apiService.getHeroSettings()
      ]);

      if (slidersData && slidersData.length > 0) {
        setSlides(slidersData);
      }
      if (heroSettingsData?.hero_bg_url) {
        setCustomHeroBg(heroSettingsData.hero_bg_url);
      } else {
        setCustomHeroBg(null);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const formatBgUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const base = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000')
      ? 'http://localhost:5000'
      : '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const currentSlide = slides[currentIndex];
  const rawBg = customHeroBg || currentSlide.image_url;
  const activeBgImage = formatBgUrl(rawBg);

  return (
    <section id="hero" className="relative min-h-screen pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden w-full text-center">
      {/* Background Image with Dark Vignette Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out opacity-30 filter blur-[1px]"
        style={{ backgroundImage: `url(${activeBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#081425]/90 via-[#081425]/80 to-[#081425]" />

      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center gap-6 w-full">
          
          {/* Glowing Badge */}
          <div className="badge-glow animate-pulse mx-auto">
            <span className="pulse-dot"></span>
            <span>{currentSlide.badge_text || 'NEXT-GEN DIGITAL AGENCY'}</span>
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] text-center w-full">
            <span className="gradient-text">{currentSlide.title}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-center">
            {currentSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto mx-auto">
            <a href={currentSlide.cta_link || '#portfolio'} className="btn-primary w-full sm:w-auto justify-center">
              <span>{currentSlide.cta_text || 'Explore Our Work'}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#contact" className="btn-secondary w-full sm:w-auto justify-center">
              Book Strategy Session
            </a>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 w-full max-w-3xl mx-auto glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-400">99.4%</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">Client Satisfaction</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-purple-400">3.8x</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">Average ROI Growth</span>
            </div>
            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-sky-400">120+</span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wider mt-1 text-center">Global Deployments</span>
            </div>
          </div>

        </div>

        {/* Slide Controls */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 mx-auto">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-2 rounded-full bg-white/5 hover:bg-indigo-600/30 border border-white/10 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
              className="p-2 rounded-full bg-white/5 hover:bg-indigo-600/30 border border-white/10 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
