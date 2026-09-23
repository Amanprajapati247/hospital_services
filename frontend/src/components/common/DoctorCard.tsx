import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, Clock, MapPin, Building2, Calendar } from 'lucide-react';
import { Doctor } from '../../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBookClick?: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBookClick }) => {
  const primaryAff = doctor.affiliations && doctor.affiliations.length > 0 ? doctor.affiliations[0] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group">
      
      <div>
        {/* Top: Photo & Basic Details */}
        <div className="flex items-start space-x-4">
          <div className="relative shrink-0 w-20 h-20">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-xs">
              <img
                src={doctor.photo_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                alt={doctor.name}
                className="w-full h-full object-cover object-top aspect-square"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
            {doctor.verified && (
              <span className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-0.5 rounded-full ring-2 ring-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                {doctor.specialization}
              </span>
              <div className="flex items-center text-xs font-bold text-slate-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 mr-1" />
                <span>{doctor.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal text-[11px] ml-0.5">({doctor.review_count})</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-1 truncate group-hover:text-teal-700 transition">
              {doctor.name}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-1 font-medium mt-0.5">
              {doctor.qualification}
            </p>

            <p className="text-xs text-slate-600 mt-1">
              <strong>{doctor.experience_years} Years</strong> Clinical Experience
            </p>
          </div>
        </div>

        {/* Hospital Affiliations Block */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Hospital Affiliations
          </div>

          {doctor.affiliations && doctor.affiliations.length > 0 ? (
            doctor.affiliations.slice(0, 2).map((aff, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{aff.hospital_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{aff.days_of_week}</span>
                    <span>•</span>
                    <span>{aff.opd_timings}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Fee</span>
                  <span className="text-xs font-bold text-slate-900">₹{aff.consultation_fee}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">Consultant in Indore</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
        <Link
          to={`/doctors/${doctor.id}`}
          className="text-center py-2 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
        >
          View Profile
        </Link>
        
        <button
          onClick={() => onBookClick ? onBookClick(doctor) : null}
          className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition flex items-center justify-center space-x-1 shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Slot</span>
        </button>
      </div>

    </div>
  );
};
