import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, ShieldCheck, Layers } from 'lucide-react';

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

  return (
    <article className="subpage-top-clearance min-h-screen pb-28 w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to All Services</span>
          </button>
        </div>

        {/* Category Header Banner */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl mb-12 w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
          <div className="badge-glow mb-3 mx-auto">Service Category</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {category?.name || 'Category Offerings'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl text-center leading-relaxed">
            {category?.description || `Explore our specialized ${category?.name || ''} capabilities engineered for high performance and B2B growth.`}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>{services.length} Services Available in this Category</span>
          </div>
        </div>

        {/* Services Grid for this Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Layout;
            const features = typeof service.features === 'string' ? JSON.parse(service.features) : (service.features || []);

            return (
              <div 
                key={service.id} 
                onClick={() => handleServiceDetailClick(service.slug)}
                className="glass-card p-8 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-all" />
                  </h3>

                  <p className="text-xs text-slate-300 mb-6 leading-relaxed line-clamp-3">
                    {service.summary}
                  </p>

                  <div className="space-y-2 mb-6">
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleServiceDetailClick(service.slug); }}
                  className="w-full text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 py-3 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 transition-all"
                >
                  View Full Detail &rarr;
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </article>
  );
}
