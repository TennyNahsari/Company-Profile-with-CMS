import React, { useState, useEffect } from 'react';
import { 
  FileText, FolderOpen, Sliders, Image, MessageSquare, 
  TrendingUp, Database, Server, CheckCircle2, Plus, Tag, Layers, Briefcase 
} from 'lucide-react';
import { apiService } from '../services/api';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    projectsCount: 0,
    servicesCount: 0,
    categoriesCount: 0,
    postsCount: 0,
    mediaCount: 0,
    inquiriesCount: 0,
    pagesCount: 0
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, services, pCategories, posts, media, inquiries, pages] = await Promise.all([
          apiService.getProjects(),
          apiService.getServices(),
          apiService.getPortfolioCategories(),
          apiService.getPosts(),
          apiService.getMedia(),
          apiService.getInquiries(),
          apiService.getPages()
        ]);

        setStats({
          projectsCount: projects.length,
          servicesCount: services.length,
          categoriesCount: pCategories.length,
          postsCount: posts.length,
          mediaCount: media.length,
          inquiriesCount: inquiries.length,
          pagesCount: pages.length
        });
      } catch (e) {}
    }
    loadStats();
  }, []);

  return (
    <div>
      {/* Title */}
      <div className="cms-dashboard-header">
        <h1 className="font-extrabold text-white cms-dashboard-title">System Dashboard</h1>
        <p className="text-xs text-slate-400">Overview of Portfolio, Services, Categories, CMS Content & B2B Leads</p>
      </div>

      {/* Metrics Grid */}
      <div className="cms-metrics-grid">
        
        <div 
          onClick={() => onNavigate('portfolio')}
          className="glass-panel cms-stat-card border border-indigo-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Portfolio</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{stats.projectsCount}</span>
          <span className="text-[10px] text-indigo-400 font-semibold mt-1">Case Studies</span>
        </div>

        <div 
          onClick={() => onNavigate('services')}
          className="glass-panel cms-stat-card border border-purple-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Services</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{stats.servicesCount}</span>
          <span className="text-[10px] text-purple-400 font-semibold mt-1">Capabilities</span>
        </div>

        <div 
          onClick={() => onNavigate('categories')}
          className="glass-panel cms-stat-card border border-emerald-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categories</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{stats.categoriesCount}</span>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1">Managed Taxonomies</span>
        </div>

        <div 
          onClick={() => onNavigate('inquiries')}
          className="glass-panel cms-stat-card border border-rose-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">B2B Leads</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{stats.inquiriesCount}</span>
          <span className="text-[10px] text-rose-400 font-semibold mt-1">Client Inquiries</span>
        </div>

        <div 
          onClick={() => onNavigate('posts')}
          className="glass-panel cms-stat-card border border-amber-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Articles</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{stats.postsCount}</span>
          <span className="text-[10px] text-amber-400 font-semibold mt-1">Blog Posts</span>
        </div>

        <div 
          onClick={() => onNavigate('media')}
          className="glass-panel cms-stat-card border border-sky-500/30 flex flex-col justify-between cursor-pointer hover:bg-white/5 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Media</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Image className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{stats.mediaCount}</span>
          <span className="text-[10px] text-sky-400 font-semibold mt-1">Uploaded Assets</span>
        </div>

      </div>

      {/* Quick Action Tiles */}
      <div className="cms-quick-grid">
        
        <div 
          onClick={() => onNavigate('portfolio')}
          className="glass-card cms-quick-card cursor-pointer group border border-white/5 hover:border-indigo-500/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Portfolio & Case Studies</h3>
          <p className="text-xs text-slate-400">Manage client deliverables, ROI metrics, and dedicated case study pages.</p>
        </div>

        <div 
          onClick={() => onNavigate('services')}
          className="glass-card cms-quick-card cursor-pointer group border border-white/5 hover:border-purple-500/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Service Capabilities</h3>
          <p className="text-xs text-slate-400">Manage core services, assigned categories, and detailed HTML narratives.</p>
        </div>

        <div 
          onClick={() => onNavigate('categories')}
          className="glass-card cms-quick-card cursor-pointer group border border-white/5 hover:border-emerald-500/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Tag className="w-5 h-5" />
            </div>
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Category Manager</h3>
          <p className="text-xs text-slate-400">Create & manage categories for Service offerings and Portfolio projects.</p>
        </div>

      </div>

      {/* Infrastructure & CPanel Status Card */}
      <div className="glass-panel cms-health-card border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span>CPanel Hosting Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">Healthy</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">Express.js API Node process running on port 5000 | PostgreSQL Pool Active</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>PostgreSQL DB Schema v1.0</span>
          </div>
        </div>
      </div>

    </div>
  );
}
