import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, ShieldCheck, Layers } from 'lucide-react';
import Pagination from './Pagination';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function ServiceCategoryPage({ categorySlug, onBack }) {
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadCategoryServices() {
      setLoading(true);
      try {
        const [catData, servData] = await Promise.all([
          apiService.getServiceCategories(),
          apiService.getServices()
        ]);

        const foundCat = catData.find(c => c.slug === categorySlug || c.id === parseInt(categorySlug));
        setCategory(foundCat || { name: categorySlug.replace(/-/g, ' '), slug: categorySlug });

        const filtered = servData.filter(s => 
          (s.category_slug && s.category_slug === categorySlug) ||
          (s.category_id && foundCat && s.category_id === foundCat.id) ||
          (s.category_name && foundCat && s.category_name.toLowerCase() === foundCat.name.toLowerCase())
        );
        setServices(filtered.length > 0 ? filtered : servData);
      } catch (e) {}
      setLoading(false);
    }
    loadCategoryServices();
  }, [categorySlug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  const totalPages = Math.ceil((services.length || 0) / itemsPerPage);
  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleServiceDetailClick = (slug) => {
    const targetUrl = `/service/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading category services...</p>
      </div>
    );
  }

  const formatImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const base = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000')
      ? 'http://localhost:5000'
      : '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <article className="subpage-top-clearance category-page-container min-h-screen w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back Button */}
        <div className="category-back-btn-box">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to All Services</span>
          </button>
        </div>

        {/* Category Header Banner */}
        <div className="glass-panel category-header-banner border border-indigo-500/30 shadow-2xl w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          <div className="badge-glow category-banner-badge mx-auto">Service Category</div>
          <h1 className="font-extrabold text-white text-center category-banner-title">
            {category?.name || 'Category Offerings'}
          </h1>
          <p className="text-slate-300 text-center category-banner-subtitle">
            {category?.description || `Explore our specialized ${category?.name || ''} capabilities engineered for high performance and B2B growth.`}
          </p>
          <div className="category-banner-count inline-flex items-center gap-2 font-semibold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>{services.length} Services Available in this Category</span>
          </div>
        </div>

        {/* Services Grid for this Category */}
        <div className="category-grid-layout mb-8">
          {paginatedServices.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Layout;
            const features = typeof service.features === 'string' ? JSON.parse(service.features) : (service.features || []);
            const thumbUrl = formatImageUrl(service.thumbnail_url);

            return (
              <div 
                key={service.id || service.slug} 
                onClick={() => handleServiceDetailClick(service.slug)}
                className="glass-card category-card-item service-card-item group relative overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {thumbUrl ? (
                    <div className="relative w-full h-44 -mt-2 -mx-2 mb-4 rounded-xl overflow-hidden border border-white/10 group-hover:border-indigo-500/40 transition-all shadow-md">
                      <img 
                        src={thumbUrl} 
                        alt={service.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081425] via-[#081425]/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 z-10 w-10 h-10 rounded-xl bg-indigo-600/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                  ) : (
                    <div className="service-card-icon-wrapper bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  )}

                  <h3 className="text-white flex items-center justify-between service-card-title mt-2">
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
                  onClick={(e) => { e.stopPropagation(); handleServiceDetailClick(service.slug); }}
                  className="service-card-button text-center font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 transition-all"
                >
                  View Full Detail &rarr;
                </button>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        )}

      </div>
    </article>
  );
}
