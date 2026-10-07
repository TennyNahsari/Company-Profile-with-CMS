import React, { useState, useEffect } from 'react';
import { Layers, Plus, Save, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import Pagination from '../components/Pagination';

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Pagination calculation
  const totalPages = Math.ceil((services.length || 0) / itemsPerPage);
  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [services.length, totalPages, currentPage]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Service Capabilities Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage Agency Service Offerings, Slugs, Descriptions, and Deliverables</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary py-2.5 px-4 text-xs w-full sm:w-auto justify-center">
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
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Services ({services.length})</h3>
            
            <div className="space-y-2">
              {paginatedServices.map((s) => (
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

          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
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

              {/* Service Thumbnail Upload */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>Service Thumbnail Image (Engineered for Market Dominance Section)</span>
                </label>
                
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {/* Thumbnail Preview Box */}
                  <div className="relative w-full md:w-40 h-28 rounded-lg overflow-hidden border border-white/15 bg-slate-900 shrink-0 flex items-center justify-center">
                    {activeService.thumbnail_url ? (
                      <>
                        <img 
                          src={activeService.thumbnail_url} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => setActiveService({ ...activeService, thumbnail_url: '' })}
                          className="absolute top-1 right-1 p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-[10px]"
                          title="Remove thumbnail"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 opacity-50 text-indigo-400" />
                        <span>No Thumbnail</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions & URL Input */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-2">
                      <label className={`cursor-pointer inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-bold text-white transition-all ${
                        uploading ? 'bg-indigo-700/50 opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                      }`}>
                        {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>{uploading ? 'Uploading...' : 'Upload Thumbnail File'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploading(true);
                            setMsg('');
                            setErrorMsg('');
                            try {
                              const res = await apiService.uploadMedia(file);
                              const url = res.data?.url || (res.data?.filepath ? res.data.filepath : '');
                              if (url) {
                                setActiveService((prev) => ({ ...prev, thumbnail_url: url }));
                                setMsg('Thumbnail image uploaded successfully!');
                              } else {
                                setErrorMsg('Failed to upload thumbnail image.');
                              }
                            } catch (err) {
                              setErrorMsg('Error uploading thumbnail image.');
                            } finally {
                              setUploading(false);
                              e.target.value = '';
                            }
                          }} 
                          disabled={uploading} 
                          className="hidden" 
                        />
                      </label>
                    </div>

                    <input 
                      type="text" 
                      placeholder="Or enter Image URL (https://...)" 
                      value={activeService.thumbnail_url || ''} 
                      onChange={(e) => setActiveService({ ...activeService, thumbnail_url: e.target.value })} 
                      className="glass-input w-full text-xs font-mono text-indigo-300" 
                    />
                  </div>
                </div>
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
