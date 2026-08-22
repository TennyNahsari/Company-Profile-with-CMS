import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const data = await apiService.getPosts();
      setPosts(data || []);
    }
    loadPosts();
  }, []);

  const handlePostClick = (slug) => {
    const targetUrl = `/blog/${slug}`;
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAllBlog = () => {
    window.history.pushState({}, '', '/blog');
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Option B: Limit top 3 articles on Homepage
  const displayedPosts = posts.slice(0, 3);

  return (
    <section id="blog" className="w-full py-12 md:py-16 relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col items-center justify-center">
          <div className="badge-glow mb-4 mx-auto">Thought Leadership</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">
            Insights & <span className="gradient-text">Market Trends</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg text-center">
            Expert perspectives on design systems, web performance, technical SEO, and modern growth architecture.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-10">
          {displayedPosts.map((post) => (
            <div 
              key={post.id || post.slug}
              onClick={() => handlePostClick(post.slug)}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-4 left-4 badge-glow text-[11px]">
                  {post.category_name || 'Insight'}
                </span>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '2026'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Option B: Explore All Insights CTA */}
        <div className="flex items-center justify-center">
          <button 
            onClick={handleExploreAllBlog}
            className="btn-secondary py-3 px-8 text-xs font-bold flex items-center gap-2 group"
          >
            <span>Explore All Insights & Articles ({posts.length})</span>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
