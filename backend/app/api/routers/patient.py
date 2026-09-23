from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.database import models
from app.schemas import schemas
from app.api.routers.auth import get_current_user

router = APIRouter(prefix="/patient", tags=["Patient Portal"])

@router.get("/dashboard")
def get_patient_dashboard(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.patient_profile
    if not profile:
        profile = models.PatientProfile(user_id=current_user.id, city="Indore")
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Next upcoming appointment
    upcoming = db.query(models.Appointment).filter(
        models.Appointment.patient_id == current_user.id,
        models.Appointment.status == "Confirmed"
    ).order_by(models.Appointment.appointment_date.asc()).first()

    # Past appointments count
    total_apps = db.query(models.Appointment).filter(
        models.Appointment.patient_id == current_user.id
    ).count()

    # Saved counts
    saved_h = db.query(models.SavedHospital).filter(models.SavedHospital.user_id == current_user.id).count()
    saved_d = db.query(models.SavedDoctor).filter(models.SavedDoctor.user_id == current_user.id).count()

    # Notifications
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).limit(5).all()

    # Family members
    family = db.query(models.FamilyMember).filter(models.FamilyMember.patient_id == profile.id).all()

    return {
        "user_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "city": profile.city,
        "blood_group": profile.blood_group,
        "insurance_name": profile.insurance_name,
        "insurance_policy_no": profile.insurance_policy_no,
        "total_appointments": total_apps,
        "saved_hospitals_count": saved_h,
        "saved_doctors_count": saved_d,
        "family_members_count": len(family),
        "upcoming_appointment": {
            "id": upcoming.id,
            "appointment_number": upcoming.appointment_number,
            "doctor_name": upcoming.doctor.name if upcoming.doctor else "Doctor",
            "doctor_specialization": upcoming.doctor.specialization if upcoming.doctor else "Specialist",
            "hospital_name": upcoming.hospital.name if upcoming.hospital else "Hospital",
            "hospital_area": upcoming.hospital.area if upcoming.hospital else "Indore",
            "hospital_phone": upcoming.hospital.phone if upcoming.hospital else "",
            "date": upcoming.appointment_date,
            "time": upcoming.appointment_time,
            "status": upcoming.status,
            "patient_notes": upcoming.patient_notes
        } if upcoming else None,
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.notification_type,
                "created_at": n.created_at
            } for n in notifications
        ],
        "family_members": [
            {
                "id": f.id,
                "name": f.name,
                "relationship": f.relationship,
                "age": f.age,
                "blood_group": f.blood_group
            } for f in family
        ]
    }

@router.get("/family", response_model=List[schemas.FamilyMemberOut])
def get_family_members(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.patient_profile
    if not profile:
        return []
    return profile.family_members

@router.post("/family", response_model=schemas.FamilyMemberOut)
def add_family_member(
    data: schemas.FamilyMemberCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.patient_profile
    if not profile:
        profile = models.PatientProfile(user_id=current_user.id, city="Indore")
        db.add(profile)
        db.commit()
        db.refresh(profile)

    fm = models.FamilyMember(
        patient_id=profile.id,
        name=data.name,
        relationship=data.relationship,
        age=data.age,
        gender=data.gender,
        blood_group=data.blood_group
    )
    db.add(fm)
    db.commit()
    db.refresh(fm)
    return fm

@router.delete("/family/{id}")
def delete_family_member(id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = current_user.patient_profile
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    fm = db.query(models.FamilyMember).filter(
        models.FamilyMember.id == id,
        models.FamilyMember.patient_id == profile.id
    ).first()
    if not fm:
        raise HTTPException(status_code=404, detail="Family member not found")
    
    db.delete(fm)
    db.commit()
    return {"message": "Family member removed successfully"}

@router.put("/profile")
def update_patient_profile(
    data: schemas.PatientProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.patient_profile
    if not profile:
        profile = models.PatientProfile(user_id=current_user.id)
        db.add(profile)

    for field, val in data.dict(exclude_unset=True).items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated successfully"}

@router.post("/saved/hospital/{id}")
def toggle_save_hospital(id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(models.SavedHospital).filter(
        models.SavedHospital.user_id == current_user.id,
        models.SavedHospital.hospital_id == id
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Hospital removed from saved list"}
    else:
        new_save = models.SavedHospital(user_id=current_user.id, hospital_id=id)
        db.add(new_save)
        db.commit()
        return {"saved": True, "message": "Hospital saved to your list"}

@router.post("/saved/doctor/{id}")
def toggle_save_doctor(id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(models.SavedDoctor).filter(
        models.SavedDoctor.user_id == current_user.id,
        models.SavedDoctor.doctor_id == id
    ).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"saved": False, "message": "Doctor removed from saved list"}
    else:
        new_save = models.SavedDoctor(user_id=current_user.id, doctor_id=id)
        db.add(new_save)
        db.commit()
        return {"saved": True, "message": "Doctor saved to your list"}
