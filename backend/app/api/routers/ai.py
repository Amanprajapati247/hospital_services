from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas import schemas
from app.services.ai_service import analyze_user_query

router = APIRouter(prefix="/ai", tags=["AI Health Assistant"])

@router.post("/chat", response_model=schemas.AiChatResponse)
def ai_health_chat(request: schemas.AiChatRequest, db: Session = Depends(get_db)):
    result = analyze_user_query(
        text=request.message,
        preferred_city=request.preferred_city or "Indore",
        db=db
    )
    return schemas.AiChatResponse(**result)
