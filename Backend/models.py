from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DECIMAL,
    TIMESTAMP,
    Boolean
)

from database import Base
from datetime import datetime


class SOSReport(Base):
    __tablename__ = "sos_reports"

    id = Column(Integer, primary_key=True, index=True)
    sos_id = Column(String(30), unique=True, nullable=False)
    disaster_type = Column(String(50), nullable=False)
    description = Column(Text)
    latitude = Column(DECIMAL(10, 7), nullable=False)
    longitude = Column(DECIMAL(10, 7), nullable=False)
    accuracy = Column(DECIMAL(10, 2))

    created_at = Column(
        TIMESTAMP,
        default=datetime.utcnow
    )

    status = Column(String(30))


class Authority(Base):
    __tablename__ = "authorities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    authority_type = Column(String(50), nullable=False)
    phone = Column(String(20))
    email = Column(String(150))
    latitude = Column(DECIMAL(10, 7), nullable=False)
    longitude = Column(DECIMAL(10, 7), nullable=False)
    address = Column(String(255))
    active = Column(Boolean, default=True)