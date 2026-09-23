from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database import models

router = APIRouter(tags=["Insurance & Government Schemes"])

@router.get("/insurance")
def get_insurance_directory(db: Session = Depends(get_db)):
    providers = db.query(models.InsuranceProvider).all()
    out = []
    for p in providers:
        # Find participating hospitals
        hospitals = []
        for hl in p.hospital_links:
            if hl.hospital:
                hospitals.append({
                    "hospital_id": hl.hospital.id,
                    "hospital_name": hl.hospital.name,
                    "area": hl.hospital.area,
                    "tpa_contact": hl.tpa_desk_contact,
                    "is_cashless": hl.is_cashless
                })
        out.append({
            "id": p.id,
            "name": p.name,
            "code": p.code,
            "toll_free": p.toll_free,
            "cashless_support": p.cashless_support,
            "network_hospitals_indore": hospitals
        })
    return out

@router.get("/schemes")
def get_government_schemes(db: Session = Depends(get_db)):
    schemes = db.query(models.GovernmentScheme).all()
    out = []
    for s in schemes:
        empanelled = []
        for hl in s.hospital_links:
            if hl.hospital:
                empanelled.append({
                    "hospital_id": hl.hospital.id,
                    "hospital_name": hl.hospital.name,
                    "area": hl.hospital.area,
                    "nodal_officer": hl.nodal_officer,
                    "nodal_contact": hl.nodal_contact
                })
        out.append({
            "id": s.id,
            "name": s.name,
            "short_name": s.short_name,
            "description": s.description,
            "eligibility": s.eligibility,
            "coverage_amount": s.coverage_amount,
            "documents_required": s.documents_required,
            "official_portal": s.official_portal,
            "empanelled_hospitals": empanelled
        })
    return out

@router.get("/cost-estimates")
def get_cost_estimates():
    treatments = [
        {
            "treatment": "Coronary Angioplasty (PTCA with Stent)",
            "specialty": "Cardiology",
            "estimated_range": "₹1,20,000 - ₹2,40,000",
            "consultation": "₹700 - ₹1,000",
            "diagnostics": "₹8,000 - ₹15,000 (Echo, Angiography)",
            "hospitalization_days": "2 - 3 Days",
            "pmjay_coverage": "Covered under PM-JAY package (up to ₹5,00,000)",
            "insurance_cashless": "Widely accepted across private super-specialities",
            "top_hospitals": ["Medanta Super Speciality Indore", "Bombay Hospital Indore", "CHL Hospital"]
        },
        {
            "treatment": "Total Knee Replacement (Unilateral)",
            "specialty": "Orthopedics",
            "estimated_range": "₹1,50,000 - ₹2,50,000",
            "consultation": "₹600 - ₹800",
            "diagnostics": "₹4,000 - ₹8,000 (Digital X-Ray, Pre-op labs)",
            "hospitalization_days": "3 - 5 Days",
            "pmjay_coverage": "Covered under PM-JAY orthopedic package",
            "insurance_cashless": "Pre-authorization approved with most TPAs",
            "top_hospitals": ["Shalby Super Speciality Hospital Indore", "Bombay Hospital Indore", "Medanta Super Speciality"]
        },
        {
            "treatment": "Normal & Cesarean Maternity Delivery",
            "specialty": "Gynecology & Obstetrics",
            "estimated_range": "₹35,000 - ₹85,000",
            "consultation": "₹500 - ₹750",
            "diagnostics": "₹5,000 - ₹10,000 (Ultrasounds, Blood work)",
            "hospitalization_days": "2 - 4 Days",
            "pmjay_coverage": "Covered under Janani Suraksha / PM-JAY",
            "insurance_cashless": "Maternity rider dependent",
            "top_hospitals": ["Choithram Hospital", "Apple Hospital Indore", "Medanta Super Speciality"]
        },
        {
            "treatment": "Cataract Surgery with Phacoemulsification",
            "specialty": "Ophthalmology",
            "estimated_range": "₹20,000 - ₹55,000 per eye",
            "consultation": "₹400 - ₹600",
            "diagnostics": "₹2,000 - ₹4,000 (Biometry, Retina OCT)",
            "hospitalization_days": "Day Care (4 - 6 Hours)",
            "pmjay_coverage": "Fully covered under National Blindness Control & PM-JAY",
            "insurance_cashless": "Standard cashless day-care procedure",
            "top_hospitals": ["Choithram Netralaya", "Bombay Hospital Indore"]
        },
        {
            "treatment": "Dengue & Acute Viral Inpatient Management",
            "specialty": "General Medicine",
            "estimated_range": "₹15,000 - ₹45,000",
            "consultation": "₹500 - ₹700",
            "diagnostics": "₹3,000 - ₹6,000 (CBC Platelet series, NS1/IgM, Liver panel)",
            "hospitalization_days": "3 - 5 Days",
            "pmjay_coverage": "Covered under General Medicine inpatient packages",
            "insurance_cashless": "Accepted with minimum 24h hospitalization",
            "top_hospitals": ["Medanta Super Speciality", "SAIMS Hospital", "CHL Hospital", "Choithram Hospital"]
        }
    ]
    return {
        "city": "Indore, MP",
        "currency": "INR (₹)",
        "disclaimer": "These cost figures represent synthetic marketplace estimates derived from standard private and charitable hospital tariffs in Indore. Final billings depend on clinical comorbidities, room category, and insurer authorization.",
        "treatments": treatments
    }
