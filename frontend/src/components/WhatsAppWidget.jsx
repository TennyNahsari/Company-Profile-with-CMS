import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { apiService } from '../services/api';

export function formatWhatsAppUrl(phoneNumber) {
  if (!phoneNumber) return 'https://wa.me/';
  let clean = phoneNumber.replace(/[^\d]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  }
  return `https://wa.me/${clean}`;
}

export default function WhatsAppWidget() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    async function loadPhone() {
      try {
        const settings = await apiService.getFooterSettings();
        if (settings && settings.contact_phone) {
          setPhoneNumber(settings.contact_phone);
        }
      } catch (e) {}
    }
    loadPhone();
  }, []);

  const waUrl = formatWhatsAppUrl(phoneNumber);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Floating Tooltip Callout Card */}
      {showTooltip && (
        <div className="whatsapp-tooltip-box p-4 rounded-2xl max-w-[260px] w-full relative animate-bounce-short transition-all duration-300 group">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTooltip(false); }}
            className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative z-10" />
            </div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Online • Support Active
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-snug font-medium mb-3">
            Butuh konsultasi cepat? Hubungi tim agency kami via WhatsApp.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
          >
            <span>Chat Sekarang</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Main Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        className="whatsapp-widget-btn flex items-center gap-3 px-5 py-3.5 rounded-full text-white cursor-pointer group"
      >
        <div className="relative flex items-center justify-center">
          {/* Animated Glow Pulse Ring */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" />
          
          {/* Official HD WhatsApp Icon SVG */}
          <svg className="w-7 h-7 fill-current text-white relative z-10 drop-shadow-md" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.415 5.171 5.294-1.388c1.464.798 3.116 1.218 4.779 1.218h.004c5.506 0 9.989-4.478 9.99-9.985.001-2.668-1.034-5.176-2.919-7.062-1.885-1.885-4.393-2.92-7.065-2.924zm5.82 14.153c-.247.694-1.442 1.328-1.986 1.388-.506.056-1.164.08-1.883-.15-1.164-.372-2.673-1.074-4.227-2.457-1.954-1.738-3.238-3.876-3.626-4.542-.387-.666-.041-1.026.206-1.272.222-.222.493-.574.74-.863.247-.289.329-.494.494-.823.165-.33.082-.618-.041-.865-.124-.247-1.112-2.677-1.523-3.666-.401-.963-.808-.832-1.112-.848-.288-.015-.618-.016-.947-.016s-.865.124-1.318.618c-.453.494-1.73 1.69-1.73 4.122s1.771 4.779 2.018 5.109c.247.33 3.484 5.318 8.44 7.457 1.18.509 2.102.813 2.82 1.04.1.031.2.062.301.092 1.185.377 2.264.324 3.116.197.949-.142 2.92-1.194 3.332-2.348.412-1.154.412-2.143.288-2.348-.123-.206-.453-.33-.947-.577z" />
          </svg>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-extrabold text-white tracking-wide leading-tight flex items-center gap-1.5">
            <span>WhatsApp Us</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          </span>
          <span className="text-[10px] text-emerald-100 font-semibold opacity-90 leading-tight">
            {phoneNumber || 'Fast Response'}
          </span>
        </div>
      </a>

    </div>
  );
}
