"""
Run this script once to create all database tables in Supabase.
Usage: python create_tables.py
"""
import sys
sys.path.append(".")

from app.core.database import engine, Base

# Import all models so SQLAlchemy knows about them
from app.models.user import User
from app.models.resume import Resume
from app.models.ats import AtsReport

print("Creating all tables...")
try:
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: All tables created (or already existed).")
    print("Tables:", list(Base.metadata.tables.keys()))
except Exception as e:
    print("ERROR:", str(e))
