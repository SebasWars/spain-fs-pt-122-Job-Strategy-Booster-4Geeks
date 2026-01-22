from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, Float, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List, Any

db = SQLAlchemy()



class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    postulaciones:Mapped[List["Postulaciones"]]=relationship("Postulaciones",back_populates="user")
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_active": self.is_active
            # do NOT include password here for security reasons
        }
    def __str__(self):
        return self.username
    

class Postulaciones(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name_company:Mapped[str]=mapped_column(String(50),nullable=False)
    salary:Mapped[int]=mapped_column(Integer,nullable=False)
    candidatos:Mapped[int]=mapped_column(Integer,nullable=False)
    reqerments: Mapped[List[Any]] = mapped_column(JSON, nullable=False)
    user_id:Mapped[int]=mapped_column(ForeignKey("user.id"))
    user:Mapped["User"]=relationship("User",back_populates="postulaciones")
    def serializer(self):
        return {
            "id":self.id,
            "name_company":self.name_company,
            "salary":self.salary,
            "candidatos":self.candidatos,
            "reqerments":[req for req in self.reqerments]

        }
    