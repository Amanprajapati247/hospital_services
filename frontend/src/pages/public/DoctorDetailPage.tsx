import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, CheckCircle2, Building2, Calendar, Clock, MapPin, Award, Shield, User } from 'lucide-react';
import { api } from '../../services/api';
import { AppointmentModal } from '../../components/common/AppointmentModal';

export const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string>('11:00 AM');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getDoctorById(id)
        .then(setDoctor)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <Link to="/doctors" className="text-xs text-teal-600 font-bold mt-2 inline-block">
          ← Return to Doctors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-6">
        <div className="relative shrink-0 w-28 h-28 sm:w-36 sm:h-36">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-slate-50 shadow-md bg-slate-100">
            <img
              src={doctor.photo_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
              alt={doctor.name}
              className="w-full h-full object-cover object-top aspect-square"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
          {doctor.verified && (
            <span className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-1 rounded-full ring-4 ring-white shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase">
              {doctor.specialization}
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {doctor.experience_years} Years Experience
            </span>
            <div className="flex items-center text-xs font-bold text-slate-900 bg-amber-50 px-2.5 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 mr-1" />
              <span>{doctor.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal ml-1">({doctor.review_count} reviews)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {doctor.name}
          </h1>

          <p className="text-xs font-semibold text-slate-600">
            {doctor.qualification}
          </p>

          <div className="text-xs text-slate-500 flex flex-wrap gap-4 pt-1">
            <span><strong>Council:</strong> {doctor.registration_council}</span>
            <span><strong>Reg No:</strong> {doctor.registration_number}</span>
            <span><strong>Languages:</strong> {doctor.languages}</span>
          </div>

          <p className="text-xs text-slate-600 pt-2 leading-relaxed max-w-3xl">
            {doctor.about}
          </p>
        </div>
      </div>

      {/* Main Grid: Affiliations & Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Hospital Affiliations & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Multi-Hospital Affiliation Cards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Hospital Affiliations & OPD Schedules</h3>
            <p className="text-xs text-slate-500">
              Dr. {doctor.name.split(' ')[1] || doctor.name} consults across multiple accredited hospital networks in Indore:
            </p>

            <div className="space-y-3">
              {doctor.affiliations?.map((aff: any) => (
                <div key={aff.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-900 text-sm">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>{aff.hospital_name}</span>
                    </div>
                    <p className="text-xs text-slate-500">Department of {aff.department} • {aff.hospital_area}</p>
                    <div className="flex items-center space-x-2 text-xs font-medium text-teal-800 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{aff.days_of_week} ({aff.opd_timings})</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Consultation</span>
                      <span className="text-base font-extrabold text-slate-900">₹{aff.consultation_fee}</span>
                    </div>
                    <button
                      onClick={() => setIsBookingOpen(true)}
                      className="mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                    >
                      Book at this Hospital
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Reviews */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Patient Feedback</h3>
            {doctor.reviews && doctor.reviews.length > 0 ? (
              <div className="space-y-3">
                {doctor.reviews.map((r: any) => (
                  <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between items-center font-bold text-slate-800">
                      <span>{r.user_name}</span>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="ml-1">{r.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-slate-600">{r.review_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No public reviews submitted yet.</p>
            )}
          </div>

        </div>

        {/* Right 1 Col: Slot Booking Picker */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 sticky top-24">
            <h3 className="text-base font-extrabold text-slate-900">Book OPD Slot</h3>
            <p className="text-xs text-slate-500">Select an available consultation timing slot:</p>

            <div className="grid grid-cols-2 gap-2">
              {doctor.available_slots?.map((slot: any) => (
                <button
                  key={slot.slot_id}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`p-2 rounded-xl text-xs font-bold border transition ${
                    selectedSlot === slot.time
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : slot.available
                      ? 'bg-slate-50 text-slate-700 hover:bg-teal-50 border-slate-200'
                      : 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm Slot ({selectedSlot})</span>
            </button>

            <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-100">
              <p>✓ Instant SMS/WhatsApp confirmation</p>
              <p>✓ Pay consultation fee directly at hospital OPD desk</p>
            </div>
          </div>
        </div>

      </div>

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={doctor}
      />

    </div>
  );
};
