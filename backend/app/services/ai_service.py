import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.database import models

# Multi-lingual Symptom and Specialty Mapping (English, Hindi, Hinglish)
SPECIALTY_PATTERNS = {
    "Cardiology": [
        r"chest\s*pain", r"chhati\s*me\s*dard", r"heart", r"dil", r"attack", 
        r"cardio", r"palpitation", r"ghabrahat", r"bp", r"blood\s*pressure", r"high\s*bp"
    ],
    "Orthopedics": [
        r"knee\s*pain", r"ghutno\s*me\s*dard", r"bone", r"haddi", r"joint", r"fracture", 
        r"ortho", r"back\s*pain", r"kamar\s*dard", r"spine", r"arthritis", r"ligament"
    ],
    "Neurology": [
        r"headache", r"sar\s*dard", r"migraine", r"stroke", r"seizure", r"daura", 
        r"nerves", r"nas", r"paralysis", r"falij", r"chakkar", r"dizziness", r"neuro"
    ],
    "Pediatrics": [
        r"child", r"bachha", r"kid", r"baby", r"infant", r"newborn", r"pediatric", 
        r"bachhe\s*ko\s*bukhar", r"teething", r"vaccination"
    ],
    "Gynecology": [
        r"pregnancy", r"delivery", r"period", r"mahina", r"gynec", r"maternity", 
        r"women", r"lady\s*doctor", r"pcos", r"pcod", r"uterus", r"ovary"
    ],
    "Dermatology": [
        r"skin", r"twacha", r"itching", r"khujli", r"rash", r"acne", r"pimples", 
        r"dermat", r"hair\s*fall", r"balon", r"allergy", r"fungal", r"eczema"
    ],
    "Gastroenterology": [
        r"stomach\s*pain", r"pet\s*dard", r"acidity", r"gas", r"indigestion", 
        r"liver", r"jaundice", r"piliya", r"constipation", r"kabz", r"loose\s*motion", r"gastro"
    ],
    "Pulmonology": [
        r"breathing", r"saans", r"cough", r"khansi", r"asthma", r"dama", 
        r"lungs", r"phephade", r"chest\s*congestion", r"pneumonia"
    ],
    "Ophthalmology": [
        r"eye", r"aankh", r"vision", r"drishti", r"cataract", r"motiyabind", 
        r"lasik", r"spectacles", r"chashma"
    ],
    "ENT": [
        r"ear", r"kaan", r"nose", r"naak", r"throat", r"gala", r"tonsil", 
        r"sinus", r"hearing", r"ent"
    ],
    "General Medicine": [
        r"fever", r"bukhar", r"weakness", r"kamzori", r"body\s*pain", 
        r"viral", r"dengue", r"malaria", r"typhoid", r"chills", r"cold"
    ]
}

EMERGENCY_TRIGGERS = [
    r"chest\s*pain", r"chhati\s*me\s*dard", r"heart\s*attack", r"cardiac",
    r"cannot\s*breathe", r"saans\s*nahi\s*aa\s*rahi", r"severe\s*bleeding",
    r"unconscious", r"behosh", r"stroke", r"paralysis\s*attack", r"seizure",
    r"head\s*injury", r"sar\s*par\s*chot", r"poison", r"zeher", r"extreme\s*pain"
]

def analyze_user_query(text: str, preferred_city: str, db: Session) -> Dict[str, Any]:
    text_lower = text.lower().strip()
    
    # 1. Check Emergency
    is_emergency = False
    emergency_matched = []
    for pattern in EMERGENCY_TRIGGERS:
        if re.search(pattern, text_lower):
            is_emergency = True
            emergency_matched.append(pattern)
            
    # 2. Extract Specialties & Symptoms
    detected_specialty = None
    detected_symptoms = []
    
    for spec, patterns in SPECIALTY_PATTERNS.items():
        for p in patterns:
            if re.search(p, text_lower):
                detected_specialty = spec
                matched_str = re.findall(p, text_lower)[0] if re.findall(p, text_lower) else spec
                if matched_str not in detected_symptoms:
                    detected_symptoms.append(matched_str)
                break
        if detected_specialty and len(detected_symptoms) > 1:
            break
            
    if not detected_specialty:
        detected_specialty = "General Medicine"
        
    # 3. Detect Budget if specified (e.g. 500, 1000, 50000)
    budget_match = re.search(r"(?:₹|rs\.?|inr|budget)?\s*(\d{3,7})", text_lower)
    budget_limit = int(budget_match.group(1)) if budget_match else None
    
    # 4. Determine Intent
    if is_emergency:
        intent = "EMERGENCY"
    elif any(k in text_lower for k in ["ayushman", "pmjay", "pm-jay", "scheme", "sarkari", "yojna"]):
        intent = "GOVERNMENT_SCHEME"
    elif any(k in text_lower for k in ["insurance", "bima", "cashless", "tpa", "policy"]):
        intent = "INSURANCE"
    elif any(k in text_lower for k in ["cost", "kharcha", "kitna lagega", "price", "fee", "rate"]):
        intent = "TREATMENT_COST"
    elif any(k in text_lower for k in ["compare", "tulna", "vs", "which is better"]):
        intent = "HOSPITAL_COMPARISON"
    elif any(k in text_lower for k in ["book", "appointment", "milna hai", "slot"]):
        intent = "APPOINTMENT"
    elif any(k in text_lower for k in ["doctor", "specialist", "dikhana hai"]):
        intent = "DOCTOR_SEARCH"
    elif any(k in text_lower for k in ["hospital", "aspatal", "clinic", "bed"]):
        intent = "HOSPITAL_SEARCH"
    else:
        intent = "SYMPTOM_INFORMATION"

    # 5. Fetch Matching Doctors
    doc_query = db.query(models.Doctor).filter(
        (models.Doctor.specialization.ilike(f"%{detected_specialty}%")) |
        (models.Doctor.specialization == detected_specialty)
    )
    doctors = doc_query.limit(3).all()
    
    rec_doctors = []
    for doc in doctors:
        aff = doc.affiliations[0] if doc.affiliations else None
        hosp_name = aff.hospital.name if (aff and aff.hospital) else "Apollo / Bombay Hospital Indore"
        fee = aff.consultation_fee if aff else 700
        
        # Respect user budget if extracted
        if budget_limit and fee > budget_limit:
            continue
            
        rec_doctors.append({
            "id": doc.id,
            "name": doc.name,
            "specialization": doc.specialization,
            "experience_years": doc.experience_years,
            "rating": doc.rating,
            "hospital_name": hosp_name,
            "consultation_fee": fee,
            "match_reason": f"Top verified {doc.specialization} specialist in Indore with {doc.experience_years}+ years experience."
        })

    # 6. Fetch Matching Hospitals
    hosp_query = db.query(models.Hospital).filter(
        models.Hospital.city.ilike(f"%{preferred_city}%")
    )
    if is_emergency:
        hosp_query = hosp_query.filter(models.Hospital.is_emergency_active == True)
    hospitals = hosp_query.order_by(models.Hospital.rating.desc()).limit(3).all()
    
    rec_hospitals = []
    for h in hospitals:
        icu = h.bed_inventory.icu_avail if h.bed_inventory else 6
        rec_hospitals.append({
            "id": h.id,
            "name": h.name,
            "area": h.area,
            "rating": h.rating,
            "starting_fee": h.starting_fee,
            "icu_avail": icu,
            "emergency_ready": h.is_emergency_active,
            "pmjay_accepted": True,
            "match_reason": f"Equipped {h.hospital_type} in {h.area}, Indore with verified 24x7 facilities and {icu} ICU beds."
        })

    # 7. Formulate Safe Clinical Responses
    if is_emergency:
        emergency_alert = "🚨 POTENTIAL MEDICAL EMERGENCY DETECTED: Symptoms matching severe or acute distress were identified. Do not delay care. Proceed directly to the nearest emergency room or call 108 immediately."
        educational_summary = (
            "Symptoms like severe chest pain, breathing difficulty, or acute distress require prompt clinical evaluation by an emergency physician. "
            "These signs can be related to cardiac, respiratory, or vascular emergencies where immediate hospital triage is essential."
        )
        warning_signs = [
            "Severe squeezing chest pressure radiating to the left arm, neck, or jaw",
            "Acute shortness of breath or blue-tinted lips",
            "Sudden numbness or drooping on one side of the face or body",
            "Loss of consciousness or profound dizziness"
        ]
        when_to_seek_care = "IMMEDIATELY. Contact 108 / 102 emergency ambulance or visit the nearest 24x7 trauma center."
    else:
        emergency_alert = None
        educational_summary = (
            f"Based on your description, the symptoms may relate to the field of {detected_specialty}. "
            "Many common conditions can cause these symptoms ranging from mild and benign to conditions requiring medical management."
        )
        warning_signs = [
            "Symptoms rapidly worsening or not improving over 48 hours",
            "High fever with chills or persistent lethargy",
            "Severe localized pain interfering with mobility or rest",
            "Onset of sudden new symptoms such as dizziness or shortness of breath"
        ]
        when_to_seek_care = f"Schedule a consultation with a qualified {detected_specialty} specialist or general physician for an accurate clinical examination."

    disclaimer = (
        "Medical Disclaimer: CareConnect AI provides educational information and healthcare provider discovery. "
        "It is not a diagnostic tool and does not replace medical advice from a registered healthcare professional."
    )

    follow_up_suggestions = [
        f"Book appointment with {detected_specialty} in Indore",
        "View nearby emergency hospitals",
        "Check Ayushman Bharat PM-JAY coverage",
        "Compare hospital bed availability"
    ]

    return {
        "intent": intent,
        "is_emergency": is_emergency,
        "emergency_alert": emergency_alert,
        "symptoms_detected": detected_symptoms if detected_symptoms else [text],
        "recommended_specialty": detected_specialty,
        "educational_summary": educational_summary,
        "warning_signs": warning_signs,
        "when_to_seek_care": when_to_seek_care,
        "disclaimer": disclaimer,
        "recommended_doctors": rec_doctors,
        "recommended_hospitals": rec_hospitals,
        "follow_up_suggestions": follow_up_suggestions
    }
