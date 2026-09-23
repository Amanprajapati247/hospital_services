import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Shield, Heart, Building2, Stethoscope, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Emergency */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                CARECONNECT<span className="text-teal-400"> AI</span>
              </span>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Indore’s premier AI-powered healthcare discovery marketplace. Compare hospitals, check live ICU bed availability, explore treatment costs, and book verified specialists.
            </p>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>24x7 Central India Helplines</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-white">
                <span className="bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-1 rounded-md font-mono font-bold">
                  🚑 MP Ambulance: 108
                </span>
                <span className="bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-1 rounded-md font-mono font-bold">
                  👶 Janani Express: 102
                </span>
                <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded-md font-mono font-bold">
                  🚨 Police / SOS: 112
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Healthcare Discovery */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Discovery</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/hospitals" className="hover:text-teal-400 transition">Hospitals in Indore</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-400 transition">Verified Specialists</Link></li>
              <li><Link to="/emergency" className="hover:text-rose-400 transition font-semibold text-rose-300">Emergency & Trauma Beds</Link></li>
              <li><Link to="/compare" className="hover:text-teal-400 transition">Compare Hospital Tariffs</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-teal-400 transition">AI Symptom Assistant</Link></li>
            </ul>
          </div>

          {/* Col 3: Insurance & Schemes */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Schemes & Cover</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/government-schemes" className="hover:text-teal-400 transition">Ayushman Bharat PM-JAY</Link></li>
              <li><Link to="/insurance" className="hover:text-teal-400 transition">Cashless Insurance Desks</Link></li>
              <li><Link to="/health" className="hover:text-teal-400 transition">Health Guides & Diseases</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition">About CareConnect AI</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">Contact & Support</Link></li>
            </ul>
          </div>

          {/* Col 4: For Partners */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Partnerships</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <p className="text-xs font-bold text-white mb-1">Are you a Hospital?</p>
                <p className="text-[11px] text-slate-400 mb-2">Connect bed availability and appointments online.</p>
                <Link to="/register?role=hospital_admin" className="inline-block text-[11px] font-bold text-teal-400 hover:text-teal-300">
                  Register Hospital →
                </Link>
              </div>

              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <p className="text-xs font-bold text-white mb-1">Are you a Doctor?</p>
                <p className="text-[11px] text-slate-400 mb-2">Manage multi-hospital schedules and slots.</p>
                <Link to="/register?role=doctor" className="inline-block text-[11px] font-bold text-teal-400 hover:text-teal-300">
                  Join as Doctor →
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Clinical Disclaimer & Copyright */}
        <div className="pt-8 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-800">
            <span className="font-bold text-slate-400">IMPORTANT MEDICAL SAFETY DISCLAIMER:</span> CareConnect AI is an educational healthcare marketplace and hospital discovery directory. It does not provide medical diagnoses, treatment plans, or emergency triage advice. If you are experiencing symptoms of a medical emergency such as severe chest pressure, severe bleeding, or loss of consciousness, please immediately dial 108 or go to the nearest hospital emergency room.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>© 2026 CareConnect AI Technologies Private Limited. Launch City: Indore, Madhya Pradesh.</p>
            <div className="flex space-x-4">
              <Link to="/design-system" className="text-teal-400 font-bold hover:underline">Design System</Link>
              <Link to="/about" className="hover:text-slate-400">Privacy Policy</Link>
              <Link to="/about" className="hover:text-slate-400">Terms of Service</Link>
              <Link to="/contact" className="hover:text-slate-400">Help Center</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
