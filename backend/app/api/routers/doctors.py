from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.database import models
from app.schemas import schemas

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("/specialties")
def get_specialties(db: Session = Depends(get_db)):
    doctors = db.query(models.Doctor).all()
    spec_counts = {}
    for d in doctors:
        spec = d.specialization
        spec_counts[spec] = spec_counts.get(spec, 0) + 1
    
    specialties_list = [
        {"name": "Cardiology", "icon": "Heart", "count": spec_counts.get("Cardiology", 4), "description": "Heart care, BP, chest pain, and angioplasty"},
        {"name": "Orthopedics", "icon": "Bone", "count": spec_counts.get("Orthopedics", 3), "description": "Joint replacement, fractures, and spine care"},
        {"name": "Neurology", "icon": "Brain", "count": spec_counts.get("Neurology", 3), "description": "Brain, stroke, migraine, and nerve disorders"},
        {"name": "Pediatrics", "icon": "Baby", "count": spec_counts.get("Pediatrics", 4), "description": "Newborn care, child health, and vaccinations"},
        {"name": "Gynecology", "icon": "Users", "count": spec_counts.get("Gynecology", 3), "description": "Maternity, pregnancy, and women's health"},
        {"name": "Dermatology", "icon": "Sparkles", "count": spec_counts.get("Dermatology", 2), "description": "Skin allergies, acne, and hair treatments"},
        {"name": "General Medicine", "icon": "Stethoscope", "count": spec_counts.get("General Medicine", 5), "description": "Fever, viral infections, and diabetes"},
        {"name": "Gastroenterology", "icon": "Activity", "count": spec_counts.get("Gastroenterology", 2), "description": "Liver, digestion, and stomach health"}
    ]
    return specialties_list

@router.get("", response_model=List[schemas.DoctorOut])
def get_doctors(
    q: Optional[str] = None,
    specialty: Optional[str] = None,
    hospital_id: Optional[int] = None,
    max_fee: Optional[int] = None,
    sort_by: Optional[str] = "relevance",
    db: Session = Depends(get_db)
):
    query = db.query(models.Doctor)

    if q:
        search_term = f"%{q.strip()}%"
        query = query.filter(
            (models.Doctor.name.ilike(search_term)) |
            (models.Doctor.specialization.ilike(search_term)) |
            (models.Doctor.about.ilike(search_term))
        )

    if specialty:
        query = query.filter(models.Doctor.specialization.ilike(f"%{specialty}%"))

    doctors = query.all()

    results = []
    for d in doctors:
        affiliations = []
        for aff in d.affiliations:
            if hospital_id and aff.hospital_id != hospital_id:
                continue
            if max_fee and aff.consultation_fee > max_fee:
                continue
            affiliations.append(schemas.DoctorAffiliationOut(
                id=aff.id,
                hospital_id=aff.hospital_id,
                hospital_name=aff.hospital.name if aff.hospital else "Hospital",
                department=aff.department,
                consultation_fee=aff.consultation_fee,
                days_of_week=aff.days_of_week,
                opd_timings=aff.opd_timings,
                is_active=aff.is_active
            ))

        if hospital_id and not affiliations:
            continue
        if max_fee and not affiliations:
            continue

        results.append(schemas.DoctorOut(
            id=d.id,
            user_id=d.user_id,
            name=d.name,
            qualification=d.qualification,
            experience_years=d.experience_years,
            specialization=d.specialization,
            registration_council=d.registration_council,
            registration_number=d.registration_number,
            about=d.about,
            languages=d.languages,
            photo_url=d.photo_url,
            rating=d.rating,
            review_count=d.review_count,
            verified=d.verified,
            affiliations=affiliations
        ))

    if sort_by == "rating":
        results.sort(key=lambda x: x.rating, reverse=True)
    elif sort_by == "experience":
        results.sort(key=lambda x: x.experience_years, reverse=True)
    elif sort_by == "fee":
        results.sort(key=lambda x: (x.affiliations[0].consultation_fee if x.affiliations else 9999))

    return results

@router.get("/{id}")
def get_doctor_by_id(id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Doctor).filter(models.Doctor.id == id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")

    affiliations = []
    for aff in doc.affiliations:
        affiliations.append({
            "id": aff.id,
            "hospital_id": aff.hospital_id,
            "hospital_name": aff.hospital.name if aff.hospital else "Hospital",
            "hospital_area": aff.hospital.area if aff.hospital else "Indore",
            "department": aff.department,
            "consultation_fee": aff.consultation_fee,
            "days_of_week": aff.days_of_week,
            "opd_timings": aff.opd_timings,
            "is_active": aff.is_active
        })

    # Available time slots for booking
    sample_slots = [
        {"slot_id": 1, "time": "10:00 AM", "available": True},
        {"slot_id": 2, "time": "10:30 AM", "available": True},
        {"slot_id": 3, "time": "11:00 AM", "available": False},
        {"slot_id": 4, "time": "11:30 AM", "available": True},
        {"slot_id": 5, "time": "12:00 PM", "available": True},
        {"slot_id": 6, "time": "05:00 PM", "available": True},
        {"slot_id": 7, "time": "05:30 PM", "available": True},
        {"slot_id": 8, "time": "06:00 PM", "available": True}
    ]

    reviews = []
    for r in doc.reviews:
        reviews.append({
            "id": r.id,
            "user_name": r.user.full_name if r.user else "Patient",
            "rating": r.rating,
            "review_text": r.review_text,
            "is_verified_patient": r.is_verified_patient,
            "created_at": r.created_at
        })

    return {
        "id": doc.id,
        "name": doc.name,
        "qualification": doc.qualification,
        "experience_years": doc.experience_years,
        "specialization": doc.specialization,
        "registration_council": doc.registration_council,
        "registration_number": doc.registration_number,
        "about": doc.about,
        "languages": doc.languages,
        "photo_url": doc.photo_url,
        "rating": doc.rating,
        "review_count": doc.review_count,
        "verified": doc.verified,
        "affiliations": affiliations,
        "available_slots": sample_slots,
        "reviews": reviews
    }
