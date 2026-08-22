import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Building2, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$10,000 - $25,000',
    service_interest: 'Web Development',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    const res = await apiService.sendInquiry(formData);
    setLoading(false);

    if (res.success) {
      setResponseMsg({ type: 'success', text: res.message });
      setFormData({ name: '', email: '', company: '', budget: '$10,000 - $25,000', service_interest: 'Web Development', message: '' });
    } else {
      setResponseMsg({ type: 'error', text: res.message || 'Error submitting inquiry.' });
    }
  };

  return (
    <section id="contact" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="badge-glow mb-4">Start A Project</div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Let's Scale Your <span className="gradient-text-accent">Brand</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Ready to transform your digital presence? Book a strategy consultation with our senior agency principals today.
              </p>
            </div>

            {/* HQ Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Global Headquarters</h4>
                  <p className="text-xs text-slate-300">Silicon Tower Level 24, Tech District, US / Singapore</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Direct Strategy Email</h4>
                  <p className="text-xs text-slate-300">hello@digiagency.com | partner@digiagency.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">B2B Priority Line</h4>
                  <p className="text-xs text-slate-300">+1 (800) 928-3444 (Mon-Fri 09:00 - 18:00 EST)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 glass-panel p-8 md:p-10 rounded-3xl border border-indigo-500/20 shadow-2xl relative w-full">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
              <span>Project Inquiry Form</span>
            </h3>

            {responseMsg && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-xs font-semibold ${
                responseMsg.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{responseMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Mark Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Corporate Email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="mark@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Company / SME</label>
                  <input 
                    type="text" 
                    placeholder="TechScale Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="glass-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Service Interest</label>
                  <select 
                    value={formData.service_interest}
                    onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                    className="glass-input w-full bg-slate-900 text-slate-200"
                  >
                    <option value="UI/UX Design">UI/UX Design & Prototyping</option>
                    <option value="Web Development">Full-Stack Web Development</option>
                    <option value="Digital Marketing">Digital Marketing & Performance SEO</option>
                    <option value="Brand Strategy">Brand Strategy & Visual Identity</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Target Budget Range</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['<$10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000+'].map((range) => (
                    <button
                      type="button"
                      key={range}
                      onClick={() => setFormData({ ...formData, budget: range })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        formData.budget === range
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Project Vision & Goals *</label>
                <textarea 
                  rows="4"
                  required
                  placeholder="Describe your primary business objectives, timeline, and key requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="glass-input w-full resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-4 text-sm font-bold"
              >
                {loading ? 'Transmitting Request...' : 'Submit Consultation Request'}
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
