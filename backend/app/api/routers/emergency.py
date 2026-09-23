from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database import models

router = APIRouter(prefix="/emergency", tags=["Emergency Care"])

@router.get("/overview")
def get_emergency_overview(db: Session = Depends(get_db)):
    hospitals = db.query(models.Hospital).filter(
        models.Hospital.is_emergency_active == True
    ).all()

    emergency_centers = []
    all_ambulances = []

    for h in hospitals:
        bed = h.bed_inventory
        icu_avail = bed.icu_avail if bed else 0
        vent_avail = bed.ventilator_avail if bed else 0
        em_avail = bed.emergency_avail if bed else 0

        emergency_centers.append({
            "id": h.id,
            "name": h.name,
            "area": h.area,
            "address": h.address,
            "emergency_phone": h.emergency_phone or h.phone,
            "hospital_phone": h.phone,
            "emergency_wait_time": h.emergency_wait_time,
            "icu_available": icu_avail,
            "ventilator_available": vent_avail,
            "emergency_beds_available": em_avail,
            "latitude": h.latitude,
            "longitude": h.longitude,
            "image_url": h.image_url,
            "last_updated": h.last_updated.strftime("%d %b %Y, %I:%M %p")
        })

        for amb in h.ambulances:
            all_ambulances.append({
                "id": amb.id,
                "hospital_id": h.id,
                "hospital_name": h.name,
                "area": h.area,
                "type": amb.ambulance_type,
                "vehicle_number": amb.vehicle_number,
                "driver_contact": amb.driver_contact,
                "is_available": amb.is_available
            })

    return {
        "emergency_helplines": [
            {"name": "National Emergency Service", "number": "112", "desc": "All-in-one emergency response"},
            {"name": "Free Emergency Medical Ambulance (MP)", "number": "108", "desc": "Sanjeevani 108 Emergency Ambulance"},
            {"name": "Pregnant Women & Infant Ambulance", "number": "102", "desc": "Janani Express"},
            {"name": "Indore Police Control Room", "number": "0731-2525555", "desc": "Local traffic and transit coordination"}
        ],
        "emergency_hospitals": emergency_centers,
        "active_ambulances": all_ambulances,
        "disclaimer": "Emergency availability is based on hospital system updates. For critical life-threatening situations, dispatch an ambulance immediately by calling 108 or the hospital emergency desk."
    }
