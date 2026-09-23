import React, { useState, useEffect } from 'react';
import { ShieldCheck, Building2, Stethoscope, Users, CheckCircle2, XCircle, AlertTriangle, Activity } from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [st, hList, dList, logs] = await Promise.all([
        api.getAdminStats(),
        api.getAdminHospitals(),
        api.getAdminDoctors(),
        api.getAuditLogs()
      ]);
      setStats(st);
      setHospitals(hList);
      setDoctors(dList);
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load platform admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyHospital = async (id: number, status: string) => {
    try {
      await api.verifyHospital(id, status);
      loadAdminData();
    } catch (err) {
      alert('Verification update failed');
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-semibold">Loading platform administration console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-0.5 rounded-full uppercase">
            <span>Platform Administration & Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            CareConnect AI System Control
          </h1>
          <p className="text-xs text-slate-300">
            Hospital credential verification, provider moderation, and audit compliance logs for Indore.
          </p>
        </div>

        <div className="text-xs bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          <span className="text-rose-300 block text-[10px]">Verification Engine</span>
          <span className="font-extrabold text-white text-base">Active (NABH / MPMC)</span>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Patients</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_users || 0}</p>
          <span className="text-[10px] text-teal-600 font-semibold">Central India</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hospitals</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_hospitals || 0}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">{stats?.verified_hospitals || 0} Verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctors</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_doctors || 0}</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Verified Specialists</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Appointments</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_appointments || 0}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Bookings Processed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Reviews</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_reviews || 0}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Moderated & Verified</span>
        </div>
      </div>

      {/* Hospital Verification Console */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-rose-600" />
              <span>Hospital Verification & Compliance Console</span>
            </h3>
            <p className="text-xs text-slate-500">
              Review state medical registration licenses and assign official "✓ Verified Hospital" badges.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                <th className="p-3">Hospital Name</th>
                <th className="p-3">Area</th>
                <th className="p-3">Reg License</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Current Status</th>
                <th className="p-3">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hospitals.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{h.name}</td>
                  <td className="p-3 text-slate-500">{h.area}, {h.city}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-700">{h.registration_no}</td>
                  <td className="p-3 font-bold text-slate-800">⭐ {h.rating.toFixed(1)}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      h.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                      h.verification_status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {h.verification_status}
                    </span>
                  </td>
                  <td className="p-3 space-x-1.5">
                    {h.verification_status !== 'verified' && (
                      <button
                        onClick={() => handleVerifyHospital(h.id, 'verified')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-md text-[10px]"
                      >
                        Approve & Verify
                      </button>
                    )}
                    {h.verification_status === 'verified' && (
                      <button
                        onClick={() => handleVerifyHospital(h.id, 'suspended')}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-md text-[10px]"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Console */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <span>Platform Security Audit Trail</span>
        </h3>
        <p className="text-xs text-slate-500">
          Immutable audit record of all bed updates, doctor affiliations, and verification actions.
        </p>

        <div className="space-y-2">
          {auditLogs.map((l) => (
            <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div>
                <span className="font-bold text-teal-800 font-mono text-[10px] mr-2">[{l.action}]</span>
                <span className="text-slate-800">{l.details}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                by {l.user_email || 'System'} • {new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
