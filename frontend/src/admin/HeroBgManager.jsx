import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

export default function HeroBgManager({ onUpdated }) {
  const [heroBgUrl, setHeroBgUrl] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    loadHeroBg();
  }, []);

  const loadHeroBg = async () => {
    const data = await apiService.getHeroSettings();
    if (data && data.hero_bg_url) {
      setHeroBgUrl(data.hero_bg_url);
    } else {
      setHeroBgUrl('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await apiService.uploadHeroBg(file);
      if (res.success || res.data?.hero_bg_url) {
        const newUrl = res.data?.hero_bg_url;
        setHeroBgUrl(newUrl);
        setCustomUrlInput('');
        setMsg({ type: 'success', text: 'Gambar background hero berhasil diupload dan diterapkan!' });
        if (onUpdated) onUpdated(newUrl);
      } else {
        setMsg({ type: 'error', text: res.message || 'Gagal mengupload gambar background.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Terjadi kesalahan saat mengupload gambar.' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveUrl = async (e) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    setUploading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await apiService.saveHeroSettings({ hero_bg_url: customUrlInput.trim() });
      if (res.success || res.data?.hero_bg_url) {
        setHeroBgUrl(customUrlInput.trim());
        setCustomUrlInput('');
        setMsg({ type: 'success', text: 'URL background hero berhasil disimpan!' });
        if (onUpdated) onUpdated(customUrlInput.trim());
      } else {
        setMsg({ type: 'error', text: 'Gagal menyimpan URL background hero.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Terjadi kesalahan server.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBg = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar background hero? Tampilan hero section akan kembali ke desain default.')) {
      return;
    }

    setUploading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await apiService.deleteHeroBg();
      if (res.success) {
        setHeroBgUrl('');
        setCustomUrlInput('');
        setMsg({ type: 'success', text: 'Gambar background hero telah dihapus. Tampilan hero section kembali seperti semula!' });
        if (onUpdated) onUpdated(null);
      } else {
        setMsg({ type: 'error', text: 'Gagal menghapus gambar background.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Terjadi kesalahan saat menghapus background.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Hero Section Landing Page Background</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-xs text-slate-400">
              Upload gambar untuk dijadikan background utama hero section. Jika dihapus, tampilan kembali ke default slider.
            </p>
          </div>
        </div>

        {/* Status indicator badge */}
        <div>
          {heroBgUrl ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Custom Background Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-white/10 text-xs font-semibold">
              Default Layout Active
            </span>
          )}
        </div>
      </div>

      {/* Message Banner */}
      {msg.text && (
        <div className={`p-3 rounded-xl text-xs font-medium flex items-center justify-between ${
          msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ type: '', text: '' })} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Preview Box */}
        <div className="lg:col-span-5">
          <div className="relative rounded-xl overflow-hidden border border-white/15 h-48 bg-slate-900 group shadow-lg">
            {heroBgUrl ? (
              <>
                <img 
                  src={heroBgUrl} 
                  alt="Hero Background Preview" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081425] via-[#081425]/40 to-transparent flex flex-col justify-between p-4">
                  <span className="self-end px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] text-white font-mono">
                    Custom Background
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">Preview Tampilan Hero</span>
                    <button
                      onClick={handleDeleteBg}
                      disabled={uploading}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-colors"
                      title="Hapus gambar background hero"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4 text-center bg-gradient-to-br from-slate-900 to-[#081425]">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-300">Belum ada gambar background custom</span>
                <span className="text-[10px] text-slate-500 mt-1">Hero section saat ini menampilkan tampilan background slider default</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Upload Actions */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* File Upload Button */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Upload File Gambar (JPG, PNG, WEBP, SVG)
            </label>
            <div className="flex items-center gap-3">
              <label className={`cursor-pointer inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all ${
                uploading ? 'bg-indigo-700/50 opacity-70' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/30'
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
                  onChange={handleFileUpload} 
                  disabled={uploading} 
                  className="hidden" 
                />
              </label>

              {heroBgUrl && (
                <button
                  type="button"
                  onClick={handleDeleteBg}
                  disabled={uploading}
                  className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Gambar</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-semibold">atau masukkan URL</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleSaveUrl} className="flex gap-2">
            <input 
              type="text" 
              placeholder="https://images.unsplash.com/..."
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              className="glass-input flex-1 text-xs font-mono text-indigo-300"
            />
            <button
              type="submit"
              disabled={uploading || !customUrlInput.trim()}
              className="btn-secondary text-xs py-2 px-4 whitespace-nowrap disabled:opacity-50"
            >
              Simpan URL
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
