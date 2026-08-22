import React, { useState, useEffect } from 'react';
import { FileText, Plus, Save, Trash2, Code, Eye, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

export default function PageBuilder() {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [editorMode, setEditorMode] = useState('hybrid'); // 'hybrid' or 'html'
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    const data = await apiService.getPages();
    setPages(data);
  };

  const handleCreateNew = () => {
    setActivePage({
      title: 'New Landing Page',
      slug: 'new-landing-page',
      content_blocks: [
        { type: 'hero', heading: 'Enterprise Product Headline', subheading: 'Empowering digital innovation.' }
      ],
      custom_html_css: '<style>\n  .custom-hero { padding: 40px; background: rgba(99,102,241,0.1); border-radius: 16px; }\n</style>\n<div className="custom-hero">\n  <h2>Custom HTML Block</h2>\n</div>',
      meta_seo: { title: 'New Landing Page | DigiAgency', description: 'Page description' }
    });
  };

  const handleSave = async () => {
    if (!activePage) return;
    setSaving(true);
    setMsg('');

    const res = await apiService.savePage(activePage);
    setSaving(false);

    if (res.success) {
      setMsg('Page saved successfully!');
      loadPages();
    } else {
      setMsg('Failed to save page.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Page Management & Builder</h1>
          <p className="text-xs text-slate-400 mt-1">Hybrid Block-based Editor with Direct HTML & CSS Code Injection</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary py-2.5 px-4 text-xs">
          <Plus className="w-4 h-4 mr-1" />
          Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Pages List */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Dynamic Pages ({pages.length})</h3>
          
          <div className="space-y-2">
            {pages.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setActivePage(p)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  activePage?.id === p.id 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <h4 className="text-sm font-bold truncate">{p.title}</h4>
                <span className="text-[11px] text-indigo-400 block font-mono mt-0.5">/{p.slug}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
          {activePage ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="text-base font-bold text-white">Page Editor</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setEditorMode(editorMode === 'hybrid' ? 'html' : 'hybrid')}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                  >
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{editorMode === 'hybrid' ? 'Switch to HTML/CSS Mode' : 'Switch to Block Mode'}</span>
                  </button>

                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary py-2 px-4 text-xs"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    {saving ? 'Saving...' : 'Save Page'}
                  </button>
                </div>
              </div>

              {msg && <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Page Title</label>
                  <input 
                    type="text" 
                    value={activePage.title || ''} 
                    onChange={(e) => setActivePage({ ...activePage, title: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL Slug</label>
                  <input 
                    type="text" 
                    value={activePage.slug || ''} 
                    onChange={(e) => setActivePage({ ...activePage, slug: e.target.value })}
                    className="glass-input w-full text-xs font-mono text-indigo-300"
                  />
                </div>
              </div>

              {/* Editor Code Area */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Custom HTML & CSS Code Injector</span>
                  <span className="text-[10px] text-indigo-400 font-normal">Full HTML/CSS layout customization</span>
                </label>
                <textarea 
                  rows="12"
                  value={activePage.custom_html_css || ''}
                  onChange={(e) => setActivePage({ ...activePage, custom_html_css: e.target.value })}
                  className="glass-input w-full font-mono text-xs text-slate-200 resize-none leading-relaxed"
                  placeholder="<style>\n  /* Inject custom CSS styles */\n</style>\n<div className='my-custom-container'>\n  <!-- Custom HTML Structure -->\n</div>"
                />
              </div>

              {/* Live Preview Area */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>Live Render Preview</span>
                </label>
                <div 
                  className="p-6 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs min-h-[160px]"
                  dangerouslySetInnerHTML={{ __html: activePage.custom_html_css || '<p class="text-slate-500 italic">No custom HTML rendered.</p>' }}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select a page from the left panel or click "Create New Page" to start editing.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
