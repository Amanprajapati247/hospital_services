import React, { useState, useEffect } from 'react';
import { Shield, Phone, CheckCircle2, Building2, Search } from 'lucide-react';
import { api } from '../../services/api';

export const InsurancePage: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getInsurance()
      .then(setProviders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = providers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Cashless Hospitalization Network</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Insurance Directory & Cashless Desks in Indore
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Find participating network hospitals in Indore with dedicated Third Party Administrator (TPA) helpdesks for instant pre-authorization and cashless claims.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search insurance provider (e.g. Star Health, HDFC, Care)..."
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl shadow-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
        />
      </div>

      {/* Insurance Cards */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading network insurers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-teal-50 text-teal-700 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                    {p.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Cashless Supported
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {p.name}
                </h3>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                  <span className="text-slate-500">Toll-Free Helpline:</span>
                  <a href={`tel:${p.toll_free}`} className="font-bold text-slate-800 hover:text-teal-700 flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-teal-600" />
                    <span>{p.toll_free}</span>
                  </a>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Network Hospitals in Indore:
                  </p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {p.network_hospitals_indore?.map((h: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                        <span className="font-semibold text-slate-700 truncate pr-2">{h.hospital_name}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{h.area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400">
                  *Cashless admission requires policy pre-authorization approval from the insurer’s TPA desk upon hospital arrival.
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
