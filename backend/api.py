import os
import sys
from pathlib import Path

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv

# Load environment variables from .env.production or system env
load_dotenv('.env.production')
load_dotenv()

from app.main import app

# Vercel serverless function entry point


