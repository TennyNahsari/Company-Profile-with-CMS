import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, RefreshCw, Sparkles, Save, Link as LinkIcon } from 'lucide-react';
import { apiService } from '../services/api';

export default function HeroBgManager({ onUpdated }) {
  const [heroBgUrl, setHeroBgUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    loadHeroBg();
  }, []);

  const loadHeroBg = async () => {
    try {
      const data = await apiService.getHeroSettings();
      if (data && data.hero_bg_url) {
        setHeroBgUrl(data.hero_bg_url);
        setInputUrl(data.hero_bg_url);
      } else {
        setHeroBgUrl('');
        setInputUrl('');
      }
    } catch (e) {
      console.error('Failed to load hero background:', e);
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
        const newUrl = res.data?.hero_bg_url || (res.data && typeof res.data === 'string' ? res.data : '');
        setHeroBgUrl(newUrl);
        setInputUrl(newUrl);
        setMsg({ type: 'success', text: 'Gambar background hero berhasil diupload dan disimpan!' });
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

  const handleSaveSettings = async (urlToSave) => {
    const targetUrl = urlToSave !== undefined ? urlToSave : inputUrl;
    if (!targetUrl || !targetUrl.trim()) {
      setMsg({ type: 'error', text: 'Silakan upload gambar atau masukkan URL terlebih dahulu.' });
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const cleanUrl = targetUrl.trim();
      const res = await apiService.saveHeroSettings({ hero_bg_url: cleanUrl });
      if (res.success || res.data?.hero_bg_url) {
        setHeroBgUrl(cleanUrl);
        setInputUrl(cleanUrl);
        setMsg({ type: 'success', text: 'Background hero section berhasil disimpan!' });
        if (onUpdated) onUpdated(cleanUrl);
      } else {
        setMsg({ type: 'error', text: 'Gagal menyimpan background hero.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Terjadi kesalahan koneksi server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBg = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus gambar background hero? Tampilan hero section akan kembali ke desain default.')) {
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await apiService.deleteHeroBg();
      if (res.success) {
        setHeroBgUrl('');
        setInputUrl('');
        setMsg({ type: 'success', text: 'Gambar background hero telah dihapus. Tampilan hero section kembali ke default!' });
        if (onUpdated) onUpdated(null);
      } else {
        setMsg({ type: 'error', text: 'Gagal menghapus gambar background.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Terjadi kesalahan saat menghapus background.' });
    } finally {
      setSaving(false);
    }
  };

  // Format display image URL for preview
  const getPreviewUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const base = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000')
      ? 'http://localhost:5000'
      : '';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
      
      {/* Title & Status */}
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
              Upload atau simpan gambar background hero section landing page. Jika dihapus, tampilan kembali seperti semula.
            </p>
          </div>
        </div>

        {/* Status indicator badge */}
        <div>
          {heroBgUrl ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Custom Background Aktif
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 border border-white/10 text-xs font-semibold">
              Layout Default Aktif
            </span>
          )}
        </div>
      </div>

      {/* Alert Notification */}
      {msg.text && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
          msg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ type: '', text: '' })} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* Main Grid: Preview & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Preview Box */}
        <div className="lg:col-span-5 flex flex-col">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Pratinjau Background Hero
          </label>
          <div className="relative rounded-xl overflow-hidden border border-white/15 min-h-[200px] h-full bg-slate-900 group shadow-lg flex-1 flex items-center justify-center">
            {heroBgUrl ? (
              <>
                <img 
                  src={getPreviewUrl(heroBgUrl)} 
                  alt="Hero Background Preview" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = heroBgUrl;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081425] via-[#081425]/40 to-transparent flex flex-col justify-between p-4">
                  <span className="self-end px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-emerald-400 font-mono font-bold border border-emerald-500/30">
                    Aktif di Landing Page
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">Preview Hero Section</span>
                    <button
                      type="button"
                      onClick={handleDeleteBg}
                      disabled={saving || uploading}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-all"
                      title="Hapus gambar background hero"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center bg-gradient-to-br from-slate-900 to-[#081425]">
                <ImageIcon className="w-10 h-10 mb-2 opacity-40 text-indigo-400" />
                <span className="text-xs font-bold text-slate-300">Belum Ada Gambar Custom</span>
                <span className="text-[11px] text-slate-500 mt-1 max-w-xs">Hero section saat ini menggunakan tampilan background slider bawaan.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Upload & Form Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Option 1: File Upload */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Opsi 1: Upload File Gambar Dari Komputer
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className={`cursor-pointer inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold text-white transition-all ${
                uploading ? 'bg-indigo-700/50 opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/30'
              }`}>
                {uploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploading ? 'Mengupload...' : 'Pilih File & Upload'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  disabled={uploading || saving} 
                  className="hidden" 
                />
              </label>
              <span className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP, SVG (Maks. 10MB)</span>
            </div>
          </div>

          {/* Option 2: Image URL Input */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Opsi 2: Link / URL Gambar Kustom</span>
            </label>
            <input 
              type="text" 
              placeholder="https://images.unsplash.com/photo-..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="glass-input w-full text-xs font-mono text-indigo-300"
            />
          </div>

          {/* Action Buttons: Save & Delete */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveSettings(inputUrl)}
                disabled={saving || uploading || !inputUrl.trim()}
                className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Menyimpan...' : 'Simpan Background Hero'}</span>
              </button>
            </div>

            {heroBgUrl && (
              <button
                type="button"
                onClick={handleDeleteBg}
                disabled={saving || uploading}
                className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Gambar Hero</span>
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
