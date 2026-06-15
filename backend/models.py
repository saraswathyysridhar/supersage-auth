from pydantic import BaseModel

class User(BaseModel):
    name: str
    email: str
    password: str

class Member(BaseModel):
    name: str
    email: str
    status: str