"""
Credit Scoring Model Training Pipeline
Trains XGBoost, LightGBM, and CatBoost models for credit scoring
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    roc_auc_score, accuracy_score, precision_score, 
    recall_score, f1_score, classification_report, confusion_matrix
)
import xgboost as xgb
import lightgbm as lgb
# from catboost import CatBoostClassifier
import joblib
from datetime import datetime
import json
import os
import sys

class CreditScoringTrainer:
    def __init__(self, data_path, model_save_path):
        self.data_path = data_path
        self.model_save_path = model_save_path
        self.models = {}
        self.scalers = {}
        self.metrics = {}
        self.feature_names = []
        
    def load_data(self):
        """Load ML-ready processed data"""
        print("Loading ML-ready data...")
        
        if not os.path.exists(self.data_path):
            print(f"ERROR: Data file not found: {self.data_path}")
            print("Please run data cleaning pipeline first!")
            sys.exit(1)
            
        df = pd.read_csv(self.data_path)
        print(f"SUCCESS: Loaded {len(df)} records with {len(df.columns)} features")
        return df
    
    def prepare_features(self, df):
        """Prepare features and target"""
        print("\nPreparing features...")
        
        # Target variable
        if 'default' not in df.columns:
            print("ERROR: Target variable 'default' not found!")
            sys.exit(1)
        
        y = df['default']
        
        # Select features (exclude target)
        X = df.drop(['default'], axis=1)
        
        # Store feature names
        self.feature_names = list(X.columns)
        
        print(f"Features: {len(self.feature_names)}")
        print(f"Target distribution:")
        print(f"  No Default (0): {(y == 0).sum()} ({(y == 0).sum() / len(y) * 100:.1f}%)")
        print(f"  Default (1): {(y == 1).sum()} ({(y == 1).sum() / len(y) * 100:.1f}%)")
        
        return X, y
    
    def split_and_scale(self, X, y):
        """Split data and scale features"""
        print("\nSplitting and scaling data...")
        
        # Split data (80-20)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set: {len(X_train)} samples")
        print(f"Test set: {len(X_test)} samples")
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Convert back to DataFrame for better handling
        X_train_scaled = pd.DataFrame(X_train_scaled, columns=self.feature_names)
        X_test_scaled = pd.DataFrame(X_test_scaled, columns=self.feature_names)
        
        self.scalers['standard'] = scaler
        
        return X_train_scaled, X_test_scaled, y_train, y_test
    
    def evaluate_model(self, model, X_test, y_test, model_name):
        """Evaluate model performance"""
        print(f"\nEvaluating {model_name}...")
        
        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred, zero_division=0),
            'recall': recall_score(y_test, y_pred, zero_division=0),
            'f1_score': f1_score(y_test, y_pred, zero_division=0),
            'roc_auc': roc_auc_score(y_test, y_pred_proba) if len(np.unique(y_test)) > 1 else 0.0
        }
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        print(f"  Accuracy:  {metrics['accuracy']:.4f}")
        print(f"  Precision: {metrics['precision']:.4f}")
        print(f"  Recall:    {metrics['recall']:.4f}")
        print(f"  F1-Score:  {metrics['f1_score']:.4f}")
        print(f"  ROC-AUC:   {metrics['roc_auc']:.4f}")
        print(f"\n  Confusion Matrix:")
        print(f"    TN: {cm[0][0]}  FP: {cm[0][1]}")
        print(f"    FN: {cm[1][0]}  TP: {cm[1][1]}")
        
        return metrics
    
    def train_xgboost(self, X_train, y_train, X_test, y_test):
        """Train XGBoost model"""
        print("\n" + "=" * 60)
        print("Training XGBoost Model")
        print("=" * 60)
        
        model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric='logloss'
        )
        
        model.fit(X_train, y_train, verbose=False)
        
        # Evaluate
        metrics = self.evaluate_model(model, X_test, y_test, 'XGBoost')
        
        self.models['xgboost'] = model
        self.metrics['xgboost'] = metrics
        
        return model, metrics
    
    def train_lightgbm(self, X_train, y_train, X_test, y_test):
        """Train LightGBM model"""
        print("\n" + "=" * 60)
        print("Training LightGBM Model")
        print("=" * 60)
        
        model = lgb.LGBMClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            verbose=-1
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate
        metrics = self.evaluate_model(model, X_test, y_test, 'LightGBM')
        
        self.models['lightgbm'] = model
        self.metrics['lightgbm'] = metrics
        
        return model, metrics
    
    # def train_catboost(self, X_train, y_train, X_test, y_test):
    #     """Train CatBoost model"""
    #     print("\n" + "=" * 60)
    #     print("Training CatBoost Model")
    #     print("=" * 60)
        
    #     model = CatBoostClassifier(
    #         iterations=100,
    #         depth=6,
    #         learning_rate=0.1,
    #         random_state=42,
    #         verbose=False
    #     )
        
    #     model.fit(X_train, y_train)
        
    #     # Evaluate
    #     metrics = self.evaluate_model(model, X_test, y_test, 'CatBoost')
        
    #     self.models['catboost'] = model
    #     self.metrics['catboost'] = metrics
        
    #     return model, metrics
    
    def get_feature_importance(self, model, model_name):
        """Get feature importance"""
        if hasattr(model, 'feature_importances_'):
            importance = model.feature_importances_
            feature_importance = pd.DataFrame({
                'feature': self.feature_names,
                'importance': importance
            }).sort_values('importance', ascending=False)
            
            print(f"\nTop 10 Features for {model_name}:")
            print(feature_importance.head(10).to_string(index=False))
            
            return feature_importance
        return None
    
    def save_models(self):
        """Save trained models and metadata"""
        print("\n" + "=" * 60)
        print("Saving Models")
        print("=" * 60)
        
        # Create output directory
        os.makedirs(self.model_save_path, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save each model
        for model_name, model in self.models.items():
            model_path = os.path.join(self.model_save_path, f"{model_name}_{timestamp}.pkl")
            joblib.dump(model, model_path)
            print(f"Saved: {model_name} -> {model_path}")
        
        # Save scaler
        scaler_path = os.path.join(self.model_save_path, f"scaler_{timestamp}.pkl")
        joblib.dump(self.scalers['standard'], scaler_path)
        print(f"Saved: scaler -> {scaler_path}")
        
        # Save metrics
        metrics_path = os.path.join(self.model_save_path, f"metrics_{timestamp}.json")
        with open(metrics_path, 'w') as f:
            json.dump(self.metrics, f, indent=2)
        print(f"Saved: metrics -> {metrics_path}")
        
        # Save feature names
        features_path = os.path.join(self.model_save_path, f"features_{timestamp}.json")
        with open(features_path, 'w') as f:
            json.dump({'features': self.feature_names}, f, indent=2)
        print(f"Saved: features -> {features_path}")
        
        # Save model info
        model_info = {
            'timestamp': timestamp,
            'models': list(self.models.keys()),
            'num_features': len(self.feature_names),
            'feature_names': self.feature_names,
            'metrics': self.metrics,
            'best_model': max(self.metrics.items(), key=lambda x: x[1]['roc_auc'])[0]
        }
        
        info_path = os.path.join(self.model_save_path, f"model_info_{timestamp}.json")
        with open(info_path, 'w') as f:
            json.dump(model_info, f, indent=2)
        print(f"Saved: model_info -> {info_path}")
        
        return timestamp
    
    def run_pipeline(self):
        """Run complete training pipeline"""
        print("=" * 60)
        print("CREDIT SCORING MODEL TRAINING PIPELINE")
        print("=" * 60)
        
        # Load data
        df = self.load_data()
        
        # Prepare features
        X, y = self.prepare_features(df)
        
        # Split and scale
        X_train, X_test, y_train, y_test = self.split_and_scale(X, y)
        
        # Train models
        self.train_xgboost(X_train, y_train, X_test, y_test)
        self.get_feature_importance(self.models['xgboost'], 'XGBoost')
        
        self.train_lightgbm(X_train, y_train, X_test, y_test)
        self.get_feature_importance(self.models['lightgbm'], 'LightGBM')
        
        # self.train_catboost(X_train, y_train, X_test, y_test)
        # self.get_feature_importance(self.models['catboost'], 'CatBoost')
        
        # Save models
        timestamp = self.save_models()
        
        # Summary
        print("\n" + "=" * 60)
        print("TRAINING COMPLETE!")
        print("=" * 60)
        
        print("\nModel Performance Summary:")
        for model_name, metrics in self.metrics.items():
            print(f"\n{model_name.upper()}:")
            print(f"  Accuracy:  {metrics['accuracy']:.4f}")
            print(f"  ROC-AUC:   {metrics['roc_auc']:.4f}")
            print(f"  F1-Score:  {metrics['f1_score']:.4f}")
        
        # Best model
        best_model = max(self.metrics.items(), key=lambda x: x[1]['roc_auc'])[0]
        print(f"\nBest Model (by ROC-AUC): {best_model.upper()}")
        
        print(f"\nModels saved with timestamp: {timestamp}")
        print(f"Location: {self.model_save_path}")
        
        return self.models, self.metrics


if __name__ == "__main__":
    print("\nStarting ML Training Pipeline...\n")
    
    # Configuration
    DATA_PATH = "../../data/processed/credit_applications_clean_ml_ready.csv"
    MODEL_SAVE_PATH = "../../models/saved_models/"
    
    # Check if data exists
    if not os.path.exists(DATA_PATH):
        print(f"ERROR: Data file not found: {DATA_PATH}")
        print("\nPlease run data cleaning pipeline first:")
        print("  cd ml-pipeline")
        print("  python test_pipeline.py")
        sys.exit(1)
    
    # Run training
    trainer = CreditScoringTrainer(DATA_PATH, MODEL_SAVE_PATH)
    models, metrics = trainer.run_pipeline()
    
    print("\nTraining pipeline completed successfully!")
    print("\nNext steps:")
    print("  1. Review model metrics")
    print("  2. Integrate best model with backend API")
    print("  3. Test predictions on new data")
