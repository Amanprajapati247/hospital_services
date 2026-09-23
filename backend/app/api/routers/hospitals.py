import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.database import models
from app.schemas import schemas

router = APIRouter(prefix="/hospitals", tags=["Hospitals"])

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Haversine formula in km
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

@router.get("", response_model=List[schemas.HospitalListOut])
def get_hospitals(
    q: Optional[str] = None,
    city: Optional[str] = "Indore",
    area: Optional[str] = None,
    specialty: Optional[str] = None,
    facility: Optional[str] = None,
    min_fee: Optional[int] = None,
    max_fee: Optional[int] = None,
    cashless_only: Optional[bool] = False,
    pmjay_only: Optional[bool] = False,
    sort_by: Optional[str] = "relevance",
    db: Session = Depends(get_db)
):
    query = db.query(models.Hospital)

    if city:
        query = query.filter(models.Hospital.city.ilike(f"%{city}%"))

    if area:
        query = query.filter(models.Hospital.area.ilike(f"%{area}%"))

    if q:
        search_term = f"%{q.strip()}%"
        query = query.filter(
            (models.Hospital.name.ilike(search_term)) |
            (models.Hospital.description.ilike(search_term)) |
            (models.Hospital.area.ilike(search_term))
        )

    if min_fee is not None:
        query = query.filter(models.Hospital.starting_fee >= min_fee)
    if max_fee is not None:
        query = query.filter(models.Hospital.starting_fee <= max_fee)

    hospitals = query.all()

    # In-memory filtering for relationship attributes
    results = []
    for h in hospitals:
        # Check facility filter
        fac_names = [f.facility_name for f in h.facilities]
        if facility and not any(facility.lower() in fn.lower() for fn in fac_names):
            continue

        # Check department / specialty filter
        dept_names = [d.name for d in h.departments]
        if specialty and not any(specialty.lower() in dn.lower() for dn in dept_names):
            continue

        icu_avail = h.bed_inventory.icu_avail if h.bed_inventory else 0
        gen_avail = h.bed_inventory.general_avail if h.bed_inventory else 0

        item = schemas.HospitalListOut(
            id=h.id,
            name=h.name,
            slug=h.slug,
            area=h.area,
            city=h.city,
            state=h.state,
            phone=h.phone,
            emergency_phone=h.emergency_phone,
            rating=h.rating,
            review_count=h.review_count,
            hospital_type=h.hospital_type,
            verified=h.verified,
            starting_fee=h.starting_fee,
            est_treatment_min=h.est_treatment_min,
            est_treatment_max=h.est_treatment_max,
            opd_wait_time=h.opd_wait_time,
            emergency_wait_time=h.emergency_wait_time,
            image_url=h.image_url,
            cover_image=h.cover_image,
            latitude=h.latitude,
            longitude=h.longitude,
            is_emergency_active=h.is_emergency_active,
            icu_avail=icu_avail,
            general_avail=gen_avail,
            facilities=fac_names,
            departments=dept_names,
            insurance_cashless=True,
            pmjay_scheme=True,
            last_updated=h.last_updated
        )
        results.append(item)

    # Sorting
    if sort_by == "rating":
        results.sort(key=lambda x: x.rating, reverse=True)
    elif sort_by == "starting_fee":
        results.sort(key=lambda x: x.starting_fee)
    elif sort_by == "icu_avail":
        results.sort(key=lambda x: (x.icu_avail or 0), reverse=True)
    elif sort_by == "reviews":
        results.sort(key=lambda x: x.review_count, reverse=True)

    return results

@router.get("/compare")
def compare_hospitals(ids: str = Query(..., description="Comma separated hospital IDs, e.g. 1,2"), db: Session = Depends(get_db)):
    id_list = [int(i.strip()) for i in ids.split(",") if i.strip().isdigit()]
    if not id_list:
        raise HTTPException(status_code=400, detail="Invalid hospital IDs")
    
    hospitals = db.query(models.Hospital).filter(models.Hospital.id.in_(id_list)).all()
    if not hospitals:
        raise HTTPException(status_code=404, detail="No hospitals found for comparison")

    comparison_data = []
    for h in hospitals:
        icu = h.bed_inventory.icu_avail if h.bed_inventory else 0
        gen = h.bed_inventory.general_avail if h.bed_inventory else 0
        comparison_data.append({
            "id": h.id,
            "name": h.name,
            "image_url": h.image_url,
            "area": h.area,
            "city": h.city,
            "rating": h.rating,
            "review_count": h.review_count,
            "hospital_type": h.hospital_type,
            "verified": h.verified,
            "starting_fee": f"₹{h.starting_fee}",
            "est_treatment_cost": f"₹{h.est_treatment_min:,} - ₹{h.est_treatment_max:,}",
            "opd_wait_time": h.opd_wait_time,
            "emergency_wait_time": h.emergency_wait_time,
            "icu_beds_available": icu,
            "general_beds_available": gen,
            "ambulance_available": len(h.ambulances) > 0,
            "insurance_cashless": "Supported (Star, HDFC, Care, ICICI)",
            "ayushman_bharat_pmjay": "Empanelled (Cashless up to ₹5 Lakh)",
            "departments_count": len(h.departments),
            "phone": h.phone,
            "emergency_phone": h.emergency_phone
        })
    return comparison_data

@router.get("/nearby")
def get_nearby_hospitals(
    lat: float = Query(22.7196, description="User latitude"),
    lon: float = Query(75.8577, description="User longitude"),
    radius_km: float = Query(25.0, description="Search radius in kilometers"),
    db: Session = Depends(get_db)
):
    hospitals = db.query(models.Hospital).all()
    nearby = []
    for h in hospitals:
        dist = calculate_distance(lat, lon, h.latitude, h.longitude)
        if dist <= radius_km:
            nearby.append({
                "id": h.id,
                "name": h.name,
                "area": h.area,
                "distance_km": dist,
                "rating": h.rating,
                "starting_fee": h.starting_fee,
                "emergency_phone": h.emergency_phone,
                "is_emergency_active": h.is_emergency_active,
                "icu_avail": h.bed_inventory.icu_avail if h.bed_inventory else 0,
                "latitude": h.latitude,
                "longitude": h.longitude,
                "image_url": h.image_url
            })
    nearby.sort(key=lambda x: x["distance_km"])
    return nearby

@router.get("/{id}", response_model=schemas.HospitalDetailOut)
def get_hospital_by_id(id: int, db: Session = Depends(get_db)):
    h = db.query(models.Hospital).filter(models.Hospital.id == id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")

    # Doctors affiliated
    docs = []
    for aff in h.doctor_affiliations:
        d = aff.doctor
        if d and d not in docs:
            docs.append(d)

    doctor_outs = []
    for d in docs:
        doctor_outs.append(schemas.DoctorOut(
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
            affiliations=[schemas.DoctorAffiliationOut(
                id=a.id,
                hospital_id=a.hospital_id,
                hospital_name=h.name,
                department=a.department,
                consultation_fee=a.consultation_fee,
                days_of_week=a.days_of_week,
                opd_timings=a.opd_timings,
                is_active=a.is_active
            ) for a in d.affiliations if a.hospital_id == h.id]
        ))

    return schemas.HospitalDetailOut(
        id=h.id,
        name=h.name,
        slug=h.slug,
        registration_no=h.registration_no,
        description=h.description,
        address=h.address,
        area=h.area,
        city=h.city,
        state=h.state,
        pincode=h.pincode,
        phone=h.phone,
        emergency_phone=h.emergency_phone,
        email=h.email,
        website=h.website,
        latitude=h.latitude,
        longitude=h.longitude,
        hospital_type=h.hospital_type,
        verified=h.verified,
        verification_status=h.verification_status,
        rating=h.rating,
        review_count=h.review_count,
        starting_fee=h.starting_fee,
        est_treatment_min=h.est_treatment_min,
        est_treatment_max=h.est_treatment_max,
        opd_wait_time=h.opd_wait_time,
        emergency_wait_time=h.emergency_wait_time,
        image_url=h.image_url,
        cover_image=h.cover_image,
        is_emergency_active=h.is_emergency_active,
        last_updated=h.last_updated,
        bed_inventory=h.bed_inventory,
        departments=h.departments,
        facilities=h.facilities,
        ambulances=h.ambulances,
        doctors=doctor_outs,
        accepted_insurances=["Star Health", "HDFC ERGO", "Care Health", "ICICI Lombard", "Niva Bupa", "New India Assurance"],
        supported_schemes=["Ayushman Bharat PM-JAY", "Deen Dayal Swasthya Suraksha Yojana", "MP State Employee Health Scheme"],
        services=h.services
    )
