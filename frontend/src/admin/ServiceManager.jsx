import React, { useState, useEffect } from 'react';
import { Layers, Plus, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadServicesData();
  }, []);

  const loadServicesData = async () => {
    const [sData, cData] = await Promise.all([
      apiService.getServices(),
      apiService.getServiceCategories()
    ]);
    setServices(sData || []);
    setCategories(cData || []);

    if (sData && sData.length > 0 && !activeService) {
      const first = sData[0];
      setActiveService({
        ...first,
        features: typeof first.features === 'string' ? JSON.parse(first.features) : (first.features || [])
      });
    }
  };

  const handleCreateNew = () => {
    setActiveService({
      title: 'New Custom Agency Service',
      slug: `service-${Date.now()}`,
      category_id: categories[0]?.id || null,
      icon_name: 'Layout',
      summary: 'Short summary of the service capabilities...',
      description: 'Detailed description of the service and Aetheric engineering methodologies...',
      features: ['Deliverable 1', 'Deliverable 2', 'Deliverable 3']
    });
    setMsg('');
    setErrorMsg('');
  };

  const handleSave = async () => {
    if (!activeService || !activeService.title) return;
    setSaving(true);
    setMsg('');
    setErrorMsg('');

    try {
      const res = await apiService.saveService(activeService);
      setSaving(false);

      if (res.success || res.data) {
        setMsg(`Service "${activeService.title}" saved successfully to PostgreSQL!`);
        await loadServicesData();
      } else {
        setErrorMsg(res.message || 'Failed to save service.');
      }
    } catch (e) {
      setSaving(false);
      setErrorMsg('Error saving service to backend database.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await apiService.deleteService(id);
    setActiveService(null);
    loadServicesData();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Service Capabilities Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage Agency Service Offerings, Slugs, Descriptions, and Deliverables</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary py-2.5 px-4 text-xs">
          <Plus className="w-4 h-4 mr-1" />
          Create New Service
        </button>
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
        
        {/* Left Services List */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Services ({services.length})</h3>
          
          <div className="space-y-2">
            {services.map((s) => (
              <div 
                key={s.id || s.slug}
                onClick={() => {
                  setMsg('');
                  setErrorMsg('');
                  setActiveService({
                    ...s,
                    features: typeof s.features === 'string' ? JSON.parse(s.features) : (s.features || [])
                  });
                }}
                className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                  activeService?.slug === s.slug 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold truncate">{s.title}</h4>
                  <span className="text-[11px] text-indigo-400 font-mono mt-0.5 block">/service/{s.slug}</span>
                </div>
                
                {s.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} 
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Service Editor Form */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
          {activeService ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span className="text-base font-bold text-white">Edit Service: {activeService.title}</span>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-xs font-bold">
                  <Save className="w-4 h-4 mr-1.5" />
                  {saving ? 'Saving to Database...' : 'Save Service Changes'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Service Title *</label>
                  <input 
                    type="text" 
                    value={activeService.title || ''} 
                    onChange={(e) => setActiveService({ ...activeService, title: e.target.value })}
                    className="glass-input w-full text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL Slug *</label>
                  <input 
                    type="text" 
                    value={activeService.slug || ''} 
                    onChange={(e) => setActiveService({ ...activeService, slug: e.target.value })}
                    className="glass-input w-full text-xs font-mono text-indigo-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={activeService.category_id || ''}
                  onChange={(e) => setActiveService({ ...activeService, category_id: parseInt(e.target.value) || null })}
                  className="glass-input w-full text-xs bg-slate-900 text-white"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Summary</label>
                <textarea 
                  rows="2"
                  value={activeService.summary || ''} 
                  onChange={(e) => setActiveService({ ...activeService, summary: e.target.value })}
                  className="glass-input w-full text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Page Overview & Narrative</label>
                <textarea 
                  rows="6"
                  value={activeService.description || ''} 
                  onChange={(e) => setActiveService({ ...activeService, description: e.target.value })}
                  className="glass-input w-full text-xs resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deliverables & Features (One per line)</label>
                <textarea 
                  rows="4"
                  value={Array.isArray(activeService.features) ? activeService.features.join('\n') : ''} 
                  onChange={(e) => setActiveService({ 
                    ...activeService, 
                    features: e.target.value.split('\n').filter(f => f.trim()) 
                  })}
                  placeholder="Design Systems&#10;User Research & Testing&#10;Wireframing & Prototyping"
                  className="glass-input w-full text-xs resize-none font-mono"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select a Service from the list on the left to edit its details or click "Create New Service".
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
