from pymongo import MongoClient
import redis
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")

client = MongoClient(MONGO_URI)

db = client["test"]

users_collection = db["users"]
members_collection = db["members"]
payments_collection = db["payments"]
redis_client = redis.Redis(host=REDIS_HOST, port=6379, decode_responses=True)