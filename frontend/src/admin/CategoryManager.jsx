import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, AlertCircle, Layers, Briefcase } from 'lucide-react';
import { apiService } from '../services/api';

export default function CategoryManager() {
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' or 'services'
  const [portfolioCats, setPortfolioCats] = useState([]);
  const [serviceCats, setServiceCats] = useState([]);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const [pData, sData] = await Promise.all([
      apiService.getPortfolioCategories(),
      apiService.getServiceCategories()
    ]);
    setPortfolioCats(pData || []);
    setServiceCats(sData || []);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setMsg('');
    setErrorMsg('');
    setLoading(true);

    const payload = {
      name: newName.trim(),
      slug: newSlug.trim() || newName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
    };

    try {
      if (activeTab === 'portfolio') {
        const res = await apiService.addPortfolioCategory(payload);
        setLoading(false);
        if (res.success || res.data) {
          setMsg(`Portfolio category "${newName}" created successfully!`);
          setNewName('');
          setNewSlug('');
          loadCategories();
        } else {
          setErrorMsg(res.message || 'Failed to create portfolio category.');
        }
      } else {
        const res = await apiService.addServiceCategory(payload);
        setLoading(false);
        if (res.success || res.data) {
          setMsg(`Service category "${newName}" created successfully!`);
          setNewName('');
          setNewSlug('');
          loadCategories();
        } else {
          setErrorMsg(res.message || 'Failed to create service category.');
        }
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Error connecting to backend API.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete category? Items assigned to this category will become uncategorized.')) return;
    setMsg('');
    setErrorMsg('');

    if (activeTab === 'portfolio') {
      await apiService.deletePortfolioCategory(id);
    } else {
      await apiService.deleteServiceCategory(id);
    }
    loadCategories();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dynamic Category Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage Custom Categories for Portfolio Projects & Agency Services</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 glass-panel p-1 rounded-xl border border-white/10">
          <button
            onClick={() => { setActiveTab('portfolio'); setMsg(''); setErrorMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'portfolio'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Portfolio Categories</span>
          </button>
          <button
            onClick={() => { setActiveTab('services'); setMsg(''); setErrorMsg(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Service Categories</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add {activeTab === 'portfolio' ? 'Portfolio' : 'Service'} Category</span>
          </h3>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category Name *</label>
              <input 
                type="text" 
                required
                placeholder={activeTab === 'portfolio' ? 'Mobile Apps' : 'AI Automation'}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="glass-input w-full text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">URL Slug</label>
              <input 
                type="text" 
                placeholder={activeTab === 'portfolio' ? 'mobile-apps' : 'ai-automation'}
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                className="glass-input w-full text-xs font-mono text-indigo-300"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-2.5 text-xs font-bold">
              {loading ? 'Creating...' : `Create ${activeTab === 'portfolio' ? 'Portfolio' : 'Service'} Category`}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
            Active {activeTab === 'portfolio' ? 'Portfolio' : 'Service'} Categories ({activeTab === 'portfolio' ? portfolioCats.length : serviceCats.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(activeTab === 'portfolio' ? portfolioCats : serviceCats).map((cat) => (
              <div key={cat.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                  <span className="text-xs text-indigo-400 font-mono">/{cat.slug}</span>
                </div>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)} 
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
