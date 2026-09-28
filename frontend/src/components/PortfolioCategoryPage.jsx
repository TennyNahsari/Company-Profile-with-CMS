import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, TrendingUp, Briefcase, Layers } from 'lucide-react';
import Pagination from './Pagination';

export default function PortfolioCategoryPage({ categorySlug, onBack }) {
  const [category, setCategory] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  const totalPages = Math.ceil((projects.length || 0) / itemsPerPage);
  const paginatedProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <article className="subpage-top-clearance category-page-container min-h-screen w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back Button */}
        <div className="category-back-btn-box">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to All Case Studies</span>
          </button>
        </div>

        {/* Category Header Banner */}
        <div className="glass-panel category-header-banner border border-indigo-500/30 shadow-2xl w-full text-center flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="badge-glow category-banner-badge mx-auto">Portfolio Category</div>
          <h1 className="font-extrabold text-white text-center category-banner-title">
            {category?.name || 'Case Studies'}
          </h1>
          <p className="text-slate-300 text-center category-banner-subtitle">
            {category?.description || `Explore our proven B2B case studies and client transformations in ${category?.name || ''}.`}
          </p>
          <div className="category-banner-count inline-flex items-center gap-2 font-semibold text-indigo-400 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{projects.length} Proven Case Studies Available</span>
          </div>
        </div>

        {/* Portfolio Grid for this Category */}
        <div className="category-grid-layout mb-8">
          {paginatedProjects.map((project) => {
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
