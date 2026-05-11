import os
from sqlmodel import SQLModel, create_engine, Session
import models  # Important: import models before calling create_all

# You can use a PostgreSQL URL here, e.g. "postgresql://user:password@localhost:5432/instant_utilities"
# For immediate local testing without Docker, SQLite is configured as a quick fallback if DB_URL isn't set.
POSTGRES_URL = os.getenv("DATABASE_URL", "sqlite:///./instant_utilities.db")

engine = create_engine(POSTGRES_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
