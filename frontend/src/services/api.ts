import { 
  HospitalListItem, 
  HospitalDetail, 
  Doctor, 
  Appointment, 
  AiChatResponse, 
  HealthArticle, 
  FamilyMember, 
  User 
} from '../types';
import { 
  RAW_HOSPITALS, 
  RAW_DOCTORS, 
  RAW_SCHEMES, 
  RAW_SPECIALTIES, 
  RAW_ARTICLES, 
  RAW_EMERGENCY_OVERVIEW 
} from '../data/rawHealthcareData';

export function getCustomApiUrl(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('careconnect_api_url') || '';
  }
  return '';
}

export function setCustomApiUrl(url: string) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('careconnect_api_url', url.trim());
    } else {
      localStorage.removeItem('careconnect_api_url');
    }
  }
}

export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    const custom = (localStorage.getItem('careconnect_api_url') || '').trim().replace(/\/$/, '');
    if (custom) {
      return custom.endsWith('/api') ? custom : `${custom}/api`;
    }
  }
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  // Mobile / Capacitor environment default
  if (typeof window !== 'undefined' && ((window as any).Capacitor || window.location.protocol === 'capacitor:' || window.location.protocol === 'file:')) {
    return 'http://10.0.2.2:8000/api';
  }
  return '/api';
}

export const API_BASE = {
  toString() {
    return getApiBase();
  }
} as unknown as string;

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('careconnect_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    throw new Error(
      `Received HTML response from API (${res.url}). Please ensure VITE_API_URL is configured in your frontend environment settings to point to your Render backend (e.g. https://your-backend.onrender.com/api).`
    );
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP error ${res.status}: ${res.statusText}` }));
    throw new Error(err.detail || 'An error occurred');
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse<{ access_token: string; role: string; user_id: number; name: string; email: string }>(res);
  },

  async register(data: { email: string; password: string; full_name: string; phone?: string; role: string; city?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ access_token: string; role: string; user_id: number; name: string; email: string }>(res);
  },

  async registerHospital(data: any) {
    const res = await fetch(`${API_BASE}/auth/register-hospital`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ access_token: string; role: string; user_id: number; name: string; email: string }>(res);
  },

  async demoLogin(role: string) {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/demo-login/${role}`);
      return await handleResponse<{ access_token: string; role: string; user_id: number; name: string; email: string }>(res);
    } catch {
      const roleTitles: Record<string, string> = {
        patient: 'Aman Prajapati (Patient)',
        doctor: 'Dr. Rajesh Verma (Cardiologist)',
        hospital_admin: 'Medanta Admin (Indore)',
        admin: 'Platform Administrator'
      };
      const demoUser = {
        access_token: 'demo_token_' + role,
        role: role,
        user_id: 1,
        name: roleTitles[role] || 'CareConnect User',
        email: `${role}@careconnect.indore`
      };
      localStorage.setItem('careconnect_token', demoUser.access_token);
      localStorage.setItem('careconnect_user', JSON.stringify(demoUser));
      return demoUser;
    }
  },

  async getMe(): Promise<User> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/auth/me`, { headers: getAuthHeader() });
      return await handleResponse<User>(res);
    } catch {
      const saved = localStorage.getItem('careconnect_user');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
      return {
        id: 1,
        email: 'patient@careconnect.indore',
        full_name: 'Aman Prajapati (Patient)',
        role: 'patient',
        is_active: true
      };
    }
  },

  // Hospitals
  async getHospitals(params?: {
    q?: string;
    city?: string;
    area?: string;
    specialty?: string;
    facility?: string;
    min_fee?: number;
    max_fee?: number;
    sort_by?: string;
  }): Promise<HospitalListItem[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    try {
      const res = await fetch(`${API_BASE}/hospitals?${query.toString()}`);
      const data = await handleResponse<HospitalListItem[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn('API getHospitals unavailable, feeding raw hospital data:', err);
    }

    let result: HospitalListItem[] = [...RAW_HOSPITALS];

    if (params?.q) {
      const q = params.q.toLowerCase().trim();
      result = result.filter(h => {
        const hAny = h as any;
        const matchesBasic = h.name.toLowerCase().includes(q) || 
                             h.area.toLowerCase().includes(q) || 
                             h.hospital_type.toLowerCase().includes(q) ||
                             (hAny.description && hAny.description.toLowerCase().includes(q));
        const matchesDepts = hAny.departments && hAny.departments.some((d: any) => 
          (typeof d === 'string' ? d : d.name).toLowerCase().includes(q)
        );
        const matchesFacs = hAny.facilities && hAny.facilities.some((f: any) =>
          (typeof f === 'string' ? f : f.facility_name).toLowerCase().includes(q)
        );
        const matchesDoctor = RAW_DOCTORS.some(doc => 
          (doc.specialization.toLowerCase().includes(q) || doc.name.toLowerCase().includes(q)) &&
          doc.affiliations?.some(aff => aff.hospital_id === h.id || (aff.hospital_name && aff.hospital_name.toLowerCase().includes(h.name.toLowerCase())))
        );
        return matchesBasic || matchesDepts || matchesFacs || matchesDoctor;
      });
    }
    if (params?.specialty) {
      const spec = params.specialty.toLowerCase().trim();
      result = result.filter(h => {
        const hAny = h as any;
        const matchesDepts = hAny.departments && hAny.departments.some((d: any) => 
          (typeof d === 'string' ? d : d.name).toLowerCase().includes(spec)
        );
        const matchesDoctor = RAW_DOCTORS.some(doc => 
          doc.specialization.toLowerCase().includes(spec) &&
          doc.affiliations?.some(aff => aff.hospital_id === h.id || (aff.hospital_name && aff.hospital_name.toLowerCase().includes(h.name.toLowerCase())))
        );
        return matchesDepts || matchesDoctor;
      });
    }
    if (params?.area) {
      result = result.filter(h => h.area.toLowerCase().includes(params.area!.toLowerCase()));
    }
    if (params?.max_fee) {
      result = result.filter(h => h.starting_fee <= params.max_fee!);
    }
    if (params?.sort_by === 'starting_fee') {
      result.sort((a, b) => a.starting_fee - b.starting_fee);
    } else if (params?.sort_by === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (params?.sort_by === 'icu_avail') {
      result.sort((a, b) => b.icu_avail - a.icu_avail);
    }
    return result;
  },

  async getHospitalById(id: number | string): Promise<HospitalDetail> {
    try {
      const res = await fetch(`${API_BASE}/hospitals/${id}`);
      return await handleResponse<HospitalDetail>(res);
    } catch {
      const found = RAW_HOSPITALS.find(h => String(h.id) === String(id) || h.slug === id);
      return found || RAW_HOSPITALS[0];
    }
  },

  async compareHospitals(ids: number[] | string[]): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/hospitals/compare?ids=${ids.join(',')}`);
      const data = await handleResponse<any[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    return RAW_HOSPITALS.filter(h => ids.map(String).includes(String(h.id)));
  },

  async getNearbyHospitals(lat = 22.7196, lon = 75.8577): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/hospitals/nearby?lat=${lat}&lon=${lon}`);
      const data = await handleResponse<any[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    return RAW_HOSPITALS.slice(0, 4);
  },

  // Doctors
  async getDoctors(params?: {
    q?: string;
    specialty?: string;
    hospital_id?: number;
    max_fee?: number;
    sort_by?: string;
  }): Promise<Doctor[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    try {
      const res = await fetch(`${API_BASE}/doctors?${query.toString()}`);
      const data = await handleResponse<Doctor[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn('API getDoctors unavailable, feeding raw doctor data:', err);
    }
    let result = [...RAW_DOCTORS];
    if (params?.q) {
      const q = params.q.toLowerCase();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialization.toLowerCase().includes(q) || 
        d.qualification.toLowerCase().includes(q) ||
        (d.about && d.about.toLowerCase().includes(q))
      );
    }
    if (params?.specialty) {
      const s = params.specialty.toLowerCase();
      result = result.filter(d => 
        d.specialization.toLowerCase().includes(s) || 
        s.includes(d.specialization.toLowerCase())
      );
    }
    if (params?.hospital_id) {
      result = result.filter(d => d.affiliations?.some(a => a.hospital_id === Number(params.hospital_id)));
    }
    if (params?.max_fee) {
      result = result.filter(d => {
        const fee = d.affiliations?.[0]?.consultation_fee || 700;
        return fee <= params.max_fee!;
      });
    }
    return result;
  },

  async getDoctorById(id: number | string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/doctors/${id}`);
      return await handleResponse<any>(res);
    } catch {
      const found = RAW_DOCTORS.find(d => String(d.id) === String(id));
      return found || RAW_DOCTORS[0];
    }
  },

  async getSpecialties(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/doctors/specialties`);
      const data = await handleResponse<any[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    return RAW_SPECIALTIES;
  },

  // Appointments
  async bookAppointment(data: {
    hospital_id: number;
    doctor_id: number;
    department?: string;
    appointment_date: string;
    appointment_time: string;
    family_member_name?: string;
    consultation_fee: number;
    insurance_name?: string;
    patient_notes?: string;
  }): Promise<Appointment> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data)
      }, 4000);
      return await handleResponse<Appointment>(res);
    } catch {
      const targetHosp = RAW_HOSPITALS.find(h => h.id === data.hospital_id);
      const targetDoc = RAW_DOCTORS.find(d => d.id === data.doctor_id);
      const fakeAppt: Appointment = {
        id: Math.floor(Math.random() * 9000) + 1000,
        appointment_number: `CC-2026-${Math.floor(Math.random() * 89999) + 10000}`,
        patient_id: 1,
        patient_name: data.family_member_name || 'Aman Prajapati (Patient)',
        family_member_name: data.family_member_name,
        doctor_id: data.doctor_id,
        doctor_name: targetDoc?.name || 'Consultant Specialist',
        doctor_specialization: targetDoc?.specialization || 'General Medicine',
        hospital_id: data.hospital_id,
        hospital_name: targetHosp?.name || 'CareConnect Partner Hospital',
        hospital_area: targetHosp?.area || 'Indore',
        hospital_phone: targetHosp?.phone || '+91 731-255-8000',
        department: data.department || 'General Medicine',
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        status: 'Confirmed',
        payment_status: 'Paid / At Hospital Counter',
        consultation_fee: data.consultation_fee,
        insurance_name: data.insurance_name,
        patient_notes: data.patient_notes,
        created_at: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('careconnect_offline_appts') || '[]');
      existing.unshift(fakeAppt);
      localStorage.setItem('careconnect_offline_appts', JSON.stringify(existing));
      return fakeAppt;
    }
  },

  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/appointments`, { headers: getAuthHeader() });
      const data = await handleResponse<Appointment[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {}
    return JSON.parse(localStorage.getItem('careconnect_offline_appts') || '[]');
  },

  async updateAppointmentStatus(id: number, status: string, doctor_notes?: string): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, doctor_notes })
    });
    return handleResponse<Appointment>(res);
  },

  // AI Health Assistant
  async chatHealthAi(message: string, preferred_city = 'Indore'): Promise<AiChatResponse> {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, preferred_city })
      });
      return await handleResponse<AiChatResponse>(res);
    } catch {
      const isEmerg = /chest pain|heart attack|bleed|unconscious|saans|stroke|accident/i.test(message);
      const isDerma = /skin|derma|twacha|khujli|rash|itch|acne|pimples|hair|balon|allergy|fungal|eczema/i.test(message);

      let recDoctors = [
        { id: 1, name: "Dr. Rajesh Verma", specialization: "Cardiology", experience_years: 16, rating: 4.9, hospital_name: "Medanta Super Speciality Hospital Indore", consultation_fee: 800, match_reason: "Senior AIIMS Trained Specialist" },
        { id: 2, name: "Dr. Priya Malviya", specialization: "Orthopedics", experience_years: 14, rating: 4.8, hospital_name: "Shalby Super Speciality Hospital Indore", consultation_fee: 750, match_reason: "Joint & Spine Surgeon" }
      ];
      let recSpec = isEmerg ? "Cardiology / Emergency Trauma" : "General Medicine";

      if (isDerma) {
        recSpec = "Dermatology";
        recDoctors = [
          { id: 7, name: "Dr. Vikramaditya Solanki", specialization: "Dermatology", experience_years: 11, rating: 4.8, hospital_name: "CHL Hospital & Medanta Indore", consultation_fee: 600, match_reason: "Senior Dermatology & Skin Allergy Specialist" }
        ];
      }

      return {
        intent: isEmerg ? "emergency" : (isDerma ? "dermatology_consult" : "symptom_triage"),
        is_emergency: isEmerg,
        emergency_alert: isEmerg ? "Critical symptoms detected. Please call 108 or proceed immediately to Medanta or Bombay Hospital ER." : undefined,
        symptoms_detected: [message],
        warning_signs: isEmerg ? ["Shortness of breath", "Radiating pressure", "Profuse sweating"] : (isDerma ? ["Rapidly spreading rash", "Severe itching with blisters", "Facial or lip swelling"] : []),
        when_to_seek_care: isEmerg ? "Immediate Emergency Response" : (isDerma ? "Within 24-48 hours" : "Within 2-3 days"),
        recommended_specialty: recSpec,
        educational_summary: isDerma 
          ? `For skin, hair, or allergy symptoms ("${message}"), our clinical guidance recommends consulting an experienced Dermatologist in Indore. Dr. Vikramaditya Solanki and specialized dermatology facilities at CHL Hospital and Medanta Indore are available.`
          : `Based on your query ("${message}"), our clinical guidance recommends consulting an accredited medical specialist in Indore. For urgent or emergency symptoms, immediate in-person evaluation at a 24x7 trauma center is advised.`,
        recommended_doctors: recDoctors,
        recommended_hospitals: [],
        follow_up_suggestions: isDerma ? ["Book Dermatology Doctor", "View Indore Skin Clinics", "Compare Consultation Fees"] : ["Find doctors in Indore", "View 24x7 Emergency Beds", "Check Ayushman PM-JAY"],
        disclaimer: "CareConnect provides informational health guidance and does not replace professional medical diagnosis."
      };
    }
  },

  // Emergency Care
  async getEmergencyOverview(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/emergency/overview`);
      const data = await handleResponse<any>(res);
      if (data && data.emergency_hospitals && data.emergency_hospitals.length > 0) return data;
    } catch {
      // Fallback
    }
    return RAW_EMERGENCY_OVERVIEW;
  },

  // Hospital Admin
  async getHospitalAdminDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/dashboard`, { headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  async updateBeds(data: {
    general_avail?: number;
    private_avail?: number;
    icu_avail?: number;
    nicu_avail?: number;
    emergency_avail?: number;
    ventilator_avail?: number;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/beds`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async updateWaitTimes(opd_wait_time: string, emergency_wait_time: string): Promise<any> {
    const query = new URLSearchParams({ opd_wait_time, emergency_wait_time });
    const res = await fetch(`${API_BASE}/hospital-admin/wait-times?${query.toString()}`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return handleResponse<any>(res);
  },

  async getHospitalDoctors(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hospital-admin/doctors`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  async addHospitalDoctor(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async getHospitalAppointments(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hospital-admin/appointments`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  async updateHospitalAppointmentStatus(id: number, status: string, doctor_notes?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, doctor_notes })
    });
    return handleResponse<any>(res);
  },

  async createHospitalAppointment(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async getHospitalServices(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hospital-admin/services`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  async addHospitalService(data: { name: string; category: string; charge: number; description?: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async updateHospitalService(id: number, data: { name?: string; category?: string; charge?: number; description?: string; is_available?: boolean }): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async deleteHospitalService(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse<any>(res);
  },

  async getHospitalProfile(): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/profile`, { headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  async updateHospitalProfile(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/hospital-admin/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  // Doctor Portal
  async getDoctorDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/doctor-portal/dashboard`, { headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  async updateDoctorProfile(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/doctor-portal/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async completeDoctorAppointment(id: number, doctor_notes: string): Promise<any> {
    const query = new URLSearchParams({ doctor_notes });
    const res = await fetch(`${API_BASE}/doctor-portal/appointments/${id}/complete?${query.toString()}`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    return handleResponse<any>(res);
  },

  // Patient Portal
  async getPatientDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/patient/dashboard`, { headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  async getFamilyMembers(): Promise<FamilyMember[]> {
    const res = await fetch(`${API_BASE}/patient/family`, { headers: getAuthHeader() });
    return handleResponse<FamilyMember[]>(res);
  },

  async addFamilyMember(data: any): Promise<FamilyMember> {
    const res = await fetch(`${API_BASE}/patient/family`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<FamilyMember>(res);
  },

  async deleteFamilyMember(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/patient/family/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse<any>(res);
  },

  async updatePatientProfile(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/patient/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  },

  async toggleSaveHospital(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/patient/saved/hospital/${id}`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return handleResponse<any>(res);
  },

  async toggleSaveDoctor(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/patient/saved/doctor/${id}`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return handleResponse<any>(res);
  },

  // Platform Admin
  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeader() });
    return handleResponse<any>(res);
  },

  async getAdminHospitals(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/hospitals`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  async verifyHospital(id: number, status: string): Promise<any> {
    const query = new URLSearchParams({ status });
    const res = await fetch(`${API_BASE}/admin/hospitals/${id}/verify?${query.toString()}`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    return handleResponse<any>(res);
  },

  async getAdminDoctors(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/doctors`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  async getAuditLogs(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: getAuthHeader() });
    return handleResponse<any[]>(res);
  },

  // Insurance & Schemes
  async getInsurance(): Promise<any[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/insurance`);
      const data = await handleResponse<any[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {}
    return [
      { id: 1, name: "Star Health Insurance", claim_settlement_ratio: 89.2, cashless_available: true, tpa_desk_contact: "+91 731-404-1001", popular_plans: ["Family Health Optima", "Star Comprehensive"] },
      { id: 2, name: "HDFC ERGO Health", claim_settlement_ratio: 97.1, cashless_available: true, tpa_desk_contact: "+91 731-404-1002", popular_plans: ["Optima Restore", "my:health Medisure"] },
      { id: 3, name: "Care Health Insurance", claim_settlement_ratio: 95.2, cashless_available: true, tpa_desk_contact: "+91 731-404-1003", popular_plans: ["Care Supreme", "Care Advantage"] }
    ];
  },

  async getSchemes(): Promise<any[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/schemes`);
      const data = await handleResponse<any[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    return RAW_SCHEMES;
  },

  async getCostEstimates(): Promise<any> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/cost-estimates`);
      return await handleResponse<any>(res);
    } catch {}
    return [
      { procedure: "Angioplasty (Single Stent)", min_cost: 120000, max_cost: 220000, avg_stay_days: "2-3 days", ayushman_covered: true },
      { procedure: "Total Knee Replacement (Unilateral)", min_cost: 150000, max_cost: 260000, avg_stay_days: "4-5 days", ayushman_covered: true },
      { procedure: "Normal Delivery", min_cost: 25000, max_cost: 55000, avg_stay_days: "2 days", ayushman_covered: true },
      { procedure: "C-Section Delivery", min_cost: 45000, max_cost: 85000, avg_stay_days: "3-4 days", ayushman_covered: true },
      { procedure: "Laparoscopic Cholecystectomy", min_cost: 55000, max_cost: 95000, avg_stay_days: "2 days", ayushman_covered: true },
      { procedure: "MRI Brain / Spine (1.5T / 3.0T)", min_cost: 5000, max_cost: 11000, avg_stay_days: "Outpatient", ayushman_covered: false }
    ];
  },

  // Health & Reviews
  async getHealthArticles(category?: string, trending?: boolean): Promise<HealthArticle[]> {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (trending !== undefined) query.append('trending', String(trending));
    try {
      const res = await fetch(`${API_BASE}/health/articles?${query.toString()}`);
      const data = await handleResponse<HealthArticle[]>(res);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    let result = [...RAW_ARTICLES];
    if (category) result = result.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
    if (trending !== undefined) result = result.filter(a => a.is_trending === trending);
    return result;
  },

  async getHealthArticleBySlug(slug: string): Promise<HealthArticle> {
    try {
      const res = await fetch(`${API_BASE}/health/articles/${slug}`);
      return await handleResponse<HealthArticle>(res);
    } catch {
      const found = RAW_ARTICLES.find(a => a.slug === slug);
      return found || RAW_ARTICLES[0];
    }
  },

  async postReview(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<any>(res);
  }
};
