import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "CareConnect AI"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "careconnect-ai-indore-healthcare-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite default with smooth PostgreSQL fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./careconnect.db"
    )
    
    DEFAULT_CITY: str = "Indore"
    DEFAULT_STATE: str = "Madhya Pradesh"
    
    # AI Engine Settings
    EMERGENCY_KEYWORDS: list[str] = [
        "chest pain", "heart attack", "chhati me dard", "severe bleeding", 
        "unconscious", "stroke", "paralysis", "breathing difficulty", 
        "saans lene me takleef", "seizure", "head trauma", "poisoning",
        "cardiac arrest", "choke", "heavy blood loss", "electric shock"
    ]

settings = Settings()
