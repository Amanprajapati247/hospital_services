import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  Users, 
  Heart, 
  Bell, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  MapPin, 
  Phone,
  ShieldCheck 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Appointment, FamilyMember } from '../../types';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  // New family member modal form
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newFmName, setNewFmName] = useState('');
  const [newFmRel, setNewFmRel] = useState('Father');
  const [newFmAge, setNewFmAge] = useState('');
  const [newFmBlood, setNewFmBlood] = useState('B+');

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, apps, fm] = await Promise.all([
        api.getPatientDashboard(),
        api.getAppointments(),
        api.getFamilyMembers()
      ]);
      setDashboardData(dash);
      setAppointments(apps);
      setFamilyMembers(fm);
    } catch (err) {
      console.error('Failed to load patient dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addFamilyMember({
        name: newFmName,
        relationship: newFmRel,
        age: parseInt(newFmAge) || undefined,
        blood_group: newFmBlood
      });
      setShowAddFamily(false);
      setNewFmName('');
      setNewFmAge('');
      loadData();
    } catch (err) {
      alert('Failed to add family member');
    }
  };

  const handleDeleteFamilyMember = async (id: number) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;
    try {
      await api.deleteFamilyMember(id);
      loadData();
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  const handleCancelAppointment = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.updateAppointmentStatus(id, 'Cancelled', 'Patient cancelled via dashboard');
      loadData();
    } catch (err) {
      alert('Failed to cancel appointment');
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading patient dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-0.5 rounded-full uppercase">
            <span>Patient Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.full_name || 'Patient'}
          </h1>
          <p className="text-xs text-slate-300">
            {dashboardData?.city || 'Indore'}, MP • Health ID: <strong className="font-mono text-teal-300">IND-2026-8841</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <span className="text-slate-400 block text-[10px]">Blood Group</span>
            <span className="font-extrabold text-white text-sm">{dashboardData?.blood_group || 'B+'}</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            <span className="text-slate-400 block text-[10px]">Active Insurance</span>
            <span className="font-extrabold text-white text-sm">{dashboardData?.insurance_name || 'Star Health'}</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <p className="text-2xl font-black text-slate-900">{appointments.length}</p>
          <span className="text-[10px] text-teal-600 font-semibold">OPD Appointments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Family Dependents</span>
          <p className="text-2xl font-black text-slate-900">{familyMembers.length}</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Registered Dependents</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Saved Facilities</span>
          <p className="text-2xl font-black text-slate-900">4</p>
          <span className="text-[10px] text-slate-400 font-semibold">Hospitals in Indore</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">PM-JAY Eligibility</span>
          <p className="text-sm font-black text-emerald-600 mt-2">Verified Eligible</p>
          <span className="text-[10px] text-slate-400 font-semibold">Up to ₹5,00,000</span>
        </div>
      </div>

      {/* Next Upcoming Appointment Highlight */}
      {dashboardData?.upcoming_appointment && (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-500/40 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded-md">
              Next Upcoming OPD Consultation
            </span>
            <h3 className="text-lg font-black text-slate-900">
              {dashboardData.upcoming_appointment.doctor_name} ({dashboardData.upcoming_appointment.doctor_specialization})
            </h3>
            <p className="text-xs text-slate-600">
              {dashboardData.upcoming_appointment.hospital_name} — {dashboardData.upcoming_appointment.hospital_area}
            </p>
            <div className="flex items-center space-x-3 text-xs text-teal-800 font-bold pt-1">
              <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {dashboardData.upcoming_appointment.date}</span>
              <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {dashboardData.upcoming_appointment.time}</span>
              <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-[11px]">Confirmed</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => handleCancelAppointment(dashboardData.upcoming_appointment.id)}
              className="bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl transition"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Appointments History & Family Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Appointment History</h3>
            <span className="text-xs text-slate-400">{appointments.length} Records</span>
          </div>

          {appointments.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No appointments scheduled yet. Browse doctors to book an OPD slot.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((app) => (
                <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{app.doctor_name}</span>
                        <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold">
                          {app.department}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          app.status === 'Completed' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{app.hospital_name} • {app.hospital_area}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900 block">₹{app.consultation_fee}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{app.appointment_number}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                    <div className="flex items-center space-x-3">
                      <span><strong>Date:</strong> {app.appointment_date} at {app.appointment_time}</span>
                      <span><strong>For:</strong> {app.family_member_name || 'Self'}</span>
                    </div>

                    {app.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelAppointment(app.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Family Members Manager */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Family Members</h3>
              </div>
              <button
                onClick={() => setShowAddFamily(true)}
                className="text-teal-600 hover:text-teal-700 text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Manage family profiles to book appointments for parents, spouse, or children seamlessly.
            </p>

            <div className="space-y-2">
              {familyMembers.map((fm) => (
                <div key={fm.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{fm.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {fm.relationship} • Age: {fm.age || 'N/A'} • {fm.blood_group}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteFamilyMember(fm.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Dropdown Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-extrabold text-slate-900">Health Alerts & Reminders</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800">Appointment Confirmed</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Your OPD slot with Dr. Rajesh Verma is confirmed.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-800">Indore Health Advisory</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Free Dengue NS1 testing active across municipal hospitals.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Add Family Member Modal */}
      {showAddFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Add Family Member</h3>
            <form onSubmit={handleAddFamilyMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFmName}
                  onChange={(e) => setNewFmName(e.target.value)}
                  placeholder="e.g. Ramakant Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={newFmRel}
                    onChange={(e) => setNewFmRel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newFmAge}
                    onChange={(e) => setNewFmAge(e.target.value)}
                    placeholder="e.g. 68"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFamily(false)}
                  className="w-full bg-slate-100 text-slate-700 font-bold py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-bold py-2 rounded-xl"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
