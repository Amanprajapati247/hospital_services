import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Phone, Navigation, Ambulance } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <span className="text-base font-extrabold tracking-tight">Need Emergency Medical Care in Indore?</span>
                <span className="bg-white/20 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">24x7 Ready</span>
              </div>
              <p className="text-xs text-rose-100">
                Instant ICU & ventilator bed availability, verified trauma centers, and direct 108 ambulance dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-2">
            <a
              href="tel:108"
              className="flex items-center space-x-1.5 bg-white text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-full font-bold text-xs shadow-md transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 108 Ambulance</span>
            </a>

            <Link
              to="/emergency"
              className="flex items-center space-x-1.5 bg-rose-950/40 hover:bg-rose-950/60 border border-white/40 text-white px-4 py-2 rounded-full font-bold text-xs transition"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Find Trauma Center</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
