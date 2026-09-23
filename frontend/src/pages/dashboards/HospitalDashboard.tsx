import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Bed, 
  Activity, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Save, 
  Plus, 
  Check, 
  X,
  Phone,
  AlertCircle,
  IndianRupee,
  Edit3,
  Trash2,
  FileText,
  User,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  Search,
  Settings,
  Sparkles,
  Camera,
  Upload,
  ImageIcon,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const HospitalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'beds' | 'services' | 'appointments' | 'profile' | 'doctors'>('beds');

  const [dashboard, setDashboard] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Bed form state
  const [generalAvail, setGeneralAvail] = useState(48);
  const [privateAvail, setPrivateAvail] = useState(18);
  const [icuAvail, setIcuAvail] = useState(8);
  const [nicuAvail, setNicuAvail] = useState(5);
  const [emergencyAvail, setEmergencyAvail] = useState(9);
  const [ventilatorAvail, setVentilatorAvail] = useState(7);
  const [savingBeds, setSavingBeds] = useState(false);

  // Wait times state
  const [opdWait, setOpdWait] = useState('15-20 mins');
  const [emergencyWait, setEmergencyWait] = useState('Immediate (< 3 mins)');
  const [savingWait, setSavingWait] = useState(false);

  // Services state
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedServiceCat, setSelectedServiceCat] = useState('All');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcCategory, setNewSvcCategory] = useState('OPD Consultation');
  const [newSvcCharge, setNewSvcCharge] = useState('');
  const [newSvcDesc, setNewSvcDesc] = useState('');
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editChargeVal, setEditChargeVal] = useState<number>(0);

  // Profile Form state
  const [profName, setProfName] = useState('');
  const [profDesc, setProfDesc] = useState('');
  const [profAddress, setProfAddress] = useState('');
  const [profArea, setProfArea] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profEmergencyPhone, setProfEmergencyPhone] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profWebsite, setProfWebsite] = useState('');
  const [profStartingFee, setProfStartingFee] = useState(500);
  const [profEstMin, setProfEstMin] = useState(15000);
  const [profEstMax, setProfEstMax] = useState(150000);
  const [profEmergencyActive, setProfEmergencyActive] = useState(true);
  const [profCover, setProfCover] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Appointment management modal / Walk-in state
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppPatientName, setNewAppPatientName] = useState('');
  const [newAppPatientPhone, setNewAppPatientPhone] = useState('+91 ');
  const [newAppDoctorId, setNewAppDoctorId] = useState<string>('');
  const [newAppDept, setNewAppDept] = useState('General Medicine');
  const [newAppDate, setNewAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAppTime, setNewAppTime] = useState('11:00 AM');
  const [newAppFee, setNewAppFee] = useState('700');
  const [newAppNotes, setNewAppNotes] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  // Add doctor modal
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('Cardiology');
  const [docQual, setDocQual] = useState('MBBS, MD');
  const [docExp, setDocExp] = useState('10');
  const [docDept, setDocDept] = useState('Cardiology');
  const [docFee, setDocFee] = useState('800');
  const [docDays, setDocDays] = useState('Mon, Tue, Wed, Thu, Fri');
  const [docTime, setDocTime] = useState('10:00 AM - 02:00 PM');
  const [docPhoto, setDocPhoto] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Please select an image file under 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const notify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const loadHospitalData = async () => {
    setLoading(true);
    try {
      const [dash, prof, apps, docs, svcs] = await Promise.all([
        api.getHospitalAdminDashboard(),
        api.getHospitalProfile(),
        api.getHospitalAppointments(),
        api.getHospitalDoctors(),
        api.getHospitalServices()
      ]);
      setDashboard(dash);
      setProfile(prof);
      setAppointments(apps);
      setDoctors(docs);
      setServices(svcs);

      if (dash.bed_inventory) {
        setGeneralAvail(dash.bed_inventory.general_avail);
        setPrivateAvail(dash.bed_inventory.private_avail);
        setIcuAvail(dash.bed_inventory.icu_avail);
        setNicuAvail(dash.bed_inventory.nicu_avail);
        setEmergencyAvail(dash.bed_inventory.emergency_avail);
        setVentilatorAvail(dash.bed_inventory.ventilator_avail);
      }
      if (dash.opd_wait_time) setOpdWait(dash.opd_wait_time);
      if (dash.emergency_wait_time) setEmergencyWait(dash.emergency_wait_time);

      if (prof) {
        setProfName(prof.name || '');
        setProfDesc(prof.description || '');
        setProfAddress(prof.address || '');
        setProfArea(prof.area || '');
        setProfPhone(prof.phone || '');
        setProfEmergencyPhone(prof.emergency_phone || '');
        setProfEmail(prof.email || '');
        setProfWebsite(prof.website || '');
        setProfStartingFee(prof.starting_fee || 500);
        setProfEstMin(prof.est_treatment_min || 15000);
        setProfEstMax(prof.est_treatment_max || 150000);
        setProfEmergencyActive(prof.is_emergency_active ?? true);
        setProfCover(prof.cover_image || prof.image_url || '');
      }
    } catch (err) {
      console.error('Failed to load hospital dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitalData();
  }, []);

  // --- Bed Handlers ---
  const handleSaveBeds = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBeds(true);
    try {
      await api.updateBeds({
        general_avail: Number(generalAvail),
        private_avail: Number(privateAvail),
        icu_avail: Number(icuAvail),
        nicu_avail: Number(nicuAvail),
        emergency_avail: Number(emergencyAvail),
        ventilator_avail: Number(ventilatorAvail)
      });
      notify('Live bed inventory successfully updated and synchronized with marketplace!');
      loadHospitalData();
    } catch (err) {
      alert('Failed to update bed inventory');
    } finally {
      setSavingBeds(false);
    }
  };

  const handleSaveWaitTimes = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWait(true);
    try {
      await api.updateWaitTimes(opdWait, emergencyWait);
      notify('Hospital OPD and Emergency wait times updated!');
      loadHospitalData();
    } catch (err) {
      alert('Failed to update wait times');
    } finally {
      setSavingWait(false);
    }
  };

  // --- Service Handlers ---
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcName.trim() || !newSvcCharge) return;
    try {
      await api.addHospitalService({
        name: newSvcName.trim(),
        category: newSvcCategory,
        charge: Number(newSvcCharge),
        description: newSvcDesc.trim() || undefined
      });
      setShowAddServiceModal(false);
      setNewSvcName('');
      setNewSvcCharge('');
      setNewSvcDesc('');
      notify(`Service "${newSvcName}" successfully added with charge ₹${newSvcCharge}!`);
      loadHospitalData();
    } catch (err) {
      alert('Failed to add service');
    }
  };

  const handleSaveServiceCharge = async (serviceId: number) => {
    try {
      await api.updateHospitalService(serviceId, { charge: Number(editChargeVal) });
      setEditingServiceId(null);
      notify('Service charge updated successfully!');
      loadHospitalData();
    } catch (err) {
      alert('Failed to update service charge');
    }
  };

  const handleDeleteService = async (serviceId: number, svcName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${svcName}"?`)) return;
    try {
      await api.deleteHospitalService(serviceId);
      notify(`Service "${svcName}" removed.`);
      loadHospitalData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  // --- Appointment Handlers ---
  const handleUpdateAppStatus = async (appId: number, newStatus: string) => {
    try {
      await api.updateHospitalAppointmentStatus(appId, newStatus);
      notify(`Appointment status changed to ${newStatus}.`);
      loadHospitalData();
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  const handleCreateWalkInAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createHospitalAppointment({
        patient_name: newAppPatientName,
        patient_phone: newAppPatientPhone,
        doctor_id: newAppDoctorId ? Number(newAppDoctorId) : (doctors[0]?.doctor_id || undefined),
        department: newAppDept,
        appointment_date: newAppDate,
        appointment_time: newAppTime,
        consultation_fee: Number(newAppFee),
        payment_status: 'Paid at Counter',
        notes: newAppNotes || undefined
      });
      setShowAddAppModal(false);
      setNewAppPatientName('');
      setNewAppPatientPhone('+91 ');
      setNewAppNotes('');
      notify('Walk-in appointment booked and confirmed at reception!');
      loadHospitalData();
    } catch (err) {
      alert('Failed to create appointment');
    }
  };

  // --- Profile Handler ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.updateHospitalProfile({
        name: profName,
        description: profDesc,
        address: profAddress,
        area: profArea,
        phone: profPhone,
        emergency_phone: profEmergencyPhone,
        email: profEmail,
        website: profWebsite,
        starting_fee: Number(profStartingFee),
        est_treatment_min: Number(profEstMin),
        est_treatment_max: Number(profEstMax),
        is_emergency_active: profEmergencyActive,
        opd_wait_time: opdWait,
        emergency_wait_time: emergencyWait,
        cover_image: profCover,
        image_url: profCover
      });
      notify('Hospital profile and pricing changes saved successfully!');
      loadHospitalData();
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Doctor Affiliation Handler ---
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addHospitalDoctor({
        doctor_name: docName,
        specialization: docSpec,
        qualification: docQual,
        experience_years: parseInt(docExp) || 5,
        department: docDept,
        consultation_fee: parseInt(docFee) || 700,
        days_of_week: docDays,
        opd_timings: docTime,
        photo_url: docPhoto || undefined
      });
      setShowAddDoctor(false);
      setDocName('');
      setDocPhoto('');
      notify(`Doctor ${docName} successfully affiliated with hospital.`);
      loadHospitalData();
    } catch (err) {
      alert('Failed to add doctor');
    }
  };

  if (loading && !dashboard) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Accessing hospital administration ERP portal...</p>
      </div>
    );
  }

  // Filtered Services
  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || 
                          (s.category && s.category.toLowerCase().includes(serviceSearch.toLowerCase()));
    const matchesCat = selectedServiceCat === 'All' || s.category === selectedServiceCat;
    return matchesSearch && matchesCat;
  });

  // Filtered Appointments
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.patient_name.toLowerCase().includes(appSearch.toLowerCase()) ||
                          (a.appointment_number && a.appointment_number.toLowerCase().includes(appSearch.toLowerCase())) ||
                          (a.doctor_name && a.doctor_name.toLowerCase().includes(appSearch.toLowerCase()));
    const matchesStatus = appStatusFilter === 'All' || a.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const categories = ['All', 'OPD Consultation', 'Diagnostics', 'Emergency Care', 'Bed & Ward', 'Procedure'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-20">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 shadow-md">
            <img
              src={profCover || profile?.cover_image || profile?.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80'}
              alt="Hospital Cover"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold px-3 py-0.5 rounded-full uppercase">
                Hospital ERP Console
              </span>
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>✓ Verified Profile</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {profile?.name || dashboard?.hospital_name || 'Hospital Administration'}
            </h1>
            <p className="text-xs text-amber-100 flex flex-wrap gap-2 items-center">
              <span>{profile?.area || dashboard?.area}, {profile?.city || 'Indore'}</span>
              <span>•</span>
              <span>Reg No: <strong className="font-mono text-amber-200">{profile?.registration_no || dashboard?.registration_no}</strong></span>
              <span>•</span>
              <span className="text-teal-300 font-bold">{services.length} Listed Services</span>
            </p>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="flex items-center gap-3 text-xs shrink-0">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
            <span className="text-amber-200 block text-[10px] uppercase font-bold">Today's OPD</span>
            <span className="font-extrabold text-white text-xl">{dashboard?.today_appointments || 0}</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
            <span className="text-teal-200 block text-[10px] uppercase font-bold">Total Appointments</span>
            <span className="font-extrabold text-white text-xl">{appointments.length || dashboard?.total_appointments || 0}</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">ICU Beds Avail</span>
            <span className="font-extrabold text-white text-xl">{icuAvail}</span>
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

      {/* ERP Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('beds')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'beds'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Bed Inventory & ER</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'services'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Services & Charges ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'appointments'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Appointments & Queue ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'profile'
              ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Hospital Profile & Pricing</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'doctors'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Doctor Roster ({doctors.length})</span>
        </button>
      </div>

      {/* ==================== TAB 1: BED INVENTORY & EMERGENCY ==================== */}
      {activeTab === 'beds' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-teal-600" />
                  <span>Live Bed Inventory ERP</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Update available beds in real time. Changes immediately reflect on the CareConnect discovery portal.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0 font-bold">
                ● Live Sync Active
              </span>
            </div>

            <form onSubmit={handleSaveBeds} className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">ICU Beds Avail</label>
                  <input
                    type="number"
                    value={icuAvail}
                    onChange={(e) => setIcuAvail(Number(e.target.value))}
                    className="w-full text-xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400">Total capacity: {dashboard?.bed_inventory?.icu_total || 45}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Ventilator Beds</label>
                  <input
                    type="number"
                    value={ventilatorAvail}
                    onChange={(e) => setVentilatorAvail(Number(e.target.value))}
                    className="w-full text-xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400">Total capacity: {dashboard?.bed_inventory?.ventilator_total || 25}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Emergency / Triage</label>
                  <input
                    type="number"
                    value={emergencyAvail}
                    onChange={(e) => setEmergencyAvail(Number(e.target.value))}
                    className="w-full text-xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400">Total capacity: {dashboard?.bed_inventory?.emergency_total || 30}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">General Ward Beds</label>
                  <input
                    type="number"
                    value={generalAvail}
                    onChange={(e) => setGeneralAvail(Number(e.target.value))}
                    className="w-full text-xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400">Total capacity: {dashboard?.bed_inventory?.general_total || 250}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">Private Rooms</label>
                  <input
                    type="number"
                    value={privateAvail}
                    onChange={(e) => setPrivateAvail(Number(e.target.value))}
                    className="w-full text-xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400">Total capacity: {dashboard?.bed_inventory?.private_total || 80}</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <label className="block text-[11px] font-bold uppercase text-slate-600">NICU Incubators</label>
                  <input
                    type="number"
                    value={nicuAvail}
                    onChange={(e) => setNicuAvail(Number(e.target.value))}
                    className="w-full text-xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-[10px] text-slate-400">Total capacity: {dashboard?.bed_inventory?.nicu_total || 20}</span>
                </div>

              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Last updated: {dashboard?.bed_inventory?.last_updated ? new Date(dashboard.bed_inventory.last_updated).toLocaleTimeString() : 'Just now'} by {dashboard?.bed_inventory?.updated_by || 'Hospital Admin'}
                </span>
                <button
                  type="submit"
                  disabled={savingBeds}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingBeds ? 'Updating...' : 'Publish Bed Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Wait Times & Ambulances */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Live Wait Times</span>
              </h2>
              <form onSubmit={handleSaveWaitTimes} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OPD Consultation Queue</label>
                  <input
                    type="text"
                    value={opdWait}
                    onChange={(e) => setOpdWait(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Trauma Wait</label>
                  <input
                    type="text"
                    value={emergencyWait}
                    onChange={(e) => setEmergencyWait(e.target.value)}
                    className="w-full text-xs font-semibold text-rose-700 font-mono bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingWait}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  {savingWait ? 'Saving...' : 'Update Wait Times'}
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-6 border border-teal-200/70 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>ERP Quick Shortcuts</span>
              </h3>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setActiveTab('services')}
                  className="w-full text-left p-3 rounded-xl bg-white border border-teal-200/80 hover:border-teal-500 font-semibold text-slate-800 flex items-center justify-between transition shadow-2xs"
                >
                  <span>🏷️ Manage Service Charges</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => { setActiveTab('appointments'); setShowAddAppModal(true); }}
                  className="w-full text-left p-3 rounded-xl bg-white border border-teal-200/80 hover:border-teal-500 font-semibold text-slate-800 flex items-center justify-between transition shadow-2xs"
                >
                  <span>➕ Book Walk-In Patient</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full text-left p-3 rounded-xl bg-white border border-teal-200/80 hover:border-teal-500 font-semibold text-slate-800 flex items-center justify-between transition shadow-2xs"
                >
                  <span>✏️ Edit Hospital Profile & Contact</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: SERVICES & SERVICE CHARGES ==================== */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            {/* Header with Search & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-teal-600" />
                  <span>Hospital Clinical Services & Tariffs</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manage outpatient, diagnostic, emergency, and surgical tariffs. Changes reflect immediately to patients on the discovery portal.
                </p>
              </div>

              <button
                onClick={() => setShowAddServiceModal(true)}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Hospital Service</span>
              </button>
            </div>

            {/* Filter Chips & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedServiceCat(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      selectedServiceCat === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search service name..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Services Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Service Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Current Charge (₹)</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.map((svc) => (
                    <tr key={svc.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        {svc.name}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700">
                          {svc.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {editingServiceId === svc.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-500">₹</span>
                            <input
                              type="number"
                              value={editChargeVal}
                              onChange={(e) => setEditChargeVal(Number(e.target.value))}
                              className="w-24 px-2 py-1 bg-white border border-teal-500 rounded-lg text-xs font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveServiceCharge(svc.id)}
                              className="p-1 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingServiceId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900">
                              ₹{svc.charge.toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => { setEditingServiceId(svc.id); setEditChargeVal(svc.charge); }}
                              className="text-slate-400 hover:text-teal-600 transition"
                              title="Edit charge"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">
                        {svc.description || 'Standard hospital tariff'}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteService(svc.id, svc.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                          title="Remove service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredServices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-semibold">
                        No clinical services found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ==================== TAB 3: APPOINTMENTS & PATIENT QUEUE ==================== */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>Hospital Appointments & Patient Queue</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manage confirmed patient consultations, mark attendance, and record receptionist / doctor notes.
                </p>
              </div>

              <button
                onClick={() => setShowAddAppModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Book Walk-In / Counter Appointment</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      appStatusFilter === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search patient, doc, or booking #..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments.map((app) => (
                <div key={app.id} className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition bg-white shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 block uppercase">
                        #{app.appointment_number}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {app.patient_name}
                      </h3>
                      {app.patient_phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" /> {app.patient_phone}
                        </p>
                      )}
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      app.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-100 text-indigo-800 animate-pulse'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Consulting Doctor</span>
                      <span className="font-bold text-slate-800">{app.doctor_name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Department</span>
                      <span className="font-bold text-slate-800">{app.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Slot Date & Time</span>
                      <span className="font-bold text-slate-800">{app.date} • {app.time}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Consultation Fee</span>
                      <span className="font-extrabold text-teal-700">₹{app.fee} ({app.payment_status})</span>
                    </div>
                  </div>

                  {app.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                      <strong>Patient Note:</strong> "{app.notes}"
                    </p>
                  )}

                  {/* Status Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] font-bold text-slate-500">Update Status:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'Confirmed')}
                        className={`px-2 py-1 rounded-lg font-bold text-[11px] ${
                          app.status === 'Confirmed' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Confirmed
                      </button>
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'Completed')}
                        className={`px-2 py-1 rounded-lg font-bold text-[11px] ${
                          app.status === 'Completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'Cancelled')}
                        className={`px-2 py-1 rounded-lg font-bold text-[11px] ${
                          app.status === 'Cancelled' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                </div>
              ))}

              {filteredAppointments.length === 0 && (
                <div className="col-span-2 p-10 text-center text-slate-400 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No appointments found for the selected filter.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================== TAB 4: HOSPITAL PROFILE & PRICING ==================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-slate-800" />
              <span>Hospital Profile & Base Tariff Settings</span>
            </h2>
            <p className="text-xs text-slate-500">
              Update institutional contact info, emergency helpline numbers, and public base consultation charges.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Hospital Cover Picture & Campus Visuals */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-amber-50/40 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Hospital Cover Picture & Exterior Visuals</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Displayed prominently on hospital search results, doctor affiliations, and public hospital profile page.
                  </p>
                </div>
                {profCover && (
                  <button
                    type="button"
                    onClick={() => setProfCover('')}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 self-start sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Picture</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Live Preview Container */}
                <div className="relative shrink-0 w-full md:w-64 h-36 rounded-2xl overflow-hidden bg-slate-200 border-2 border-slate-300/80 shadow-xs group">
                  <img
                    src={profCover || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80'}
                    alt="Hospital Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Live Marketplace Preview</span>
                    </span>
                  </div>
                </div>

                {/* Upload & Preset Controls */}
                <div className="flex-1 w-full space-y-3 text-xs">
                  {/* Option 1: File Upload */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Upload Hospital Image from Computer / Phone:
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold px-3 py-2 rounded-xl flex items-center space-x-2 shadow-xs transition">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Choose Local File...</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setProfCover)}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">JPG, PNG, WebP up to 3MB</span>
                    </div>
                  </div>

                  {/* Option 2: Image URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Or Paste Image Web URL:
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or hospital CDN URL"
                        value={profCover}
                        onChange={(e) => setProfCover(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono pr-8"
                      />
                      {profCover && (
                        <button
                          type="button"
                          onClick={() => setProfCover('')}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Option 3: Quick Architectural Presets */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Or Select Curated Hospital Preset:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '🏛️ Modern Campus', url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80' },
                        { label: '🏢 Glass Medical Tower', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80' },
                        { label: '🚑 Emergency Wing', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80' },
                        { label: '🏥 Clinical Pavilion', url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1000&q=80' },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProfCover(preset.url)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
                            profCover === preset.url
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Hospital Official Name</label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Hospital Overview & Bio</label>
                <textarea
                  rows={3}
                  value={profDesc}
                  onChange={(e) => setProfDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={profAddress}
                  onChange={(e) => setProfAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Area / Locality</label>
                <input
                  type="text"
                  value={profArea}
                  onChange={(e) => setProfArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reception Desk Phone</label>
                <input
                  type="text"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Emergency 24x7 Hotline</label>
                <input
                  type="text"
                  value={profEmergencyPhone}
                  onChange={(e) => setProfEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-rose-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Website</label>
                <input
                  type="url"
                  value={profWebsite}
                  onChange={(e) => setProfWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Pricing row */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 sm:col-span-2 space-y-3">
                <span className="font-extrabold text-slate-900 block text-xs uppercase tracking-wider">
                  Base Consultation & Inpatient Treatment Charges
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Starting OPD Fee (₹)</label>
                    <input
                      type="number"
                      value={profStartingFee}
                      onChange={(e) => setProfStartingFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Est. Treatment Min (₹)</label>
                    <input
                      type="number"
                      value={profEstMin}
                      onChange={(e) => setProfEstMin(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Est. Treatment Max (₹)</label>
                    <input
                      type="number"
                      value={profEstMax}
                      onChange={(e) => setProfEstMax(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="emergencyActive"
                  checked={profEmergencyActive}
                  onChange={(e) => setProfEmergencyActive(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="emergencyActive" className="font-bold text-slate-800">
                  24x7 Emergency Trauma Unit Active & Accepting Ambulances
                </label>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Saving Profile...' : 'Save Profile & Pricing Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== TAB 5: DOCTOR ROSTER ==================== */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Hospital Doctor Roster & Timings</span>
              </h2>
              <p className="text-xs text-slate-500">
                Manage medical practitioners, consultation charges, and OPD schedule timings.
              </p>
            </div>

            <button
              onClick={() => setShowAddDoctor(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Affiliate New Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition bg-white space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">OPD Fee:</span>
                    <span className="font-bold text-slate-900">₹{doc.consultation_fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Days:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[150px]">{doc.days_of_week}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timings:</span>
                    <span className="font-semibold text-slate-800">{doc.opd_timings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD SERVICE ==================== */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-teal-600" />
                <span>Add New Hospital Service</span>
              </h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={newSvcName}
                  onChange={(e) => setNewSvcName(e.target.value)}
                  placeholder="e.g. 2D Echocardiography / MRI Brain"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newSvcCategory}
                    onChange={(e) => setNewSvcCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="OPD Consultation">OPD Consultation</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Emergency Care">Emergency Care</option>
                    <option value="Bed & Ward">Bed & Ward</option>
                    <option value="Procedure">Procedure / Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Charge (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newSvcCharge}
                    onChange={(e) => setNewSvcCharge(e.target.value)}
                    placeholder="e.g. 2400"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={newSvcDesc}
                  onChange={(e) => setNewSvcDesc(e.target.value)}
                  placeholder="Clinical details, duration, instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: BOOK WALK-IN APPOINTMENT ==================== */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Book Reception / Walk-In Appointment</span>
              </h3>
              <button onClick={() => setShowAddAppModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkInAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAppPatientName}
                  onChange={(e) => setNewAppPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={newAppPatientPhone}
                  onChange={(e) => setNewAppPatientPhone(e.target.value)}
                  placeholder="+91 98260 XXXXX"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor</label>
                  <select
                    value={newAppDoctorId}
                    onChange={(e) => setNewAppDoctorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="">Any Available Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.doctor_id} value={d.doctor_id}>
                        {d.name} ({d.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newAppDept}
                    onChange={(e) => setNewAppDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newAppDate}
                    onChange={(e) => setNewAppDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newAppTime}
                    onChange={(e) => setNewAppTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OPD Fee (₹)</label>
                  <input
                    type="number"
                    value={newAppFee}
                    onChange={(e) => setNewAppFee(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Symptoms / Notes</label>
                <input
                  type="text"
                  value={newAppNotes}
                  onChange={(e) => setNewAppNotes(e.target.value)}
                  placeholder="e.g. High fever, hypertension followup"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAppModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Walk-In Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD DOCTOR ==================== */}
      {showAddDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Affiliate Doctor with Hospital</h3>
              <button onClick={() => setShowAddDoctor(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Dr. Full Name"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={docSpec}
                    onChange={(e) => setDocSpec(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    required
                    value={docQual}
                    onChange={(e) => setDocQual(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">OPD Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={docDept}
                    onChange={(e) => setDocDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">OPD Timings</label>
                <input
                  type="text"
                  value={docTime}
                  onChange={(e) => setDocTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Profile Picture</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                    <img
                      src={docPhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                      alt="Doctor"
                      className="w-full h-full object-cover object-top aspect-square"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="url"
                      placeholder="Image URL or choose file / preset"
                      value={docPhoto}
                      onChange={(e) => setDocPhoto(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                    />
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <label className="cursor-pointer text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Upload className="w-2.5 h-2.5" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, setDocPhoto)}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setDocPhoto('https://images.unsplash.com/photo-1594824813576-696232537021?auto=format&fit=crop&w=400&q=80')}
                        className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded"
                      >
                        Preset 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocPhoto('https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80')}
                        className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded"
                      >
                        Preset 2
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctor(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  Add Affiliation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
