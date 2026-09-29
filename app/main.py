from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import engine, Base, SessionLocal
from . import models
from .schemas import CandidateCreate, CandidateUpdate, Role,Status

from fastapi.staticfiles import StaticFiles
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Candidate Management API"}


@app.post("/candidates", status_code=201)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    new_candidate = models.Candidate(**candidate.model_dump())

    try:
        db.add(new_candidate)
        db.commit()
        db.refresh(new_candidate)
    except:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists..")
    return new_candidate

@app.get("/candidates")
def get_candidates(
    role: Role | None = None,
    status: Status | None = None,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Candidate)

    if role:
        query = query.filter(models.Candidate.role == role.value)

    if status:
        query = query.filter(models.Candidate.status == status.value)

    if search:
        query = query.filter(models.Candidate.name.ilike(f"%{search}%"))

    return query.all()


@app.get("/candidates/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return candidate

@app.put("/candidates/{candidate_id}")
def update_candidate(
    candidate_id: int,
    candidate_data: CandidateUpdate,
    db: Session = Depends(get_db)
):
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    updates = candidate_data.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(candidate, field, value)

    db.commit()
    db.refresh(candidate)

    return candidate

@app.delete("/candidates/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(models.Candidate).filter(
        models.Candidate.id == candidate_id
    ).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    db.delete(candidate)
    db.commit()

    return {"message": "Candidate deleted successfully"}