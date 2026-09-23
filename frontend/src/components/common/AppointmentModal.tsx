import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Building2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FamilyMember } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: any;
  hospital?: any;
  onSuccess?: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  doctor,
  hospital,
  onSuccess
}) => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('Self');
  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedData, setConfirmedData] = useState<any | null>(null);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '12:00 PM', '04:30 PM', '05:00 PM', '06:00 PM'
  ];

  useEffect(() => {
    if (user && isOpen) {
      api.getFamilyMembers().then(setFamilyMembers).catch(() => {});
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const targetHospitalId = hospital?.id || (doctor?.affiliations?.[0]?.hospital_id) || 1;
  const targetHospitalName = hospital?.name || (doctor?.affiliations?.[0]?.hospital_name) || 'Medanta Super Speciality Hospital Indore';
  const targetFee = doctor?.affiliations?.[0]?.consultation_fee || hospital?.starting_fee || 700;
  const targetDoctorName = doctor?.name || 'Dr. Rajesh Verma (Cardiologist)';
  const targetDoctorId = doctor?.id || 1;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in or use 1-Click Demo Login to book an appointment.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await api.bookAppointment({
        hospital_id: targetHospitalId,
        doctor_id: targetDoctorId,
        department: doctor?.specialization || 'General Medicine',
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        family_member_name: selectedPatient,
        consultation_fee: targetFee,
        patient_notes: notes
      });
      setConfirmedData(res);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to confirm appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-teal-700 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-200">Book OPD Appointment</span>
            <h3 className="text-lg font-bold">CareConnect Instant Booking</h3>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {confirmedData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-1">Booking Ref: <strong className="font-mono text-teal-700">{confirmedData.appointment_number}</strong></p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
                <p><strong>Doctor:</strong> {confirmedData.doctor_name} ({confirmedData.doctor_specialization})</p>
                <p><strong>Hospital:</strong> {confirmedData.hospital_name} - {confirmedData.hospital_area}</p>
                <p><strong>Date & Time:</strong> {confirmedData.appointment_date} at {confirmedData.appointment_time}</p>
                <p><strong>Patient:</strong> {confirmedData.family_member_name}</p>
                <p><strong>Consultation Fee:</strong> ₹{confirmedData.consultation_fee} (Pay at Hospital)</p>
              </div>

              <button
                onClick={onClose}
                className="w-full max-w-sm bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-md"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              
              {/* Doctor & Hospital info card */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  {doctor?.photo_url ? (
                    <div className="relative shrink-0 w-11 h-11 rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                      <img
                        src={doctor.photo_url}
                        alt={targetDoctorName}
                        className="w-full h-full object-cover object-top aspect-square"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{targetDoctorName}</p>
                    <p className="text-slate-500 truncate">{targetHospitalName}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Fee</span>
                  <span className="text-sm font-extrabold text-slate-900">₹{targetFee}</span>
                </div>
              </div>

              {/* Patient Selection (Self or Family Member) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Appointment For:</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="Self">Myself ({user?.full_name || 'Patient'})</option>
                  {familyMembers.map((fm) => (
                    <option key={fm.id} value={`${fm.name} (${fm.relationship})`}>
                      {fm.name} ({fm.relationship}, Age: {fm.age || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot:</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Symptoms or Notes (Optional):</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Mild headache, follow-up blood pressure check, knee pain..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>{loading ? 'Confirming with Hospital...' : 'Confirm Appointment (Pay at Hospital)'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
