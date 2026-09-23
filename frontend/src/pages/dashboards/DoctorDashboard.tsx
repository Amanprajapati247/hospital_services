import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  User, 
  Star, 
  MessageSquare,
  Camera,
  Upload,
  Trash2,
  Save,
  X,
  Settings,
  ShieldCheck,
  Sparkles,
  Edit3
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Doctor Profile Form State
  const [docName, setDocName] = useState('');
  const [docSpecialization, setDocSpecialization] = useState('');
  const [docQualification, setDocQualification] = useState('');
  const [docExpYears, setDocExpYears] = useState<number>(10);
  const [docPhotoUrl, setDocPhotoUrl] = useState('');
  const [docAbout, setDocAbout] = useState('');
  const [docLanguages, setDocLanguages] = useState('Hindi, English');
  const [docCouncil, setDocCouncil] = useState('Madhya Pradesh Medical Council');
  const [docRegNo, setDocRegNo] = useState('MPMC-2015-8842');
  const [savingProfile, setSavingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadDoctorData = async () => {
    setLoading(true);
    try {
      const data = await api.getDoctorDashboard();
      setDashboard(data);
      if (data) {
        setDocName(data.name || '');
        setDocSpecialization(data.specialization || '');
        setDocQualification(data.qualification || '');
        setDocExpYears(data.experience_years || 10);
        setDocPhotoUrl(data.photo_url || '');
        setDocAbout(data.about || '');
        setDocLanguages(data.languages || 'Hindi, English');
        setDocCouncil(data.registration_council || 'Madhya Pradesh Medical Council');
        setDocRegNo(data.registration_number || 'MPMC-2015-8842');
      }
    } catch (err) {
      console.error('Failed to load doctor dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  const notify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Please select an image file under 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDocPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateDoctorProfile({
        name: docName,
        qualification: docQualification,
        specialization: docSpecialization,
        experience_years: Number(docExpYears),
        photo_url: docPhotoUrl,
        about: docAbout,
        languages: docLanguages,
        registration_council: docCouncil,
        registration_number: docRegNo
      });
      notify('Doctor profile and picture updated successfully!');
      loadDoctorData();
    } catch (err) {
      alert('Failed to update doctor profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingId) return;
    try {
      await api.completeDoctorAppointment(completingId, clinicalNotes);
      setCompletingId(null);
      setClinicalNotes('');
      notify('Consultation marked as completed with clinical notes saved.');
      loadDoctorData();
    } catch (err) {
      alert('Failed to complete consultation');
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading doctor clinical console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Doctor Profile Picture */}
          <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 shadow-md">
              <img
                src={dashboard?.photo_url || docPhotoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                alt={dashboard?.name || 'Doctor'}
                className="w-full h-full object-cover object-top aspect-square"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1 rounded-full ring-2 ring-white shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold px-3 py-0.5 rounded-full uppercase">
                Doctor Clinical Portal
              </span>
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Practitioner</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {dashboard?.name || user?.full_name}
            </h1>
            <p className="text-xs text-indigo-200">
              {dashboard?.specialization} • {dashboard?.qualification} • {dashboard?.experience_years} Years Clinical Experience
            </p>
          </div>
        </div>

        {/* Action Controls & Metrics */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold rounded-xl flex items-center space-x-2 transition shadow-xs"
          >
            <Camera className="w-4 h-4 text-indigo-200" />
            <span>Update Photo & Profile</span>
          </button>

          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <span className="text-indigo-200 block text-[10px]">Patient Rating</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="font-extrabold text-white text-base">{dashboard?.rating?.toFixed(1) || '4.8'}</span>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <span className="text-indigo-200 block text-[10px]">Total Patients</span>
            <span className="font-extrabold text-white text-base">{dashboard?.total_appointments || 0}</span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'appointments'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Patient Appointments ({dashboard?.recent_appointments?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Doctor Profile & Photo</span>
        </button>
      </div>

      {/* ==================== TAB 1: APPOINTMENTS & AFFILIATIONS ==================== */}
      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Appointments Scheduled */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Upcoming Patient Consultations</span>
              </h3>
              <span className="text-xs text-slate-500">{dashboard?.recent_appointments?.length || 0} Scheduled</span>
            </div>

            <div className="space-y-3">
              {dashboard?.recent_appointments?.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No upcoming appointments scheduled today.
                </div>
              ) : (
                dashboard?.recent_appointments?.map((app: any) => (
                  <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{app.patient_name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                            For: {app.family_member_name || 'Self'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                            app.status === 'Completed' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {app.hospital_name} • {app.date} at {app.time}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900">₹{app.fee}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{app.appointment_number}</span>
                      </div>
                    </div>

                    {app.patient_notes && (
                      <p className="text-slate-600 text-[11px] italic bg-white p-2 rounded-lg border border-slate-100">
                        Patient Note: "{app.patient_notes}"
                      </p>
                    )}

                    {app.doctor_notes && (
                      <p className="text-teal-800 text-[11px] bg-teal-50/60 p-2 rounded-lg border border-teal-100">
                        Doctor Advice: {app.doctor_notes}
                      </p>
                    )}

                    {app.status === 'Confirmed' && (
                      <div className="pt-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => setCompletingId(app.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition shadow-xs"
                        >
                          Complete & Add Notes
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right 1 Col: Hospital Affiliations */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Affiliated Hospitals</span>
              </h3>
              <p className="text-xs text-slate-500">
                Your registered OPD consultation centers in Indore:
              </p>

              <div className="space-y-2">
                {dashboard?.affiliations?.map((aff: any) => (
                  <div key={aff.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{aff.hospital_name}</strong>
                      <span className="font-extrabold text-slate-900">₹{aff.consultation_fee}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Dept: {aff.department}</p>
                    <p className="text-indigo-700 font-medium text-[10px]">{aff.days_of_week} ({aff.opd_timings})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================== TAB 2: DOCTOR PROFILE & PHOTO SETTINGS ==================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-indigo-600" />
              <span>Doctor Profile & Photo Settings</span>
            </h2>
            <p className="text-xs text-slate-500">
              Update your clinical profile photo, specialization, qualifications, medical council registration, and patient bio.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Profile Photo Editor Box */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-indigo-600" />
                    <span>Doctor Profile Picture</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your photo appears on doctor cards, OPD booking slots, and search results across CareConnect.
                  </p>
                </div>
                {docPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setDocPhotoUrl('')}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 self-start sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                {/* Square Live Preview */}
                <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-200 border-2 border-indigo-200 shadow-md">
                  <img
                    src={docPhotoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                    alt="Doctor Preview"
                    className="w-full h-full object-cover object-top aspect-square"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1 rounded-full ring-2 ring-white shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>

                {/* Upload & Preset Options */}
                <div className="flex-1 w-full space-y-3 text-xs">
                  {/* File Upload Button */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Upload Picture from Device:
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-3 py-2 rounded-xl flex items-center space-x-2 shadow-xs transition">
                        <Upload className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Choose Local Photo...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">JPG, PNG, WebP up to 3MB</span>
                    </div>
                  </div>

                  {/* Photo URL Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Or Direct Image Web URL:
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or profile image link"
                        value={docPhotoUrl}
                        onChange={(e) => setDocPhotoUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono pr-8"
                      />
                      {docPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setDocPhotoUrl('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Avatar Presets */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Or Choose Professional Doctor Avatar:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '👨‍⚕️ Male Physician', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
                        { label: '👩‍⚕️ Female Specialist', url: 'https://images.unsplash.com/photo-1594824813576-696232537021?auto=format&fit=crop&w=400&q=80' },
                        { label: '👨‍⚕️ Senior Consultant', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80' },
                        { label: '👩‍⚕️ Senior Surgeon', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80' },
                      ].map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setDocPhotoUrl(p.url)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                            docPhotoUrl === p.url
                              ? 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Specialization *</label>
                <input
                  type="text"
                  required
                  value={docSpecialization}
                  onChange={(e) => setDocSpecialization(e.target.value)}
                  placeholder="e.g. Cardiologist, Neurologist"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-teal-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Qualifications & Degrees *</label>
                <input
                  type="text"
                  required
                  value={docQualification}
                  onChange={(e) => setDocQualification(e.target.value)}
                  placeholder="e.g. MBBS, MD (Medicine), DM (Cardiology)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Years of Clinical Experience *</label>
                <input
                  type="number"
                  required
                  value={docExpYears}
                  onChange={(e) => setDocExpYears(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State Medical Council</label>
                <input
                  type="text"
                  value={docCouncil}
                  onChange={(e) => setDocCouncil(e.target.value)}
                  placeholder="Madhya Pradesh Medical Council"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Registration Number</label>
                <input
                  type="text"
                  value={docRegNo}
                  onChange={(e) => setDocRegNo(e.target.value)}
                  placeholder="e.g. MPMC-2015-8842"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Languages Spoken</label>
                <input
                  type="text"
                  value={docLanguages}
                  onChange={(e) => setDocLanguages(e.target.value)}
                  placeholder="Hindi, English, Marathi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">About Doctor & Clinical Expertise</label>
                <textarea
                  rows={4}
                  value={docAbout}
                  onChange={(e) => setDocAbout(e.target.value)}
                  placeholder="Describe your medical journey, key procedures, patient philosophy, and specialties..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Saving Profile...' : 'Save Profile & Photo Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complete Modal */}
      {completingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Complete Consultation</h3>
            <form onSubmit={handleComplete} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Notes & Follow-up Advice</label>
                <textarea
                  rows={4}
                  required
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="e.g. ECG normal, BP 120/80. Prescribed routine preventative therapy. Follow up in 3 months..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingId(null)}
                  className="w-full bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl"
                >
                  Save & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
