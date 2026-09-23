from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database import models
from app.api.routers.auth import get_current_user

from app.schemas import schemas

router = APIRouter(prefix="/doctor-portal", tags=["Doctor Portal"])

def get_doctor_account(current_user: models.User, db: Session) -> models.Doctor:
    if current_user.doctor_profile:
        return current_user.doctor_profile
    # Demo fallback for testing
    if current_user.role in ["doctor", "platform_admin"]:
        d = db.query(models.Doctor).first()
        if d:
            return d
    raise HTTPException(status_code=403, detail="Doctor profile not found")

@router.get("/dashboard")
def get_doctor_dashboard(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = get_doctor_account(current_user, db)
    
    appointments = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == doc.id
    ).order_by(models.Appointment.created_at.desc()).all()

    affiliations = []
    for aff in doc.affiliations:
        affiliations.append({
            "id": aff.id,
            "hospital_id": aff.hospital_id,
            "hospital_name": aff.hospital.name if aff.hospital else "Hospital",
            "department": aff.department,
            "consultation_fee": aff.consultation_fee,
            "days_of_week": aff.days_of_week,
            "opd_timings": aff.opd_timings,
            "is_active": aff.is_active
        })

    return {
        "doctor_id": doc.id,
        "name": doc.name,
        "qualification": doc.qualification,
        "specialization": doc.specialization,
        "experience_years": doc.experience_years,
        "rating": doc.rating,
        "review_count": doc.review_count,
        "photo_url": doc.photo_url,
        "about": doc.about,
        "languages": doc.languages,
        "registration_council": doc.registration_council,
        "registration_number": doc.registration_number,
        "total_appointments": len(appointments),
        "affiliations": affiliations,
        "recent_appointments": [
            {
                "id": a.id,
                "appointment_number": a.appointment_number,
                "patient_name": a.patient_user.full_name if a.patient_user else "Patient",
                "patient_phone": a.patient_user.phone if a.patient_user else None,
                "family_member_name": a.family_member_name,
                "hospital_name": a.hospital.name if a.hospital else "Hospital",
                "date": a.appointment_date,
                "time": a.appointment_time,
                "fee": a.consultation_fee,
                "status": a.status,
                "patient_notes": a.patient_notes,
                "doctor_notes": a.doctor_notes
            } for a in appointments[:10]
        ]
    }

@router.put("/profile")
def update_doctor_profile(
    data: schemas.DoctorProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = get_doctor_account(current_user, db)
    if data.name is not None:
        doc.name = data.name
    if data.qualification is not None:
        doc.qualification = data.qualification
    if data.specialization is not None:
        doc.specialization = data.specialization
    if data.experience_years is not None:
        doc.experience_years = data.experience_years
    if data.about is not None:
        doc.about = data.about
    if data.languages is not None:
        doc.languages = data.languages
    if data.photo_url is not None:
        doc.photo_url = data.photo_url
    if data.registration_council is not None:
        doc.registration_council = data.registration_council
    if data.registration_number is not None:
        doc.registration_number = data.registration_number

    db.commit()
    db.refresh(doc)
    return {
        "message": "Doctor profile updated successfully", 
        "doctor_id": doc.id,
        "name": doc.name,
        "photo_url": doc.photo_url
    }

@router.patch("/appointments/{id}/complete")
def complete_appointment(
    id: int,
    doctor_notes: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = get_doctor_account(current_user, db)
    app = db.query(models.Appointment).filter(
        models.Appointment.id == id,
        models.Appointment.doctor_id == doc.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Appointment not found")

    app.status = "Completed"
    app.doctor_notes = doctor_notes
    db.commit()
    return {"message": "Appointment completed with clinical notes updated", "appointment_id": id}
