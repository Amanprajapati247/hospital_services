# CARECONNECT AI
## Complete AI-Powered Healthcare Marketplace & Hospital Discovery Platform

**Tagline**: *Find the Right Doctor. Find the Right Hospital. Find the Right Care.*  
**Initial Launch City**: **Indore, Madhya Pradesh, India** (Engineered to expand across India)

---

## 🌟 Key Product Innovations & Experience Fusion

CareConnect AI unites the best user experiences from leading digital platforms:
- **Flipkart**: Marketplace-style responsive product & hospital cards, smart filters, price/tariff explorer, category pills, wishlist/save, and comparison matrix.
- **Zomato**: Location-based discovery, area search in Indore (Vijay Nagar, Palasia, Scheme 54, AB Road, Bhawarkua, Manik Bagh), verified badges, authentic patient reviews.
- **Practo**: Doctor discovery, multi-hospital affiliations, OPD slot selection, and instant appointment booking.
- **Google Maps**: Interactive Leaflet maps with custom pins, live hospital bed popups, and turn-by-turn directions.
- **ChatGPT**: Natural-language AI health triage in **English, Hindi, and Hinglish** with Web Speech voice recognition and strict clinical safety guardrails.
- **Hospital ERP / Admin**: Hospital bed inventory management (General, Private, ICU, NICU, Emergency, Ventilator), OPD waiting time manager, doctor affiliations, and incoming appointment queues.

---

## 🚨 Medical Safety Guardrails

- CareConnect AI does **NOT** diagnose diseases or prescribe medications.
- Evaluates emergency red-flag symptoms (chest pain, stroke signs, breathing distress, acute trauma) and surfaces high-visibility emergency warnings with 1-click **108 Ambulance** dispatch and nearest trauma centers.
- Explains matching rationale transparently ("Why you're seeing this hospital / doctor").

---

## 👥 Role-Based Portals

| Role | Demo Login | Password | Capabilities |
|---|---|---|---|
| **Patient** | `patient@careconnect.in` | `password123` | Search, compare, ask AI, book appointments, manage family members, save hospitals. |
| **Doctor** | `doctor@careconnect.in` | `password123` | View appointment queues, complete consultations with clinical notes, manage hospital affiliations. |
| **Hospital Admin** | `hospital@careconnect.in` | `password123` | Real-time Bed Inventory ERP (ICU/Ventilator/General), OPD wait times, doctor management, appointments. |
| **Platform Admin** | `admin@careconnect.in` | `password123` | Hospital & doctor verification workflows (NABH/MPMC), moderation, platform statistics, security audit logs. |

*(Note: You can switch between any role with 1-click on the top bar or login page!)*

---

## 🚀 Quick Start Guide

### 1. Backend (FastAPI + SQLAlchemy)

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Interactive Redoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 2. Frontend (React + TypeScript + Vite + Tailwind CSS)

```bash
cd frontend
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

### 3. Run Automated Tests

```bash
cd backend
pytest tests/test_api.py -v
```

---

## 📍 Launch Dataset — Indore, Madhya Pradesh

Seeded with realistic, verified healthcare hubs:
1. **Medanta Super Speciality Hospital Indore** (Scheme 54, PU4 Commercial, AB Road)
2. **Bombay Hospital Indore** (Eastern Ring Road, IDA Scheme 94, Vijay Nagar)
3. **CHL Hospital Indore** (A.B. Road, Near LIG Square, Anoop Nagar)
4. **Choithram Hospital & Research Centre** (Manik Bagh Road)
5. **Sri Aurobindo Institute of Medical Sciences (SAIMS)** (MR-10 / Bhawrasla)
6. **Shalby Super Speciality Hospital** (R.S. Bhandari Marg, New Palasia)
7. **Apple Hospital & Research Centre** (Bhawarkua Main Road)
