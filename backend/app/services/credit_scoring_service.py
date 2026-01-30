import os
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from loguru import logger
from app.models.risk_assessment import RiskAssessment
from app.models.application import Application
from app.schemas.application import ApplicationCreate

# Path to models (relative to backend execution)
# Assuming backend is run from 'backend/' dir, and models are in '../ml-pipeline/models/saved_models/'
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../ml-pipeline/models/saved_models"))

class MLScoringEngine:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.features = None
        self.model_info = None
        self.load_model()
    
    def load_model(self):
        """Load the best trained model"""
        try:
            if not os.path.exists(MODEL_DIR):
                logger.warning(f"Model directory not found: {MODEL_DIR}. Using mock scoring.")
                return

            # Find latest model timestamp
            files = os.listdir(MODEL_DIR)
            timestamps = []
            for f in files:
                if f.startswith("model_info_") and f.endswith(".json"):
                    timestamps.append(f.replace("model_info_", "").replace(".json", ""))
            
            if not timestamps:
                logger.warning("No trained models found. Using mock scoring.")
                return
                
            latest_ts = sorted(timestamps)[-1]
            logger.info(f"Loading model version: {latest_ts}")
            
            # Load info
            import json
            with open(os.path.join(MODEL_DIR, f"model_info_{latest_ts}.json"), 'r') as f:
                self.model_info = json.load(f)
            
            best_model_name = self.model_info.get('best_model', 'xgboost')
            
            # Load model and scaler
            self.model = joblib.load(os.path.join(MODEL_DIR, f"{best_model_name}_{latest_ts}.pkl"))
            self.scaler = joblib.load(os.path.join(MODEL_DIR, f"scaler_{latest_ts}.pkl"))
            
            # Load feature names
            with open(os.path.join(MODEL_DIR, f"features_{latest_ts}.json"), 'r') as f:
                data = json.load(f)
                self.features = data['features']
                
            logger.success(f"Successfully loaded {best_model_name} model")
            
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")
            self.model = None

    def prepare_features(self, application_data: ApplicationCreate):
        """Transform application data into model features"""
        # Dictionary to hold raw features
        data = {
            'age': 35, # Default if missing (should be in input)
            'annual_income': application_data.annual_income,
            'years_employed': 5, # Default
            'monthly_debt': application_data.monthly_debt,
            'loan_amount': application_data.loan_amount,
            
            # Categorical placeholders (would come from enriched data)
            'employment_status_encoded': 1, # Employed
            'payment_history_encoded': 2, # Good
            'marital_status_encoded': 1, # Married
            'education_encoded': 2, # Bachelor
            'home_ownership_encoded': 1, # Own
            'gender_encoded': 1, # Male
            'existing_credits': 1, 
            'credit_history_length': 5,
            'dependents': 0
        }
        
        # Calculate derived features
        data['debt_to_income_ratio'] = (data['monthly_debt'] * 12) / data['annual_income'] if data['annual_income'] > 0 else 0
        data['credit_to_income_ratio'] = data['loan_amount'] / data['annual_income'] if data['annual_income'] > 0 else 0
        data['monthly_income'] = data['annual_income'] / 12
        data['debt_burden'] = (data['monthly_debt'] / data['monthly_income']) * 100 if data['monthly_income'] > 0 else 0
        data['credit_quality_score'] = data['credit_history_length'] * 10
        
        # Feature DataFrame
        df = pd.DataFrame([data])
        
        # Ensure all required features exist (fill 0 for missing ones like one-hot encoded)
        if self.features:
            for feat in self.features:
                if feat not in df.columns:
                    df[feat] = 0
            
            # Reorder columns
            df = df[self.features]
            
        return df

    def predict(self, application_data: ApplicationCreate):
        """Predict credit score and risk"""
        if not self.model:
            return self.mock_predict(application_data)
        
        try:
            # Prepare features
            X = self.prepare_features(application_data)
            
            # Scale
            X_scaled = self.scaler.transform(X)
            
            # Predict
            prob_default = self.model.predict_proba(X_scaled)[0][1]
            
            # Convert probability to credit score (300-850)
            # Default prob 0 -> 850, default prob 1 -> 300
            credit_score = int(850 - (prob_default * 550))
            
            # Determine risk
            if credit_score >= 700:
                risk_level = "Low"
            elif credit_score >= 600:
                risk_level = "Medium"
            else:
                risk_level = "High"
                
            return {
                "credit_score": credit_score,
                "risk_level": risk_level,
                "default_probability": float(prob_default),
                "model_used": "XGBoost (ML)"
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return self.mock_predict(application_data)

    def mock_predict(self, application_data: ApplicationCreate):
        """Fallback mock prediction"""
        logger.info("Using mock scoring logic")
        score = 650  # Base
        
        # Simple logic
        if application_data.annual_income > 50000:
            score += 50
        if application_data.monthly_debt < 1000:
            score += 50
            
        return {
            "credit_score": score,
            "risk_level": "Low" if score > 700 else "Medium",
            "default_probability": 0.1,
            "model_used": "Rule-based (Mock)"
        }

# Global engine instance
scoring_engine = MLScoringEngine()

async def calculate_credit_score(application_data: ApplicationCreate) -> dict:
    """
    Calculate credit score using ML model
    """
    logger.info(f"Calculating credit score for {application_data.full_name}")
    
    # Use engine to predict
    result = scoring_engine.predict(application_data)
    
    return {
        "credit_score": result['credit_score'],
        "risk_level": result['risk_level'],
        "approval_probability": 1.0 - result['default_probability'],
        "risk_factors": ["High Debt"] if result['risk_level'] == "High" else [],
        "model_version": result['model_used']
    }
