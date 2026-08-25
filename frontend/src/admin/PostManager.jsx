import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus, Trash2, Save, Image, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function PostManager() {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await apiService.getPosts();
    setPosts(data);
  };

  const handleCreateNew = () => {
    setActivePost({
      title: 'New Thought Leadership Insight',
      slug: 'new-thought-leadership-insight',
      category_name: 'UI/UX Insights',
      excerpt: 'Short summary of the article...',
      content_html: '<h3>Article Headline</h3><p>Write your detailed article body content here...</p>',
      featured_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
      status: 'PUBLISHED'
    });
  };

  const handleSave = async () => {
    if (!activePost) return;
    setSaving(true);
    setMsg('');

    const res = await apiService.addPost(activePost);
    setSaving(false);

    if (res.success) {
      setMsg('Post published successfully!');
      loadPosts();
    } else {
      setMsg('Failed to publish post.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    await apiService.deletePost(id);
    setActivePost(null);
    loadPosts();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Blog & Articles Publisher</h1>
          <p className="text-xs text-slate-400 mt-1">Manage Thought Leadership Content, Categories, and SEO Meta</p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary py-2.5 px-4 text-xs w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4 mr-1" />
          Create New Article
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Posts List */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Published Articles ({posts.length})</h3>
          
          <div className="space-y-2">
            {posts.map((p) => (
              <div 
                key={p.id}
                onClick={() => setActivePost(p)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  activePost?.id === p.id 
                    ? 'bg-purple-600/20 border-purple-500 text-white' 
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-400 uppercase">{p.category_name || 'Insights'}</span>
                  {p.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} 
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <h4 className="text-sm font-bold truncate mt-1">{p.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Form */}
        <div className="lg:col-span-8 glass-panel p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
          {activePost ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-bold text-white">Article Editor</span>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-4 text-xs">
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {saving ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>

              {msg && <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold">{msg}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Article Title</label>
                  <input 
                    type="text" 
                    value={activePost.title || ''} 
                    onChange={(e) => setActivePost({ ...activePost, title: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category Name</label>
                  <input 
                    type="text" 
                    value={activePost.category_name || ''} 
                    onChange={(e) => setActivePost({ ...activePost, category_name: e.target.value })}
                    className="glass-input w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Featured Image URL</label>
                <input 
                  type="text" 
                  value={activePost.featured_image || ''} 
                  onChange={(e) => setActivePost({ ...activePost, featured_image: e.target.value })}
                  className="glass-input w-full text-xs font-mono text-indigo-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Excerpt Summary</label>
                <textarea 
                  rows="2"
                  value={activePost.excerpt || ''} 
                  onChange={(e) => setActivePost({ ...activePost, excerpt: e.target.value })}
                  className="glass-input w-full text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">HTML Article Content</label>
                <textarea 
                  rows="10"
                  value={activePost.content_html || ''} 
                  onChange={(e) => setActivePost({ ...activePost, content_html: e.target.value })}
                  className="glass-input w-full font-mono text-xs text-slate-200 resize-none leading-relaxed"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select an article to edit or click "Create New Article".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
