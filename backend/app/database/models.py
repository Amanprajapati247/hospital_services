import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default="patient")  # patient, doctor, hospital_admin, platform_admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    managed_hospital = relationship("Hospital", back_populates="admin_user", uselist=False)
    appointments = relationship("Appointment", back_populates="patient_user")
    reviews = relationship("Review", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    saved_hospitals = relationship("SavedHospital", back_populates="user")
    saved_doctors = relationship("SavedDoctor", back_populates="user")


class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    blood_group = Column(String(10), nullable=True)
    city = Column(String(100), default="Indore")
    address = Column(Text, nullable=True)
    emergency_contact = Column(String(50), nullable=True)
    preferred_language = Column(String(50), default="Hindi / English")
    insurance_name = Column(String(100), nullable=True)
    insurance_policy_no = Column(String(100), nullable=True)

    user = relationship("User", back_populates="patient_profile")
    family_members = relationship("FamilyMember", back_populates="patient")


class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patient_profiles.id"))
    name = Column(String(255), nullable=False)
    relation = Column("relationship", String(50), nullable=False)  # Father, Mother, Spouse, Child, Other
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    blood_group = Column(String(10), nullable=True)

    patient = relationship("PatientProfile", back_populates="family_members")

    @property
    def relationship(self):
        return self.relation

    @relationship.setter
    def relationship(self, value):
        self.relation = value


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), index=True, nullable=False)
    slug = Column(String(255), unique=True, index=True)
    registration_no = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=False)
    area = Column(String(100), index=True, default="Vijay Nagar")
    city = Column(String(100), index=True, default="Indore")
    state = Column(String(100), default="Madhya Pradesh")
    pincode = Column(String(20), default="452010")
    phone = Column(String(50), nullable=False)
    emergency_phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    latitude = Column(Float, default=22.7196)
    longitude = Column(Float, default=75.8577)
    hospital_type = Column(String(50), default="Private Super Speciality")  # Private, Government, Trust
    verified = Column(Boolean, default=True)
    verification_status = Column(String(50), default="verified")  # pending, verified, rejected, suspended
    rating = Column(Float, default=4.5)
    review_count = Column(Integer, default=120)
    starting_fee = Column(Integer, default=500)
    est_treatment_min = Column(Integer, default=15000)
    est_treatment_max = Column(Integer, default=150000)
    opd_wait_time = Column(String(50), default="20-30 mins")
    emergency_wait_time = Column(String(50), default="Immediate (< 5 mins)")
    image_url = Column(Text, nullable=True)
    cover_image = Column(Text, nullable=True)
    is_emergency_active = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    admin_user = relationship("User", back_populates="managed_hospital")
    departments = relationship("HospitalDepartment", back_populates="hospital", cascade="all, delete-orphan")
    facilities = relationship("HospitalFacility", back_populates="hospital", cascade="all, delete-orphan")
    bed_inventory = relationship("BedInventory", back_populates="hospital", uselist=False, cascade="all, delete-orphan")
    ambulances = relationship("HospitalAmbulance", back_populates="hospital", cascade="all, delete-orphan")
    doctor_affiliations = relationship("DoctorHospitalAffiliation", back_populates="hospital")
    appointments = relationship("Appointment", back_populates="hospital")
    reviews = relationship("Review", back_populates="hospital")
    insurances = relationship("HospitalInsurance", back_populates="hospital")
    schemes = relationship("HospitalScheme", back_populates="hospital")
    services = relationship("HospitalService", back_populates="hospital", cascade="all, delete-orphan")


class HospitalDepartment(Base):
    __tablename__ = "hospital_departments"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    name = Column(String(100), index=True, nullable=False)
    description = Column(Text, nullable=True)
    hod_name = Column(String(150), nullable=True)
    opd_timings = Column(String(100), default="09:00 AM - 05:00 PM")
    emergency_ready = Column(Boolean, default=True)

    hospital = relationship("Hospital", back_populates="departments")


class HospitalFacility(Base):
    __tablename__ = "hospital_facilities"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    facility_name = Column(String(100), nullable=False)  # ICU, NICU, MRI, CT Scan, Blood Bank, 24x7 Emergency, etc.

    hospital = relationship("Hospital", back_populates="facilities")


class HospitalService(Base):
    __tablename__ = "hospital_services"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=False)
    name = Column(String(150), nullable=False)
    category = Column(String(100), default="General")  # OPD Consultation, Diagnostics, Emergency Care, Bed & Ward, Surgery & Procedure
    charge = Column(Integer, nullable=False)  # Service charge in INR
    description = Column(Text, nullable=True)
    is_available = Column(Boolean, default=True)

    hospital = relationship("Hospital", back_populates="services")


class BedInventory(Base):
    __tablename__ = "bed_inventory"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), unique=True)
    general_total = Column(Integer, default=150)
    general_avail = Column(Integer, default=42)
    private_total = Column(Integer, default=50)
    private_avail = Column(Integer, default=14)
    icu_total = Column(Integer, default=30)
    icu_avail = Column(Integer, default=6)
    nicu_total = Column(Integer, default=15)
    nicu_avail = Column(Integer, default=4)
    emergency_total = Column(Integer, default=20)
    emergency_avail = Column(Integer, default=8)
    ventilator_total = Column(Integer, default=20)
    ventilator_avail = Column(Integer, default=5)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    updated_by = Column(String(100), default="Hospital Admin")

    hospital = relationship("Hospital", back_populates="bed_inventory")


class HospitalAmbulance(Base):
    __tablename__ = "hospital_ambulances"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    ambulance_type = Column(String(50), default="Advanced Life Support (ALS)")  # BLS, ALS, Patient Transport
    vehicle_number = Column(String(50), nullable=False)
    driver_contact = Column(String(50), nullable=False)
    is_available = Column(Boolean, default=True)

    hospital = relationship("Hospital", back_populates="ambulances")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), index=True, nullable=False)
    qualification = Column(String(255), nullable=False)  # MBBS, MD (Cardiology), etc.
    experience_years = Column(Integer, default=10)
    specialization = Column(String(100), index=True, nullable=False)
    registration_council = Column(String(100), default="Madhya Pradesh Medical Council")
    registration_number = Column(String(100), default="MPMC-2015-8842")
    about = Column(Text, nullable=True)
    languages = Column(String(255), default="Hindi, English")
    photo_url = Column(Text, nullable=True)
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=95)
    verified = Column(Boolean, default=True)
    verification_status = Column(String(50), default="verified")

    user = relationship("User", back_populates="doctor_profile")
    affiliations = relationship("DoctorHospitalAffiliation", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")
    reviews = relationship("Review", back_populates="doctor")


class DoctorHospitalAffiliation(Base):
    __tablename__ = "doctor_hospital_affiliations"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    department = Column(String(100), default="General")
    consultation_fee = Column(Integer, default=700)
    days_of_week = Column(String(100), default="Mon, Tue, Wed, Thu, Fri, Sat")
    opd_timings = Column(String(100), default="10:00 AM - 02:00 PM")
    is_active = Column(Boolean, default=True)

    doctor = relationship("Doctor", back_populates="affiliations")
    hospital = relationship("Hospital", back_populates="doctor_affiliations")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    appointment_number = Column(String(50), unique=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    family_member_name = Column(String(100), nullable=True)
    department = Column(String(100), default="General")
    appointment_date = Column(String(50), nullable=False)
    appointment_time = Column(String(50), nullable=False)
    consultation_fee = Column(Integer, default=700)
    status = Column(String(50), default="Confirmed")  # Pending, Confirmed, Completed, Cancelled, Rescheduled
    payment_status = Column(String(50), default="Pay at Hospital")
    insurance_name = Column(String(100), nullable=True)
    patient_notes = Column(Text, nullable=True)
    doctor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient_user = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    hospital = relationship("Hospital", back_populates="appointments")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    hospital_id = Column(Integer, ForeignKey("hospitals.id"), nullable=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    rating = Column(Float, default=5.0)
    cleanliness_rating = Column(Float, default=5.0)
    staff_rating = Column(Float, default=5.0)
    wait_time_rating = Column(Float, default=4.0)
    review_text = Column(Text, nullable=False)
    is_verified_patient = Column(Boolean, default=True)
    is_reported = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reviews")
    hospital = relationship("Hospital", back_populates="reviews")
    doctor = relationship("Doctor", back_populates="reviews")


class InsuranceProvider(Base):
    __tablename__ = "insurance_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(50), unique=True)
    logo_url = Column(String(500), nullable=True)
    toll_free = Column(String(50), default="1800-102-4477")
    cashless_support = Column(Boolean, default=True)

    hospital_links = relationship("HospitalInsurance", back_populates="insurance")


class HospitalInsurance(Base):
    __tablename__ = "hospital_insurances"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    insurance_id = Column(Integer, ForeignKey("insurance_providers.id"))
    is_cashless = Column(Boolean, default=True)
    tpa_desk_contact = Column(String(50), default="+91 731-255-8899")

    hospital = relationship("Hospital", back_populates="insurances")
    insurance = relationship("InsuranceProvider", back_populates="hospital_links")


class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), unique=True, nullable=False)
    short_name = Column(String(50), index=True)  # PM-JAY, Deen Dayal, etc.
    description = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=False)
    coverage_amount = Column(String(50), default="₹5,00,000 per family/year")
    documents_required = Column(Text, nullable=False)
    official_portal = Column(String(255), default="https://pmjay.gov.in")

    hospital_links = relationship("HospitalScheme", back_populates="scheme")


class HospitalScheme(Base):
    __tablename__ = "hospital_schemes"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    scheme_id = Column(Integer, ForeignKey("government_schemes.id"))
    is_empanelled = Column(Boolean, default=True)
    nodal_officer = Column(String(100), default="Dr. R. K. Gupta")
    nodal_contact = Column(String(50), default="+91 731-244-1122")

    hospital = relationship("Hospital", back_populates="schemes")
    scheme = relationship("GovernmentScheme", back_populates="hospital_links")


class HealthArticle(Base):
    __tablename__ = "health_articles"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), index=True)
    summary = Column(Text, nullable=False)
    symptoms = Column(Text, nullable=True)
    causes = Column(Text, nullable=True)
    prevention = Column(Text, nullable=True)
    when_to_see_doctor = Column(Text, nullable=False)
    relevant_specialty = Column(String(100), default="General Medicine")
    sources = Column(String(255), default="MoHFW India, WHO, Indian Council of Medical Research")
    disclaimer = Column(Text, default="This content is purely educational and does not constitute medical advice or diagnosis. Always consult a verified medical professional.")
    read_time = Column(String(20), default="4 min read")
    is_trending = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class SavedHospital(Base):
    __tablename__ = "saved_hospitals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))

    user = relationship("User", back_populates="saved_hospitals")
    hospital = relationship("Hospital")


class SavedDoctor(Base):
    __tablename__ = "saved_doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))

    user = relationship("User", back_populates="saved_doctors")
    doctor = relationship("Doctor")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="appointment")  # appointment, emergency, update, alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False)
    target_type = Column(String(100), nullable=False)  # hospital, doctor, bed, appointment, review
    target_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
