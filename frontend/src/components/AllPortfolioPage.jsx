import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Briefcase, TrendingUp, Search, Tag } from 'lucide-react';

export default function AllPortfolioPage({ onBack }) {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([{ name: 'ALL', slug: 'all' }]);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllPortfolio() {
      setLoading(true);
      try {
        const [projData, catData] = await Promise.all([
          apiService.getProjects(),
          apiService.getPortfolioCategories()
        ]);
        setProjects(projData || []);
        if (catData && catData.length > 0) {
          setCategories([{ name: 'ALL', slug: 'all' }, ...catData]);
        }
      } catch (e) {}
      setLoading(false);
    }
    loadAllPortfolio();
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'ALL' || 
      (p.category && p.category.toLowerCase().includes(filter.toLowerCase())) ||
      (p.category_name && p.category_name.toLowerCase().includes(filter.toLowerCase())) ||
      (p.category_slug && p.category_slug === filter.toLowerCase());
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleProjectDetailClick = (slug) => {
    const targetUrl = `/portfolio/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (e, catSlug) => {
    e.stopPropagation();
    if (!catSlug) return;
    const targetUrl = `/portfolio/category/${catSlug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading full portfolio case studies directory...</p>
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
          <div className="badge-glow mb-3 mx-auto">Complete Portfolio Directory</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            All Case Studies & Deliverables
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl text-center leading-relaxed mb-6">
            Browse our full catalog of client transformations, ROI performance metrics, and enterprise engineering case studies.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input 
              type="text"
              placeholder="Search case studies by client or technology..."
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

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {filteredProjects.map((project) => {
            const outcomes = typeof project.outcomes === 'string' ? JSON.parse(project.outcomes) : (project.outcomes || {});
            const catName = project.category_name || project.category;
            const catSlug = project.category_slug || (catName ? catName.toLowerCase().replace(/[^a-z0-9]/g, '-') : null);

            return (
              <div 
                key={project.id || project.slug}
                onClick={() => handleProjectDetailClick(project.slug)}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={project.thumbnail_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {catName && (
                    <button
                      onClick={(e) => handleCategoryClick(e, catSlug)}
                      className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all flex items-center gap-1.5"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{catName}</span>
                    </button>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-400">{project.client_name}</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2 group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-6">
                      {project.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">
                        {Object.values(outcomes)[0] || 'High Growth'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Case Study &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </article>
  );
}
