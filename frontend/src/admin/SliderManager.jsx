import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Trash2, Save, Image, Link, CheckCircle2, Upload, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import Pagination from '../components/Pagination';

export default function SliderManager() {
  const [sliders, setSliders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: '',
    subtitle: '',
    badge_text: 'NEXT-GEN DIGITAL AGENCY',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
    cta_text: 'Explore Work',
    cta_link: '#portfolio'
  });
  const [msg, setMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    const data = await apiService.getSliders();
    setSliders(data || []);
  };

  // Pagination logic
  const totalPages = Math.ceil((sliders.length || 0) / itemsPerPage);
  const paginatedSliders = sliders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [sliders.length, totalPages, currentPage]);

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.image_url) return;

    const res = await apiService.addSlider(newSlide);
    if (res.success) {
      setMsg('Slide added successfully!');
      setNewSlide({
        title: '',
        subtitle: '',
        badge_text: 'NEXT-GEN DIGITAL AGENCY',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
        cta_text: 'Explore Work',
        cta_link: '#portfolio'
      });
      loadSliders();
    }
  };

  const handleDelete = async (id) => {
    await apiService.deleteSlider(id);
    loadSliders();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Hero Slider Customizer</h1>
        <p className="text-xs text-slate-400 mt-1">Manage Homepage Image Carousel, Badges, and Call-to-Action Links</p>
      </div>

      {msg && <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}

      {/* Add New Slide Form */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>Add Hero Slide</span>
        </h3>

        <form onSubmit={handleAddSlide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Headline Title *</label>
            <input 
              type="text" 
              required
              placeholder="Innovators Without Borders"
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Badge Highlight</label>
            <input 
              type="text" 
              placeholder="NEXT-GEN DIGITAL AGENCY"
              value={newSlide.badge_text}
              onChange={(e) => setNewSlide({ ...newSlide, badge_text: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          {/* Background Image Upload & URL Input */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Background Slide Image *
            </label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Thumbnail Box */}
              <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden border border-white/15 bg-slate-900 shrink-0 flex items-center justify-center shadow-md">
                {newSlide.image_url ? (
                  <>
                    <img 
                      src={newSlide.image_url} 
                      alt="Slide Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => setNewSlide({ ...newSlide, image_url: '' })}
                      className="absolute top-1 right-1 p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-[10px]"
                      title="Clear image"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 text-[10px] p-2 text-center">
                    <Image className="w-6 h-6 mb-1 opacity-50 text-indigo-400" />
                    <span>No Image Set</span>
                  </div>
                )}
              </div>

              {/* Upload Actions & URL Input */}
              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-white transition-all ${
                    uploading ? 'bg-indigo-700/50 opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                  }`}>
                    {uploading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploading ? 'Mengupload...' : 'Pilih & Upload Gambar'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const res = await apiService.uploadMedia(file);
                          const url = res.data?.url || (res.data?.filepath ? res.data.filepath : '');
                          if (url) {
                            setNewSlide((prev) => ({ ...prev, image_url: url }));
                          }
                        } catch (err) {
                          console.error('Failed to upload slide image:', err);
                        } finally {
                          setUploading(false);
                          e.target.value = '';
                        }
                      }} 
                      disabled={uploading} 
                      className="hidden" 
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">JPG, PNG, WEBP, SVG</span>
                </div>

                <input 
                  type="text" 
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newSlide.image_url}
                  onChange={(e) => setNewSlide({ ...newSlide, image_url: e.target.value })}
                  className="glass-input w-full text-xs font-mono text-indigo-300"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subtitle Overview</label>
            <textarea 
              rows="2"
              placeholder="We architect futuristic digital experiences..."
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              className="glass-input w-full text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Button Label</label>
            <input 
              type="text" 
              placeholder="Explore Work"
              value={newSlide.cta_text}
              onChange={(e) => setNewSlide({ ...newSlide, cta_text: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Button Target Link</label>
            <input 
              type="text" 
              placeholder="#portfolio"
              value={newSlide.cta_link}
              onChange={(e) => setNewSlide({ ...newSlide, cta_link: e.target.value })}
              className="glass-input w-full text-xs"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="btn-primary py-2.5 px-5 text-xs font-bold">
              Upload Slide
            </button>
          </div>
        </form>
      </div>

      {/* Slide List Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Active Slides ({sliders.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedSliders.map((slide) => (
            <div key={slide.id} className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between">
              <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/60 p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">{slide.badge_text}</span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{slide.title}</h4>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400">CTA: {slide.cta_text} ({slide.cta_link})</span>
                <button onClick={() => handleDelete(slide.id)} className="text-rose-400 hover:text-rose-300 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
