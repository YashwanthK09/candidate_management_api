from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class Role(str, Enum):
    PYTHON = "Python Developer"
    JAVA = "Java Developer"
    FRONTEND = "Frontend Developer"
    BACKEND = "Backend Developer"
    DATA_ANALYST = "Data Analyst"


class Status(str, Enum):
    APPLIED = "Applied"
    SHORTLISTED = "Shortlisted"
    INTERVIEW = "Interview"
    SELECTED = "Selected"
    REJECTED = "Rejected"  

class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: Role
    status: Status
    skills: str = ""
    experience: int = Field(default=0, ge=0)

class CandidateUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    role: Role | None = None
    status: Status | None = None
    skills: str | None = None
    experience: int | None = Field(default=None, ge=0)

      