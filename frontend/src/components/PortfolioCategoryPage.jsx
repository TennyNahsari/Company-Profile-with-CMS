import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, TrendingUp, Briefcase, Layers } from 'lucide-react';

export default function PortfolioCategoryPage({ categorySlug, onBack }) {
  const [category, setCategory] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryPortfolio() {
      setLoading(true);
      try {
        const [catData, projData] = await Promise.all([
          apiService.getPortfolioCategories(),
          apiService.getProjects()
        ]);

        const foundCat = catData.find(c => c.slug === categorySlug || c.id === parseInt(categorySlug));
        setCategory(foundCat || { name: categorySlug.replace(/-/g, ' '), slug: categorySlug });

        const filtered = projData.filter(p => 
          (p.category_slug && p.category_slug === categorySlug) ||
          (p.category_id && foundCat && p.category_id === foundCat.id) ||
          (p.category && foundCat && p.category.toLowerCase().includes(foundCat.name.toLowerCase())) ||
          (p.category_name && foundCat && p.category_name.toLowerCase().includes(foundCat.name.toLowerCase()))
        );
        setProjects(filtered.length > 0 ? filtered : projData);
      } catch (e) {}
      setLoading(false);
    }
    loadCategoryPortfolio();
  }, [categorySlug]);

  const handleProjectDetailClick = (slug) => {
    const targetUrl = `/portfolio/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading portfolio case studies...</p>
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
            <span>Back to All Case Studies</span>
          </button>
        </div>

        {/* Category Header Banner */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/30 shadow-2xl mb-12 w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="badge-glow mb-3 mx-auto">Portfolio Category</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {category?.name || 'Case Studies'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl text-center leading-relaxed">
            {category?.description || `Explore our proven B2B case studies and client transformations in ${category?.name || ''}.`}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{projects.length} Proven Case Studies Available</span>
          </div>
        </div>

        {/* Portfolio Grid for this Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {projects.map((project) => {
            const outcomes = typeof project.outcomes === 'string' ? JSON.parse(project.outcomes) : (project.outcomes || {});

            return (
              <div 
                key={project.id}
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
                  
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-indigo-400">
                    {project.category_name || project.category || 'Case Study'}
                  </span>
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
                      Read Full Case Study &rarr;
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
