import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  Bed, 
  Heart, 
  Star, 
  Clock, 
  Search, 
  Phone, 
  Navigation, 
  Calendar, 
  Mic, 
  Layers, 
  Copy, 
  Check, 
  Stethoscope, 
  Building2 
} from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tokens' | 'buttons' | 'badges' | 'cards' | 'inputs'>('tokens');

  const copySnippet = (name: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(name);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10 pb-20">
      
      {/* Design System Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-900/50 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CareConnect AI • Living Design System</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
          Complete Healthcare UI Design System
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          The unified design language powering CareConnect AI across Indore and Central India. Built on modern medical aesthetic principles: clinical safety, high information density, responsive micro-interactions, and accessible typography.
        </p>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 text-xs font-bold">
          {[
            { id: 'tokens', label: '1. Tokens & Colors' },
            { id: 'buttons', label: '2. Buttons & Actions' },
            { id: 'badges', label: '3. Badges & Chips' },
            { id: 'cards', label: '4. Cards & Components' },
            { id: 'inputs', label: '5. Form Controls' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: TOKENS & COLOR PALETTES */}
      {activeTab === 'tokens' && (
        <section className="space-y-8 animate-in fade-in duration-200">
          
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Color Palette & Semantic Roles</h2>
            <p className="text-xs text-slate-500">Carefully calibrated for healthcare trust, emergency contrast, and high readability.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Clinical Teal */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="h-20 rounded-xl bg-teal-600 flex items-end p-2 text-white font-mono text-xs font-bold">
                teal-600 (#0d9488)
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Clinical Teal (Primary Brand)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Represents medical credibility, renewal, and verified certifications.</p>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                <div className="bg-teal-50 text-teal-800 p-1 rounded font-bold">50</div>
                <div className="bg-teal-100 text-teal-800 p-1 rounded font-bold">100</div>
                <div className="bg-teal-600 text-white p-1 rounded font-bold">600</div>
                <div className="bg-teal-800 text-white p-1 rounded font-bold">800</div>
              </div>
            </div>

            {/* Emergency Red */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="h-20 rounded-xl bg-rose-600 flex items-end p-2 text-white font-mono text-xs font-bold">
                rose-600 (#dc2626)
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Emergency Coral (Urgent Triage)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Reserved exclusively for 108 ambulance, trauma centers, and critical red flags.</p>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                <div className="bg-rose-50 text-rose-800 p-1 rounded font-bold">50</div>
                <div className="bg-rose-100 text-rose-800 p-1 rounded font-bold">100</div>
                <div className="bg-rose-600 text-white p-1 rounded font-bold">600</div>
                <div className="bg-rose-800 text-white p-1 rounded font-bold">800</div>
              </div>
            </div>

            {/* Trust Navy */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="h-20 rounded-xl bg-slate-900 flex items-end p-2 text-white font-mono text-xs font-bold">
                slate-900 (#0f172a)
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Trust Navy (Enterprise & Neutral)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Foundational dark tone for hero headers, typography, and ERP dashboards.</p>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                <div className="bg-slate-100 text-slate-800 p-1 rounded font-bold">100</div>
                <div className="bg-slate-300 text-slate-800 p-1 rounded font-bold">300</div>
                <div className="bg-slate-700 text-white p-1 rounded font-bold">700</div>
                <div className="bg-slate-900 text-white p-1 rounded font-bold">900</div>
              </div>
            </div>

            {/* Ayushman Blue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <div className="h-20 rounded-xl bg-blue-700 flex items-end p-2 text-white font-mono text-xs font-bold">
                blue-700 (#1d4ed8)
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Scheme Blue (Financial Protection)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Identifies Ayushman Bharat PM-JAY and cashless insurance desk features.</p>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                <div className="bg-blue-50 text-blue-800 p-1 rounded font-bold">50</div>
                <div className="bg-blue-100 text-blue-800 p-1 rounded font-bold">100</div>
                <div className="bg-blue-700 text-white p-1 rounded font-bold">700</div>
                <div className="bg-blue-900 text-white p-1 rounded font-bold">900</div>
              </div>
            </div>

          </div>

          {/* Typography Hierarchy */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Typography Scale (Plus Jakarta Sans)</h3>
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-50 pb-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Display Headings (36px / 40px)</span>
                <span className="font-mono text-[11px] text-slate-400">font-black tracking-tight</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-50 pb-2">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">Section Title (24px)</span>
                <span className="font-mono text-[11px] text-slate-400">font-extrabold text-slate-900</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-50 pb-2">
                <span className="text-base font-bold text-slate-900">Component Title (16px)</span>
                <span className="font-mono text-[11px] text-slate-400">font-bold text-base</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-50 pb-2">
                <span className="text-xs text-slate-600">Body & Metadata (12px / 14px leading-relaxed)</span>
                <span className="font-mono text-[11px] text-slate-400">text-xs text-slate-600 leading-relaxed</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span className="text-[10px] font-mono text-teal-700 uppercase font-bold">IND-REF-2026-8841 (Micro Mono 10px)</span>
                <span className="font-mono text-[11px] text-slate-400">font-mono text-[10px] uppercase</span>
              </div>
            </div>
          </div>

        </section>
      )}

      {/* TAB 2: BUTTONS & ACTION CONTROLS */}
      {activeTab === 'buttons' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Button States & Semantic Actions</h2>
            <p className="text-xs text-slate-500">Consistent sizing, hover elevations, active states, and accessible contrast ratios.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Primary Action */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Primary Action</span>
                <div>
                  <button className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition shadow-md flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">bg-teal-600 hover:bg-teal-700</p>
              </div>

              {/* Emergency CTA */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Emergency High Priority</span>
                <div>
                  <button className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-md shadow-rose-500/20 flex items-center space-x-2 animate-pulse">
                    <Phone className="w-4 h-4" />
                    <span>Call 108 Ambulance</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">bg-rose-600 shadow-rose-500/20</p>
              </div>

              {/* AI Glow Button */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">AI Conversational Trigger</span>
                <div>
                  <button className="bg-gradient-to-r from-teal-500 to-emerald-400 hover:opacity-90 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-md flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Ask CareConnect AI</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">from-teal-500 to-emerald-400</p>
              </div>

              {/* Secondary Outline */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Secondary / Compare</span>
                <div>
                  <button className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Add to Compare</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">border border-slate-300 text-slate-700</p>
              </div>

              {/* Navigation Action */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Navigation / Directions</span>
                <div>
                  <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-teal-600" />
                    <span>Get Directions</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">bg-slate-100 hover:bg-slate-200</p>
              </div>

              {/* Voice Search Button */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Voice Recognition (Hindi/Eng)</span>
                <div>
                  <button className="bg-slate-100 hover:bg-teal-50 text-teal-700 border border-slate-200 font-bold text-xs px-4 py-3 rounded-xl transition flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-teal-600" />
                    <span>Speak (Hindi / English)</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Web Speech API Voice Trigger</p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* TAB 3: BADGES & STATUS TAGS */}
      {activeTab === 'badges' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Healthcare Status Badges & Pills</h2>
            <p className="text-xs text-slate-500">Standardized verified accreditation, live availability, and financial entitlement tags.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Accreditation</span>
                <span className="inline-flex items-center space-x-1.5 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Verified Hospital</span>
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Emergency Readiness</span>
                <span className="inline-flex items-center space-x-1.5 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  <Activity className="w-3.5 h-3.5" />
                  <span>24x7 Emergency Ready</span>
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Government Scheme</span>
                <span className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>PM-JAY Empanelled</span>
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Insurance</span>
                <span className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-3 py-1 rounded-full">
                  <span>Cashless Supported</span>
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Live Bed Availability</span>
                <span className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>14 ICU Beds Live</span>
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Rating</span>
                <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>4.8 (384 reviews)</span>
                </span>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* TAB 4: CARDS & COMPLEX COMPONENTS */}
      {activeTab === 'cards' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Card Architectural Blueprint</h2>
            <p className="text-xs text-slate-500">Complete composition examples for marketplace discovery cards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Live Bed Inventory Metric Component */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Bed Inventory KPI Block
              </h4>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center space-x-1">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    <span>ICU Available</span>
                  </span>
                  <p className="text-xl font-black text-emerald-600 mt-1">12 <span className="text-xs text-slate-400 font-normal">/ 45</span></p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center space-x-1">
                    <Bed className="w-3.5 h-3.5 text-teal-600" />
                    <span>General Beds</span>
                  </span>
                  <p className="text-xl font-black text-slate-900 mt-1">68 <span className="text-xs text-slate-400 font-normal">/ 220</span></p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Updated: Today, 12:35 PM</span>
                <span className="text-emerald-700 font-bold">Verified by Hospital Admin</span>
              </div>
            </div>

            {/* Doctor Affiliation Snapshot Component */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Doctor Hospital Affiliation Widget
              </h4>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Bombay Hospital Indore</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Mon, Wed, Fri • 05:00 PM - 08:00 PM</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Consultation</span>
                  <span className="text-sm font-black text-slate-900">₹900</span>
                </div>
              </div>

              <button className="w-full bg-teal-600 text-white font-bold text-xs py-2.5 rounded-xl">
                Book Slot at Bombay Hospital
              </button>
            </div>

          </div>
        </section>
      )}

      {/* TAB 5: FORM CONTROLS */}
      {activeTab === 'inputs' && (
        <section className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Form Controls & Filter Inputs</h2>
            <p className="text-xs text-slate-500">Specialized healthcare inputs: location selector, range sliders, date pickers.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Search with Location Prefix</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Vijay Nagar, Indore..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">OPD Consultation Fee Slider</label>
                <input type="range" min="300" max="1500" defaultValue="800" className="w-full accent-teal-600 mt-2" />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹300</span>
                  <span className="font-bold text-slate-800">₹800</span>
                  <span>₹1500+</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Select Medical Department</label>
                <select className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-hidden">
                  <option>Cardiology (Heart Care)</option>
                  <option>Orthopedics (Joint & Spine)</option>
                  <option>Neurology (Brain & Stroke)</option>
                  <option>Pediatrics (Child Health)</option>
                </select>
              </div>

            </div>
          </div>
        </section>
      )}

    </div>
  );
};
