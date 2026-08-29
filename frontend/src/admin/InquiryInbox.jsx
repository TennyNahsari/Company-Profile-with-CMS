import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Building2, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function InquiryInbox() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    const data = await apiService.getInquiries();
    const list = Array.isArray(data) ? data : [];
    setInquiries(list);
    if (list.length > 0) setSelectedInquiry(list[0]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">B2B Leads & Inquiries Inbox</h1>
        <p className="text-xs text-slate-400 mt-1">Manage High-Intent Client Submissions Sent via Contact Form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inbox List */}
        <div className="lg:col-span-5 glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Received Leads ({inquiries?.length || 0})</h3>

          <div className="space-y-2">
            {(inquiries || []).map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  selectedInquiry?.id === inq.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold truncate">{inq.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {inq.budget || 'Inquiry'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-1">{inq.company || inq.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Lead Detail View */}
        <div className="lg:col-span-7 glass-panel p-4 sm:p-6 md:p-8 rounded-2xl border border-white/10 space-y-6">
          {selectedInquiry ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedInquiry.name}</h2>
                  <span className="text-xs text-indigo-400 flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedInquiry.email}
                  </span>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                  Status: {selectedInquiry.status || 'NEW'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Company / SME</span>
                  <span className="font-semibold text-white">{selectedInquiry.company || 'Not Specified'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Budget</span>
                  <span className="font-semibold text-indigo-300">{selectedInquiry.budget || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Service Interest</span>
                  <span className="font-semibold text-purple-300">{selectedInquiry.service_interest || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Received Date</span>
                  <span className="font-semibold text-slate-300">{new Date(selectedInquiry.created_at || Date.now()).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Vision Message</h4>
                <div className="p-4 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <a 
                  href={`mailto:${selectedInquiry.email}?subject=RE: DigiAgency Strategy Consultation`}
                  className="btn-primary py-2.5 px-5 text-xs"
                >
                  Reply via Email &rarr;
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select an inquiry to read project details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
