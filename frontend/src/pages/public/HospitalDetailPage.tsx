import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Phone, 
  Navigation, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Bed, 
  Ambulance, 
  FileText, 
  User, 
  Share2, 
  Heart,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import { api } from '../../services/api';
import { HospitalDetail, Doctor } from '../../types';
import { DoctorCard } from '../../components/common/DoctorCard';
import { MapViewer } from '../../components/common/MapViewer';
import { AppointmentModal } from '../../components/common/AppointmentModal';

export const HospitalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<HospitalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'beds' | 'doctors' | 'insurance' | 'reviews'>('overview');

  // Booking modal
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getHospitalById(id)
        .then(setHospital)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500 font-semibold">Loading verified hospital records...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Hospital Not Found</h2>
        <Link to="/hospitals" className="text-xs text-teal-600 font-bold mt-2 inline-block">
          ← Return to Hospitals Directory
        </Link>
      </div>
    );
  }

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;
    window.open(url, '_blank');
  };

  const bed = hospital.bed_inventory;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Cover and Hero Header */}
      <div className="relative bg-slate-900 text-white">
        <div className="h-64 sm:h-80 w-full overflow-hidden opacity-40">
          <img
            src={hospital.cover_image || hospital.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80'}
            alt={hospital.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {hospital.hospital_type}
                </span>
                {hospital.verified && (
                  <span className="inline-flex items-center space-x-1 bg-teal-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>✓ NABH Verified</span>
                  </span>
                )}
                {hospital.is_emergency_active && (
                  <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    24x7 Emergency Ready
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {hospital.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/10 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span className="font-bold text-white">{hospital.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({hospital.review_count} patient reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick CTAs Header */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={openDirections}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-1.5"
              >
                <Navigation className="w-4 h-4" />
                <span>Directions</span>
              </button>

              <a
                href={`tel:${hospital.emergency_phone || hospital.phone}`}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Emergency: {hospital.emergency_phone || hospital.phone}</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="flex space-x-8 text-xs font-bold uppercase tracking-wider overflow-x-auto">
          {[
            { id: 'overview', label: 'Hospital Overview' },
            { id: 'beds', label: `Live Beds (${bed?.general_avail || 0} Avail)` },
            { id: 'doctors', label: `Doctors & OPD (${hospital.doctors?.length || 0})` },
            { id: 'insurance', label: 'Cashless & PM-JAY' },
            { id: 'reviews', label: 'Patient Reviews' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Tabbed Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* About text */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-base font-extrabold text-slate-900">About {hospital.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {hospital.description}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">OPD Wait Time</span>
                    <span className="font-bold text-slate-800">{hospital.opd_wait_time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Emergency Triage</span>
                    <span className="font-bold text-rose-700">{hospital.emergency_wait_time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Starts</span>
                    <span className="font-bold text-slate-800">₹{hospital.starting_fee}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Treatment Range</span>
                    <span className="font-bold text-slate-800">₹{hospital.est_treatment_min.toLocaleString()}+</span>
                  </div>
                </div>
              </div>

              {/* Facilities Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-base font-extrabold text-slate-900">Medical Facilities & Diagnostic Equipment</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {hospital.facilities?.map((f: any) => (
                    <div key={f.id} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{f.facility_name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-base font-extrabold text-slate-900">Clinical Departments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {hospital.departments?.map((d: any) => (
                    <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{d.name}</h4>
                        {d.emergency_ready && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">24x7</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{d.opd_timings}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Published Clinical Services & Charges */}
              {hospital.services && hospital.services.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-teal-600" />
                        <span>Published Clinical Services & Transparent Tariffs</span>
                      </h3>
                      <p className="text-xs text-slate-500">Hospital-verified service charges in Indore</p>
                    </div>
                    <span className="text-[10px] bg-teal-50 text-teal-700 font-bold border border-teal-200 px-2.5 py-0.5 rounded-full">
                      Verified Pricing
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hospital.services.map((s: any) => (
                      <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold inline-block">
                            {s.category}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-slate-900">₹{s.charge.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 block">Est. Tariff</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: LIVE BED INVENTORY */}
          {activeTab === 'beds' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Live Bed Inventory & Critical Care Units</h3>
                  <p className="text-xs text-slate-500">Hospital-managed status updated via CareConnect ERP</p>
                </div>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono font-semibold">
                  Last updated: Today
                </span>
              </div>

              {bed ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'ICU Beds', avail: bed.icu_avail, total: bed.icu_total, icon: Activity, alert: bed.icu_avail < 3 },
                    { label: 'Ventilator Beds', avail: bed.ventilator_avail, total: bed.ventilator_total, icon: Activity, alert: bed.ventilator_avail < 2 },
                    { label: 'Emergency Trauma', avail: bed.emergency_avail, total: bed.emergency_total, icon: AlertCircle, alert: false },
                    { label: 'NICU (Neonatal)', avail: bed.nicu_avail, total: bed.nicu_total, icon: Heart, alert: false },
                    { label: 'General Ward', avail: bed.general_avail, total: bed.general_total, icon: Bed, alert: false },
                    { label: 'Private Deluxe', avail: bed.private_avail, total: bed.private_total, icon: Bed, alert: false }
                  ].map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                          <span>{b.label}</span>
                          <Icon className={`w-4 h-4 ${b.alert ? 'text-rose-500' : 'text-teal-600'}`} />
                        </div>
                        <div className="my-3">
                          <span className="text-2xl font-black text-slate-900">{b.avail}</span>
                          <span className="text-xs text-slate-400 font-medium"> / {b.total} Total</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${b.alert ? 'bg-rose-500' : 'bg-teal-600'}`}
                            style={{ width: `${Math.round((b.avail / b.total) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Bed counts are being refreshed by the hospital desk.</p>
              )}

              {/* Ambulances */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Ambulance Fleet</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hospital.ambulances?.map((amb) => (
                    <div key={amb.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">{amb.ambulance_type}</p>
                        <p className="font-mono text-[11px] text-slate-500">{amb.vehicle_number}</p>
                      </div>
                      <a
                        href={`tel:${amb.driver_contact}`}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{amb.driver_contact}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOCTORS */}
          {activeTab === 'doctors' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">Affiliated Specialists at {hospital.name}</h3>
                <span className="text-xs text-slate-500">{hospital.doctors?.length || 0} Doctors Available</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hospital.doctors?.map((doc) => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    onBookClick={(d) => {
                      setSelectedDoctor(d);
                      setIsBookingOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INSURANCE & SCHEMES */}
          {activeTab === 'insurance' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">Cashless Insurance & Government Schemes Desk</h3>
                <p className="text-xs text-slate-500">
                  Dedicated TPA desk operates 24x7 for cashless hospitalization pre-authorizations.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Ayushman Bharat (PM-JAY) Empanelled Center</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Eligible golden card holders receive 100% cashless treatment for secondary and tertiary care up to ₹5,00,000. Nodal officer contact desk is located in the Main OPD Ground Floor.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Empanelled Cashless Insurers</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {hospital.accepted_insurances?.map((ins, i) => (
                    <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Verified Patient Experiences</h3>
                  <p className="text-xs text-slate-500">Reviews submitted by patients following verified consultations</p>
                </div>
                <div className="flex items-center space-x-1 bg-amber-50 text-amber-900 px-3 py-1 rounded-xl text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{hospital.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: 'Siddharth Jain (Palasia, Indore)',
                    rating: 5,
                    date: '14 Sep 2026',
                    text: 'Exceptional cardiac care team. The emergency ICU admission was processed within 5 minutes of arrival. Clear billing with cashless approval.'
                  },
                  {
                    name: 'Meenakshi Sharma (Vijay Nagar)',
                    rating: 5,
                    date: '02 Sep 2026',
                    text: 'Very clean OPD and knowledgeable orthopedic doctors. OPD wait time was exactly 20 minutes as shown on CareConnect AI.'
                  }
                ].map((rev, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{rev.name}</p>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Quick Info & Direct Booking Card */}
        <div className="space-y-6">
          
          {/* Quick Booking Action Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 sticky top-24">
            <h3 className="text-base font-extrabold text-slate-900">Book OPD Appointment</h3>
            <p className="text-xs text-slate-500">
              Direct confirmed appointment with OPD doctors at {hospital.name}.
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Fee</span>
                <span className="font-bold text-slate-900">₹{hospital.starting_fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">OPD Wait Time</span>
                <span className="font-bold text-teal-700">{hospital.opd_wait_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pay Option</span>
                <span className="font-bold text-slate-900">Pay at Hospital Desk</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDoctor(hospital.doctors?.[0] || null);
                setIsBookingOpen(true);
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>

            {/* Emergency Call Box */}
            <div className="pt-3 border-t border-slate-100">
              <a
                href={`tel:${hospital.emergency_phone || hospital.phone}`}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Emergency: {hospital.emergency_phone || hospital.phone}</span>
              </a>
            </div>

            {/* Contact details */}
            <div className="pt-2 text-xs text-slate-500 space-y-1.5">
              <p><strong>Phone:</strong> {hospital.phone}</p>
              <p><strong>Email:</strong> {hospital.email || 'care@indorehospital.com'}</p>
              <p><strong>Website:</strong> <a href={hospital.website || '#'} target="_blank" rel="noreferrer" className="text-teal-600 underline">Visit Hospital Portal</a></p>
            </div>
          </div>

        </div>

      </div>

      <AppointmentModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={selectedDoctor}
        hospital={hospital}
      />

    </div>
  );
};
