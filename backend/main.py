from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import users_collection
from models import User
import bcrypt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "MongoDB Connected"
    }

@app.post("/signup")
def signup(user: User):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message": "User already exists"
        }

    hashed_password = bcrypt.hashpw(
        user.password.encode(),
        bcrypt.gensalt()
    )

    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    })

    return {
        "message": "Signup successful"
    }

@app.post("/login")
def login(user: User):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        return {
            "message": "User not found"
        }

    password_match = bcrypt.checkpw(
        user.password.encode(),
        existing_user["password"]
    )

    if not password_match:
        return {
            "message": "Invalid password"
        }

    return {
        "message": "Login successful",
        "name": existing_user["name"],
        "email": existing_user["email"]
    }