import datetime
from sqlalchemy.orm import Session
from app.database import models
from app.core.security import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(models.Hospital).first():
        print("Database already contains records. Skipping seed.")
        return

    print("Seeding CareConnect AI database with realistic Indore healthcare data...")

    # 1. Users
    pwd_hash = get_password_hash("password123")
    
    patient_user = models.User(
        email="patient@careconnect.in",
        hashed_password=pwd_hash,
        full_name="Abhishek Sharma",
        phone="+91 98260 12345",
        role="patient",
        is_active=True
    )
    
    doctor_user = models.User(
        email="doctor@careconnect.in",
        hashed_password=pwd_hash,
        full_name="Dr. Rajesh Verma",
        phone="+91 98260 23456",
        role="doctor",
        is_active=True
    )
    
    hospital_user = models.User(
        email="hospital@careconnect.in",
        hashed_password=pwd_hash,
        full_name="Medanta Indore Administrator",
        phone="+91 731-255-8000",
        role="hospital_admin",
        is_active=True
    )
    
    admin_user = models.User(
        email="admin@careconnect.in",
        hashed_password=pwd_hash,
        full_name="Platform Administrator",
        phone="+91 98260 99999",
        role="platform_admin",
        is_active=True
    )
    
    db.add_all([patient_user, doctor_user, hospital_user, admin_user])
    db.commit()

    # 2. Patient Profile & Family
    patient_profile = models.PatientProfile(
        user_id=patient_user.id,
        age=34,
        gender="Male",
        blood_group="B+",
        city="Indore",
        address="142, Scheme 54, Near Meghdoot Garden, Vijay Nagar, Indore",
        emergency_contact="+91 98260 98765",
        preferred_language="Hindi / English",
        insurance_name="Star Health Comprehensive",
        insurance_policy_no="SH-IND-2024-8841"
    )
    db.add(patient_profile)
    db.commit()

    family_members = [
        models.FamilyMember(patient_id=patient_profile.id, name="Ramakant Sharma", relationship="Father", age=68, gender="Male", blood_group="O+"),
        models.FamilyMember(patient_id=patient_profile.id, name="Sharda Sharma", relationship="Mother", age=63, gender="Female", blood_group="B+"),
        models.FamilyMember(patient_id=patient_profile.id, name="Neha Sharma", relationship="Spouse", age=32, gender="Female", blood_group="A+"),
        models.FamilyMember(patient_id=patient_profile.id, name="Aarav Sharma", relationship="Child", age=6, gender="Male", blood_group="B+")
    ]
    db.add_all(family_members)
    db.commit()

    # 3. Insurance Providers
    insurances = [
        models.InsuranceProvider(name="Star Health Insurance", code="STAR_HEALTH", toll_free="1800-425-2255", cashless_support=True),
        models.InsuranceProvider(name="HDFC ERGO Health", code="HDFC_ERGO", toll_free="1800-266-6444", cashless_support=True),
        models.InsuranceProvider(name="Care Health Insurance (Religare)", code="CARE_HEALTH", toll_free="1800-102-4488", cashless_support=True),
        models.InsuranceProvider(name="ICICI Lombard General", code="ICICI_LOMBARD", toll_free="1800-2666", cashless_support=True),
        models.InsuranceProvider(name="Niva Bupa Health Insurance", code="NIVA_BUPA", toll_free="1860-500-8888", cashless_support=True),
        models.InsuranceProvider(name="The New India Assurance", code="NEW_INDIA", toll_free="1800-209-1415", cashless_support=True)
    ]
    db.add_all(insurances)
    db.commit()

    # 4. Government Schemes
    schemes = [
        models.GovernmentScheme(
            name="Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
            short_name="PM-JAY",
            description="Flagship national health protection scheme providing secondary and tertiary care hospitalization coverage.",
            eligibility="Deprivation and occupational criteria for rural and urban areas as per SECC 2011 database, plus state-expanded PM-JAY ration card holders.",
            coverage_amount="₹5,00,000 per family per year",
            documents_required="Ayushman Bharat Golden Card, Aadhaar Card, Samagra ID, Ration Card.",
            official_portal="https://pmjay.gov.in"
        ),
        models.GovernmentScheme(
            name="Deen Dayal Swasthya Suraksha Yojana (Madhya Pradesh)",
            short_name="Deen Dayal Yojna",
            description="State-sponsored cashless healthcare assistance program for economically vulnerable families in Madhya Pradesh.",
            eligibility="BPL cardholders and registered unorganized sector workers in Madhya Pradesh.",
            coverage_amount="Up to ₹2,50,000 per family/year",
            documents_required="BPL Card, MP Samagra Family ID, Domicile Certificate, Aadhaar.",
            official_portal="https://health.mp.gov.in"
        ),
        models.GovernmentScheme(
            name="Madhya Pradesh State Employee Health Scheme",
            short_name="MP Employee Health",
            description="Comprehensive cashless hospitalization coverage for state government employees, pensioners and accredited journalists.",
            eligibility="Permanent MP State Government employees, retired pensioners, and recognized dependents.",
            coverage_amount="₹10,00,000 for critical illness, ₹5,00,000 general",
            documents_required="Employee Health Card, Employee PPO / Treasury Code ID, Aadhaar.",
            official_portal="https://health.mp.gov.in/employee"
        )
    ]
    db.add_all(schemes)
    db.commit()

    # 5. Realistic Indore Hospitals
    hospitals_data = [
        {
            "admin_user_id": hospital_user.id,
            "name": "Medanta Super Speciality Hospital Indore",
            "slug": "medanta-super-speciality-hospital-indore",
            "registration_no": "MP-IND-MED-2014-089",
            "description": "Medanta Super Speciality Hospital Indore brings world-class quaternary healthcare to Central India with NABH & NABL accreditations, a 160-slice cardiac CT, 3.0T MRI, dedicated Heart Institute, and 24x7 Level-1 Trauma Emergency.",
            "address": "Plot No. 8, PU4 Commercial, Scheme 54, Near Rasoma Square, AB Road, Indore, MP 452010",
            "area": "Vijay Nagar / Scheme 54",
            "city": "Indore",
            "phone": "+91 731-255-8000",
            "emergency_phone": "+91 731-255-8888",
            "email": "contact.indore@medanta.org",
            "website": "https://www.medanta.org/indore-hospital",
            "latitude": 22.7533,
            "longitude": 75.8937,
            "hospital_type": "Private Super Speciality",
            "verified": True,
            "verification_status": "verified",
            "rating": 4.8,
            "review_count": 384,
            "starting_fee": 800,
            "est_treatment_min": 25000,
            "est_treatment_max": 250000,
            "opd_wait_time": "15-20 mins",
            "emergency_wait_time": "Immediate (< 3 mins)",
            "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
            "cover_image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
            "beds": {"general_total": 220, "general_avail": 48, "private_total": 80, "private_avail": 18, "icu_total": 45, "icu_avail": 8, "nicu_total": 20, "nicu_avail": 5, "emergency_total": 25, "emergency_avail": 9, "ventilator_total": 30, "ventilator_avail": 7},
            "ambulances": [
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-AB-1080", "contact": "+91 98260 88801", "avail": True},
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-AB-1081", "contact": "+91 98260 88802", "avail": True},
                {"type": "Basic Life Support (BLS)", "veh": "MP-09-AB-1082", "contact": "+91 98260 88803", "avail": False}
            ]
        },
        {
            "admin_user_id": None,
            "name": "Bombay Hospital Indore",
            "slug": "bombay-hospital-indore",
            "registration_no": "MP-IND-BOM-2003-014",
            "description": "A 600-bed premier tertiary care multi-speciality landmark hospital on the Ring Road, renowned for interventional cardiology, robotic joint replacement, neurosurgery, and comprehensive cancer care in Malwa region.",
            "address": "Eastern Ring Road, IDA Scheme No. 94, Near Radisson Square, Vijay Nagar, Indore, MP 452010",
            "area": "Vijay Nagar",
            "city": "Indore",
            "phone": "+91 731-255-8866",
            "emergency_phone": "+91 731-255-8811",
            "email": "info@bombayhospitalindore.com",
            "website": "https://www.bombayhospitalindore.com",
            "latitude": 22.7547,
            "longitude": 75.8974,
            "hospital_type": "Private Trust Hospital",
            "verified": True,
            "verification_status": "verified",
            "rating": 4.7,
            "review_count": 512,
            "starting_fee": 700,
            "est_treatment_min": 18000,
            "est_treatment_max": 200000,
            "opd_wait_time": "20-25 mins",
            "emergency_wait_time": "Immediate (< 5 mins)",
            "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
            "cover_image": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
            "beds": {"general_total": 350, "general_avail": 72, "private_total": 120, "private_avail": 26, "icu_total": 60, "icu_avail": 12, "nicu_total": 25, "nicu_avail": 6, "emergency_total": 35, "emergency_avail": 14, "ventilator_total": 40, "ventilator_avail": 10},
            "ambulances": [
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-BH-2020", "contact": "+91 98261 77701", "avail": True},
                {"type": "Basic Life Support (BLS)", "veh": "MP-09-BH-2021", "contact": "+91 98261 77702", "avail": True}
            ]
        },
        {
            "admin_user_id": None,
            "name": "CHL Hospital Indore",
            "slug": "chl-hospital-indore",
            "registration_no": "MP-IND-CHL-2001-002",
            "description": "Central India's pioneer private corporate multi-speciality hospital, offering specialized interventional cardiology, nephrology & kidney transplant, gastro-sciences, and orthopedics.",
            "address": "A.B. Road, Near LIG Square, Anoop Nagar, Indore, MP 452008",
            "area": "AB Road / Palasia",
            "city": "Indore",
            "phone": "+91 731-477-4444",
            "emergency_phone": "+91 731-477-4400",
            "email": "contact@chlhospitals.com",
            "website": "https://www.chlhospitals.com",
            "latitude": 22.7305,
            "longitude": 75.8821,
            "hospital_type": "Private Super Speciality",
            "verified": True,
            "verification_status": "verified",
            "rating": 4.6,
            "review_count": 298,
            "starting_fee": 600,
            "est_treatment_min": 15000,
            "est_treatment_max": 180000,
            "opd_wait_time": "15-30 mins",
            "emergency_wait_time": "Immediate (< 4 mins)",
            "image_url": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
            "cover_image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
            "beds": {"general_total": 180, "general_avail": 34, "private_total": 60, "private_avail": 12, "icu_total": 35, "icu_avail": 5, "nicu_total": 15, "nicu_avail": 3, "emergency_total": 20, "emergency_avail": 6, "ventilator_total": 22, "ventilator_avail": 4},
            "ambulances": [
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-CH-3030", "contact": "+91 98262 66601", "avail": True}
            ]
        },
        {
            "admin_user_id": None,
            "name": "Choithram Hospital & Research Centre",
            "slug": "choithram-hospital-indore",
            "registration_no": "MP-IND-CHO-1979-001",
            "description": "A historic, trust-run 350-bed multi-speciality tertiary care institution renowned for charitable and ethical care, comprehensive oncology, pediatrics, dialysis, and burn ICU.",
            "address": "14, Manik Bagh Road, Dhar Kothi, Indore, MP 452014",
            "area": "Manik Bagh / South Indore",
            "city": "Indore",
            "phone": "+91 731-247-4101",
            "emergency_phone": "+91 731-247-4100",
            "email": "care@choithram.org",
            "website": "https://www.choithram.org",
            "latitude": 22.7001,
            "longitude": 75.8456,
            "hospital_type": "Charitable Trust Super Speciality",
            "verified": True,
            "verification_status": "verified",
            "rating": 4.7,
            "review_count": 420,
            "starting_fee": 400,
            "est_treatment_min": 10000,
            "est_treatment_max": 140000,
            "opd_wait_time": "25-35 mins",
            "emergency_wait_time": "Immediate (< 5 mins)",
            "image_url": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
            "cover_image": "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80",
            "beds": {"general_total": 240, "general_avail": 55, "private_total": 70, "private_avail": 15, "icu_total": 40, "icu_avail": 9, "nicu_total": 20, "nicu_avail": 7, "emergency_total": 25, "emergency_avail": 10, "ventilator_total": 28, "ventilator_avail": 8},
            "ambulances": [
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-CT-4040", "contact": "+91 98263 55501", "avail": True},
                {"type": "Basic Life Support (BLS)", "veh": "MP-09-CT-4041", "contact": "+91 98263 55502", "avail": True}
            ]
        },
        {
            "admin_user_id": None,
            "name": "Sri Aurobindo Institute of Medical Sciences (SAIMS)",
            "slug": "saims-hospital-indore",
            "registration_no": "MP-IND-SAI-2005-045",
            "description": "One of the largest medical university hospitals in Central India with over 1,200 beds, state-of-the-art super specialities, organ transplant centre, and dedicated Ayushman Bharat PM-JAY wing.",
            "address": "Indore-Ujjain Highway, Near MR-10 Crossing, Bhawrasla, Indore, MP 453555",
            "area": "MR-10 / Bhawrasla",
            "city": "Indore",
            "phone": "+91 731-423-1000",
            "emergency_phone": "+91 731-423-1108",
            "email": "info@saimsonline.com",
            "website": "https://www.saimsonline.com",
            "latitude": 22.7845,
            "longitude": 75.8562,
            "hospital_type": "Medical College & Super Speciality",
            "verified": True,
            "verification_status": "verified",
            "rating": 4.5,
            "review_count": 680,
            "starting_fee": 300,
            "est_treatment_min": 8000,
            "est_treatment_max": 120000,
            "opd_wait_time": "30-40 mins",
            "emergency_wait_time": "Immediate (< 5 mins)",
            "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
            "cover_image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
            "beds": {"general_total": 700, "general_avail": 145, "private_total": 150, "private_avail": 32, "icu_total": 85, "icu_avail": 14, "nicu_total": 35, "nicu_avail": 8, "emergency_total": 50, "emergency_avail": 18, "ventilator_total": 60, "ventilator_avail": 12},
            "ambulances": [
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-SA-5050", "contact": "+91 98264 44401", "avail": True},
                {"type": "Basic Life Support (BLS)", "veh": "MP-09-SA-5051", "contact": "+91 98264 44402", "avail": True}
            ]
        },
        {
            "admin_user_id": None,
            "name": "Shalby Super Speciality Hospital Indore",
            "slug": "shalby-hospital-indore",
            "registration_no": "MP-IND-SHA-2012-031",
            "description": "Internationally acclaimed center for Joint Replacement, Arthroscopy, spine surgery, cardiac sciences, and comprehensive sports medicine.",
            "address": "R.S. Bhandari Marg, Janjeerwala Square, New Palasia, Indore, MP 452001",
            "area": "New Palasia",
            "city": "Indore",
            "phone": "+91 731-667-7777",
            "emergency_phone": "+91 731-667-7700",
            "email": "indore.info@shalby.in",
            "website": "https://www.shalby.org/indore",
            "latitude": 22.7238,
            "longitude": 75.8791,
            "hospital_type": "Private Super Speciality",
            "verified": True,
            "verification_status": "verified",
            "rating": 4.6,
            "review_count": 215,
            "starting_fee": 750,
            "est_treatment_min": 22000,
            "est_treatment_max": 220000,
            "opd_wait_time": "15-25 mins",
            "emergency_wait_time": "Immediate (< 5 mins)",
            "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
            "cover_image": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80",
            "beds": {"general_total": 160, "general_avail": 38, "private_total": 60, "private_avail": 14, "icu_total": 28, "icu_avail": 6, "nicu_total": 12, "nicu_avail": 3, "emergency_total": 18, "emergency_avail": 7, "ventilator_total": 18, "ventilator_avail": 5},
            "ambulances": [
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-SH-6060", "contact": "+91 98265 33301", "avail": True}
            ]
        },
        {
            "admin_user_id": None,
            "name": "Apple Hospital & Research Centre",
            "slug": "apple-hospital-indore",
            "registration_no": "MP-IND-APP-2009-021",
            "description": "Multi-speciality hub serving South and Central Indore with advanced neonatology, pediatrics, general surgery, dialysis, and 24x7 emergency medical trauma care.",
            "address": "Bhawarkua Main Road, Transport Nagar, Near Apple Square, Indore, MP 452014",
            "area": "Bhawarkua",
            "city": "Indore",
            "phone": "+91 731-404-0000",
            "emergency_phone": "+91 731-404-0009",
            "email": "care@applehospital.in",
            "website": "https://www.applehospital.in",
            "latitude": 22.6952,
            "longitude": 75.8643,
            "hospital_type": "Private Multi-Speciality",
            "verified": True,
            "verification_status": "verified",
            "rating": 4.4,
            "review_count": 180,
            "starting_fee": 500,
            "est_treatment_min": 12000,
            "est_treatment_max": 130000,
            "opd_wait_time": "15-20 mins",
            "emergency_wait_time": "Immediate (< 5 mins)",
            "image_url": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
            "cover_image": "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80",
            "beds": {"general_total": 130, "general_avail": 31, "private_total": 45, "private_avail": 10, "icu_total": 24, "icu_avail": 4, "nicu_total": 16, "nicu_avail": 5, "emergency_total": 15, "emergency_avail": 6, "ventilator_total": 15, "ventilator_avail": 4},
            "ambulances": [
                {"type": "Advanced Life Support (ALS)", "veh": "MP-09-AP-7070", "contact": "+91 98266 22201", "avail": True}
            ]
        }
    ]

    hosp_objects = []
    for hd in hospitals_data:
        h = models.Hospital(
            admin_user_id=hd["admin_user_id"],
            name=hd["name"],
            slug=hd["slug"],
            registration_no=hd["registration_no"],
            description=hd["description"],
            address=hd["address"],
            area=hd["area"],
            city=hd["city"],
            phone=hd["phone"],
            emergency_phone=hd["emergency_phone"],
            email=hd["email"],
            website=hd["website"],
            latitude=hd["latitude"],
            longitude=hd["longitude"],
            hospital_type=hd["hospital_type"],
            verified=hd["verified"],
            verification_status=hd["verification_status"],
            rating=hd["rating"],
            review_count=hd["review_count"],
            starting_fee=hd["starting_fee"],
            est_treatment_min=hd["est_treatment_min"],
            est_treatment_max=hd["est_treatment_max"],
            opd_wait_time=hd["opd_wait_time"],
            emergency_wait_time=hd["emergency_wait_time"],
            image_url=hd["image_url"],
            cover_image=hd["cover_image"],
            is_emergency_active=True
        )
        db.add(h)
        db.commit()
        hosp_objects.append(h)

        # Bed inventory
        b = hd["beds"]
        bed_inv = models.BedInventory(
            hospital_id=h.id,
            general_total=b["general_total"],
            general_avail=b["general_avail"],
            private_total=b["private_total"],
            private_avail=b["private_avail"],
            icu_total=b["icu_total"],
            icu_avail=b["icu_avail"],
            nicu_total=b["nicu_total"],
            nicu_avail=b["nicu_avail"],
            emergency_total=b["emergency_total"],
            emergency_avail=b["emergency_avail"],
            ventilator_total=b["ventilator_total"],
            ventilator_avail=b["ventilator_avail"]
        )
        db.add(bed_inv)

        # Ambulances
        for amb in hd["ambulances"]:
            db.add(models.HospitalAmbulance(
                hospital_id=h.id,
                ambulance_type=amb["type"],
                vehicle_number=amb["veh"],
                driver_contact=amb["contact"],
                is_available=amb["avail"]
            ))

        # Standard Departments
        depts = ["Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Gynecology", "Dermatology", "General Medicine", "Gastroenterology", "Emergency & Trauma"]
        for dept in depts:
            db.add(models.HospitalDepartment(
                hospital_id=h.id,
                name=dept,
                description=f"Advanced Department of {dept} with dedicated consultation, procedural suites, and inpatient beds.",
                hod_name=f"Dr. Senior Consultant ({dept})",
                opd_timings="09:30 AM - 04:30 PM",
                emergency_ready=True
            ))

        # Facilities
        facs = ["24x7 Emergency", "ICU & Critical Care", "NICU", "Operation Theatres", "CT Scan & MRI", "In-House Pharmacy", "Blood Bank", "Dialysis Unit", "Digital X-Ray"]
        for fac in facs:
            db.add(models.HospitalFacility(hospital_id=h.id, facility_name=fac))

        # Link Insurances
        for ins in insurances:
            db.add(models.HospitalInsurance(hospital_id=h.id, insurance_id=ins.id, is_cashless=True))

        # Link Schemes
        for sc in schemes:
            db.add(models.HospitalScheme(hospital_id=h.id, scheme_id=sc.id, is_empanelled=True))

    db.commit()

    # 6. Doctors
    doctors_data = [
        {
            "user_id": doctor_user.id,
            "name": "Dr. Rajesh Verma",
            "qualification": "MBBS, MD (General Medicine), DM (Cardiology) - AIIMS",
            "experience_years": 16,
            "specialization": "Cardiology",
            "registration_council": "Madhya Pradesh Medical Council",
            "registration_number": "MPMC-2009-4412",
            "about": "Senior Interventional Cardiologist specializing in complex angioplasty, heart failure management, pacemaker implantation, and cardiac preventative care in Indore.",
            "languages": "Hindi, English",
            "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
            "rating": 4.9,
            "review_count": 142,
            "affiliations": [
                {"hosp_idx": 0, "dept": "Cardiology", "fee": 800, "days": "Mon, Tue, Wed, Thu, Fri", "time": "10:00 AM - 02:00 PM"},
                {"hosp_idx": 1, "dept": "Cardiology", "fee": 900, "days": "Mon, Wed, Fri", "time": "05:00 PM - 08:00 PM"}
            ]
        },
        {
            "user_id": None,
            "name": "Dr. Priya Malviya",
            "qualification": "MBBS, MS (Orthopedics), Fellowship in Joint Replacement (Germany)",
            "experience_years": 14,
            "specialization": "Orthopedics",
            "registration_council": "Madhya Pradesh Medical Council",
            "registration_number": "MPMC-2011-5821",
            "about": "Renowned Orthopedic Surgeon with extensive expertise in minimally invasive knee and hip replacements, arthroscopy, and sports trauma management.",
            "languages": "Hindi, English, Malwi",
            "photo_url": "https://images.unsplash.com/photo-1594824813576-696232537021?auto=format&fit=crop&w=400&q=80",
            "rating": 4.8,
            "review_count": 118,
            "affiliations": [
                {"hosp_idx": 5, "dept": "Orthopedics", "fee": 750, "days": "Mon, Tue, Wed, Thu, Fri, Sat", "time": "11:00 AM - 03:00 PM"},
                {"hosp_idx": 0, "dept": "Orthopedics", "fee": 800, "days": "Tue, Thu, Sat", "time": "04:00 PM - 07:00 PM"}
            ]
        },
        {
            "user_id": None,
            "name": "Dr. Amit Joshi",
            "qualification": "MBBS, MD (Medicine), DM (Neurology) - PGI Chandigarh",
            "experience_years": 12,
            "specialization": "Neurology",
            "registration_council": "Madhya Pradesh Medical Council",
            "registration_number": "MPMC-2013-6712",
            "about": "Consultant Neurologist focused on acute stroke intervention, epilepsy, Parkinson's disease, neuromuscular disorders, and chronic migraines.",
            "languages": "Hindi, English",
            "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
            "rating": 4.8,
            "review_count": 96,
            "affiliations": [
                {"hosp_idx": 1, "dept": "Neurology", "fee": 700, "days": "Mon, Tue, Wed, Thu, Fri", "time": "10:30 AM - 01:30 PM"},
                {"hosp_idx": 2, "dept": "Neurology", "fee": 650, "days": "Mon, Wed, Fri", "time": "03:30 PM - 06:30 PM"}
            ]
        },
        {
            "user_id": None,
            "name": "Dr. Sneha Kulkarni",
            "qualification": "MBBS, MD (Pediatrics), DNB (Neonatology)",
            "experience_years": 9,
            "specialization": "Pediatrics",
            "registration_council": "Madhya Pradesh Medical Council",
            "registration_number": "MPMC-2016-8902",
            "about": "Specialist Pediatrician & Neonatologist providing caring child health care, growth tracking, newborn intensive care, and vaccination regimens.",
            "languages": "Hindi, English, Marathi",
            "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
            "rating": 4.9,
            "review_count": 134,
            "affiliations": [
                {"hosp_idx": 6, "dept": "Pediatrics", "fee": 500, "days": "Mon, Tue, Wed, Thu, Fri, Sat", "time": "09:00 AM - 01:00 PM"},
                {"hosp_idx": 3, "dept": "Pediatrics", "fee": 450, "days": "Mon, Wed, Fri", "time": "04:00 PM - 07:00 PM"}
            ]
        },
        {
            "user_id": None,
            "name": "Dr. Ananya Trivedi",
            "qualification": "MBBS, MS (Obstetrics & Gynecology), Fellowship in Laparoscopy",
            "experience_years": 15,
            "specialization": "Gynecology",
            "registration_council": "Madhya Pradesh Medical Council",
            "registration_number": "MPMC-2010-3814",
            "about": "Senior Consultant Gynecologist and Obstetrician known for high-risk pregnancy management, PCOS counseling, and laparoscopic surgeries.",
            "languages": "Hindi, English",
            "photo_url": "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80",
            "rating": 4.9,
            "review_count": 182,
            "affiliations": [
                {"hosp_idx": 3, "dept": "Gynecology", "fee": 500, "days": "Mon, Tue, Wed, Thu, Fri", "time": "10:00 AM - 02:00 PM"},
                {"hosp_idx": 0, "dept": "Gynecology", "fee": 750, "days": "Tue, Thu, Sat", "time": "03:00 PM - 06:00 PM"}
            ]
        },
        {
            "user_id": None,
            "name": "Dr. Vikramaditya Solanki",
            "qualification": "MBBS, MD (Dermatology, Venereology & Leprosy)",
            "experience_years": 11,
            "specialization": "Dermatology",
            "registration_council": "Madhya Pradesh Medical Council",
            "registration_number": "MPMC-2014-7231",
            "about": "Clinical Dermatologist specializing in stubborn skin allergies, psoriasis, acne scar treatments, hair-loss therapies, and laser cosmetic procedures.",
            "languages": "Hindi, English",
            "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
            "rating": 4.7,
            "review_count": 89,
            "affiliations": [
                {"hosp_idx": 2, "dept": "Dermatology", "fee": 600, "days": "Mon, Tue, Wed, Thu, Fri", "time": "11:00 AM - 03:00 PM"}
            ]
        },
        {
            "user_id": None,
            "name": "Dr. Harshwardhan Rathore",
            "qualification": "MBBS, MD (Internal Medicine) - MGM Medical College Indore",
            "experience_years": 18,
            "specialization": "General Medicine",
            "registration_council": "Madhya Pradesh Medical Council",
            "registration_number": "MPMC-2007-2109",
            "about": "Senior Physician managing infectious illnesses, diabetes care, hypertension, fever investigations, and chronic lifestyle disorders in Indore.",
            "languages": "Hindi, English, Malwi",
            "photo_url": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
            "rating": 4.8,
            "review_count": 210,
            "affiliations": [
                {"hosp_idx": 1, "dept": "General Medicine", "fee": 700, "days": "Mon, Tue, Wed, Thu, Fri, Sat", "time": "09:30 AM - 01:30 PM"},
                {"hosp_idx": 4, "dept": "General Medicine", "fee": 300, "days": "Mon, Wed, Fri", "time": "03:00 PM - 06:00 PM"}
            ]
        }
    ]

    for dd in doctors_data:
        doc = models.Doctor(
            user_id=dd["user_id"],
            name=dd["name"],
            qualification=dd["qualification"],
            experience_years=dd["experience_years"],
            specialization=dd["specialization"],
            registration_council=dd["registration_council"],
            registration_number=dd["registration_number"],
            about=dd["about"],
            languages=dd["languages"],
            photo_url=dd["photo_url"],
            rating=dd["rating"],
            review_count=dd["review_count"],
            verified=True,
            verification_status="verified"
        )
        db.add(doc)
        db.commit()

        for aff in dd["affiliations"]:
            target_hosp = hosp_objects[aff["hosp_idx"]]
            db.add(models.DoctorHospitalAffiliation(
                doctor_id=doc.id,
                hospital_id=target_hosp.id,
                department=aff["dept"],
                consultation_fee=aff["fee"],
                days_of_week=aff["days"],
                opd_timings=aff["time"],
                is_active=True
            ))
        db.commit()

    # 7. Sample Initial Appointments for Demo Patient
    app1 = models.Appointment(
        appointment_number="CC-IND-2026-09191",
        patient_id=patient_user.id,
        doctor_id=1,  # Dr. Rajesh Verma
        hospital_id=1,  # Medanta Indore
        family_member_name="Self",
        department="Cardiology",
        appointment_date="2026-09-21",
        appointment_time="11:30 AM",
        consultation_fee=800,
        status="Confirmed",
        payment_status="Pay at Hospital",
        insurance_name="Star Health Comprehensive",
        patient_notes="Routine 6-month blood pressure review and mild exertion checkup."
    )
    
    app2 = models.Appointment(
        appointment_number="CC-IND-2026-09192",
        patient_id=patient_user.id,
        doctor_id=2,  # Dr. Priya Malviya
        hospital_id=6,  # Shalby
        family_member_name="Ramakant Sharma (Father)",
        department="Orthopedics",
        appointment_date="2026-09-24",
        appointment_time="12:00 PM",
        consultation_fee=750,
        status="Confirmed",
        payment_status="Pay at Hospital",
        insurance_name="Star Health Comprehensive",
        patient_notes="Father experiencing bilateral knee stiffness for 3 weeks."
    )
    db.add_all([app1, app2])
    db.commit()

    # 8. Health Articles & Guides
    articles = [
        models.HealthArticle(
            slug="dengue-prevention-and-care-indore",
            title="Dengue Awareness & Platelet Care: What You Must Know in Malwa",
            category="Seasonal infections",
            summary="Essential medical guide on identifying early warning signs of dengue, platelet count monitoring, and hydration protocols.",
            symptoms="High fever (103°F+), severe headache, retro-orbital pain (behind the eyes), joint aches, and petechial rashes.",
            causes="Transmission via infected Aedes aegypti mosquitoes breeding in stagnant freshwater.",
            prevention="Prevent water accumulation in coolers and flowerpots, use DEET mosquito repellents, and wear covered clothing.",
            when_to_see_doctor="Seek emergency evaluation immediately if you observe persistent vomiting, severe abdominal pain, gum bleeding, or platelet drop below 50,000.",
            relevant_specialty="General Medicine",
            read_time="4 min read",
            is_trending=True
        ),
        models.HealthArticle(
            slug="cardiac-health-winter-alert",
            title="Heart Health & Cold Weather: Managing Blood Pressure & Cardiac Strain",
            category="Heart health",
            summary="Understanding why cold weather constricts blood vessels, raises blood pressure, and increases cardiac workload.",
            symptoms="Morning chest tightness, shortness of breath upon brisk walking, palpitations, or lightheadedness.",
            causes="Vasoconstriction due to low ambient temperatures causing elevated systemic vascular resistance.",
            prevention="Avoid vigorous early morning walks during peak cold; exercise indoors, monitor BP daily, and stay warm.",
            when_to_see_doctor="Any chest pressure, crushing pain radiating to the left arm or jaw, or sudden breathlessness requires immediate emergency attention.",
            relevant_specialty="Cardiology",
            read_time="5 min read",
            is_trending=True
        ),
        models.HealthArticle(
            slug="diabetes-and-lifestyle-management",
            title="Comprehensive Diabetes Management: Diet, HbA1c & Kidney Protection",
            category="Diabetes",
            summary="Practical guidelines for managing Type 2 diabetes, monitoring HbA1c every 3 months, and preventing diabetic retinopathy & nephropathy.",
            symptoms="Frequent urination (polyuria), increased thirst (polydipsia), unexplained weight loss, and slow wound healing.",
            causes="Insulin resistance and relative insulin deficiency compounded by sedentary lifestyle and high-glycemic diets.",
            prevention="Balanced high-fiber meals, 45 minutes daily physical activity, and routine glycemic screening.",
            when_to_see_doctor="Fasting blood glucose consistently > 140 mg/dL, foot ulcers, or visual blurriness.",
            relevant_specialty="General Medicine",
            read_time="6 min read",
            is_trending=False
        ),
        models.HealthArticle(
            slug="knee-arthritis-joint-replacement-guide",
            title="Understanding Knee Osteoarthritis: Exercises vs. When Surgery is Needed",
            category="Bone & Joint Health",
            summary="Clear overview of knee cartilage degeneration stages, non-surgical relief, and modern robotic total knee replacement.",
            symptoms="Morning joint stiffness, crepitus (crackling sounds in knees), pain while descending stairs, and bow-leg deformity.",
            causes="Wear and tear of articular cartilage over age, previous meniscus injury, or hereditary predisposition.",
            prevention="Maintain healthy BMI, low-impact cycling/swimming, and quadriceps strengthening exercises.",
            when_to_see_doctor="Severe resting pain, inability to walk 100 meters without halting, or visible knee alignment changes.",
            relevant_specialty="Orthopedics",
            read_time="5 min read",
            is_trending=True
        )
    ]
    db.add_all(articles)
    db.commit()

    # 9. Verified Reviews
    reviews = [
        models.Review(
            user_id=patient_user.id,
            hospital_id=1,
            doctor_id=1,
            rating=5.0,
            cleanliness_rating=5.0,
            staff_rating=5.0,
            wait_time_rating=4.5,
            review_text="Dr. Rajesh Verma at Medanta Indore provided exceptional clarity on my father's cardiac stent followup. Clean OPD, clear billing, and very helpful staff.",
            is_verified_patient=True
        ),
        models.Review(
            user_id=patient_user.id,
            hospital_id=2,
            doctor_id=3,
            rating=4.8,
            cleanliness_rating=4.5,
            staff_rating=5.0,
            wait_time_rating=4.0,
            review_text="Bombay Hospital Indore has incredible emergency care. When my uncle experienced acute vertigo, the triage team acted within 4 minutes. Highly recommended.",
            is_verified_patient=True
        )
    ]
    db.add_all(reviews)
    db.commit()

    # 10. Notifications
    notifs = [
        models.Notification(
            user_id=patient_user.id,
            title="Appointment Confirmed",
            message="Your appointment with Dr. Rajesh Verma at Medanta Super Speciality Hospital Indore is confirmed for 21 Sep 2026 at 11:30 AM.",
            notification_type="appointment"
        ),
        models.Notification(
            user_id=patient_user.id,
            title="Healthcare Advisory: Dengue in Indore",
            message="Municipal health bulletin: Free Dengue NS1 testing and platelet beds available at Choithram and Medanta emergency centers.",
            notification_type="alert"
        )
    ]
    db.add_all(notifs)
    db.commit()

    print("Database successfully seeded with realistic Indore healthcare dataset!")
