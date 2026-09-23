import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Stethoscope, 
  IndianRupee, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  BedDouble
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const JoinHospitalPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  // Admin Account
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Hospital Profile
  const [hospitalName, setHospitalName] = useState('');
  const [city, setCity] = useState('Indore');
  const [area, setArea] = useState('Vijay Nagar');
  const [address, setAddress] = useState('');
  const [hospitalPhone, setHospitalPhone] = useState('+91 731-');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 731-');
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [hospitalType, setHospitalType] = useState('Private Super Speciality');
  const [description, setDescription] = useState('');
  const [startingFee, setStartingFee] = useState(600);
  const [estMin, setEstMin] = useState(15000);
  const [estMax, setEstMax] = useState(150000);

  // Initial Services list
  const [services, setServices] = useState([
    { name: 'General OPD Consultation', category: 'OPD Consultation', charge: 600, description: 'Comprehensive clinical evaluation' },
    { name: 'Specialist OPD (Cardiology / Neuro)', category: 'OPD Consultation', charge: 900, description: 'Super-specialist diagnosis' },
    { name: 'Emergency Casualty & Triage (24x7)', category: 'Emergency Care', charge: 1200, description: '24x7 emergency resuscitation and assessment' },
    { name: 'ICU Bed with Multipara Monitor (Per Day)', category: 'Bed & Ward', charge: 7500, description: 'Intensive Cardiac & Critical Care Unit' },
    { name: 'Digital Chest X-Ray (PA View)', category: 'Diagnostics', charge: 650, description: 'Immediate high-res radiograph' },
  ]);

  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Diagnostics');
  const [newServiceCharge, setNewServiceCharge] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServiceCharge) return;
    setServices([
      ...services,
      {
        name: newServiceName.trim(),
        category: newServiceCategory,
        charge: Number(newServiceCharge),
        description: 'Hospital listed clinical service'
      }
    ]);
    setNewServiceName('');
    setNewServiceCharge('');
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChargeChange = (index: number, val: number) => {
    const updated = [...services];
    updated[index].charge = val;
    setServices(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        admin_name: adminName,
        admin_email: adminEmail,
        admin_phone: adminPhone,
        admin_password: adminPassword,
        hospital_name: hospitalName,
        city,
        area,
        address,
        phone: hospitalPhone,
        emergency_phone: emergencyPhone,
        email: hospitalEmail || adminEmail,
        website: website || undefined,
        hospital_type: hospitalType,
        starting_fee: Number(startingFee),
        est_treatment_min: Number(estMin),
        est_treatment_max: Number(estMax),
        description: description || undefined,
        initial_services: services.map(s => ({
          name: s.name,
          category: s.category,
          charge: Number(s.charge),
          description: s.description,
          is_available: true
        }))
      };

      const res = await api.registerHospital(payload);
      localStorage.setItem('careconnect_token', res.access_token);
      await refreshUser();
      navigate('/hospital/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register hospital. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital Onboarding Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Empanel Your Hospital on <span className="text-teal-400">CareConnect AI</span>
          </h1>
          <p className="text-sm text-slate-300">
            Publish your hospital profile, manage live ICU/General bed availability, set customized clinical service charges, and streamline outpatient and emergency patient admissions.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Real-Time Bed ERP
            </span>
            <span className="flex items-center gap-1.5 text-teal-300">
              <CheckCircle2 className="w-4 h-4" /> Transparent Service Charges
            </span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <CheckCircle2 className="w-4 h-4" /> Instant Doctor Roster Sync
            </span>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-300">Already have an active hospital profile on CareConnect AI?</span>
            <Link to="/hospital/login" className="font-extrabold text-amber-300 hover:text-white underline">
              Sign In to Hospital ERP Portal →
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-400 text-rose-800 text-xs font-bold rounded-2xl">
          {error}
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Administrator Account */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Hospital Administrator Account</h2>
              <p className="text-xs text-slate-500">This account will have administrative ERP access to update beds, services, and view appointments.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Administrator Full Name *</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Mittal / Admin Desk"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Email (Login ID) *</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@hospital.org"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Mobile / Contact *</label>
              <input
                type="text"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="+91 98260 XXXXX"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hospital Profile Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Hospital Profile & Contact Info</h2>
              <p className="text-xs text-slate-500">Public information displayed to patients searching for care in Indore.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Hospital Official Name *</label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. LifeCare Super Speciality Hospital & Trauma Center"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hospital Type</label>
              <select
                value={hospitalType}
                onChange={(e) => setHospitalType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-semibold"
              >
                <option value="Private Super Speciality">Private Super Speciality</option>
                <option value="Private Multi-Speciality">Private Multi-Speciality</option>
                <option value="Trust / Charitable Super Speciality">Trust / Charitable Hospital</option>
                <option value="Children & Maternity Hospital">Children & Maternity Hospital</option>
                <option value="Specialist Eye / Dental Hospital">Specialist Eye / Dental Hospital</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City & Area Location *</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City (e.g. Indore)"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Area (e.g. Vijay Nagar)"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot No., Scheme, Landmark, Indore, MP 452010"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reception / OPD Desk Phone *</label>
              <input
                type="text"
                required
                value={hospitalPhone}
                onChange={(e) => setHospitalPhone(e.target.value)}
                placeholder="+91 731-255-XXXX"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency 24x7 Hotline *</label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 731-255-9999"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-mono text-rose-700 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Website (Optional)</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.yourhospital.org"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hospital Contact Email</label>
              <input
                type="email"
                value={hospitalEmail}
                onChange={(e) => setHospitalEmail(e.target.value)}
                placeholder="info@hospital.org"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Hospital Overview & Specialties</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key clinical departments, NABH accreditation, advanced surgical capabilities, emergency care..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Service Charges & Pricing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Hospital Services & Service Charges (₹)</h2>
              <p className="text-xs text-slate-500">Define your consultation and procedural charges. You can modify these anytime from your Hospital ERP.</p>
            </div>
          </div>

          {/* Base pricing overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <label className="block font-bold text-slate-600">Starting OPD Fee (₹)</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  value={startingFee}
                  onChange={(e) => setStartingFee(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <label className="block font-bold text-slate-600">Est. Treatment Min (₹)</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={estMin}
                  onChange={(e) => setEstMin(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <label className="block font-bold text-slate-600">Est. Treatment Max (₹)</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  value={estMax}
                  onChange={(e) => setEstMax(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Active Services List with Inline Charge Editing */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Default Clinical Services & Custom Charges
            </span>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {services.map((svc, idx) => (
                <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{svc.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                        {svc.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{svc.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1">
                      <span className="text-xs font-bold text-slate-500 mr-1">₹</span>
                      <input
                        type="number"
                        value={svc.charge}
                        onChange={(e) => handleServiceChargeChange(idx, Number(e.target.value))}
                        className="w-24 text-xs font-extrabold text-slate-900 bg-transparent focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Remove service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom service row */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-600" />
              <span>Add Custom Hospital Service</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <input
                type="text"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="Service name (e.g. 2D Echo / MRI)"
                className="sm:col-span-2 px-3 py-2 bg-white border border-slate-300 rounded-xl"
              />
              <select
                value={newServiceCategory}
                onChange={(e) => setNewServiceCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl font-semibold"
              >
                <option value="OPD Consultation">OPD Consultation</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Emergency Care">Emergency Care</option>
                <option value="Bed & Ward">Bed & Ward</option>
                <option value="Procedure">Procedure / Surgery</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newServiceCharge}
                  onChange={(e) => setNewServiceCharge(e.target.value)}
                  placeholder="Charge ₹"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                />
                <button
                  type="button"
                  onClick={handleAddCustomService}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-xl font-bold shrink-0 text-xs"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">
            By joining CareConnect AI, you agree to maintain authentic bed status and transparent pricing under Indore healthcare network guidelines.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-teal-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <span>Registering Hospital ERP...</span>
            ) : (
              <>
                <span>Complete Onboarding & Launch ERP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
