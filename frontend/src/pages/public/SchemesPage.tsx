import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, FileText, Phone, ExternalLink, Building2 } from 'lucide-react';
import { api } from '../../services/api';

export const SchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSchemes()
      .then(setSchemes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Government Healthcare Entitlements</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Ayushman Bharat (PM-JAY) & State Healthcare Schemes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Comprehensive guide to government-sponsored healthcare coverage, eligibility criteria, document checklists, and empanelled tertiary hospitals in Indore, MP.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading government schemes...</div>
      ) : (
        <div className="space-y-6">
          {schemes.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full uppercase">
                      {s.short_name}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Cover: {s.coverage_amount}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">{s.name}</h2>
                </div>

                <a
                  href={s.official_portal}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs self-start md:self-auto"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Description & Eligibility */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Scheme Overview</h4>
                    <p className="text-slate-600 leading-relaxed">{s.description}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Eligibility Criteria</h4>
                    <p className="text-slate-600 leading-relaxed">{s.eligibility}</p>
                  </div>
                </div>

                {/* Documents & Empanelled Hospitals */}
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5">
                    <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 mr-1 text-amber-700" />
                      <span>Required Documents Checklist</span>
                    </h4>
                    <p className="text-amber-800 leading-relaxed font-medium">{s.documents_required}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      Empanelled Hospitals in Indore ({s.empanelled_hospitals?.length || 0})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {s.empanelled_hospitals?.map((h: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                          <p className="font-bold text-slate-900 truncate">{h.hospital_name}</p>
                          <p className="text-[10px] text-slate-500">{h.area}</p>
                          <p className="text-[10px] text-teal-700 font-semibold flex items-center space-x-1 pt-1">
                            <Phone className="w-2.5 h-2.5" />
                            <span>Nodal: {h.nodal_contact}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
