from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database import models
from app.schemas import schemas
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    email: str = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token credentials")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/register", response_model=schemas.Token)
def register_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if user_in.role == "patient":
        profile = models.PatientProfile(user_id=new_user.id, city=user_in.city or "Indore")
        db.add(profile)
        db.commit()

    token = create_access_token({"sub": new_user.email, "role": new_user.role, "uid": new_user.id})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        role=new_user.role,
        user_id=new_user.id,
        name=new_user.full_name,
        email=new_user.email
    )

@router.post("/register-hospital", response_model=schemas.Token)
def register_hospital(data: schemas.HospitalRegisterRequest, db: Session = Depends(get_db)):
    import re, random

    # Check user uniqueness
    existing_user = db.query(models.User).filter(models.User.email == data.admin_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this administrator email already exists. Please sign in.")

    # Create URL-friendly unique slug
    base_slug = re.sub(r'[^a-zA-Z0-9]+', '-', data.hospital_name.lower()).strip('-')
    slug = base_slug
    counter = 1
    while db.query(models.Hospital).filter(models.Hospital.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    # 1. Create Hospital Administrator Account
    admin_user = models.User(
        email=data.admin_email,
        hashed_password=get_password_hash(data.admin_password),
        full_name=data.admin_name,
        phone=data.admin_phone,
        role="hospital_admin",
        is_active=True
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    # 2. Create Hospital Record
    reg_num = f"MP-HOSP-{random.randint(1000, 9999)}"
    new_hospital = models.Hospital(
        admin_user_id=admin_user.id,
        name=data.hospital_name,
        slug=slug,
        registration_no=reg_num,
        description=data.description or f"{data.hospital_name} is an empanelled healthcare institution in {data.city} committed to accessible, quality clinical treatment.",
        address=data.address,
        area=data.area,
        city=data.city,
        state="Madhya Pradesh",
        pincode="452010",
        phone=data.phone,
        emergency_phone=data.emergency_phone or data.phone,
        email=data.email or data.admin_email,
        website=data.website,
        hospital_type=data.hospital_type,
        verified=True,
        verification_status="verified",
        starting_fee=data.starting_fee,
        est_treatment_min=data.est_treatment_min,
        est_treatment_max=data.est_treatment_max,
        opd_wait_time="15-20 mins",
        emergency_wait_time="Immediate (< 5 mins)",
        is_emergency_active=True,
        image_url="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
        latitude=22.7196 + (random.uniform(-0.04, 0.04)),
        longitude=75.8577 + (random.uniform(-0.04, 0.04))
    )
    db.add(new_hospital)
    db.commit()
    db.refresh(new_hospital)

    # 3. Create default Bed Inventory
    bed_inv = models.BedInventory(
        hospital_id=new_hospital.id,
        general_total=80,
        general_avail=25,
        private_total=25,
        private_avail=8,
        icu_total=18,
        icu_avail=4,
        nicu_total=8,
        nicu_avail=3,
        emergency_total=12,
        emergency_avail=5,
        ventilator_total=10,
        ventilator_avail=3,
        updated_by=data.admin_name
    )
    db.add(bed_inv)

    # 4. Create default Facilities
    facilities = [
        models.HospitalFacility(hospital_id=new_hospital.id, facility_name="24x7 Emergency & Trauma"),
        models.HospitalFacility(hospital_id=new_hospital.id, facility_name="ICU & Critical Care"),
        models.HospitalFacility(hospital_id=new_hospital.id, facility_name="Digital Diagnostics & Pathology"),
        models.HospitalFacility(hospital_id=new_hospital.id, facility_name="In-house Pharmacy"),
        models.HospitalFacility(hospital_id=new_hospital.id, facility_name="Cashless TPA Desk")
    ]
    db.add_all(facilities)

    # 5. Create default Departments
    departments = [
        models.HospitalDepartment(hospital_id=new_hospital.id, name="General Medicine", opd_timings="09:00 AM - 05:00 PM"),
        models.HospitalDepartment(hospital_id=new_hospital.id, name="Emergency & Trauma", opd_timings="24 Hours Open")
    ]
    db.add_all(departments)

    # 6. Initialize Services with specified or default charges
    services = [
        models.HospitalService(
            hospital_id=new_hospital.id,
            name="General OPD Consultation",
            category="OPD Consultation",
            charge=data.starting_fee,
            description="Initial diagnostic consultation with general physician"
        ),
        models.HospitalService(
            hospital_id=new_hospital.id,
            name="Emergency Casualty & Triage",
            category="Emergency Care",
            charge=data.starting_fee + 300,
            description="24x7 emergency medical officer examination and triage stabilization"
        ),
        models.HospitalService(
            hospital_id=new_hospital.id,
            name="ICU Bed Care (Per 24h)",
            category="Bed & Ward",
            charge=6500,
            description="Intensive Cardiac & Critical Care unit per-day tariff"
        ),
        models.HospitalService(
            hospital_id=new_hospital.id,
            name="Complete Blood Count (CBC) + ESR",
            category="Diagnostics",
            charge=450,
            description="Automated clinical hematology panel"
        )
    ]

    if data.initial_services:
        for s in data.initial_services:
            services.append(models.HospitalService(
                hospital_id=new_hospital.id,
                name=s.name,
                category=s.category,
                charge=s.charge,
                description=s.description,
                is_available=s.is_available
            ))

    db.add_all(services)

    # 7. Audit log
    audit = models.AuditLog(
        user_id=admin_user.id,
        user_email=admin_user.email,
        action="HOSPITAL_ONBOARDING",
        target_type="hospital",
        target_id=new_hospital.id,
        details=f"Hospital '{new_hospital.name}' joined CareConnect AI network under admin {admin_user.full_name}."
    )
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": admin_user.email, "role": admin_user.role, "uid": admin_user.id})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        role=admin_user.role,
        user_id=admin_user.id,
        name=admin_user.full_name,
        email=admin_user.email
    )

@router.post("/login", response_model=schemas.Token)
def login_user(creds: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    token = create_access_token({"sub": user.email, "role": user.role, "uid": user.id})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        name=user.full_name,
        email=user.email
    )

@router.get("/demo-login/{role}", response_model=schemas.Token)
def demo_login(role: str, db: Session = Depends(get_db)):
    role_email_map = {
        "patient": "patient@careconnect.in",
        "doctor": "doctor@careconnect.in",
        "hospital": "hospital@careconnect.in",
        "hospital_admin": "hospital@careconnect.in",
        "admin": "admin@careconnect.in",
        "platform_admin": "admin@careconnect.in"
    }
    target_email = role_email_map.get(role.lower())
    if not target_email:
        raise HTTPException(status_code=400, detail="Invalid demo role requested")
    
    user = db.query(models.User).filter(models.User.email == target_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo account not found. Ensure database is seeded.")
    
    token = create_access_token({"sub": user.email, "role": user.role, "uid": user.id})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        name=user.full_name,
        email=user.email
    )

@router.get("/me", response_model=schemas.UserOut)
def get_me(user: models.User = Depends(get_current_user)):
    hosp_id = user.managed_hospital.id if user.managed_hospital else None
    doc_id = user.doctor_profile.id if user.doctor_profile else None
    return schemas.UserOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        hospital_id=hosp_id,
        doctor_id=doc_id
    )
