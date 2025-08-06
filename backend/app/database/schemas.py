from pydantic import BaseModel, EmailStr

class UserSchema(BaseModel):
    nome: str
    senha: str
    email: EmailStr

class UserPublic(BaseModel):
    id: int
    nome: str
    email: EmailStr

    class Config:
        orm_mode = True
