from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP
from database import Base


class SOSReport(Base):
    __tablename__ = "sos_reports"

    id = Column(Integer, primary_key=True, index=True)
    sos_id = Column(String(30), unique=True, nullable=False)
    disaster_type = Column(String(50), nullable=False)
    description = Column(Text)
    latitude = Column(DECIMAL(10, 7), nullable=False)
    longitude = Column(DECIMAL(10, 7), nullable=False)
    accuracy = Column(DECIMAL(10, 2))
    created_at = Column(TIMESTAMP)
    status = Column(String(30))