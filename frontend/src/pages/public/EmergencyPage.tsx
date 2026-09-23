import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Phone, 
  Navigation, 
  Ambulance, 
  Activity, 
  Heart, 
  Clock, 
  ShieldAlert, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';

export const EmergencyPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEmergencyOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-16">
      
      {/* High-Visibility Emergency Header */}
      <div className="bg-gradient-to-r from-rose-800 via-rose-700 to-red-700 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span>24x7 Emergency Command Center • Indore, MP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            🚨 Immediate Emergency Medical Assistance
          </h1>

          <p className="text-xs sm:text-sm text-rose-100 max-w-2xl mx-auto leading-relaxed">
            If a patient is experiencing severe chest pain, stroke signs, difficulty breathing, or severe trauma, call an ambulance immediately or navigate directly to the nearest trauma center below.
          </p>

          {/* Quick Helplines Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto pt-4">
            {[
              { name: '108 Sanjeevani Ambulance', num: '108', desc: 'Free 24x7 Medical Ambulance in MP', highlight: true },
              { name: '102 Janani Express', num: '102', desc: 'Pregnant Women & Infant Transport', highlight: false },
              { name: '112 National SOS', num: '112', desc: 'All Emergency Services Response', highlight: false },
              { name: 'Indore Traffic Control', num: '0731-2525555', desc: 'Green Corridor & Transit Support', highlight: false }
            ].map((hp) => (
              <a
                key={hp.num}
                href={`tel:${hp.num}`}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 transition shadow-lg ${
                  hp.highlight
                    ? 'bg-white text-rose-700 hover:bg-rose-50 scale-105'
                    : 'bg-rose-900/60 hover:bg-rose-900 border border-white/20 text-white'
                }`}
              >
                <span className="text-xs font-bold">{hp.name}</span>
                <span className="text-2xl font-black font-mono">{hp.num}</span>
                <span className="text-[10px] text-center opacity-80">{hp.desc}</span>
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Safety Warning */}
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-1.5 shrink-0" />
            CRITICAL MEDICAL ADVICE:
          </p>
          <p>
            Do not delay seeking emergency medical treatment for an online questionnaire or chat. For critical life-threatening conditions, please call 108 or proceed straight to an equipped Level-1/2 emergency trauma hospital.
          </p>
        </div>

        {/* Emergency Hospitals with Live Bed Counters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                24x7 Emergency Trauma Centers in Indore
              </h2>
              <p className="text-xs text-slate-500">
                Hospitals with active emergency triage, round-the-clock intensive care units, and in-house doctors
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              Live Status Active
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading emergency trauma units...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.emergency_hospitals?.map((h: any) => (
                <div
                  key={h.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 hover:border-rose-400 p-5 shadow-xs space-y-4 flex flex-col justify-between transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                        {h.area}
                      </span>
                      <span className="text-[11px] font-extrabold text-rose-600 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>Triage: {h.emergency_wait_time}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {h.name}
                    </h3>
                    <p className="text-xs text-slate-500">{h.address}</p>

                    {/* Live Critical Care Inventory */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs mt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">ICU</span>
                        <strong className="text-emerald-600 text-sm font-black">{h.icu_available}</strong>
                        <span className="text-[10px] text-slate-400"> Avail</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Ventilator</span>
                        <strong className="text-slate-800 text-sm font-black">{h.ventilator_available}</strong>
                        <span className="text-[10px] text-slate-400"> Avail</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Trauma</span>
                        <strong className="text-slate-800 text-sm font-black">{h.emergency_beds_available}</strong>
                        <span className="text-[10px] text-slate-400"> Avail</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <a
                      href={`tel:${h.emergency_phone}`}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Emergency Desk: {h.emergency_phone}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center space-x-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5 text-teal-600" />
                      <span>Turn-by-Turn Navigation</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Ambulances Fleet */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Ambulance className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-extrabold text-slate-900">Dedicated Hospital Ambulance Fleets</h3>
            </div>
            <span className="text-xs text-slate-500">ALS & BLS Units stationed across Indore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data?.active_ambulances?.map((amb: any) => (
              <div key={amb.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{amb.hospital_name}</p>
                  <p className="text-[11px] text-teal-700 font-semibold">{amb.type}</p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">{amb.vehicle_number} • {amb.area}</p>
                </div>
                <a
                  href={`tel:${amb.driver_contact}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] px-3 py-2 rounded-lg flex items-center space-x-1 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
