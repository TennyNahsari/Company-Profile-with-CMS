import React, { useState, useEffect } from 'react';
import { Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, Tag, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import Pagination from './Pagination';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    async function loadServices() {
      const data = await apiService.getServices();
      setServices(data || []);
    }
    loadServices();
  }, []);

  const totalPages = Math.ceil((services.length || 0) / itemsPerPage);
  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleServiceClick = (slug) => {
    const targetUrl = `/service/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (e, catSlug) => {
    e.stopPropagation();
    if (!catSlug) return;
    const targetUrl = `/service/category/${catSlug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAllServices = () => {
    window.history.pushState({}, '', '/services');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="services" className="w-full relative flex flex-col items-center justify-center services-section-container">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mx-auto services-header-box flex flex-col items-center justify-center">
          <div className="badge-glow mb-4 mx-auto">Core Capabilities</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center services-header-title">
            Engineered for Market <span className="gradient-text-accent">Dominance</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg text-center services-header-subtitle">
            End-to-end digital solutions designed to transform complex brand strategies into high-converting revenue engines.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid-layout mb-8">
          {paginatedServices.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Layout;
            const features = typeof service.features === 'string' ? JSON.parse(service.features) : (service.features || []);
            const hasCategory = Boolean(service.category_name);
            const catName = service.category_name;
            const catSlug = service.category_slug || service.slug;

            return (
              <div 
                key={service.id || service.slug} 
                onClick={() => handleServiceClick(service.slug)}
                className="glass-card service-card-item group relative overflow-hidden cursor-pointer"
              >
                {/* Background Accent Glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all" />

                <div>
                  {hasCategory && (
                    <div className="service-card-badge">
                      <button
                        onClick={(e) => handleCategoryClick(e, catSlug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                        title={`View all services in category "${catName}"`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{catName}</span>
                      </button>
                    </div>
                  )}

                  <div className="service-card-icon-wrapper bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-white flex items-center justify-between service-card-title">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-all shrink-0 ml-2" />
                  </h3>

                  <p className="service-card-summary line-clamp-3">
                    {service.summary}
                  </p>

                  <div className="service-card-features-list">
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="service-card-feature-item">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleServiceClick(service.slug); }}
                  className="service-card-button text-center font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 transition-all"
                >
                  View Detail Page &rarr;
                </button>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mb-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Explore All Services CTA */}
        <div className="flex items-center justify-center services-cta-wrapper">
          <button 
            onClick={handleExploreAllServices}
            className="btn-secondary py-3.5 px-8 text-xs font-bold flex items-center gap-2 group"
          >
            <span>Explore All Agency Services ({services.length})</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
