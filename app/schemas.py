from pydantic import BaseModel, EmailStr, Field, field_validator
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
    phone: str = Field(pattern=r"^\d{10}$")
    role: Role
    status: Status
    skills: str = ""
    experience: int = Field(default=0, ge=0)

    @field_validator("role", mode="before")
    @classmethod
    def validate_role(cls, value):
        for role in Role:
            if value.lower() == role.value.lower():
                return role
        raise ValueError("Invalid role")


    @field_validator("status", mode="before")
    @classmethod
    def validate_status(cls, value):
        for status in Status:
            if value.lower() == status.value.lower():
                return status
        raise ValueError("Invalid status")

class CandidateUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = Field(pattern=r"^\d{10}$")
    role: Role | None = None
    status: Status | None = None
    skills: str | None = None
    experience: int | None = Field(default=None, ge=0)

      