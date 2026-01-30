"""
Data Cleaning and Preprocessing Pipeline
Cleans raw credit data and prepares it for ML training
"""

import pandas as pd
import numpy as np
from datetime import datetime
import os

class DataCleaner:
    def __init__(self, raw_data_path, processed_data_path):
        self.raw_data_path = raw_data_path
        self.processed_data_path = processed_data_path
        self.df = None
        
    def load_raw_data(self):
        """Load raw CSV data"""
        print(" Loading raw data...")
        self.df = pd.read_csv(self.raw_data_path)
        print(f" Loaded {len(self.df)} records")
        print(f" Columns: {list(self.df.columns)}")
        return self.df
    
    def check_data_quality(self):
        """Check for data quality issues"""
        print("\n Checking data quality...")
        
        # Missing values
        missing = self.df.isnull().sum()
        if missing.sum() > 0:
            print(f"  Missing values found:")
            print(missing[missing > 0])
        else:
            print(" No missing values")
        
        # Duplicates
        duplicates = self.df.duplicated().sum()
        if duplicates > 0:
            print(f"  {duplicates} duplicate records found")
        else:
            print(" No duplicates")
        
        # Data types
        print(f"\n Data types:")
        print(self.df.dtypes)
        
        return missing, duplicates
    
    def clean_data(self):
        """Clean and validate data"""
        print("\n Cleaning data...")
        
        # Remove duplicates
        initial_count = len(self.df)
        self.df = self.df.drop_duplicates()
        removed = initial_count - len(self.df)
        if removed > 0:
            print(f" Removed {removed} duplicate records")
        
        # Handle missing values
        if self.df.isnull().sum().sum() > 0:
            # Fill numeric columns with median
            numeric_cols = self.df.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                if self.df[col].isnull().sum() > 0:
                    median_val = self.df[col].median()
                    self.df[col].fillna(median_val, inplace=True)
                    print(f" Filled {col} missing values with median: {median_val}")
            
            # Fill categorical columns with mode
            categorical_cols = self.df.select_dtypes(include=['object']).columns
            for col in categorical_cols:
                if self.df[col].isnull().sum() > 0:
                    mode_val = self.df[col].mode()[0]
                    self.df[col].fillna(mode_val, inplace=True)
                    print(f" Filled {col} missing values with mode: {mode_val}")
        
        # Validate age
        self.df = self.df[(self.df['age'] >= 18) & (self.df['age'] <= 100)]
        print(f" Validated age range (18-100)")
        
        # Validate income
        self.df = self.df[self.df['annual_income'] > 0]
        print(f" Validated annual income (> 0)")
        
        # Validate loan amount
        self.df = self.df[self.df['loan_amount'] > 0]
        print(f" Validated loan amount (> 0)")
        
        # Validate employment years
        self.df = self.df[self.df['years_employed'] >= 0]
        print(f" Validated employment years (>= 0)")
        
        print(f"\n Clean data: {len(self.df)} records")
        return self.df
    
    def engineer_features(self):
        """Create derived features"""
        print("\n Engineering features...")
        
        # Debt-to-income ratio
        self.df['debt_to_income_ratio'] = (self.df['monthly_debt'] * 12) / self.df['annual_income']
        print(" Created: debt_to_income_ratio")
        
        # Credit-to-income ratio
        self.df['credit_to_income_ratio'] = self.df['loan_amount'] / self.df['annual_income']
        print(" Created: credit_to_income_ratio")
        
        # Monthly income
        self.df['monthly_income'] = self.df['annual_income'] / 12
        print(" Created: monthly_income")
        
        # Debt burden (monthly debt as % of monthly income)
        self.df['debt_burden'] = (self.df['monthly_debt'] / self.df['monthly_income']) * 100
        print(" Created: debt_burden")
        
        # Age groups
        self.df['age_group'] = pd.cut(
            self.df['age'], 
            bins=[0, 25, 35, 45, 55, 100], 
            labels=['18-25', '26-35', '36-45', '46-55', '56+']
        )
        print(" Created: age_group")
        
        # Income groups
        self.df['income_group'] = pd.cut(
            self.df['annual_income'],
            bins=[0, 40000, 60000, 80000, 100000, float('inf')],
            labels=['Low', 'Medium', 'High', 'Very High', 'Ultra High']
        )
        print(" Created: income_group")
        
        # Employment stability score
        self.df['employment_stability'] = np.where(
            self.df['years_employed'] >= 10, 'Stable',
            np.where(self.df['years_employed'] >= 5, 'Moderate', 'New')
        )
        print(" Created: employment_stability")
        
        # Credit history quality
        self.df['credit_quality_score'] = self.df['credit_history_length'] * 10
        print(" Created: credit_quality_score")
        
        return self.df
    
    def encode_categorical(self):
        """Encode categorical variables"""
        print("\n Encoding categorical variables...")
        
        # Gender encoding
        self.df['gender_encoded'] = self.df['gender'].map({'M': 1, 'F': 0})
        print(" Encoded: gender")
        
        # Employment status encoding
        employment_map = {'Employed': 1, 'Self-Employed': 2, 'Unemployed': 0}
        self.df['employment_status_encoded'] = self.df['employment_status'].map(employment_map)
        print(" Encoded: employment_status")
        
        # Payment history encoding
        payment_map = {'Excellent': 3, 'Good': 2, 'Fair': 1, 'Poor': 0}
        self.df['payment_history_encoded'] = self.df['payment_history'].map(payment_map)
        print(" Encoded: payment_history")
        
        # Marital status encoding
        marital_map = {'Married': 1, 'Single': 0, 'Divorced': 0}
        self.df['marital_status_encoded'] = self.df['marital_status'].map(marital_map)
        print(" Encoded: marital_status")
        
        # Education encoding
        education_map = {'PhD': 4, 'Master': 3, 'Bachelor': 2, 'High School': 1}
        self.df['education_encoded'] = self.df['education'].map(education_map)
        print(" Encoded: education")
        
        # Home ownership encoding
        home_map = {'Own': 1, 'Rent': 0, 'Mortgage': 0.5}
        self.df['home_ownership_encoded'] = self.df['home_ownership'].map(home_map)
        print(" Encoded: home_ownership")
        
        # Loan purpose encoding (one-hot)
        loan_purpose_dummies = pd.get_dummies(self.df['loan_purpose'], prefix='loan_purpose')
        self.df = pd.concat([self.df, loan_purpose_dummies], axis=1)
        print(f" One-hot encoded: loan_purpose ({len(loan_purpose_dummies.columns)} categories)")
        
        return self.df
    
    def create_risk_labels(self):
        """Create risk level labels based on features"""
        print("\n Creating risk labels...")
        
        # Risk score calculation
        risk_score = 0
        
        # Income factor
        risk_score += np.where(self.df['annual_income'] < 40000, 2, 0)
        risk_score += np.where(self.df['annual_income'] > 80000, -1, 0)
        
        # Debt ratio factor
        risk_score += np.where(self.df['debt_to_income_ratio'] > 0.4, 2, 0)
        risk_score += np.where(self.df['debt_to_income_ratio'] < 0.2, -1, 0)
        
        # Employment factor
        risk_score += np.where(self.df['years_employed'] < 2, 1, 0)
        risk_score += np.where(self.df['years_employed'] > 10, -1, 0)
        
        # Credit history factor
        risk_score += np.where(self.df['credit_history_length'] < 3, 1, 0)
        risk_score += np.where(self.df['credit_history_length'] > 10, -1, 0)
        
        # Payment history factor
        risk_score += np.where(self.df['payment_history'] == 'Poor', 2, 0)
        risk_score += np.where(self.df['payment_history'] == 'Excellent', -1, 0)
        
        self.df['risk_score'] = risk_score
        
        # Risk level categorization
        self.df['risk_level'] = pd.cut(
            risk_score,
            bins=[-float('inf'), 0, 2, float('inf')],
            labels=['Low', 'Medium', 'High']
        )
        
        print(f" Created risk labels")
        print(f"   Risk distribution:")
        print(self.df['risk_level'].value_counts())
        
        return self.df
    
    def save_processed_data(self):
        """Save cleaned and processed data"""
        print("\n Saving processed data...")
        
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(self.processed_data_path), exist_ok=True)
        
        # Save full processed data
        self.df.to_csv(self.processed_data_path, index=False)
        print(f" Saved to: {self.processed_data_path}")
        
        # Save feature-only data for ML
        ml_features = [
            'age', 'annual_income', 'years_employed', 'monthly_debt', 'loan_amount',
            'existing_credits', 'credit_history_length', 'dependents',
            'debt_to_income_ratio', 'credit_to_income_ratio', 'debt_burden',
            'credit_quality_score', 'gender_encoded', 'employment_status_encoded',
            'payment_history_encoded', 'marital_status_encoded', 'education_encoded',
            'home_ownership_encoded', 'default'
        ]
        
        # Add loan purpose dummies
        loan_purpose_cols = [col for col in self.df.columns if col.startswith('loan_purpose_')]
        ml_features.extend(loan_purpose_cols)
        
        ml_data = self.df[ml_features]
        ml_data_path = self.processed_data_path.replace('.csv', '_ml_ready.csv')
        ml_data.to_csv(ml_data_path, index=False)
        print(f" Saved ML-ready data to: {ml_data_path}")
        
        # Save data summary
        summary_path = self.processed_data_path.replace('.csv', '_summary.txt')
        with open(summary_path, 'w') as f:
            f.write("=" * 50 + "\n")
            f.write("DATA PROCESSING SUMMARY\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Processing Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Total Records: {len(self.df)}\n")
            f.write(f"Total Features: {len(self.df.columns)}\n\n")
            f.write("Feature List:\n")
            for col in self.df.columns:
                f.write(f"  - {col}\n")
            f.write("\n" + "=" * 50 + "\n")
            f.write("BASIC STATISTICS\n")
            f.write("=" * 50 + "\n")
            f.write(str(self.df.describe()))
        
        print(f" Saved summary to: {summary_path}")
        
        return self.df
    
    def run_pipeline(self):
        """Run complete data cleaning pipeline"""
        print("=" * 60)
        print(" DATA CLEANING & PREPROCESSING PIPELINE")
        print("=" * 60)
        
        # Step 1: Load data
        self.load_raw_data()
        
        # Step 2: Check quality
        self.check_data_quality()
        
        # Step 3: Clean data
        self.clean_data()
        
        # Step 4: Engineer features
        self.engineer_features()
        
        # Step 5: Encode categorical
        self.encode_categorical()
        
        # Step 6: Create risk labels
        self.create_risk_labels()
        
        # Step 7: Save processed data
        self.save_processed_data()
        
        print("\n" + "=" * 60)
        print(" PIPELINE COMPLETE!")
        print("=" * 60)
        print(f"\n Final dataset shape: {self.df.shape}")
        print(f" Output location: {self.processed_data_path}")
        
        return self.df


if __name__ == "__main__":
    # Configuration
    RAW_DATA_PATH = "../data/raw/credit_applications_raw.csv"
    PROCESSED_DATA_PATH = "../data/processed/credit_applications_clean.csv"
    
    # Run pipeline
    cleaner = DataCleaner(RAW_DATA_PATH, PROCESSED_DATA_PATH)
    cleaned_data = cleaner.run_pipeline()
    
    print("\n Data is ready for ML training!")

