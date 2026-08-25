import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Layout, Code, TrendingUp, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

const iconMap = {
  Layout: Layout,
  Code: Code,
  TrendingUp: TrendingUp,
  Sparkles: Sparkles,
};

export default function ServiceDetailPage({ slug, onBack }) {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadServiceDetail() {
      setLoading(true);
      setError(null);
      try {
        const services = await apiService.getServices();
        const found = services.find(s => s.slug === slug || s.id === parseInt(slug));
        if (found) {
          setService(found);
        } else {
          setError('Service not found.');
        }
      } catch (e) {
        setError('Error loading service details.');
      }
      setLoading(false);
    }
    loadServiceDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading service capabilities...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="subpage-top-clearance min-h-screen pb-20 flex flex-col items-center justify-center text-center">
        <div className="glass-panel p-8 rounded-3xl max-w-md mx-auto text-center border border-rose-500/30">
          <Layout className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The service page "/service/{slug}" does not exist.</p>
          <button onClick={onBack} className="btn-primary py-2.5 px-5 text-xs mx-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[service.icon_name] || Layout;
  const features = typeof service.features === 'string' ? JSON.parse(service.features) : (service.features || []);

  return (
    <article className="subpage-top-clearance min-h-screen pb-28 w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-6xl">
        
        {/* Back Button */}
        <div className="detail-back-btn-box flex items-center justify-start w-full">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to All Services</span>
          </button>
        </div>

        {/* SECTION 1: Hero Header Card */}
        <div className="glass-panel service-detail-hero-banner border border-indigo-500/30 shadow-2xl w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row items-start md:items-center service-detail-hero-header">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[11px] font-bold text-indigo-400 mb-2">
                <Tag className="w-3 h-3" />
                <span>{service.category_name || 'AGENCY CAPABILITY'}</span>
              </div>
              <h1 className="font-extrabold text-white service-detail-hero-title">{service.title}</h1>
            </div>
          </div>

          <p className="service-detail-hero-summary text-slate-300 leading-relaxed">
            {service.summary}
          </p>

          <div className="flex flex-wrap items-center border-t border-white/10 service-detail-hero-cta">
            <a href="#contact" className="btn-primary py-3.5 px-7 text-xs font-bold shadow-lg">
              <span>Request {service.title} Strategy</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% In-House SLA Guaranteed</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Key Scope & Deliverables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full service-detail-section-grid">
          
          {/* Key Deliverables */}
          <div className="lg:col-span-7 glass-panel service-detail-card border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-white flex items-center gap-2.5 service-detail-card-title">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>Key Scope & Deliverables</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 service-detail-features-grid">
                {features.map((feat, idx) => (
                  <div key={idx} className="service-detail-feature-chip bg-white/5 border border-white/10 flex items-center hover:bg-white/10 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-slate-200">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Partner Card */}
          <div className="lg:col-span-5 glass-panel service-detail-card border border-white/10 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-2">Why Partner With DigiAgency</span>
              <h3 className="text-xl font-bold text-white mb-4">Aetheric Engineering Advantage</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We combine deep technical domain expertise in React, Express, and PostgreSQL cloud architecture with conversions-first UX research to deliver enterprise results.
              </p>
            </div>

            <a href="#contact" className="w-full btn-secondary text-center justify-center py-3.5 text-xs font-bold shadow-md">
              Schedule Capabilities Briefing
            </a>
          </div>

        </div>

        {/* SECTION 3: Detailed Custom HTML & CSS Narrative Render Area */}
        {service.description && (
          <div className="glass-panel service-detail-prose-box border border-white/10 w-full prose prose-invert max-w-none text-slate-300 leading-relaxed shadow-xl">
            <div dangerouslySetInnerHTML={{ __html: service.description }} />
          </div>
        )}

      </div>
    </article>
  );
}
