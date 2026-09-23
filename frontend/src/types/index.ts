export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'platform_admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  hospital_id?: number;
  doctor_id?: number;
}

export interface BedInventory {
  id: number;
  general_total: number;
  general_avail: number;
  private_total: number;
  private_avail: number;
  icu_total: number;
  icu_avail: number;
  nicu_total: number;
  nicu_avail: number;
  emergency_total: number;
  emergency_avail: number;
  ventilator_total: number;
  ventilator_avail: number;
  last_updated: string;
  updated_by: string;
}

export interface HospitalAmbulance {
  id: number;
  ambulance_type: string;
  vehicle_number: string;
  driver_contact: string;
  is_available: boolean;
}

export interface HospitalDepartment {
  id: number;
  name: string;
  description?: string;
  hod_name?: string;
  opd_timings: string;
  emergency_ready: boolean;
}

export interface HospitalFacility {
  id: number;
  facility_name: string;
}

export interface DoctorAffiliation {
  id: number;
  hospital_id: number;
  hospital_name?: string;
  hospital_area?: string;
  department: string;
  consultation_fee: number;
  days_of_week: string;
  opd_timings: string;
  is_active: boolean;
}

export interface Doctor {
  id: number;
  user_id?: number;
  name: string;
  qualification: string;
  experience_years: number;
  specialization: string;
  registration_council: string;
  registration_number: string;
  about?: string;
  languages: string;
  photo_url?: string;
  rating: number;
  review_count: number;
  verified: boolean;
  affiliations: DoctorAffiliation[];
}

export interface HospitalListItem {
  id: number;
  name: string;
  slug: string;
  area: string;
  city: string;
  state: string;
  phone: string;
  emergency_phone?: string;
  rating: number;
  review_count: number;
  hospital_type: string;
  verified: boolean;
  starting_fee: number;
  est_treatment_min: number;
  est_treatment_max: number;
  opd_wait_time: string;
  emergency_wait_time: string;
  image_url?: string;
  cover_image?: string;
  latitude: number;
  longitude: number;
  is_emergency_active: boolean;
  icu_avail: number;
  general_avail: number;
  facilities: string[];
  departments: string[];
  insurance_cashless: boolean;
  pmjay_scheme: boolean;
  last_updated: string;
}

export interface HospitalService {
  id: number;
  hospital_id: number;
  name: string;
  category: string;
  charge: number;
  description?: string;
  is_available: boolean;
}

export interface HospitalDetail extends HospitalListItem {
  registration_no?: string;
  description?: string;
  address: string;
  pincode: string;
  email?: string;
  website?: string;
  cover_image?: string;
  bed_inventory?: BedInventory;
  departments: any[];
  facilities: any[];
  ambulances: HospitalAmbulance[];
  doctors: Doctor[];
  accepted_insurances: string[];
  supported_schemes: string[];
  services?: HospitalService[];
}

export interface Appointment {
  id: number;
  appointment_number: string;
  patient_id: number;
  patient_name: string;
  patient_phone?: string;
  family_member_name?: string;
  doctor_id: number;
  doctor_name: string;
  doctor_specialization: string;
  hospital_id: number;
  hospital_name: string;
  hospital_area: string;
  hospital_phone: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  consultation_fee: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
  payment_status: string;
  insurance_name?: string;
  patient_notes?: string;
  doctor_notes?: string;
  created_at: string;
}

export interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age?: number;
  gender?: string;
  blood_group?: string;
}

export interface RecommendedDoctor {
  id: number;
  name: string;
  specialization: string;
  experience_years: number;
  rating: number;
  hospital_name: string;
  consultation_fee: number;
  match_reason: string;
}

export interface RecommendedHospital {
  id: number;
  name: string;
  area: string;
  rating: number;
  starting_fee: number;
  icu_avail: number;
  emergency_ready: boolean;
  pmjay_accepted: boolean;
  match_reason: string;
}

export interface AiChatResponse {
  intent: string;
  is_emergency: boolean;
  emergency_alert?: string;
  symptoms_detected: string[];
  recommended_specialty?: string;
  educational_summary: string;
  warning_signs: string[];
  when_to_seek_care: string;
  disclaimer: string;
  recommended_doctors: RecommendedDoctor[];
  recommended_hospitals: RecommendedHospital[];
  follow_up_suggestions: string[];
}

export interface HealthArticle {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  symptoms?: string;
  causes?: string;
  prevention?: string;
  when_to_see_doctor: string;
  relevant_specialty: string;
  sources: string;
  disclaimer: string;
  read_time: string;
  is_trending: boolean;
  created_at: string;
}
