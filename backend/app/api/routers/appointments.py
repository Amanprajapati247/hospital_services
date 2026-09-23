import datetime
import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.database import models
from app.schemas import schemas
from app.api.routers.auth import get_current_user

router = APIRouter(prefix="/appointments", tags=["Appointments"])

def serialize_appointment(app: models.Appointment) -> schemas.AppointmentOut:
    return schemas.AppointmentOut(
        id=app.id,
        appointment_number=app.appointment_number,
        patient_id=app.patient_id,
        patient_name=app.patient_user.full_name if app.patient_user else "Patient",
        patient_phone=app.patient_user.phone if app.patient_user else None,
        family_member_name=app.family_member_name,
        doctor_id=app.doctor_id,
        doctor_name=app.doctor.name if app.doctor else "Doctor",
        doctor_specialization=app.doctor.specialization if app.doctor else "Specialist",
        hospital_id=app.hospital_id,
        hospital_name=app.hospital.name if app.hospital else "Hospital",
        hospital_area=app.hospital.area if app.hospital else "Indore",
        hospital_phone=app.hospital.phone if app.hospital else "+91 731-000-0000",
        department=app.department,
        appointment_date=app.appointment_date,
        appointment_time=app.appointment_time,
        consultation_fee=app.consultation_fee,
        status=app.status,
        payment_status=app.payment_status,
        insurance_name=app.insurance_name,
        patient_notes=app.patient_notes,
        doctor_notes=app.doctor_notes,
        created_at=app.created_at
    )

@router.post("", response_model=schemas.AppointmentOut)
def book_appointment(
    data: schemas.AppointmentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    hospital = db.query(models.Hospital).filter(models.Hospital.id == data.hospital_id).first()
    doctor = db.query(models.Doctor).filter(models.Doctor.id == data.doctor_id).first()
    if not hospital or not doctor:
        raise HTTPException(status_code=404, detail="Hospital or Doctor not found")

    rand_digits = random.randint(1000, 9999)
    app_no = f"CC-IND-{datetime.datetime.now().strftime('%Y%m%d')}-{rand_digits}"

    appointment = models.Appointment(
        appointment_number=app_no,
        patient_id=current_user.id,
        doctor_id=doctor.id,
        hospital_id=hospital.id,
        family_member_name=data.family_member_name or "Self",
        department=data.department or doctor.specialization,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        consultation_fee=data.consultation_fee,
        status="Confirmed",
        payment_status="Pay at Hospital",
        insurance_name=data.insurance_name,
        patient_notes=data.patient_notes,
        doctor_notes=None
    )
    db.add(appointment)

    # Add notification for patient
    notif = models.Notification(
        user_id=current_user.id,
        title="Appointment Confirmed",
        message=f"Your appointment with {doctor.name} at {hospital.name} ({hospital.area}) is confirmed for {data.appointment_date} at {data.appointment_time}.",
        notification_type="appointment"
    )
    db.add(notif)
    db.commit()
    db.refresh(appointment)

    return serialize_appointment(appointment)

@router.get("", response_model=List[schemas.AppointmentOut])
def get_user_appointments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "patient":
        appointments = db.query(models.Appointment).filter(
            models.Appointment.patient_id == current_user.id
        ).order_by(models.Appointment.created_at.desc()).all()
    elif current_user.role == "doctor" and current_user.doctor_profile:
        appointments = db.query(models.Appointment).filter(
            models.Appointment.doctor_id == current_user.doctor_profile.id
        ).order_by(models.Appointment.created_at.desc()).all()
    elif current_user.role == "hospital_admin" and current_user.managed_hospital:
        appointments = db.query(models.Appointment).filter(
            models.Appointment.hospital_id == current_user.managed_hospital.id
        ).order_by(models.Appointment.created_at.desc()).all()
    else:
        appointments = db.query(models.Appointment).order_by(models.Appointment.created_at.desc()).all()

    return [serialize_appointment(a) for a in appointments]

@router.get("/{id}", response_model=schemas.AppointmentOut)
def get_appointment_detail(id: int, db: Session = Depends(get_db)):
    app = db.query(models.Appointment).filter(models.Appointment.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return serialize_appointment(app)

@router.patch("/{id}/status", response_model=schemas.AppointmentOut)
def update_appointment_status(
    id: int,
    data: schemas.AppointmentStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(models.Appointment).filter(models.Appointment.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Appointment not found")

    app.status = data.status
    if data.doctor_notes:
        app.doctor_notes = data.doctor_notes
    
    # Send notification to patient
    notif = models.Notification(
        user_id=app.patient_id,
        title=f"Appointment Status: {data.status}",
        message=f"Your appointment ({app.appointment_number}) with {app.doctor.name} at {app.hospital.name} status is now {data.status}.",
        notification_type="appointment"
    )
    db.add(notif)
    db.commit()
    db.refresh(app)
    return serialize_appointment(app)
