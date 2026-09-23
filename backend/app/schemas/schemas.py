import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any

# Authentication & User
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    name: str
    email: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "patient"  # patient, doctor, hospital_admin, platform_admin
    city: Optional[str] = "Indore"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime.datetime
    hospital_id: Optional[int] = None
    doctor_id: Optional[int] = None

    class Config:
        from_attributes = True

# Patient & Family Member
class FamilyMemberCreate(BaseModel):
    name: str
    relationship: str
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

class FamilyMemberOut(BaseModel):
    id: int
    name: str
    relationship: str
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

    class Config:
        from_attributes = True

class PatientProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    preferred_language: Optional[str] = None
    insurance_name: Optional[str] = None
    insurance_policy_no: Optional[str] = None

# Facilities & Departments
class FacilityOut(BaseModel):
    id: int
    facility_name: str
    class Config:
        from_attributes = True

class DepartmentOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    hod_name: Optional[str] = None
    opd_timings: str
    emergency_ready: bool
    class Config:
        from_attributes = True

# Hospital Services & Charges
class HospitalServiceCreate(BaseModel):
    name: str
    category: str = "General"  # OPD Consultation, Diagnostics, Emergency Care, Bed & Ward, Surgery & Procedure, Package
    charge: int
    description: Optional[str] = None
    is_available: bool = True

class HospitalServiceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    charge: Optional[int] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None

class HospitalServiceOut(BaseModel):
    id: int
    hospital_id: int
    name: str
    category: str
    charge: int
    description: Optional[str] = None
    is_available: bool

    class Config:
        from_attributes = True

class HospitalProfileUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    hospital_type: Optional[str] = None
    starting_fee: Optional[int] = None
    est_treatment_min: Optional[int] = None
    est_treatment_max: Optional[int] = None
    is_emergency_active: Optional[bool] = None
    opd_wait_time: Optional[str] = None
    emergency_wait_time: Optional[str] = None
    cover_image: Optional[str] = None
    image_url: Optional[str] = None

class DoctorProfileUpdate(BaseModel):
    name: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    about: Optional[str] = None
    languages: Optional[str] = None
    photo_url: Optional[str] = None
    registration_council: Optional[str] = None
    registration_number: Optional[str] = None

class HospitalRegisterRequest(BaseModel):
    admin_name: str
    admin_email: EmailStr
    admin_phone: str
    admin_password: str
    hospital_name: str
    city: str = "Indore"
    area: str = "Vijay Nagar"
    address: str
    phone: str
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    hospital_type: str = "Private Super Speciality"
    starting_fee: int = 500
    est_treatment_min: int = 15000
    est_treatment_max: int = 150000
    description: Optional[str] = None
    initial_services: Optional[List[HospitalServiceCreate]] = None

class AppointmentAdminCreate(BaseModel):
    patient_name: str
    patient_phone: str
    doctor_id: Optional[int] = None
    department: str = "General"
    appointment_date: str
    appointment_time: str
    consultation_fee: int = 700
    payment_status: str = "Paid at Counter"
    notes: Optional[str] = None

class AppointmentStatusUpdate(BaseModel):
    status: str
    doctor_notes: Optional[str] = None

# Bed Inventory
class BedInventoryOut(BaseModel):
    id: int
    general_total: int
    general_avail: int
    private_total: int
    private_avail: int
    icu_total: int
    icu_avail: int
    nicu_total: int
    nicu_avail: int
    emergency_total: int
    emergency_avail: int
    ventilator_total: int
    ventilator_avail: int
    last_updated: datetime.datetime
    updated_by: str

    class Config:
        from_attributes = True

class BedInventoryUpdate(BaseModel):
    general_avail: Optional[int] = None
    private_avail: Optional[int] = None
    icu_avail: Optional[int] = None
    nicu_avail: Optional[int] = None
    emergency_avail: Optional[int] = None
    ventilator_avail: Optional[int] = None

# Ambulance
class AmbulanceOut(BaseModel):
    id: int
    ambulance_type: str
    vehicle_number: str
    driver_contact: str
    is_available: bool
    class Config:
        from_attributes = True

class AmbulanceUpdate(BaseModel):
    is_available: bool

# Doctor Affiliations & Doctors
class DoctorAffiliationOut(BaseModel):
    id: int
    hospital_id: int
    hospital_name: Optional[str] = None
    department: str
    consultation_fee: int
    days_of_week: str
    opd_timings: str
    is_active: bool
    class Config:
        from_attributes = True

class DoctorOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    qualification: str
    experience_years: int
    specialization: str
    registration_council: str
    registration_number: str
    about: Optional[str] = None
    languages: str
    photo_url: Optional[str] = None
    rating: float
    review_count: int
    verified: bool
    affiliations: List[DoctorAffiliationOut] = []
    class Config:
        from_attributes = True

class DoctorCreateAffiliation(BaseModel):
    doctor_name: str
    qualification: str
    experience_years: int
    specialization: str
    department: str
    consultation_fee: int
    days_of_week: str
    opd_timings: str
    photo_url: Optional[str] = None

# Hospital
class HospitalListOut(BaseModel):
    id: int
    name: str
    slug: str
    area: str
    city: str
    state: str
    phone: str
    emergency_phone: Optional[str] = None
    rating: float
    review_count: int
    hospital_type: str
    verified: bool
    starting_fee: int
    est_treatment_min: int
    est_treatment_max: int
    opd_wait_time: str
    emergency_wait_time: str
    image_url: Optional[str] = None
    cover_image: Optional[str] = None
    latitude: float
    longitude: float
    is_emergency_active: bool
    icu_avail: Optional[int] = 0
    general_avail: Optional[int] = 0
    facilities: List[str] = []
    departments: List[str] = []
    insurance_cashless: bool = True
    pmjay_scheme: bool = True
    last_updated: datetime.datetime

class HospitalDetailOut(BaseModel):
    id: int
    name: str
    slug: str
    registration_no: Optional[str] = None
    description: Optional[str] = None
    address: str
    area: str
    city: str
    state: str
    pincode: str
    phone: str
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    latitude: float
    longitude: float
    hospital_type: str
    verified: bool
    verification_status: str
    rating: float
    review_count: int
    starting_fee: int
    est_treatment_min: int
    est_treatment_max: int
    opd_wait_time: str
    emergency_wait_time: str
    image_url: Optional[str] = None
    cover_image: Optional[str] = None
    is_emergency_active: bool
    last_updated: datetime.datetime
    bed_inventory: Optional[BedInventoryOut] = None
    departments: List[DepartmentOut] = []
    facilities: List[FacilityOut] = []
    ambulances: List[AmbulanceOut] = []
    doctors: List[DoctorOut] = []
    accepted_insurances: List[str] = []
    supported_schemes: List[str] = []
    services: List[HospitalServiceOut] = []

    class Config:
        from_attributes = True

class HospitalUpdateData(BaseModel):
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    opd_wait_time: Optional[str] = None
    emergency_wait_time: Optional[str] = None
    description: Optional[str] = None
    starting_fee: Optional[int] = None
    is_emergency_active: Optional[bool] = None

# Appointment
class AppointmentCreate(BaseModel):
    hospital_id: int
    doctor_id: int
    department: Optional[str] = "General"
    appointment_date: str
    appointment_time: str
    family_member_name: Optional[str] = None
    consultation_fee: int = 700
    insurance_name: Optional[str] = None
    patient_notes: Optional[str] = None

class AppointmentStatusUpdate(BaseModel):
    status: str  # Confirmed, Completed, Cancelled, Rescheduled
    doctor_notes: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    appointment_number: str
    patient_id: int
    patient_name: str
    patient_phone: Optional[str] = None
    family_member_name: Optional[str] = None
    doctor_id: int
    doctor_name: str
    doctor_specialization: str
    hospital_id: int
    hospital_name: str
    hospital_area: str
    hospital_phone: str
    department: str
    appointment_date: str
    appointment_time: str
    consultation_fee: int
    status: str
    payment_status: str
    insurance_name: Optional[str] = None
    patient_notes: Optional[str] = None
    doctor_notes: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# Reviews
class ReviewCreate(BaseModel):
    hospital_id: Optional[int] = None
    doctor_id: Optional[int] = None
    rating: float
    cleanliness_rating: Optional[float] = 5.0
    staff_rating: Optional[float] = 5.0
    wait_time_rating: Optional[float] = 4.0
    review_text: str

class ReviewOut(BaseModel):
    id: int
    user_name: str
    rating: float
    cleanliness_rating: float
    staff_rating: float
    wait_time_rating: float
    review_text: str
    is_verified_patient: bool
    created_at: datetime.datetime
    hospital_name: Optional[str] = None
    doctor_name: Optional[str] = None

    class Config:
        from_attributes = True

# Insurance & Scheme
class InsuranceOut(BaseModel):
    id: int
    name: str
    code: str
    logo_url: Optional[str] = None
    toll_free: str
    cashless_support: bool
    class Config:
        from_attributes = True

class SchemeOut(BaseModel):
    id: int
    name: str
    short_name: str
    description: str
    eligibility: str
    coverage_amount: str
    documents_required: str
    official_portal: str
    class Config:
        from_attributes = True

# Health Articles
class HealthArticleOut(BaseModel):
    id: int
    slug: str
    title: str
    category: str
    summary: str
    symptoms: Optional[str] = None
    causes: Optional[str] = None
    prevention: Optional[str] = None
    when_to_see_doctor: str
    relevant_specialty: str
    sources: str
    disclaimer: str
    read_time: str
    is_trending: bool
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# AI Assistant
class AiChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    preferred_city: Optional[str] = "Indore"

class RecommendedDoctor(BaseModel):
    id: int
    name: str
    specialization: str
    experience_years: int
    rating: float
    hospital_name: str
    consultation_fee: int
    match_reason: str

class RecommendedHospital(BaseModel):
    id: int
    name: str
    area: str
    rating: float
    starting_fee: int
    icu_avail: int
    emergency_ready: bool
    pmjay_accepted: bool
    match_reason: str

class AiChatResponse(BaseModel):
    intent: str
    is_emergency: bool
    emergency_alert: Optional[str] = None
    symptoms_detected: List[str] = []
    recommended_specialty: Optional[str] = None
    educational_summary: str
    warning_signs: List[str] = []
    when_to_seek_care: str
    disclaimer: str
    recommended_doctors: List[RecommendedDoctor] = []
    recommended_hospitals: List[RecommendedHospital] = []
    follow_up_suggestions: List[str] = []
