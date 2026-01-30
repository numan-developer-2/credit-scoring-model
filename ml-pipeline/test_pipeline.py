"""
Quick test script to verify data pipeline
"""

import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pipelines.feature_engineering.data_cleaner import DataCleaner

def test_data_pipeline():
    """Test the complete data pipeline"""
    print("Testing Data Pipeline...")
    print("=" * 60)
    
    # Paths
    raw_data = "data/raw/credit_applications_raw.csv"
    processed_data = "data/processed/credit_applications_clean.csv"
    
    # Check if raw data exists
    if not os.path.exists(raw_data):
        print(f"ERROR: Raw data not found: {raw_data}")
        print("Please ensure the raw data file exists.")
        return False
    
    print(f"SUCCESS: Raw data found: {raw_data}")
    
    # Run pipeline
    try:
        cleaner = DataCleaner(raw_data, processed_data)
        cleaned_df = cleaner.run_pipeline()
        
        print("\n" + "=" * 60)
        print("PIPELINE TEST PASSED!")
        print("=" * 60)
        print(f"\nResults:")
        print(f"   - Records processed: {len(cleaned_df)}")
        print(f"   - Features created: {len(cleaned_df.columns)}")
        print(f"   - Output file: {processed_data}")
        
        # Show sample
        print(f"\nSample of cleaned data:")
        print(cleaned_df.head())
        
        return True
        
    except Exception as e:
        print(f"\nPIPELINE TEST FAILED!")
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_data_pipeline()
    sys.exit(0 if success else 1)
