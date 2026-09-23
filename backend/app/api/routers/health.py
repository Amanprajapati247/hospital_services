from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.database import models
from app.schemas import schemas
from app.api.routers.auth import get_current_user

router = APIRouter(tags=["Health Library & Reviews"])

@router.get("/health/articles", response_model=List[schemas.HealthArticleOut])
def get_articles(
    category: Optional[str] = None,
    trending: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.HealthArticle)
    if category:
        query = query.filter(models.HealthArticle.category.ilike(f"%{category}%"))
    if trending is not None:
        query = query.filter(models.HealthArticle.is_trending == trending)
    return query.all()

@router.get("/health/articles/{slug}", response_model=schemas.HealthArticleOut)
def get_article_detail(slug: str, db: Session = Depends(get_db)):
    art = db.query(models.HealthArticle).filter(models.HealthArticle.slug == slug).first()
    if not art:
        raise HTTPException(status_code=404, detail="Health guide not found")
    return art

@router.post("/reviews", response_model=schemas.ReviewOut)
def post_review(
    data: schemas.ReviewCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rev = models.Review(
        user_id=current_user.id,
        hospital_id=data.hospital_id,
        doctor_id=data.doctor_id,
        rating=data.rating,
        cleanliness_rating=data.cleanliness_rating or 5.0,
        staff_rating=data.staff_rating or 5.0,
        wait_time_rating=data.wait_time_rating or 4.0,
        review_text=data.review_text,
        is_verified_patient=True
    )
    db.add(rev)
    db.commit()
    db.refresh(rev)

    hosp_name = rev.hospital.name if rev.hospital else None
    doc_name = rev.doctor.name if rev.doctor else None

    return schemas.ReviewOut(
        id=rev.id,
        user_name=current_user.full_name,
        rating=rev.rating,
        cleanliness_rating=rev.cleanliness_rating,
        staff_rating=rev.staff_rating,
        wait_time_rating=rev.wait_time_rating,
        review_text=rev.review_text,
        is_verified_patient=rev.is_verified_patient,
        created_at=rev.created_at,
        hospital_name=hosp_name,
        doctor_name=doc_name
    )
