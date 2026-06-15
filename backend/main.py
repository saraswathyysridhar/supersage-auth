from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from models import User, Member
import secrets
from bson import ObjectId
from typing import Optional
from database import (
    users_collection,
    members_collection,
    payments_collection,
    redis_client,
)
import bcrypt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ")[1]
    email = redis_client.get(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return email


@app.get("/")
def home():
    return {"message": "MongoDB Connected"}


@app.post("/signup")
def signup(user: User):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        return {"message": "User already exists"}
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    users_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
    })
    return {"message": "Signup successful"}


@app.post("/login")
def login(user: User):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user:
        return {"message": "User not found"}
    password_match = bcrypt.checkpw(
        user.password.encode(), existing_user["password"]
    )
    if not password_match:
        return {"message": "Invalid password"}
    token = secrets.token_hex(32)
    redis_client.setex(token, 86400, existing_user["email"])
    return {
        "message": "Login successful",
        "token": token,
        "name": existing_user["name"],
        "email": existing_user["email"],
    }


@app.post("/logout")
def logout(
    authorization: Optional[str] = Header(None),
    email: str = Depends(verify_token),
):
    token = authorization.split(" ")[1]
    redis_client.delete(token)
    return {"message": "Logout successful"}


@app.get("/me")
def get_me(email: str = Depends(verify_token)):
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"name": user["name"], "email": user["email"]}


@app.get("/dashboard")
def get_dashboard(email: str = Depends(verify_token)):
    members = members_collection.count_documents({})
    payments = list(payments_collection.find())
    revenue = sum(p["amount"] for p in payments)
    pending_payments = len([p for p in payments if p["status"] == "Pending"])
    profit = revenue * 0.3
    return {
        "revenue": revenue,
        "members": members,
        "profit": profit,
        "weekly_checkins": members,
        "pending_payments": pending_payments,
    }


@app.get("/members")
def get_members(email: str = Depends(verify_token)):
    members = []
    for member in members_collection.find():
        member["_id"] = str(member["_id"])
        members.append(member)
    return members


@app.post("/members")
def create_member(member: Member, email: str = Depends(verify_token)):
    members_collection.insert_one({
        "name": member.name,
        "email": member.email,
        "status": member.status,
    })
    return {"message": "Member created"}


@app.delete("/members/{member_id}")
def delete_member(member_id: str, email: str = Depends(verify_token)):
    members_collection.delete_one({"_id": ObjectId(member_id)})
    return {"message": "Member deleted"}


@app.get("/payments")
def get_payments(email: str = Depends(verify_token)):
    payments = []
    for payment in payments_collection.find():
        payment["_id"] = str(payment["_id"])
        payments.append(payment)
    return payments


@app.get("/seed-members")
def seed_members():
    members_collection.delete_many({})
    members_collection.insert_many([
        {"name": "John Smith", "email": "john@example.com", "status": "Active"},
        {"name": "Sarah Johnson", "email": "sarah@example.com", "status": "Active"},
        {"name": "Mike Brown", "email": "mike@example.com", "status": "Inactive"},
    ])
    return {"message": "Members created"}


@app.get("/seed-payments")
def seed_payments():
    payments_collection.delete_many({})
    payments_collection.insert_many([
        {"name": "John Smith", "amount": 120, "status": "Pending"},
        {"name": "Sarah Johnson", "amount": 240, "status": "Paid"},
        {"name": "Mike Brown", "amount": 90, "status": "Pending"},
        {"name": "Emma Davis", "amount": 310, "status": "Paid"},
    ])
    return {"message": "Payments created"}
