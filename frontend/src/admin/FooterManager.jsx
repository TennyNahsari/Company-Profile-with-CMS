import React, { useState, useEffect } from 'react';
import { Layout, Save, CheckCircle2, AlertCircle, Globe, Mail, Phone, MapPin, Linkedin, Twitter, Github, Dribbble } from 'lucide-react';
import { apiService } from '../services/api';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const ThreadsIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12c0 5-3.8 8.5-8 8.5s-7.5-3.5-7.5-8.5S7.2 3.5 12 3.5c4.5 0 7.5 3 7.5 7.5 0 2.5-1.5 4.2-3.5 4.2-1.5 0-2.5-1-2.5-2.5V8.5c0-1.5-1-2.5-2.5-2.5S8.5 7.2 8.5 9s1.2 3 2.5 3c1 0 1.8-.5 2.2-1.3.3.8 1.2 1.3 2.3 1.3 2.5 0 4.5-2.2 4.5-5 0-5.5-4-9-9.5-9C5 1 1 5.5 1 12s4 11 10.5 11c4.5 0 8.2-3 8.5-7.5" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function FooterManager() {
  const [footerData, setFooterData] = useState({
    company_name: 'DigiAgency Aetheric',
    company_bio: 'Enterprise digital agency engineering high-speed React web products, UI/UX design systems, and data-driven B2B growth marketing.',
    office_address: 'Financial Tower Level 18, Pacific Boulevard, San Francisco, CA',
    contact_email: 'hello@digiagency.com',
    contact_phone: '+1 (555) 234-5678',
    copyright_text: '© 2026 DigiAgency Aetheric. All rights reserved. Powered by React, Express & PostgreSQL.',
    social_instagram: 'https://instagram.com',
    social_twitter: 'https://twitter.com',
    social_threads: 'https://threads.net',
    social_facebook: 'https://facebook.com',
    social_linkedin: 'https://linkedin.com',
    social_youtube: 'https://youtube.com'
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    const data = await apiService.getFooterSettings();
    if (data) setFooterData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    setErrorMsg('');
    try {
      const res = await apiService.saveFooterSettings(footerData);
      setSaving(false);
      if (res.success || res.data) {
        setMsg('Footer settings saved successfully to PostgreSQL database!');
      } else {
        setErrorMsg('Failed to save footer settings.');
      }
    } catch (e) {
      setSaving(false);
      setErrorMsg('Error connecting to API server.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Footer & Contact Settings Manager</h1>
          <p className="text-xs text-slate-400 mt-1">Manage global website footer bio, address, email/phone, social links, and copyright text</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-6 text-xs font-bold shadow-lg">
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? 'Saving to Database...' : 'Save Footer Settings'}
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

      {/* Main Settings Form */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
        
        {/* Company Bio Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-white/10 pb-2">Company Branding & Bio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Brand Name</label>
              <input 
                type="text"
                value={footerData.company_name || ''}
                onChange={(e) => setFooterData({ ...footerData, company_name: e.target.value })}
                className="glass-input w-full text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Copyright & Legal Text</label>
              <input 
                type="text"
                value={footerData.copyright_text || ''}
                onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                className="glass-input w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company Footer Bio Paragraph</label>
            <textarea 
              rows="3"
              value={footerData.company_bio || ''}
              onChange={(e) => setFooterData({ ...footerData, company_bio: e.target.value })}
              className="glass-input w-full text-xs leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-white/10 pb-2">Office Address & Contact Info</h3>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">HQ Office Location Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text"
                value={footerData.office_address || ''}
                onChange={(e) => setFooterData({ ...footerData, office_address: e.target.value })}
                className="glass-input w-full pl-10 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Inquiry Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email"
                  value={footerData.contact_email || ''}
                  onChange={(e) => setFooterData({ ...footerData, contact_email: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  value={footerData.contact_phone || ''}
                  onChange={(e) => setFooterData({ ...footerData, contact_phone: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-white/10 pb-2">Social Media Handles & Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instagram URL</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-pink-400">
                  <InstagramIcon />
                </div>
                <input 
                  type="text"
                  placeholder="https://instagram.com/..."
                  value={footerData.social_instagram || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_instagram: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-pink-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Twitter / X URL</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-sky-400">
                  <TwitterIcon />
                </div>
                <input 
                  type="text"
                  placeholder="https://twitter.com/..."
                  value={footerData.social_twitter || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_twitter: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-sky-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Threads URL</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-slate-300">
                  <ThreadsIcon />
                </div>
                <input 
                  type="text"
                  placeholder="https://threads.net/@..."
                  value={footerData.social_threads || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_threads: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Facebook URL</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-blue-400">
                  <FacebookIcon />
                </div>
                <input 
                  type="text"
                  placeholder="https://facebook.com/..."
                  value={footerData.social_facebook || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_facebook: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-indigo-400">
                  <LinkedinIcon />
                </div>
                <input 
                  type="text"
                  placeholder="https://linkedin.com/in/..."
                  value={footerData.social_linkedin || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_linkedin: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-indigo-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">YouTube URL</label>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-rose-400">
                  <YoutubeIcon />
                </div>
                <input 
                  type="text"
                  placeholder="https://youtube.com/@..."
                  value={footerData.social_youtube || ''}
                  onChange={(e) => setFooterData({ ...footerData, social_youtube: e.target.value })}
                  className="glass-input w-full pl-10 text-xs font-mono text-rose-300"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
