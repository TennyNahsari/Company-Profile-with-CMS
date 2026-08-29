import React, { useState, useEffect } from 'react';
import { Sparkles, Github, Twitter, Linkedin, Dribbble, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
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

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState({
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

  useEffect(() => {
    async function loadFooterSettings() {
      const data = await apiService.getFooterSettings();
      if (data) {
        setFooterSettings(prev => ({ ...prev, ...data }));
      }
    }
    loadFooterSettings();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 footer-top-clearance pb-16 relative flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 w-full">
          
          {/* Brand & Dynamic Bio */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-heading text-xl font-extrabold text-white">
                {footerSettings.company_name || 'DigiAgency'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {footerSettings.company_bio}
            </p>

            {/* Address & Contact Info */}
            <div className="space-y-1.5 pt-1 text-xs text-slate-400">
              {footerSettings.office_address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{footerSettings.office_address}</span>
                </div>
              )}
              {footerSettings.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <a href={`mailto:${footerSettings.contact_email}`} className="hover:text-white transition-colors">{footerSettings.contact_email}</a>
                </div>
              )}
              {footerSettings.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <a 
                    href={`https://wa.me/${footerSettings.contact_phone.replace(/[^\d]/g, '').replace(/^0/, '62')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                    title="Chat via WhatsApp"
                  >
                    <span>{footerSettings.contact_phone}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-3 flex-wrap">
              {footerSettings.social_instagram && (
                <a href={footerSettings.social_instagram} target="_blank" rel="noreferrer" title="Instagram" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500 transition-colors">
                  <InstagramIcon />
                </a>
              )}
              {footerSettings.social_twitter && (
                <a href={footerSettings.social_twitter} target="_blank" rel="noreferrer" title="Twitter / X" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors">
                  <TwitterIcon />
                </a>
              )}
              {footerSettings.social_threads && (
                <a href={footerSettings.social_threads} target="_blank" rel="noreferrer" title="Threads" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors">
                  <ThreadsIcon />
                </a>
              )}
              {footerSettings.social_facebook && (
                <a href={footerSettings.social_facebook} target="_blank" rel="noreferrer" title="Facebook" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500 transition-colors">
                  <FacebookIcon />
                </a>
              )}
              {footerSettings.social_linkedin && (
                <a href={footerSettings.social_linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500 transition-colors">
                  <LinkedinIcon />
                </a>
              )}
              {footerSettings.social_youtube && (
                <a href={footerSettings.social_youtube} target="_blank" rel="noreferrer" title="YouTube" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500 transition-colors">
                  <YoutubeIcon />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Capabilities</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">UI/UX Design Systems</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">React & Node Web Apps</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">SEO & Digital Growth</a></li>
              <li><a href="#services" className="hover:text-indigo-400 transition-colors">Brand Strategy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">About Story</a></li>
              <li><a href="#portfolio" className="hover:text-indigo-400 transition-colors">Case Studies</a></li>
              <li><a href="#blog" className="hover:text-indigo-400 transition-colors">Blog & Insights</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Contact Strategy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 w-full">
          <p>{footerSettings.copyright_text || `© ${new Date().getFullYear()} DigiAgency Aetheric. All rights reserved.`}</p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
