import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["platform"] == "CareConnect AI"
    assert res.json()["launch_city"] == "Indore"

    res = client.get("/api/health-check")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_demo_logins_all_roles():
    for role in ["patient", "doctor", "hospital", "admin"]:
        res = client.get(f"/api/auth/demo-login/{role}")
        assert res.status_code == 200, f"Demo login failed for {role}"
        data = res.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user_id"] > 0

def test_hospitals_search_and_filters():
    # 1. Get all hospitals in Indore
    res = client.get("/api/hospitals?city=Indore")
    assert res.status_code == 200
    hospitals = res.json()
    assert len(hospitals) >= 5
    
    # 2. Search by query 'Medanta'
    res = client.get("/api/hospitals?q=Medanta")
    assert res.status_code == 200
    results = res.json()
    assert any("Medanta" in h["name"] for h in results)

    # 3. Filter by specialty 'Cardiology'
    res = client.get("/api/hospitals?specialty=Cardiology")
    assert res.status_code == 200
    assert len(res.json()) > 0

    # 4. Detail page
    hosp_id = hospitals[0]["id"]
    res = client.get(f"/api/hospitals/{hosp_id}")
    assert res.status_code == 200
    detail = res.json()
    assert detail["name"] == hospitals[0]["name"]
    assert detail["bed_inventory"] is not None
    assert "accepted_insurances" in detail

def test_hospital_comparison():
    res = client.get("/api/hospitals/compare?ids=1,2,3")
    assert res.status_code == 200
    comp = res.json()
    assert len(comp) >= 2
    assert "icu_beds_available" in comp[0]
    assert "starting_fee" in comp[0]

def test_doctors_and_specialties():
    # Specialties
    res = client.get("/api/doctors/specialties")
    assert res.status_code == 200
    specialties = res.json()
    assert any(s["name"] == "Cardiology" for s in specialties)

    # Search doctors
    res = client.get("/api/doctors?specialty=Cardiology")
    assert res.status_code == 200
    docs = res.json()
    assert len(docs) > 0
    assert "Dr. Rajesh Verma" in docs[0]["name"]

def test_ai_assistant_hinglish_and_emergency():
    # 1. Emergency chest pain trigger (Hindi / Hinglish)
    res = client.post("/api/ai/chat", json={
        "message": "Mujhe bohot severe chest pain ho raha hai aur saans lene me takleef hai",
        "preferred_city": "Indore"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["is_emergency"] is True
    assert data["intent"] == "EMERGENCY"
    assert data["emergency_alert"] is not None
    assert len(data["recommended_hospitals"]) > 0

    # 2. Knee pain consultation (Hindi / Hinglish)
    res = client.post("/api/ai/chat", json={
        "message": "Meri mummy ke ghutno me dard rehta hai, Indore me doctor dikhana hai",
        "preferred_city": "Indore"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["is_emergency"] is False
    assert data["recommended_specialty"] == "Orthopedics"
    assert len(data["recommended_doctors"]) > 0

def test_emergency_overview():
    res = client.get("/api/emergency/overview")
    assert res.status_code == 200
    data = res.json()
    assert len(data["emergency_helplines"]) >= 3
    assert len(data["emergency_hospitals"]) > 0
    assert len(data["active_ambulances"]) > 0

def test_appointment_booking():
    # Login as patient
    login_res = client.get("/api/auth/demo-login/patient")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Book appointment
    book_res = client.post("/api/appointments", json={
        "hospital_id": 1,
        "doctor_id": 1,
        "department": "Cardiology",
        "appointment_date": "2026-09-28",
        "appointment_time": "10:30 AM",
        "family_member_name": "Self",
        "consultation_fee": 800,
        "patient_notes": "Test consultation notes"
    }, headers=headers)
    assert book_res.status_code == 200
    app_data = book_res.json()
    assert app_data["status"] == "Confirmed"
    assert app_data["appointment_number"].startswith("CC-IND-")

    # Retrieve patient's appointments
    apps_res = client.get("/api/appointments", headers=headers)
    assert apps_res.status_code == 200
    assert len(apps_res.json()) >= 1

def test_hospital_admin_bed_update():
    login_res = client.get("/api/auth/demo-login/hospital")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    update_res = client.put("/api/hospital-admin/beds", json={
        "icu_avail": 12,
        "general_avail": 55
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["icu_avail"] == 12

def test_insurance_and_schemes():
    res = client.get("/api/insurance")
    assert res.status_code == 200
    assert len(res.json()) >= 4

    res = client.get("/api/schemes")
    assert res.status_code == 200
    assert any(s["short_name"] == "PM-JAY" for s in res.json())

    res = client.get("/api/cost-estimates")
    assert res.status_code == 200
    assert len(res.json()["treatments"]) >= 4

def test_doctor_profile_photo_update():
    login_res = client.get("/api/auth/demo-login/doctor")
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch doctor dashboard
    dash_res = client.get("/api/doctor-portal/dashboard", headers=headers)
    assert dash_res.status_code == 200
    assert "photo_url" in dash_res.json()

    # Update doctor photo
    test_photo = "https://images.unsplash.com/photo-test-doctor.jpg"
    update_res = client.put("/api/doctor-portal/profile", json={
        "name": "Dr. Rajesh Verma Updated",
        "photo_url": test_photo,
        "specialization": "Interventional Cardiology"
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["photo_url"] == test_photo

    # Verify update persisted
    verify_res = client.get("/api/doctor-portal/dashboard", headers=headers)
    assert verify_res.status_code == 200
    assert verify_res.json()["photo_url"] == test_photo

def test_hospital_profile_photo_update():
    login_res = client.get("/api/auth/demo-login/hospital")
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Update hospital cover image
    test_cover = "https://images.unsplash.com/photo-test-hospital.jpg"
    update_res = client.put("/api/hospital-admin/profile", json={
        "cover_image": test_cover,
        "image_url": test_cover
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["cover_image"] == test_cover

    # Verify via profile endpoint
    prof_res = client.get("/api/hospital-admin/profile", headers=headers)
    assert prof_res.status_code == 200
    assert prof_res.json()["cover_image"] == test_cover
