import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database import models
from app.schemas import schemas
from app.api.routers.auth import get_current_user

router = APIRouter(prefix="/hospital-admin", tags=["Hospital Administration"])

def get_admin_hospital(current_user: models.User, db: Session) -> models.Hospital:
    # If the user has a directly managed hospital, return it
    if current_user.managed_hospital:
        return current_user.managed_hospital
    # If platform admin or demo fallback, return Medanta Indore (hospital id 1)
    if current_user.role in ["hospital_admin", "platform_admin"]:
        h = db.query(models.Hospital).first()
        if h:
            return h
    raise HTTPException(status_code=403, detail="You do not have administrative access to any hospital")

@router.get("/dashboard")
def get_hospital_dashboard(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    hospital = get_admin_hospital(current_user, db)
    
    # Calculate stats
    total_appointments = db.query(models.Appointment).filter(models.Appointment.hospital_id == hospital.id).count()
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    today_appointments = db.query(models.Appointment).filter(
        models.Appointment.hospital_id == hospital.id,
        models.Appointment.appointment_date == today_str
    ).count()

    bed_inv = hospital.bed_inventory
    return {
        "hospital_id": hospital.id,
        "hospital_name": hospital.name,
        "registration_no": hospital.registration_no,
        "verification_status": hospital.verification_status,
        "area": hospital.area,
        "rating": hospital.rating,
        "total_appointments": total_appointments,
        "today_appointments": today_appointments,
        "opd_wait_time": hospital.opd_wait_time,
        "emergency_wait_time": hospital.emergency_wait_time,
        "is_emergency_active": hospital.is_emergency_active,
        "bed_inventory": schemas.BedInventoryOut.from_orm(bed_inv) if bed_inv else None,
        "doctor_count": len(hospital.doctor_affiliations),
        "ambulance_count": len(hospital.ambulances),
        "last_updated": hospital.last_updated
    }

@router.put("/beds", response_model=schemas.BedInventoryOut)
def update_bed_inventory(
    data: schemas.BedInventoryUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    bed = hospital.bed_inventory
    if not bed:
        bed = models.BedInventory(hospital_id=hospital.id)
        db.add(bed)

    if data.general_avail is not None:
        bed.general_avail = data.general_avail
    if data.private_avail is not None:
        bed.private_avail = data.private_avail
    if data.icu_avail is not None:
        bed.icu_avail = data.icu_avail
    if data.nicu_avail is not None:
        bed.nicu_avail = data.nicu_avail
    if data.emergency_avail is not None:
        bed.emergency_avail = data.emergency_avail
    if data.ventilator_avail is not None:
        bed.ventilator_avail = data.ventilator_avail

    bed.last_updated = datetime.datetime.utcnow()
    bed.updated_by = current_user.full_name
    hospital.last_updated = datetime.datetime.utcnow()

    # Log audit
    audit = models.AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="UPDATE_BED_INVENTORY",
        target_type="hospital",
        target_id=hospital.id,
        details=f"Updated bed availability for {hospital.name}: ICU {bed.icu_avail}, General {bed.general_avail}"
    )
    db.add(audit)
    db.commit()
    db.refresh(bed)
    return bed

@router.put("/wait-times")
def update_wait_times(
    opd_wait_time: str,
    emergency_wait_time: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    hospital.opd_wait_time = opd_wait_time
    hospital.emergency_wait_time = emergency_wait_time
    hospital.last_updated = datetime.datetime.utcnow()
    db.commit()
    return {"message": "Wait times updated successfully", "last_updated": hospital.last_updated}

@router.get("/doctors")
def list_hospital_doctors(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    hospital = get_admin_hospital(current_user, db)
    results = []
    for aff in hospital.doctor_affiliations:
        doc = aff.doctor
        if doc:
            results.append({
                "affiliation_id": aff.id,
                "doctor_id": doc.id,
                "name": doc.name,
                "specialization": doc.specialization,
                "qualification": doc.qualification,
                "department": aff.department,
                "consultation_fee": aff.consultation_fee,
                "days_of_week": aff.days_of_week,
                "opd_timings": aff.opd_timings,
                "is_active": aff.is_active,
                "rating": doc.rating
            })
    return results

@router.post("/doctors")
def add_doctor_affiliation(
    data: schemas.DoctorCreateAffiliation,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    
    # Check if doctor exists or create doctor entry
    doctor = db.query(models.Doctor).filter(models.Doctor.name == data.doctor_name).first()
    if not doctor:
        doctor = models.Doctor(
            name=data.doctor_name,
            qualification=data.qualification,
            experience_years=data.experience_years,
            specialization=data.specialization,
            photo_url=data.photo_url or "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
            verified=True,
            verification_status="verified"
        )
        db.add(doctor)
        db.commit()
        db.refresh(doctor)
    elif data.photo_url:
        doctor.photo_url = data.photo_url

    affiliation = models.DoctorHospitalAffiliation(
        doctor_id=doctor.id,
        hospital_id=hospital.id,
        department=data.department,
        consultation_fee=data.consultation_fee,
        days_of_week=data.days_of_week,
        opd_timings=data.opd_timings,
        is_active=True
    )
    db.add(affiliation)
    db.commit()
    return {"message": f"Doctor {doctor.name} affiliated with {hospital.name} successfully", "doctor_id": doctor.id}

@router.get("/appointments")
def list_hospital_appointments(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    hospital = get_admin_hospital(current_user, db)
    apps = db.query(models.Appointment).filter(
        models.Appointment.hospital_id == hospital.id
    ).order_by(models.Appointment.created_at.desc()).all()
    
    out = []
    for a in apps:
        out.append({
            "id": a.id,
            "appointment_number": a.appointment_number,
            "patient_name": a.patient_user.full_name if a.patient_user else "Patient",
            "patient_phone": a.patient_user.phone if a.patient_user else None,
            "family_member_name": a.family_member_name,
            "doctor_name": a.doctor.name if a.doctor else "Doctor",
            "department": a.department,
            "date": a.appointment_date,
            "time": a.appointment_time,
            "fee": a.consultation_fee,
            "status": a.status,
            "payment_status": a.payment_status,
            "notes": a.patient_notes,
            "doctor_notes": a.doctor_notes
        })
    return out

@router.put("/appointments/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    data: schemas.AppointmentStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    app = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.hospital_id == hospital.id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Appointment not found")

    app.status = data.status
    if data.doctor_notes is not None:
        app.doctor_notes = data.doctor_notes

    db.commit()
    db.refresh(app)
    return {"message": "Appointment updated successfully", "id": app.id, "status": app.status}

@router.post("/appointments")
def create_hospital_appointment(
    data: schemas.AppointmentAdminCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    import random
    app_no = f"CC-H{hospital.id}-{random.randint(10000, 99999)}"

    # Find or create a patient user for this walk-in / admin booking
    patient = db.query(models.User).filter(models.User.phone == data.patient_phone).first()
    if not patient:
        from app.core.security import get_password_hash
        patient = models.User(
            email=f"walkin_{random.randint(1000,9999)}@careconnect.in",
            hashed_password=get_password_hash("password123"),
            full_name=data.patient_name,
            phone=data.patient_phone,
            role="patient",
            is_active=True
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    new_app = models.Appointment(
        appointment_number=app_no,
        patient_id=patient.id,
        doctor_id=data.doctor_id,
        hospital_id=hospital.id,
        department=data.department,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        consultation_fee=data.consultation_fee,
        status="Confirmed",
        payment_status=data.payment_status,
        patient_notes=data.notes
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return {"message": "Appointment created successfully", "appointment_number": app_no, "id": new_app.id}

# --- Hospital Services & Charges ---
@router.get("/services", response_model=List[schemas.HospitalServiceOut])
def get_hospital_services(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    hospital = get_admin_hospital(current_user, db)
    return db.query(models.HospitalService).filter(models.HospitalService.hospital_id == hospital.id).all()

@router.post("/services", response_model=schemas.HospitalServiceOut)
def add_hospital_service(
    data: schemas.HospitalServiceCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    svc = models.HospitalService(
        hospital_id=hospital.id,
        name=data.name,
        category=data.category,
        charge=data.charge,
        description=data.description,
        is_available=data.is_available
    )
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return svc

@router.put("/services/{service_id}", response_model=schemas.HospitalServiceOut)
def update_hospital_service(
    service_id: int,
    data: schemas.HospitalServiceUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    svc = db.query(models.HospitalService).filter(
        models.HospitalService.id == service_id,
        models.HospitalService.hospital_id == hospital.id
    ).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")

    if data.name is not None:
        svc.name = data.name
    if data.category is not None:
        svc.category = data.category
    if data.charge is not None:
        svc.charge = data.charge
    if data.description is not None:
        svc.description = data.description
    if data.is_available is not None:
        svc.is_available = data.is_available

    db.commit()
    db.refresh(svc)
    return svc

@router.delete("/services/{service_id}")
def delete_hospital_service(
    service_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    svc = db.query(models.HospitalService).filter(
        models.HospitalService.id == service_id,
        models.HospitalService.hospital_id == hospital.id
    ).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")

    db.delete(svc)
    db.commit()
    return {"message": "Service deleted successfully"}

# --- Hospital Profile & Pricing Management ---
@router.get("/profile")
def get_hospital_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    hospital = get_admin_hospital(current_user, db)
    return {
        "id": hospital.id,
        "name": hospital.name,
        "slug": hospital.slug,
        "registration_no": hospital.registration_no,
        "description": hospital.description,
        "address": hospital.address,
        "area": hospital.area,
        "city": hospital.city,
        "state": hospital.state,
        "pincode": hospital.pincode,
        "phone": hospital.phone,
        "emergency_phone": hospital.emergency_phone,
        "email": hospital.email,
        "website": hospital.website,
        "hospital_type": hospital.hospital_type,
        "verified": hospital.verified,
        "verification_status": hospital.verification_status,
        "starting_fee": hospital.starting_fee,
        "est_treatment_min": hospital.est_treatment_min,
        "est_treatment_max": hospital.est_treatment_max,
        "opd_wait_time": hospital.opd_wait_time,
        "emergency_wait_time": hospital.emergency_wait_time,
        "is_emergency_active": hospital.is_emergency_active,
        "cover_image": hospital.cover_image,
        "image_url": hospital.image_url
    }

@router.put("/profile")
def update_hospital_profile(
    data: schemas.HospitalProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = get_admin_hospital(current_user, db)
    if data.name is not None:
        hospital.name = data.name
    if data.description is not None:
        hospital.description = data.description
    if data.address is not None:
        hospital.address = data.address
    if data.area is not None:
        hospital.area = data.area
    if data.city is not None:
        hospital.city = data.city
    if data.phone is not None:
        hospital.phone = data.phone
    if data.emergency_phone is not None:
        hospital.emergency_phone = data.emergency_phone
    if data.email is not None:
        hospital.email = data.email
    if data.website is not None:
        hospital.website = data.website
    if data.hospital_type is not None:
        hospital.hospital_type = data.hospital_type
    if data.starting_fee is not None:
        hospital.starting_fee = data.starting_fee
    if data.est_treatment_min is not None:
        hospital.est_treatment_min = data.est_treatment_min
    if data.est_treatment_max is not None:
        hospital.est_treatment_max = data.est_treatment_max
    if data.is_emergency_active is not None:
        hospital.is_emergency_active = data.is_emergency_active
    if data.opd_wait_time is not None:
        hospital.opd_wait_time = data.opd_wait_time
    if data.emergency_wait_time is not None:
        hospital.emergency_wait_time = data.emergency_wait_time
    if data.cover_image is not None:
        hospital.cover_image = data.cover_image
    if data.image_url is not None:
        hospital.image_url = data.image_url

    hospital.last_updated = datetime.datetime.utcnow()
    db.commit()
    db.refresh(hospital)
    return {"message": "Hospital profile updated successfully", "hospital_name": hospital.name, "cover_image": hospital.cover_image}

