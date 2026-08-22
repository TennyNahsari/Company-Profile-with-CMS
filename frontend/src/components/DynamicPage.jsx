import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';

export default function DynamicPage({ slug, onBack }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      setLoading(true);
      setError(null);
      try {
        const pages = await apiService.getPages();
        const found = pages.find(p => p.slug === slug || p.id === parseInt(slug));
        if (found) {
          setPageData(found);
        } else {
          setError('Page not found.');
        }
      } catch (e) {
        setError('Error loading dynamic page content.');
      }
      setLoading(false);
    }
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading dynamic landing page...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center text-center">
        <div className="glass-panel p-8 rounded-3xl max-w-md mx-auto text-center border border-rose-500/30">
          <FileText className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-xs text-slate-400 mb-6">The page with URL slug "/{slug}" does not exist or has not been published yet.</p>
          <button onClick={onBack} className="btn-primary py-2.5 px-5 text-xs mx-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="subpage-top-clearance min-h-screen pb-28 w-full flex flex-col items-center">
      <div className="custom-container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back navigation */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Page Title & Header */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/20 shadow-2xl mb-12 w-full text-center flex flex-col items-center">
          <div className="badge-glow mb-4 mx-auto">Custom Dynamic Page</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            {pageData.title}
          </h1>
          <span className="text-xs font-mono text-indigo-400">/{pageData.slug}</span>
        </div>

        {/* Dynamic Custom HTML & CSS Render Area */}
        <div 
          className="w-full glass-panel p-8 md:p-12 rounded-3xl border border-white/10 prose prose-invert max-w-none text-slate-200"
          dangerouslySetInnerHTML={{ __html: pageData.custom_html_css || '<p className="text-slate-400 italic">No custom content added yet.</p>' }}
        />

      </div>
    </article>
  );
}
