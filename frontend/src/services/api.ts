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

const API_BASE = '/api';

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('careconnect_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Network error' }));
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
    const res = await fetch(`${API_BASE}/auth/demo-login/${role}`);
    return handleResponse<{ access_token: string; role: string; user_id: number; name: string; email: string }>(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getAuthHeader() });
    return handleResponse<User>(res);
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
    const res = await fetch(`${API_BASE}/hospitals?${query.toString()}`);
    return handleResponse<HospitalListItem[]>(res);
  },

  async getHospitalById(id: number | string): Promise<HospitalDetail> {
    const res = await fetch(`${API_BASE}/hospitals/${id}`);
    return handleResponse<HospitalDetail>(res);
  },

  async compareHospitals(ids: number[] | string[]): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hospitals/compare?ids=${ids.join(',')}`);
    return handleResponse<any[]>(res);
  },

  async getNearbyHospitals(lat = 22.7196, lon = 75.8577): Promise<any[]> {
    const res = await fetch(`${API_BASE}/hospitals/nearby?lat=${lat}&lon=${lon}`);
    return handleResponse<any[]>(res);
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
    const res = await fetch(`${API_BASE}/doctors?${query.toString()}`);
    return handleResponse<Doctor[]>(res);
  },

  async getDoctorById(id: number | string): Promise<any> {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    return handleResponse<any>(res);
  },

  async getSpecialties(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/doctors/specialties`);
    return handleResponse<any[]>(res);
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
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse<Appointment>(res);
  },

  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/appointments`, { headers: getAuthHeader() });
    return handleResponse<Appointment[]>(res);
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
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, preferred_city })
    });
    return handleResponse<AiChatResponse>(res);
  },

  // Emergency Care
  async getEmergencyOverview(): Promise<any> {
    const res = await fetch(`${API_BASE}/emergency/overview`);
    return handleResponse<any>(res);
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
    const res = await fetch(`${API_BASE}/insurance`);
    return handleResponse<any[]>(res);
  },

  async getSchemes(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/schemes`);
    return handleResponse<any[]>(res);
  },

  async getCostEstimates(): Promise<any> {
    const res = await fetch(`${API_BASE}/cost-estimates`);
    return handleResponse<any>(res);
  },

  // Health & Reviews
  async getHealthArticles(category?: string, trending?: boolean): Promise<HealthArticle[]> {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (trending !== undefined) query.append('trending', String(trending));
    const res = await fetch(`${API_BASE}/health/articles?${query.toString()}`);
    return handleResponse<HealthArticle[]>(res);
  },

  async getHealthArticleBySlug(slug: string): Promise<HealthArticle> {
    const res = await fetch(`${API_BASE}/health/articles/${slug}`);
    return handleResponse<HealthArticle>(res);
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
