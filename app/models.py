from sqlalchemy import Column, Integer, String
from .database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, nullable=False)
    skills = Column(String)
    experience = Column(Integer, default=0)