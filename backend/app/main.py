from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.session import engine, Base, SessionLocal, get_db
from app.database import models
from app.seeds.seed_data import seed_database
from app.api.routers import (
    auth,
    hospitals,
    doctors,
    appointments,
    ai,
    emergency,
    hospital_admin,
    doctor_portal,
    patient,
    admin,
    insurance_schemes,
    health
)

import time

# Initialize database schema and seeds with connection retry
def init_database():
    retries = 5
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            with SessionLocal() as db:
                seed_database(db)
            print("Database connected and initialized successfully.")
            break
        except Exception as e:
            retries -= 1
            print(f"Waiting for database to be ready ({retries} retries remaining)... Error: {e}")
            if retries == 0:
                raise e
            time.sleep(2)

init_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareConnect AI - Complete AI-Powered Healthcare Marketplace & Hospital Discovery Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers list
routers = [
    auth.router,
    hospitals.router,
    doctors.router,
    appointments.router,
    ai.router,
    emergency.router,
    hospital_admin.router,
    doctor_portal.router,
    patient.router,
    admin.router,
    insurance_schemes.router,
    health.router,
]

# Include Routers under /api and without prefix for resilient routing
for r in routers:
    app.include_router(r, prefix=settings.API_V1_STR)
    app.include_router(r)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "Find the Right Doctor. Find the Right Hospital. Find the Right Care.",
        "launch_city": settings.DEFAULT_CITY,
        "status": "operational",
        "api_docs": "/docs"
    }

@app.get("/api/health-check")
@app.get("/health-check")
def health_check(db: Session = Depends(get_db)):
    try:
        h_count = db.query(models.Hospital).count()
        d_count = db.query(models.Doctor).count()
        u_count = db.query(models.User).count()
        return {
            "status": "healthy",
            "city": "Indore",
            "database": "connected",
            "hospitals_count": h_count,
            "doctors_count": d_count,
            "users_count": u_count
        }
    except Exception as e:
        return {"status": "degraded", "error": str(e)}

@app.get("/api/seed")
@app.get("/seed")
def trigger_seed(db: Session = Depends(get_db)):
    try:
        seed_database(db, force=True)
        h_count = db.query(models.Hospital).count()
        d_count = db.query(models.Doctor).count()
        return {
            "status": "success",
            "message": "Database seeded successfully",
            "hospitals_count": h_count,
            "doctors_count": d_count
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
