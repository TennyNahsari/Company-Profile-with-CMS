import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Save, Trash2, CheckCircle2, AlertCircle, Image } from 'lucide-react';
import { apiService } from '../services/api';

export default function PortfolioManager() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    const [pData, cData] = await Promise.all([
      apiService.getProjects(),
      apiService.getPortfolioCategories()
    ]);
    setProjects(pData || []);
    setCategories(cData || []);

    if (pData && pData.length > 0 && !activeProject) {
      const first = pData[0];
      setActiveProject({
        ...first,
        outcomesStr: typeof first.outcomes === 'object' ? JSON.stringify(first.outcomes, null, 2) : (first.outcomes || '{}')
      });
    }
  };

  const handleCreateNew = () => {
    setActiveProject({
      title: 'New Case Study Project',
      slug: `project-${Date.now()}`,
      client_name: 'Acme Enterprise',
      category_id: categories[0]?.id || null,
      category: categories[0]?.name || 'UI/UX Design',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
      summary: 'Short summary of project scope and business transformation outcomes...',
      outcomesStr: JSON.stringify({ conversion_rate: '+150%', roas: '4.5x' }, null, 2),
      content_html: '<h3>Project Overview & Strategy</h3><p>Narrative of how DigiAgency executed this transformation...</p>'
    });
    setMsg('');
    setErrorMsg('');
  };

  const handleSave = async () => {
    if (!activeProject || !activeProject.title) return;
    setSaving(true);
    setMsg('');
    setErrorMsg('');

    let parsedOutcomes = {};
    try {
      parsedOutcomes = typeof activeProject.outcomesStr === 'string' 
        ? JSON.parse(activeProject.outcomesStr || '{}')
        : (activeProject.outcomes || {});
    } catch (e) {
      setErrorMsg('Invalid JSON format in ROI Outcomes field.');
      setSaving(false);
      return;
    }

    const payload = {
      ...activeProject,
      category_id: (activeProject.category_id && !isNaN(activeProject.category_id)) ? parseInt(activeProject.category_id) : null,
      outcomes: parsedOutcomes
    };

    try {
      const res = await apiService.saveProject(payload);
      setSaving(false);

      if (res.success || res.data) {
        setMsg(`Portfolio Case Study "${activeProject.title}" saved successfully to PostgreSQL!`);
        await loadPortfolioData();
      } else {
        setErrorMsg(res.message || 'Failed to save project.');
      }
    } catch (e) {
      setSaving(false);
      setErrorMsg('Error saving project to database.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this case study?')) return;
    await apiService.deleteProject(id);
    setActiveProject(null);
    loadPortfolioData();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Portfolio & Case Studies Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage B2B Case Studies, Client Outcomes, Categories, and Visual Collateral</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary py-2.5 px-4 text-xs font-bold">
          <Plus className="w-4 h-4 mr-1" />
          Create New Case Study
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
        
        {/* Left Case Studies List */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Projects ({projects.length})</h3>
          
          <div className="space-y-2">
            {projects.map((p) => (
              <div 
                key={p.id || p.slug}
                onClick={() => {
                  setMsg('');
                  setErrorMsg('');
                  setActiveProject({
                    ...p,
                    outcomesStr: typeof p.outcomes === 'object' ? JSON.stringify(p.outcomes, null, 2) : (p.outcomes || '{}')
                  });
                }}
                className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center justify-between ${
                  activeProject?.slug === p.slug 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold truncate">{p.title}</h4>
                  <span className="text-[11px] text-indigo-400 font-mono mt-0.5 block">/portfolio/{p.slug}</span>
                </div>
                
                {p.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} 
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Editor Form */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
          {activeProject ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <span className="text-base font-bold text-white">Edit Case Study: {activeProject.title}</span>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-xs font-bold">
                  <Save className="w-4 h-4 mr-1.5" />
                  {saving ? 'Saving to Database...' : 'Save Case Study'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Title *</label>
                  <input 
                    type="text" 
                    value={activeProject.title || ''} 
                    onChange={(e) => setActiveProject({ ...activeProject, title: e.target.value })}
                    className="glass-input w-full text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL Slug *</label>
                  <input 
                    type="text" 
                    value={activeProject.slug || ''} 
                    onChange={(e) => setActiveProject({ ...activeProject, slug: e.target.value })}
                    className="glass-input w-full text-xs font-mono text-indigo-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Client Name</label>
                  <input 
                    type="text" 
                    value={activeProject.client_name || ''} 
                    onChange={(e) => setActiveProject({ ...activeProject, client_name: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assign Category</label>
                  <select
                    value={activeProject.category_id || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const catIdNum = val !== '' ? parseInt(val) : null;
                      const selectedCat = categories.find(c => c.id === catIdNum);
                      setActiveProject({ 
                        ...activeProject, 
                        category_id: catIdNum,
                        category: selectedCat ? selectedCat.name : ''
                      });
                    }}
                    className="glass-input w-full text-xs bg-slate-900 text-white"
                  >
                    <option value="">-- Uncategorized --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thumbnail Banner Image URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={activeProject.thumbnail_url || ''} 
                    onChange={(e) => setActiveProject({ ...activeProject, thumbnail_url: e.target.value })}
                    className="glass-input w-full text-xs font-mono"
                    placeholder="/images/hero-local.jpg or https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Case Summary</label>
                <textarea 
                  rows="2"
                  value={activeProject.summary || ''} 
                  onChange={(e) => setActiveProject({ ...activeProject, summary: e.target.value })}
                  className="glass-input w-full text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ROI Outcomes JSON (Key-Value Metrics)</label>
                <textarea 
                  rows="3"
                  value={activeProject.outcomesStr || ''} 
                  onChange={(e) => setActiveProject({ ...activeProject, outcomesStr: e.target.value })}
                  placeholder='{\n  "conversion_increase": "145%",\n  "roas": "4.2x"\n}'
                  className="glass-input w-full text-xs font-mono resize-none text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Narrative HTML Content</label>
                <textarea 
                  rows="5"
                  value={activeProject.content_html || ''} 
                  onChange={(e) => setActiveProject({ ...activeProject, content_html: e.target.value })}
                  className="glass-input w-full text-xs font-mono resize-none leading-relaxed"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select a Case Study from the list on the left to edit or click "Create New Case Study".
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
