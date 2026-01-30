import sys
import os

# Adds backend directory to python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.services.credit_scoring_service import scoring_engine

def test_integration():
    print("Testing Backend ML Integration...")
    if scoring_engine.model:
        print("✅ ML Model Loaded Successfully!")
        print(f"Model Info: {scoring_engine.model_info}")
    else:
        print("❌ Failed to load ML Model (Using Mock)")

if __name__ == "__main__":
    test_integration()
