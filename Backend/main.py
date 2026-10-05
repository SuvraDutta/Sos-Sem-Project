from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from database import SessionLocal
from models import SOSReport
from schemas import SOSCreate


# Create FastAPI application
app = FastAPI(title="DisasterSOS API")


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database session
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# Test endpoint
@app.get("/")
def home():
    return {
        "message": "DisasterSOS API is running"
    }


# SOS submission endpoint
@app.post("/sos")
def create_sos(
    sos: SOSCreate,
    db: Session = Depends(get_db)
):

    # Generate SOS ID
    count = db.query(SOSReport).count() + 1

    sos_id = f"SOS-{datetime.now().year}-{count:06d}"

    # Create SOS record
    new_sos = SOSReport(
        sos_id=sos_id,
        disaster_type=sos.disaster_type,
        description=sos.description,
        latitude=sos.latitude,
        longitude=sos.longitude,
        accuracy=sos.accuracy,
        status="Reported"
    )

    # Save to database
    db.add(new_sos)
    db.commit()
    db.refresh(new_sos)

    # Send response to frontend
    return {
        "success": True,
        "message": "SOS submitted successfully",
        "sos_id": sos_id
    }