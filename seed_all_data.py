import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend'))
sys.path.insert(0, backend_dir)

db_path = os.path.join(backend_dir, 'careconnect.db').replace('\\', '/')
os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"

from app.database.session import SessionLocal, engine, Base
from app.database import models

# Ensure schema tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

print("Seeding full healthcare dataset into SQLite careconnect.db...")

# 1. Fetch or create hospitals
hospitals_data = [
    {
        "name": "Medanta Super Speciality Hospital Indore",
        "slug": "medanta-super-speciality-hospital-indore",
        "registration_no": "MP-IND-MED-2014-089",
        "description": "Medanta Super Speciality Hospital Indore brings world-class quaternary healthcare to Central India with NABH & NABL accreditations, a 160-slice cardiac CT, 3.0T MRI, dedicated Heart Institute, and 24x7 Level-1 Trauma Emergency.",
        "address": "Plot No. 8, PU4 Commercial, Scheme 54, Near Rasoma Square, AB Road, Indore, MP 452010",
        "area": "Vijay Nagar / Scheme 54",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-255-8000",
        "emergency_phone": "+91 731-255-8888",
        "email": "contact.indore@medanta.org",
        "website": "https://www.medanta.org/indore-hospital",
        "latitude": 22.7533,
        "longitude": 75.8937,
        "hospital_type": "Private Super Speciality",
        "verified": True,
        "rating": 4.8,
        "review_count": 384,
        "starting_fee": 800,
        "est_treatment_min": 25000,
        "est_treatment_max": 250000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 3 mins)",
        "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Bombay Hospital Indore",
        "slug": "bombay-hospital-indore",
        "registration_no": "MP-IND-BOM-2003-014",
        "description": "A 600-bed premier tertiary care multi-speciality landmark hospital on the Ring Road, renowned for interventional cardiology, robotic joint replacement, neurosurgery, and comprehensive cancer care in Malwa region.",
        "address": "Eastern Ring Road, IDA Scheme No. 94, Near Radisson Square, Vijay Nagar, Indore, MP 452010",
        "area": "Vijay Nagar",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-255-8866",
        "emergency_phone": "+91 731-255-8811",
        "email": "info@bombayhospitalindore.com",
        "website": "https://www.bombayhospitalindore.com",
        "latitude": 22.7547,
        "longitude": 75.8974,
        "hospital_type": "Private Trust Hospital",
        "verified": True,
        "rating": 4.7,
        "review_count": 512,
        "starting_fee": 700,
        "est_treatment_min": 18000,
        "est_treatment_max": 200000,
        "opd_wait_time": "20-25 mins",
        "emergency_wait_time": "Immediate (< 5 mins)",
        "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "CHL Hospital Indore",
        "slug": "chl-hospital-indore",
        "registration_no": "MP-IND-CHL-2001-002",
        "description": "Central India's pioneer private corporate super-speciality hospital, recognized for breakthrough cardiovascular surgeries, interventional neurology, and advanced gastroenterology.",
        "address": "AB Road, Near LIG Square, Anoop Nagar, Indore, MP 452008",
        "area": "AB Road / LIG Square",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-477-4444",
        "emergency_phone": "+91 731-477-4100",
        "email": "info@chlhospitals.com",
        "website": "https://www.carehospitals.com/chl-indore",
        "latitude": 22.7388,
        "longitude": 75.8892,
        "hospital_type": "Private Corporate Hospital",
        "verified": True,
        "rating": 4.6,
        "review_count": 298,
        "starting_fee": 600,
        "est_treatment_min": 15000,
        "est_treatment_max": 180000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 4 mins)",
        "image_url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Choithram Hospital & Research Centre",
        "slug": "choithram-hospital-indore",
        "registration_no": "MP-IND-CHO-1979-001",
        "description": "A legendary charitable trust healthcare institution in Indore serving Central India for over 45 years with an extensive organ transplant program, burn unit, and high-volume multi-speciality OPDs.",
        "address": "Manik Bagh Road, Choithram Square, Indore, MP 452014",
        "area": "Manik Bagh",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-247-4101",
        "emergency_phone": "+91 731-247-4100",
        "email": "contact@choithram.org",
        "website": "https://www.choithram.org",
        "latitude": 22.6934,
        "longitude": 75.8456,
        "hospital_type": "Charitable Trust Hospital",
        "verified": True,
        "rating": 4.7,
        "review_count": 420,
        "starting_fee": 400,
        "est_treatment_min": 10000,
        "est_treatment_max": 140000,
        "opd_wait_time": "25-30 mins",
        "emergency_wait_time": "Immediate (< 4 mins)",
        "image_url": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Sri Aurobindo Institute of Medical Sciences (SAIMS)",
        "slug": "saims-hospital-indore",
        "registration_no": "MP-IND-SAI-2003-088",
        "description": "One of the largest medical college hospitals in Central India with over 1200 beds, multi-organ transplant center, advanced oncology institute, and robotic surgical suites.",
        "address": "Indore-Ujjain Highway, Sanwer Road, Bhawrasla, Indore, MP 453555",
        "area": "Bhawrasla / Ujjain Road",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-423-1000",
        "emergency_phone": "+91 731-423-1111",
        "email": "contact@saimsonline.com",
        "website": "https://www.saimsonline.com",
        "latitude": 22.7842,
        "longitude": 75.8361,
        "hospital_type": "Medical College Super Speciality",
        "verified": True,
        "rating": 4.5,
        "review_count": 680,
        "starting_fee": 300,
        "est_treatment_min": 8000,
        "est_treatment_max": 120000,
        "opd_wait_time": "25-35 mins",
        "emergency_wait_time": "Immediate (< 2 mins)",
        "image_url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Shalby Super Speciality Hospital Indore",
        "slug": "shalby-hospital-indore",
        "registration_no": "MP-IND-SHA-2012-045",
        "description": "Renowned globally for total joint replacement surgeries, arthroscopy, spine intervention, and sports medicine with computerized navigation suites.",
        "address": "R.S. Bhandari Marg, Janjeerwala Square, New Palasia, Indore, MP 452001",
        "area": "New Palasia",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-667-7777",
        "emergency_phone": "+91 731-667-7100",
        "email": "info.indore@shalby.in",
        "website": "https://www.shalby.org/indore",
        "latitude": 22.7265,
        "longitude": 75.8794,
        "hospital_type": "Private Super Speciality",
        "verified": True,
        "rating": 4.6,
        "review_count": 215,
        "starting_fee": 750,
        "est_treatment_min": 22000,
        "est_treatment_max": 210000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 5 mins)",
        "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Apple Hospital & Research Centre",
        "slug": "apple-hospital-indore",
        "registration_no": "MP-IND-APP-2009-031",
        "description": "A trusted multi-speciality healthcare facility in south Indore offering comprehensive trauma care, renal sciences, general laparoscopy, and round-the-clock emergency services.",
        "address": "Bhuvneshwari Nagar, Near Bhawarkua Square, AB Road, Indore, MP 452001",
        "area": "Bhawarkua",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-400-5000",
        "emergency_phone": "+91 731-400-5108",
        "email": "contact@applehospitalindore.com",
        "website": "https://www.applehospitalindore.com",
        "latitude": 22.6975,
        "longitude": 75.8643,
        "hospital_type": "Private Multi Speciality",
        "verified": True,
        "rating": 4.5,
        "review_count": 178,
        "starting_fee": 500,
        "est_treatment_min": 12000,
        "est_treatment_max": 130000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 4 mins)",
        "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Apollo Hospitals Indore",
        "slug": "apollo-hospitals-indore",
        "registration_no": "MP-IND-APO-2014-067",
        "description": "Part of the prestigious Apollo Hospitals Group, bringing advanced tertiary care, JCI/NABH accredited standards, robotic oncology, and 24x7 emergency response to Indore.",
        "address": "Sector D, Scheme No 74C, Near Meghdoot Garden, Vijay Nagar, Indore, MP 452010",
        "area": "Vijay Nagar",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-244-5555",
        "emergency_phone": "+91 731-244-5106",
        "email": "indore@apollohospitals.com",
        "website": "https://indore.apollohospitals.com",
        "latitude": 22.7562,
        "longitude": 75.8921,
        "hospital_type": "Private Super Speciality",
        "verified": True,
        "rating": 4.8,
        "review_count": 360,
        "starting_fee": 900,
        "est_treatment_min": 28000,
        "est_treatment_max": 270000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 3 mins)",
        "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Greater Kailash Hospital",
        "slug": "greater-kailash-hospital-indore",
        "registration_no": "MP-IND-GK-1988-011",
        "description": "Centrally located multi-speciality landmark hospital renowned for advanced cardiology, general laparoscopy, intensive care, and obstetrics in Old Palasia.",
        "address": "11/2, Old Palasia, Near Industry House, AB Road, Indore, MP 452001",
        "area": "Old Palasia",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-404-5000",
        "emergency_phone": "+91 731-404-5100",
        "email": "info@gkhospital.com",
        "website": "https://www.gkhospital.com",
        "latitude": 22.7231,
        "longitude": 75.8785,
        "hospital_type": "Private Multi Speciality",
        "verified": True,
        "rating": 4.6,
        "review_count": 240,
        "starting_fee": 600,
        "est_treatment_min": 16000,
        "est_treatment_max": 160000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 4 mins)",
        "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Vishesh Jupiter Hospital",
        "slug": "vishesh-jupiter-hospital-indore",
        "registration_no": "MP-IND-VIS-2018-052",
        "description": "State-of-the-art tertiary care center situated on Ring Road with leading organ transplant, interventional cardiology, nephrology, and Level-1 trauma response.",
        "address": "Near Teen Imli Square, Ring Road, Palda, Indore, MP 452001",
        "area": "Ring Road",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-477-7777",
        "emergency_phone": "+91 731-477-7108",
        "email": "vishesh.indore@jupiterhospital.com",
        "website": "https://www.jupiterhospital.com/indore",
        "latitude": 22.6890,
        "longitude": 75.8821,
        "hospital_type": "Private Super Speciality",
        "verified": True,
        "rating": 4.7,
        "review_count": 195,
        "starting_fee": 700,
        "est_treatment_min": 20000,
        "est_treatment_max": 220000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 4 mins)",
        "image_url": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "Suyash Hospital Indore",
        "slug": "suyash-hospital-indore",
        "registration_no": "MP-IND-SUY-2015-044",
        "description": "Modern multi-speciality hospital in Vijay Nagar specialized in obstetrics, high-risk neonatology, laparoscopic surgery, and comprehensive critical care.",
        "address": "Scheme No. 54, PU-4 Commercial, Near Orbit Mall, Vijay Nagar, Indore, MP 452010",
        "area": "Vijay Nagar / Scheme 54",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-257-2222",
        "emergency_phone": "+91 731-257-2100",
        "email": "contact@suyashhospitalindore.com",
        "website": "https://www.suyashhospitalindore.com",
        "latitude": 22.7489,
        "longitude": 75.8950,
        "hospital_type": "Private Multi Speciality",
        "verified": True,
        "rating": 4.6,
        "review_count": 165,
        "starting_fee": 550,
        "est_treatment_min": 14000,
        "est_treatment_max": 140000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 4 mins)",
        "image_url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    },
    {
        "name": "CARE CHL Hospital & Cancer Centre",
        "slug": "care-chl-cancer-centre-indore",
        "registration_no": "MP-IND-CAR-2016-083",
        "description": "Premier dedicated oncology center in Central India offering comprehensive surgical oncology, medical oncology, linear accelerator radiation therapy, and bone marrow transplant.",
        "address": "Paliwal Nagar, Near AB Road, Indore, MP 452008",
        "area": "AB Road",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "phone": "+91 731-477-8000",
        "emergency_phone": "+91 731-477-8100",
        "email": "cancer.indore@carehospitals.com",
        "website": "https://www.carehospitals.com/chl-cancer-centre",
        "latitude": 22.7355,
        "longitude": 75.8860,
        "hospital_type": "Dedicated Oncology Centre",
        "verified": True,
        "rating": 4.8,
        "review_count": 180,
        "starting_fee": 800,
        "est_treatment_min": 30000,
        "est_treatment_max": 350000,
        "opd_wait_time": "15-20 mins",
        "emergency_wait_time": "Immediate (< 5 mins)",
        "image_url": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        "is_emergency_active": True,
    }
]

hosp_map = {}
for data in hospitals_data:
    h = db.query(models.Hospital).filter(models.Hospital.slug == data["slug"]).first()
    if not h:
        h = models.Hospital(**data)
        db.add(h)
        db.commit()
        db.refresh(h)
        print(f"Created hospital: {h.name}")
        
        # Add bed inventory
        bed = models.BedInventory(
            hospital_id=h.id,
            general_total=180,
            general_avail=45,
            private_total=60,
            private_avail=15,
            icu_total=30,
            icu_avail=6,
            nicu_total=12,
            nicu_avail=3,
            emergency_total=18,
            emergency_avail=6,
            ventilator_total=16,
            ventilator_avail=4
        )
        db.add(bed)

        # Add departments
        depts = ["Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Gynecology", "Dermatology", "General Medicine", "Gastroenterology", "Emergency & Trauma"]
        for dept in depts:
            d = models.HospitalDepartment(
                hospital_id=h.id,
                name=dept,
                description=f"Department of {dept} with specialist consultations and inpatient facilities."
            )
            db.add(d)
        db.commit()
    hosp_map[data["slug"]] = h

# 2. Doctors
doctors_data = [
    {
        "name": "Dr. Rajesh Verma",
        "qualification": "MBBS, MD, DM (Cardiology) - AIIMS",
        "experience_years": 16,
        "specialization": "Cardiology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2009-4412",
        "about": "Senior Interventional Cardiologist specializing in complex coronary angioplasty, heart failure, and pacemaker implantation.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 142,
        "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("medanta-super-speciality-hospital-indore", "Cardiology", 800)
        ]
    },
    {
        "name": "Dr. Priya Malviya",
        "qualification": "MBBS, MS (Orthopedics), Fellowship Joint Replacement",
        "experience_years": 14,
        "specialization": "Orthopedics",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2011-5821",
        "about": "Renowned Orthopedic Surgeon with extensive expertise in minimally invasive knee and hip replacements.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 118,
        "photo_url": "https://images.unsplash.com/photo-1594824813576-696232537021?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("shalby-hospital-indore", "Orthopedics", 750)
        ]
    },
    {
        "name": "Dr. Amit Joshi",
        "qualification": "MBBS, MD, DM (Neurology) - PGI Chandigarh",
        "experience_years": 12,
        "specialization": "Neurology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2013-6712",
        "about": "Consultant Neurologist focused on acute stroke intervention, epilepsy, Parkinson's disease, and migraines.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 96,
        "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("saims-hospital-indore", "Neurology", 700)
        ]
    },
    {
        "name": "Dr. Sneha Rathi",
        "qualification": "MBBS, MD (Pediatrics), Fellowship Neonatology",
        "experience_years": 11,
        "specialization": "Pediatrics",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2014-7890",
        "about": "Compassionate Pediatrician & Neonatologist providing expert developmental tracking and vaccinations.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 104,
        "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("choithram-hospital-indore", "Pediatrics", 500)
        ]
    },
    {
        "name": "Dr. Sandeep Kulkarni",
        "qualification": "MBBS, MD, DM (Gastroenterology) - CMC Vellore",
        "experience_years": 15,
        "specialization": "Gastroenterology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2010-3398",
        "about": "Senior Gastroenterologist & Hepatologist specializing in advanced therapeutic endoscopy and liver diseases.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 87,
        "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("chl-hospital-indore", "Gastroenterology", 700)
        ]
    },
    {
        "name": "Dr. Ananya Saxena",
        "qualification": "MBBS, MS (Obstetrics & Gynecology)",
        "experience_years": 13,
        "specialization": "Gynecology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2012-6541",
        "about": "Expert Obstetrician & Gynecologist specializing in high-risk pregnancy care and painless normal delivery.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 132,
        "photo_url": "https://images.unsplash.com/photo-1594824813576-696232537021?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("medanta-super-speciality-hospital-indore", "Gynecology", 800)
        ]
    },
    {
        "name": "Dr. Vikramaditya Solanki",
        "qualification": "MBBS, MD (Dermatology, Venereology & Leprosy)",
        "experience_years": 11,
        "specialization": "Dermatology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2014-7231",
        "about": "Senior Clinical Dermatologist & Dermato-Surgeon specializing in stubborn skin allergies, psoriasis, eczema, acne scar treatments, hair-loss therapies, and laser cosmetic procedures in Indore.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 89,
        "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("chl-hospital-indore", "Dermatology", 600),
            ("medanta-super-speciality-hospital-indore", "Dermatology", 700)
        ]
    },
    {
        "name": "Dr. Harshwardhan Rathore",
        "qualification": "MBBS, MD (Internal Medicine) - MGM Medical College Indore",
        "experience_years": 18,
        "specialization": "General Medicine",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2007-3104",
        "about": "Senior Physician managing infectious illnesses, fevers (Dengue, Typhoid), adult diabetes, and hypertension.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 176,
        "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("choithram-hospital-indore", "General Medicine", 500),
            ("apple-hospital-indore", "General Medicine", 500)
        ]
    },
    {
        "name": "Dr. Meenakshi Sharma",
        "qualification": "MBBS, MD (Dermatology) - KMC Manipal",
        "experience_years": 14,
        "specialization": "Dermatology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2011-4890",
        "about": "Consultant Dermatologist and Aesthetic Specialist known for anti-aging therapies, chemical peels, vitiligo, and hair treatments.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 112,
        "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("apollo-hospitals-indore", "Dermatology", 800),
            ("bombay-hospital-indore", "Dermatology", 750)
        ]
    },
    {
        "name": "Dr. Pradeep Goyal",
        "qualification": "MBBS, MD, DM (Cardiology)",
        "experience_years": 19,
        "specialization": "Cardiology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2006-2811",
        "about": "Eminent Interventional Cardiologist with over 10,000 successful coronary stentings and primary angioplasties.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 210,
        "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("bombay-hospital-indore", "Cardiology", 850),
            ("vishesh-jupiter-hospital-indore", "Cardiology", 800)
        ]
    },
    {
        "name": "Dr. Alok Mandlia",
        "qualification": "MBBS, MD, DM (Gastroenterology)",
        "experience_years": 13,
        "specialization": "Gastroenterology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2012-7019",
        "about": "Expert in therapeutic endoscopy, pancreatitis management, and liver care.",
        "languages": "Hindi, English",
        "rating": 4.7,
        "review_count": 78,
        "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("apollo-hospitals-indore", "Gastroenterology", 800)
        ]
    },
    {
        "name": "Dr. Sunita Chouhan",
        "qualification": "MBBS, MS (Obstetrics & Gynecology), DGO",
        "experience_years": 17,
        "specialization": "Gynecology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2008-3920",
        "about": "Senior Consultant Gynecologist with expertise in reproductive medicine and laparoscopic hysterectomy.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 145,
        "photo_url": "https://images.unsplash.com/photo-1594824813576-696232537021?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("greater-kailash-hospital-indore", "Gynecology", 650)
        ]
    },
    {
        "name": "Dr. Vivek Shrivastava",
        "qualification": "MBBS, MS (Orthopedics) - MGM Indore, MCh Ortho",
        "experience_years": 16,
        "specialization": "Orthopedics",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2009-4110",
        "about": "Joint Replacement Specialist renowned for partial and total knee replacement with rapid rehabilitation.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 125,
        "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("shalby-hospital-indore", "Orthopedics", 750),
            ("apple-hospital-indore", "Orthopedics", 600)
        ]
    },
    {
        "name": "Dr. Neeraj Jain",
        "qualification": "MBBS, MD, DM (Neurology) - NIMHANS",
        "experience_years": 15,
        "specialization": "Neurology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2010-5342",
        "about": "Specialist in neuro-electrophysiology, multiple sclerosis, dementia, and acute stroke thrombolysis.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 110,
        "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("chl-hospital-indore", "Neurology", 700),
            ("apollo-hospitals-indore", "Neurology", 850)
        ]
    },
    {
        "name": "Dr. Ritu Singhal",
        "qualification": "MBBS, MD (Pediatrics), DNB",
        "experience_years": 12,
        "specialization": "Pediatrics",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2013-6229",
        "about": "Pediatric Intensivist dedicated to neonatal intensive care, child asthma, and adolescent nutrition.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 88,
        "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("suyash-hospital-indore", "Pediatrics", 550)
        ]
    },
    {
        "name": "Dr. Abhishek Agrawal",
        "qualification": "MBBS, MD (Pulmonary Medicine)",
        "experience_years": 14,
        "specialization": "Pulmonology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2011-5002",
        "about": "Chest Physician specializing in bronchial asthma, interstitial lung disease (ILD), and sleep apnea.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 94,
        "photo_url": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("bombay-hospital-indore", "Pulmonology", 700)
        ]
    },
    {
        "name": "Dr. Kavita Bundela",
        "qualification": "MBBS, MD, DM (Endocrinology)",
        "experience_years": 11,
        "specialization": "Endocrinology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2014-6990",
        "about": "Clinical Endocrinologist with expertise in complex diabetes management, thyroid, and osteoporosis.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 85,
        "photo_url": "https://images.unsplash.com/photo-1594824813576-696232537021?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("medanta-super-speciality-hospital-indore", "Endocrinology", 800),
            ("greater-kailash-hospital-indore", "Endocrinology", 700)
        ]
    },
    {
        "name": "Dr. Manish Patidar",
        "qualification": "MBBS, MS (ENT)",
        "experience_years": 13,
        "specialization": "ENT",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2012-5881",
        "about": "ENT Surgeon specialized in endoscopic sinus surgery (FESS), tympanoplasty, vertigo, and snoring care.",
        "languages": "Hindi, English",
        "rating": 4.7,
        "review_count": 73,
        "photo_url": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("apple-hospital-indore", "ENT", 500)
        ]
    },
    {
        "name": "Dr. Shweta Porwal",
        "qualification": "MBBS, MS (Ophthalmology), Fellowship Vitreo-Retina",
        "experience_years": 10,
        "specialization": "Ophthalmology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2015-7762",
        "about": "Eye Surgeon & Retinal Consultant specializing in micro-incision cataract surgery (MICS) and diabetic retina care.",
        "languages": "Hindi, English",
        "rating": 4.8,
        "review_count": 91,
        "photo_url": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("choithram-hospital-indore", "Ophthalmology", 450)
        ]
    },
    {
        "name": "Dr. Chetan Pamecha",
        "qualification": "MBBS, MS, MCh (Surgical Oncology) - Tata Memorial",
        "experience_years": 16,
        "specialization": "Oncology",
        "registration_council": "Madhya Pradesh Medical Council",
        "registration_number": "MPMC-2009-3891",
        "about": "Senior Surgical Oncologist specializing in breast conservation, head & neck onco-surgeries, and GI tumors.",
        "languages": "Hindi, English",
        "rating": 4.9,
        "review_count": 156,
        "photo_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
        "affiliations": [
            ("care-chl-cancer-centre-indore", "Oncology", 800)
        ]
    }
]

for d_data in doctors_data:
    affiliations_to_create = d_data.pop("affiliations", [])
    doc = db.query(models.Doctor).filter(models.Doctor.name == d_data["name"]).first()
    if not doc:
        doc = models.Doctor(**d_data)
        db.add(doc)
        db.commit()
        db.refresh(doc)
        print(f"Created doctor: {doc.name}")
    
    # Ensure affiliations exist
    for hosp_slug, dept, fee in affiliations_to_create:
        h = db.query(models.Hospital).filter(models.Hospital.slug == hosp_slug).first()
        if h:
            aff = db.query(models.DoctorHospitalAffiliation).filter(
                models.DoctorHospitalAffiliation.doctor_id == doc.id,
                models.DoctorHospitalAffiliation.hospital_id == h.id
            ).first()
            if not aff:
                aff = models.DoctorHospitalAffiliation(
                    doctor_id=doc.id,
                    hospital_id=h.id,
                    department=dept,
                    consultation_fee=fee,
                    days_of_week="Mon, Tue, Wed, Thu, Fri",
                    opd_timings="10:00 AM - 02:00 PM",
                    is_active=True
                )
                db.add(aff)
                db.commit()

print("Successfully seeded all 12 hospitals and 20 doctors into careconnect.db!")
db.close()
