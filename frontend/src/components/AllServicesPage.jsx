import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowUpRight, Tag, Layers, Search } from 'lucide-react';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function AllServicesPage({ onBack }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([{ name: 'ALL', slug: 'all' }]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllServices() {
      setLoading(true);
      try {
        const [servData, catData] = await Promise.all([
          apiService.getServices(),
          apiService.getServiceCategories()
        ]);
        setServices(servData || []);
        if (catData && catData.length > 0) {
          setCategories([{ name: 'ALL', slug: 'all' }, ...catData]);
        }
      } catch (e) {}
      setLoading(false);
    }
    loadAllServices();
  }, []);

  const filteredServices = services.filter(s => {
    const matchesFilter = filter === 'ALL' || 
      (s.category_name && s.category_name.toLowerCase().includes(filter.toLowerCase())) ||
      (s.category_slug && s.category_slug === filter.toLowerCase());
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading full agency capabilities directory...</p>
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
            <span>Back to Home</span>
          </button>
        </div>

        {/* Directory Header Banner */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl mb-12 w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="badge-glow mb-3 mx-auto">Full Capabilities Directory</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            All Agency Services & Solutions
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl text-center leading-relaxed mb-6">
            Explore our complete spectrum of digital marketing, UI/UX design, React full-stack engineering, and brand strategy capabilities.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input 
              type="text"
              placeholder="Search services or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-11 pr-4 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 w-full">
          {categories.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setFilter(cat.name)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                filter === cat.name
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon_name] || Layout;
            const features = typeof service.features === 'string' ? JSON.parse(service.features) : (service.features || []);
            const hasCategory = Boolean(service.category_name);
            const catName = service.category_name;
            const catSlug = service.category_slug || service.slug;

            return (
              <div 
                key={service.id || service.slug} 
                onClick={() => handleServiceClick(service.slug)}
                className="glass-card p-8 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
              >
                <div>
                  {hasCategory && (
                    <div className="mb-4">
                      <button
                        onClick={(e) => handleCategoryClick(e, catSlug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{catName}</span>
                      </button>
                    </div>
                  )}

                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-all" />
                  </h3>

                  <p className="text-xs text-slate-300 mb-6 line-clamp-3 leading-relaxed">
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
                  onClick={(e) => { e.stopPropagation(); handleServiceClick(service.slug); }}
                  className="w-full text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 py-3 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 transition-all"
                >
                  View Detail Page &rarr;
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </article>
  );
}
