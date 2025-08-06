from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, index=True)
    senha = Column(String)
    email = Column(String, unique=True, index=True)

    cronogramas = relationship("Cronograma", back_populates="usuario")


class Cronograma(Base):
    __tablename__ = "cronogramas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    descricao = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    usuario = relationship("User", back_populates="cronogramas")
