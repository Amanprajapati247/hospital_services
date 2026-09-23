import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, CheckCircle2, ShieldCheck, AlertCircle, Building2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export const CostExplorerPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    api.getCostEstimates()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const current = data?.treatments?.[selectedIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          <Calculator className="w-3.5 h-3.5 text-teal-600" />
          <span>Transparent Healthcare Tariffs</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Treatment Cost Explorer — Indore, MP
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Estimate realistic treatment, surgery, and inpatient costs across private, corporate, and trust hospitals in Indore. Check insurance cashless acceptance and Ayushman Bharat coverage.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading procedure tariffs...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left 1 Col: Procedure Selector List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1">
              Select Medical Procedure
            </h3>
            {data?.treatments?.map((t: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left p-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  selectedIdx === idx
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <p className="line-clamp-1">{t.treatment}</p>
                  <span className={`text-[10px] font-normal ${selectedIdx === idx ? 'text-teal-100' : 'text-slate-400'}`}>
                    {t.specialty}
                  </span>
                </div>
                <span className={`text-[11px] font-extrabold ${selectedIdx === idx ? 'text-white' : 'text-slate-900'}`}>
                  {t.estimated_range.split(' - ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Right 2 Cols: Detailed Cost Breakdown */}
          {current && (
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md uppercase">
                  {current.specialty}
                </span>
                <h2 className="text-2xl font-black text-slate-900">{current.treatment}</h2>
              </div>

              {/* Total Estimated Banner */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
                    Estimated Total Tariff Range
                  </span>
                  <span className="text-3xl font-black text-teal-400">{current.estimated_range}</span>
                </div>
                <div className="text-xs text-slate-300 sm:text-right">
                  <span className="block">Hospital Stay: <strong>{current.hospitalization_days}</strong></span>
                  <span className="block text-emerald-400 font-bold">✓ Cashless Pre-Auth Available</span>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Specialist Consultation</span>
                  <p className="font-extrabold text-slate-800 text-sm">{current.consultation}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Pre-Op Diagnostics & Scans</span>
                  <p className="font-extrabold text-slate-800 text-sm">{current.diagnostics}</p>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1 sm:col-span-2">
                  <span className="text-blue-900 uppercase text-[10px] font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    Government Scheme (PM-JAY) Eligibility
                  </span>
                  <p className="font-bold text-blue-950">{current.pmjay_coverage}</p>
                </div>
              </div>

              {/* Top Recommended Hospitals */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended Indore Hospitals for this Procedure:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {current.top_hospitals?.map((hName: string, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate">{hName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 leading-relaxed border border-slate-100">
                <strong className="text-slate-700">Tariff Disclaimer:</strong> {data?.disclaimer}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
