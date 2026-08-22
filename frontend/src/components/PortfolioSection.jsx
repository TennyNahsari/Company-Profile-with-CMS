import React, { useState, useEffect } from 'react';
import { ExternalLink, Layers, TrendingUp, Tag, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function PortfolioSection() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([{ name: 'ALL', slug: 'all' }]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    async function loadPortfolioData() {
      const [projData, catData] = await Promise.all([
        apiService.getProjects(),
        apiService.getPortfolioCategories()
      ]);
      setProjects(projData || []);
      if (catData && catData.length > 0) {
        setCategories([{ name: 'ALL', slug: 'all' }, ...catData]);
      }
    }
    loadPortfolioData();
  }, []);

  const filteredProjects = filter === 'ALL' 
    ? projects 
    : projects.filter(p => 
        (p.category && p.category.toLowerCase().includes(filter.toLowerCase())) ||
        (p.category_name && p.category_name.toLowerCase().includes(filter.toLowerCase())) ||
        (p.category_slug && p.category_slug === filter.toLowerCase())
      );

  // Option B: Limit homepage display to top 6 projects
  const displayedProjects = filteredProjects.slice(0, 6);

  const handleProjectClick = (slug) => {
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

  const handleExploreAllPortfolio = () => {
    window.history.pushState({}, '', '/portfolio');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="w-full section-padding bg-slate-950/40 relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center justify-center">
          <div className="badge-glow mb-4 mx-auto">Case Studies & Portfolio</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            Proven Results & <span className="gradient-text">Case Studies</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg text-center">
            Explore how we've scaled ambitious startups and Fortune 500 brands through strategic digital transformation.
          </p>
        </div>

        {/* Dynamic Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 w-full">
          {categories.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setFilter(cat.name)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                filter === cat.name
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Portfolio Grid (Showcase 6 Featured) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-14">
          {displayedProjects.map((project) => {
            const outcomes = typeof project.outcomes === 'string' ? JSON.parse(project.outcomes) : (project.outcomes || {});
            const catName = project.category_name || project.category;
            const catSlug = project.category_slug || (catName ? catName.toLowerCase().replace(/[^a-z0-9]/g, '-') : null);

            return (
              <div 
                key={project.id || project.slug}
                onClick={() => handleProjectClick(project.slug)}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail Image Container */}
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
                      title={`View all case studies in category "${catName}"`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{catName}</span>
                    </button>
                  )}
                </div>

                {/* Body Content */}
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

                  {/* Outcome Highlights Chips */}
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

        {/* Option B: Explore All Case Studies CTA */}
        <div className="flex items-center justify-center">
          <button 
            onClick={handleExploreAllPortfolio}
            className="btn-primary py-3.5 px-8 text-xs font-bold flex items-center gap-2 group"
          >
            <span>View All B2B Case Studies ({projects.length})</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
