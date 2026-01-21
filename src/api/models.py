from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # Relaciones
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="user", uselist=False
    )
    postulations: Mapped[list["Postulation"]] = relationship(
        "Postulation", back_populates="user"
    )


class Profile(db.Model):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    image_filename: Mapped[str] = mapped_column(
        String(255), nullable=True)  # archivo de imagen
    bio: Mapped[str] = mapped_column(String(5000), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="profile")

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "bio": self.bio,
            "image_filename": self.image_filename,
        }


class Status(db.Model):
    __tablename__ = "status"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)

    postulations: Mapped[list["Postulation"]] = relationship(
        "Postulation", back_populates="status"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Postulation(db.Model):
    __tablename__ = "postulation"

    id: Mapped[int] = mapped_column(primary_key=True)
    postulation_state: Mapped[str] = mapped_column(String(50), nullable=False)
    company_name: Mapped[str] = mapped_column(String(50), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False)
    experience: Mapped[int] = mapped_column(Integer, nullable=False)
    inscription_date: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    salary: Mapped[float] = mapped_column(Float, nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    postulation_url: Mapped[str] = mapped_column(String(5000), nullable=False)
    work_type: Mapped[str] = mapped_column(String(50), nullable=False)
    requirements: Mapped[list[dict]] = mapped_column(JSON, nullable=False)
    candidates_applied: Mapped[int] = mapped_column(Integer, nullable=False)
    available_positions: Mapped[int] = mapped_column(Integer, nullable=False)
    job_description: Mapped[str] = mapped_column(String(500), nullable=False)

    # Relaciones
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="postulations")

    status_id: Mapped[int] = mapped_column(
        ForeignKey("status.id"), nullable=False)
    status: Mapped["Status"] = relationship(
        "Status", back_populates="postulations")

    def serialize(self):
        return {
            "id": self.id,
            "postulation_state": self.postulation_state,
            "company_name": self.company_name,
            "role": self.role,
            "experience": self.experience,
            "inscription_date": self.inscription_date.isoformat(),
            "city": self.city,
            "salary": self.salary,
            "platform": self.platform,
            "postulation_url": self.postulation_url,
            "work_type": self.work_type,
            "requirements": self.requirements,
            "candidates_applied": self.candidates_applied,
            "available_positions": self.available_positions,
            "job_description": self.job_description,
        }
