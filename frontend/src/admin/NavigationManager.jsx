import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function NavigationManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('/new-landing-page');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    const data = await apiService.getMenus();
    setMenuItems(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newLabel || !newUrl) return;
    setMsg('');

    const res = await apiService.addMenu({
      label: newLabel,
      url: newUrl,
      order_index: menuItems.length + 1
    });

    if (res.success || res.data) {
      setMsg(`Navigation link "${newLabel}" added successfully!`);
      setNewLabel('');
      setNewUrl('/new-landing-page');
      loadMenus();
    }
  };

  const handleDelete = async (id) => {
    await apiService.deleteMenu(id);
    loadMenus();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Header & Menu Manager</h1>
        <p className="text-xs text-slate-400 mt-1">Configure Main Public Header Navigation Links and Custom Routing URLs</p>
      </div>

      {msg && (
        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Add Link Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add Navigation Link</span>
          </h3>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Link Title *</label>
              <input 
                type="text" 
                required
                placeholder="New Landing Page"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="glass-input w-full text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Anchor / URL *</label>
              <input 
                type="text" 
                required
                placeholder="/new-landing-page or #services"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="glass-input w-full text-xs font-mono text-indigo-300"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Gunakan <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">/new-landing-page</code> untuk dynamic page, atau <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300">#services</code> untuk section homepage.
              </span>
            </div>

            <button type="submit" className="w-full btn-primary justify-center py-2.5 text-xs">
              Add Menu Link
            </button>
          </form>
        </div>

        {/* Links List */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Active Navigation Links ({menuItems.length})</h3>

          {menuItems.map((item, idx) => (
            <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.label}</h4>
                  <span className="text-xs text-indigo-400 font-mono">{item.url}</span>
                </div>
              </div>

              <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-rose-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
