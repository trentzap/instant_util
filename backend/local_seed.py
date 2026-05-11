import os
from sqlmodel import Session, create_engine
from models import User, Facility
from utils.auth import get_password_hash

print("\n--- INSTANT.UTILITIES REMOTE DB SEEDER ---")
db_url = input("Paste your exact Render DATABASE_URL (starts with postgresql://): ").strip()

if not db_url:
    print("No URL provided. Exiting.")
    exit(1)

# Render uses external postgresql://
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)

print("Connecting to database...")

with Session(engine) as session:
    # 1. Create a Facility
    facility = session.query(Facility).filter(Facility.id == 1).first()
    if not facility:
        facility = Facility(
            id=1, 
            name="Sunrise Towers", 
            type="residential",
            subscription_plan="premium",
            status="active"
        )
        session.add(facility)
        session.commit()
        print("Created default facility (Sunrise Towers, ID: 1)")
    else:
        print("Facility ID 1 already exists.")

    # 2. Create Users
    users_to_create = [
        {"first_name": "Test", "last_name": "Manager", "email": "manager@test.com", "role": "manager", "facility_id": 1},
        {"first_name": "Test", "last_name": "Resident", "email": "resident@test.com", "role": "resident", "facility_id": 1},
        {"first_name": "Test", "last_name": "Contractor", "email": "contractor@test.com", "role": "contractor", "facility_id": None}
    ]

    for u in users_to_create:
        existing = session.query(User).filter(User.email == u["email"]).first()
        if not existing:
            user = User(
                first_name=u["first_name"],
                last_name=u["last_name"],
                email=u["email"],
                hashed_password=get_password_hash("password123"),
                role=u["role"],
                facility_id=u["facility_id"]
            )
            session.add(user)
            print(f"Created user: {u['email']}")
        else:
            print(f"User already exists: {u['email']}")

    session.commit()

print("\nDatabase seeded successfully!")
print("You can now log in at Vercel with:")
print("Email: manager@test.com")
print("Password: password123")
