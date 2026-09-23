import React from 'react';
import { Sparkles, Shield, Heart, Award, MapPin, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 space-y-10 pb-20">
      
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Our Mission & Safety Principles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Transforming Healthcare Discovery in Central India
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          CareConnect AI combines marketplace transparency, clinical triage guardrails, and hospital ERP connectivity to ensure every patient in Indore finds the right doctor, the right hospital, and the right care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Safety First</h3>
          <p className="text-slate-600 leading-relaxed">
            We never fabricate diagnoses. Our AI evaluates emergency red-flags and routes critical patients to accredited 24x7 trauma centers immediately.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">NABH & NABL Verified</h3>
          <p className="text-slate-600 leading-relaxed">
            All featured hospitals in Indore (Medanta, Bombay Hospital, CHL, Choithram, SAIMS, Shalby) hold verified state and national medical credentials.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Ayushman Bharat Access</h3>
          <p className="text-slate-600 leading-relaxed">
            We champion financial healthcare transparency with dedicated guides to PM-JAY and cashless insurance networks across Madhya Pradesh.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
        <h3 className="text-xl font-bold">Launch Headquarters — Indore, MP</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          CareConnect AI Technologies Private Limited is headquartered in Scheme 54, PU4 Commercial, Vijay Nagar, Indore. We are scaling our network across Bhopal, Ujjain, Dewas, and all of Central India.
        </p>
      </div>

    </div>
  );
};
