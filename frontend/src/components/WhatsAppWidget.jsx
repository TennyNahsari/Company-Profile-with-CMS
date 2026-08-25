import React, { useState, useEffect } from 'react';
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
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
        title="WhatsApp Us"
        className="relative group flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] rounded-full text-white shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300"
      >
        {/* Animated Glow Pulse Ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-70 animate-ping -z-10" />
        
        {/* Official HD WhatsApp Icon SVG */}
        <svg className="w-7 h-7 fill-current text-white drop-shadow-md" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.415 5.171 5.294-1.388c1.464.798 3.116 1.218 4.779 1.218h.004c5.506 0 9.989-4.478 9.99-9.985.001-2.668-1.034-5.176-2.919-7.062-1.885-1.885-4.393-2.92-7.065-2.924zm5.82 14.153c-.247.694-1.442 1.328-1.986 1.388-.506.056-1.164.08-1.883-.15-1.164-.372-2.673-1.074-4.227-2.457-1.954-1.738-3.238-3.876-3.626-4.542-.387-.666-.041-1.026.206-1.272.222-.222.493-.574.74-.863.247-.289.329-.494.494-.823.165-.33.082-.618-.041-.865-.124-.247-1.112-2.677-1.523-3.666-.401-.963-.808-.832-1.112-.848-.288-.015-.618-.016-.947-.016s-.865.124-1.318.618c-.453.494-1.73 1.69-1.73 4.122s1.771 4.779 2.018 5.109c.247.33 3.484 5.318 8.44 7.457 1.18.509 2.102.813 2.82 1.04.1.031.2.062.301.092 1.185.377 2.264.324 3.116.197.949-.142 2.92-1.194 3.332-2.348.412-1.154.412-2.143.288-2.348-.123-.206-.453-.33-.947-.577z" />
        </svg>
      </a>
    </div>
  );
}

