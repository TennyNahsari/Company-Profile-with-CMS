import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, TrendingUp, Calendar, Building2, CheckCircle2, ArrowRight, Tag } from 'lucide-react';

export default function PortfolioDetailPage({ slug, onBack }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPortfolioDetail() {
      setLoading(true);
      setError(null);
      try {
        const projects = await apiService.getProjects();
        const found = projects.find(p => p.slug === slug || p.id === parseInt(slug));
        if (found) {
          setProject(found);
        } else {
          setError('Portfolio case study not found.');
        }
      } catch (e) {
        setError('Error loading portfolio details.');
      }
      setLoading(false);
    }
    loadPortfolioDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading case study details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="glass-panel p-8 rounded-3xl max-w-md mx-auto text-center border border-rose-500/30">
          <Building2 className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Case Study Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The case study page "/portfolio/{slug}" does not exist.</p>
          <button onClick={onBack} className="btn-primary py-2.5 px-5 text-xs mx-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const outcomes = typeof project.outcomes === 'string' ? JSON.parse(project.outcomes) : (project.outcomes || {});

  return (
    <article className="subpage-top-clearance min-h-screen pb-28 w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-5xl">
        
        {/* Back Button */}
        <div className="mb-6 flex items-center justify-start w-full">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to All Case Studies</span>
          </button>
        </div>

        {/* Hero Header Area - Centered & Symmetric */}
        <div className="mb-8 text-center w-full flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <span className="badge-glow">{project.category_name || project.category || 'CASE STUDY'}</span>
            {project.client_name && (
              <span className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Client: {project.client_name}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center leading-tight max-w-4xl">
            {project.title}
          </h1>

          <p className="text-slate-300 text-sm md:text-lg text-center leading-relaxed max-w-3xl mb-2">
            {project.summary}
          </p>
        </div>

        {/* Hero Image Banner - Explicit 44px bottom clearance */}
        <div className="w-full h-[360px] md:h-[480px] rounded-3xl overflow-hidden portfolio-detail-hero-gap border border-white/10 relative shadow-2xl">
          <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        </div>

        {/* Metrics Grid Highlights - Explicit 44px section clearance */}
        {Object.keys(outcomes).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 portfolio-detail-section-gap w-full">
            {Object.entries(outcomes).map(([key, val]) => (
              <div key={key} className="glass-panel p-6 rounded-2xl border border-indigo-500/25 text-center flex flex-col items-center justify-center shadow-lg hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-3xl font-extrabold text-white">{val}</span>
                </div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        )}

        {/* Case Narrative Content - Explicit 44px section clearance */}
        {project.content_html && (
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 portfolio-detail-section-gap w-full prose prose-invert max-w-none text-slate-300 leading-relaxed shadow-xl">
            <div dangerouslySetInnerHTML={{ __html: project.content_html }} />
          </div>
        )}

        {/* Bottom CTA Card */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/30 text-center flex flex-col items-center justify-center gap-6 w-full shadow-2xl mt-8">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">Ready to Achieve Similar Results?</h3>
          <p className="text-slate-300 text-sm max-w-xl text-center leading-relaxed">
            Partner with DigiAgency to architect custom digital applications and growth marketing systems engineered for measurable ROI.
          </p>
          <a href="#contact" className="btn-primary py-3.5 px-8 text-xs font-bold shadow-lg">
            <span>Book Consultation Strategy</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </article>
  );
}
