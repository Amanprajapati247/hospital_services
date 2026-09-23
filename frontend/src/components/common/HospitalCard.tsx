import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  Shield, 
  Clock, 
  Bed, 
  Activity, 
  Phone, 
  Navigation, 
  ArrowRight,
  Plus,
  Check
} from 'lucide-react';
import { HospitalListItem } from '../../types';
import { useCompare } from '../../context/CompareContext';

interface HospitalCardProps {
  hospital: HospitalListItem;
  onBookClick?: (hospital: HospitalListItem) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onBookClick }) => {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(hospital.id);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(hospital.id);
    } else {
      addToCompare(hospital);
    }
  };

  const openDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group">
      
      {/* Top Banner / Image */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={hospital.cover_image || hospital.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80'}
          alt={hospital.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {hospital.verified && (
            <span className="inline-flex items-center space-x-1 bg-teal-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Hospital</span>
            </span>
          )}
          {hospital.is_emergency_active && (
            <span className="inline-flex items-center space-x-1 bg-rose-600/90 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs">
              <Activity className="w-3 h-3" />
              <span>24x7 Emergency</span>
            </span>
          )}
        </div>

        {/* Rating Badge Top Right */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-md flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span className="text-xs font-bold text-slate-900">{hospital.rating.toFixed(1)}</span>
          <span className="text-[10px] text-slate-500 font-medium">({hospital.review_count})</span>
        </div>

        {/* Bottom overlay: Location */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
            {hospital.hospital_type}
          </span>
          <h3 className="text-base font-bold leading-snug line-clamp-1 group-hover:text-teal-200 transition">
            {hospital.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        {/* Location & Wait Time */}
        <div className="space-y-1.5">
          <div className="flex items-center text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
            <span className="truncate">{hospital.area}, {hospital.city}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>OPD Wait: <strong className="text-slate-800">{hospital.opd_wait_time}</strong></span>
            </div>
            <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
              Emergency: {hospital.emergency_wait_time}
            </div>
          </div>
        </div>

        {/* Bed Status Counter (Real-time highlight) */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 grid grid-cols-2 gap-2 text-center">
          <div className="bg-white rounded-lg p-1.5 border border-slate-100 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center space-x-1">
              <Activity className="w-3 h-3 text-rose-500" />
              <span>ICU Beds</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              <span className={hospital.icu_avail > 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                {hospital.icu_avail}
              </span>
              <span className="text-[10px] text-slate-400 font-normal"> Avail</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-1.5 border border-slate-100 shadow-2xs">
            <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center space-x-1">
              <Bed className="w-3 h-3 text-teal-600" />
              <span>General Beds</span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">
              <span className="text-slate-800 font-bold">{hospital.general_avail}</span>
              <span className="text-[10px] text-slate-400 font-normal"> Avail</span>
            </div>
          </div>
        </div>

        {/* Insurance & Scheme Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="inline-flex items-center text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
            <Shield className="w-2.5 h-2.5 mr-1 text-blue-500" />
            PM-JAY Empanelled
          </span>
          <span className="inline-flex items-center text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md">
            Cashless Insurance
          </span>
        </div>

        {/* Pricing Summary */}
        <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">OPD Consultation</span>
            <span className="text-sm font-black text-slate-900">₹{hospital.starting_fee}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Treatment</span>
            <span className="text-xs font-bold text-slate-700">₹{hospital.est_treatment_min.toLocaleString()} - ₹{hospital.est_treatment_max.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions Bottom Bar */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/hospitals/${hospital.id}`}
              className="w-full text-center bg-teal-600 hover:bg-teal-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs"
            >
              View Hospital
            </Link>

            <button
              onClick={handleCompareToggle}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 border transition ${
                inCompare
                  ? 'bg-teal-50 border-teal-500 text-teal-700 font-extrabold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {inCompare ? <Check className="w-3.5 h-3.5 mr-1 text-teal-600" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
              <span>{inCompare ? 'Compared' : 'Compare'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
            <a href={`tel:${hospital.emergency_phone || hospital.phone}`} className="flex items-center space-x-1 text-slate-600 hover:text-rose-600 transition">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Call Desk</span>
            </a>
            <button onClick={openDirections} className="flex items-center space-x-1 text-slate-600 hover:text-teal-700 transition">
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
