import React, { useState, useEffect } from 'react';
import { Image, Upload, Copy, Check, Trash2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const data = await apiService.getMedia();
    setMediaItems(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const res = await apiService.uploadMedia(file);
    setUploading(false);

    if (res.success) {
      loadMedia();
    }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Central Media Library</h1>
          <p className="text-xs text-slate-400 mt-1">Upload Images, PDFs, and Copy Direct CDN Asset URLs for Page Content</p>
        </div>

        <label className="btn-primary py-2.5 px-4 text-xs cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading Asset...' : 'Upload Media Asset'}</span>
          <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
        </label>
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="glass-card p-4 rounded-xl border border-white/10 flex flex-col justify-between group">
            <div className="h-40 rounded-lg overflow-hidden mb-3 bg-slate-900 flex items-center justify-center relative">
              <img 
                src={item.url || item.filepath} 
                alt={item.filename} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <Image className="w-8 h-8 text-slate-600 absolute" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-white truncate mb-1" title={item.filename}>{item.filename}</h4>
              <p className="text-[10px] text-slate-400 font-mono mb-3">{(item.size / 1024).toFixed(1)} KB</p>
            </div>

            <button
              onClick={() => copyToClipboard(item.url || item.filepath, item.id)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                copiedId === item.id 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10'
              }`}
            >
              {copiedId === item.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>URL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Asset URL</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
