import React, { useState } from 'react';
import { Lock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminLogin({ onLoginSuccess, onClose }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await apiService.login(username, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      setError(res.message || 'Authentication failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">DigiAgency CMS Admin</h2>
          <p className="text-xs text-slate-400 mt-1">CPanel Backend Content Management Access</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Credentials Notice */}
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 mb-6">
          <span className="font-bold">Default Admin Credentials:</span>
          <br />Username: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">admin</code> | Password: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">admin123</code>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Username / Email</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Security Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary flex-1 justify-center py-3 text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex-1 justify-center py-3 text-xs"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
