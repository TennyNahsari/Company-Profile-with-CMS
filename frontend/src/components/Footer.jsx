import React, { useState, useEffect } from 'react';
import { Sparkles, Github, Twitter, Linkedin, Dribbble, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { apiService } from '../services/api';

export default function Footer() {
  const [footerSettings, setFooterSettings] = useState({
    company_name: 'DigiAgency Aetheric',
    company_bio: 'Enterprise digital agency engineering high-speed React web products, UI/UX design systems, and data-driven B2B growth marketing.',
    office_address: 'Financial Tower Level 18, Pacific Boulevard, San Francisco, CA',
    contact_email: 'hello@digiagency.com',
    contact_phone: '+1 (555) 234-5678',
    copyright_text: '© 2026 DigiAgency Aetheric. All rights reserved. Powered by React, Express & PostgreSQL.',
    social_linkedin: 'https://linkedin.com',
    social_twitter: 'https://twitter.com',
    social_github: 'https://github.com',
    social_dribbble: 'https://dribbble.com'
  });

  useEffect(() => {
    async function loadFooterSettings() {
      const data = await apiService.getFooterSettings();
      if (data) {
        setFooterSettings(data);
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
            <div className="flex items-center gap-3 pt-3">
              {footerSettings.social_linkedin && (
                <a href={footerSettings.social_linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_twitter && (
                <a href={footerSettings.social_twitter} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_github && (
                <a href={footerSettings.social_github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {footerSettings.social_dribbble && (
                <a href={footerSettings.social_dribbble} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                  <Dribbble className="w-4 h-4" />
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
