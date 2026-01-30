# 🤖 ML Pipeline - Credit Scoring

Complete machine learning pipeline for credit scoring model development and deployment.

## 📁 Directory Structure

```
ml-pipeline/
├── data/
│   ├── raw/                     # Raw CSV data
│   │   └── credit_applications_raw.csv (50 sample records)
│   ├── processed/               # Cleaned data (auto-generated)
│   ├── features/                # Feature store
│   ├── external/                # External datasets
│   └── synthetic/               # Synthetic data
├── models/
│   ├── saved_models/            # Trained models (.pkl files)
│   ├── model_registry/          # Model versions
│   └── configs/                 # Model configurations
├── pipelines/
│   ├── training/
│   │   └── train_model.py       # Training pipeline (XGBoost, LightGBM, CatBoost)
│   ├── inference/               # Inference scripts
│   ├── feature_engineering/
│   │   └── data_cleaner.py      # Data cleaning pipeline
│   └── evaluation/              # Model evaluation
├── monitoring/
│   ├── drift_detection/         # Data drift monitoring
│   ├── performance/             # Performance tracking
│   └── alerts/                  # Alert configurations
└── notebooks/                   # Jupyter notebooks
```

## 🚀 Quick Start

### 1. Clean Raw Data

```bash
cd ml-pipeline/pipelines/feature_engineering
python data_cleaner.py
```

**Output:**

- `data/processed/credit_applications_clean.csv` - Full cleaned dataset
- `data/processed/credit_applications_clean_ml_ready.csv` - ML-ready features
- `data/processed/credit_applications_clean_summary.txt` - Data summary

### 2. Train Models

```bash
cd ml-pipeline/pipelines/training
python train_model.py
```

**Output:**

- `models/saved_models/xgboost_YYYYMMDD_HHMMSS.pkl`
- `models/saved_models/lightgbm_YYYYMMDD_HHMMSS.pkl`
- `models/saved_models/catboost_YYYYMMDD_HHMMSS.pkl`
- `models/saved_models/metrics_YYYYMMDD_HHMMSS.json`

## 📊 Data Pipeline

### Raw Data (50 records)

**Features:**

- `applicant_id` - Unique identifier
- `full_name` - Applicant name
- `age` - Age (18-100)
- `gender` - M/F
- `annual_income` - Annual income ($)
- `employment_status` - Employed/Self-Employed/Unemployed
- `years_employed` - Years in current employment
- `monthly_debt` - Monthly debt payments ($)
- `loan_amount` - Requested loan amount ($)
- `loan_purpose` - Home/Car/Business/Education/Personal
- `existing_credits` - Number of existing credits
- `credit_history_length` - Years of credit history
- `payment_history` - Excellent/Good/Fair/Poor
- `marital_status` - Married/Single/Divorced
- `dependents` - Number of dependents
- `education` - PhD/Master/Bachelor/High School
- `home_ownership` - Own/Rent/Mortgage
- `default` - Target variable (0: No default, 1: Default)

### Data Cleaning Steps

1. **Load Raw Data** - Read CSV file
2. **Quality Check** - Check for missing values, duplicates
3. **Data Cleaning**
   - Remove duplicates
   - Handle missing values (median for numeric, mode for categorical)
   - Validate age (18-100)
   - Validate income (> 0)
   - Validate loan amount (> 0)
4. **Feature Engineering**
   - `debt_to_income_ratio` = (monthly_debt \* 12) / annual_income
   - `credit_to_income_ratio` = loan_amount / annual_income
   - `monthly_income` = annual_income / 12
   - `debt_burden` = (monthly_debt / monthly_income) \* 100
   - `age_group` = Categorical age groups
   - `income_group` = Categorical income groups
   - `employment_stability` = Stable/Moderate/New
   - `credit_quality_score` = credit_history_length \* 10
5. **Categorical Encoding**
   - Gender → Binary (M=1, F=0)
   - Employment status → Ordinal
   - Payment history → Ordinal (Excellent=3, Good=2, Fair=1, Poor=0)
   - Education → Ordinal (PhD=4, Master=3, Bachelor=2, HS=1)
   - Loan purpose → One-hot encoding
6. **Risk Labeling**
   - Calculate risk score based on multiple factors
   - Categorize into Low/Medium/High risk
7. **Save Processed Data**
   - Full dataset with all features
   - ML-ready dataset with selected features
   - Data summary report

### Engineered Features

**Ratio Features:**

- `debt_to_income_ratio` - Debt burden indicator
- `credit_to_income_ratio` - Loan size relative to income
- `debt_burden` - Monthly debt as % of income

**Categorical Features:**

- `age_group` - 18-25, 26-35, 36-45, 46-55, 56+
- `income_group` - Low, Medium, High, Very High, Ultra High
- `employment_stability` - Stable, Moderate, New

**Encoded Features:**

- `gender_encoded` - Binary
- `employment_status_encoded` - Ordinal
- `payment_history_encoded` - Ordinal
- `marital_status_encoded` - Binary
- `education_encoded` - Ordinal
- `home_ownership_encoded` - Ordinal
- `loan_purpose_*` - One-hot encoded

**Derived Features:**

- `monthly_income` - Annual income / 12
- `credit_quality_score` - Credit history length \* 10
- `risk_score` - Calculated risk score
- `risk_level` - Low/Medium/High

## 🧠 ML Models

### XGBoost

- **Algorithm:** Gradient Boosting
- **Parameters:** 100 estimators, max_depth=6, learning_rate=0.1
- **Use Case:** High accuracy, feature importance

### LightGBM

- **Algorithm:** Gradient Boosting (leaf-wise)
- **Parameters:** 100 estimators, max_depth=6, learning_rate=0.1
- **Use Case:** Fast training, large datasets

### CatBoost

- **Algorithm:** Gradient Boosting (categorical features)
- **Parameters:** 100 iterations, depth=6, learning_rate=0.1
- **Use Case:** Handles categorical features well

## 📈 Model Evaluation

**Metrics:**

- Accuracy
- ROC-AUC Score
- Precision, Recall, F1-Score
- Confusion Matrix

## 🔄 Complete Workflow

```bash
# 1. Clean data
cd ml-pipeline/pipelines/feature_engineering
python data_cleaner.py

# 2. Train models
cd ../training
python train_model.py

# 3. Models are saved in ml-pipeline/models/saved_models/
```

## 📝 Dependencies

```bash
pip install pandas numpy scikit-learn xgboost lightgbm catboost joblib
```

## 🎯 Next Steps

1. ✅ Data cleaning - DONE
2. ✅ Feature engineering - DONE
3. ✅ Model training - DONE
4. ⏳ Model evaluation - TODO
5. ⏳ Hyperparameter tuning - TODO
6. ⏳ Model deployment - TODO
7. ⏳ Drift detection - TODO
8. ⏳ Performance monitoring - TODO

## 📊 Sample Data Statistics

- **Total Records:** 50
- **Features:** 18 original + 15 engineered = 33 total
- **Target Distribution:**
  - No Default (0): ~80%
  - Default (1): ~20%
- **Age Range:** 25-46 years
- **Income Range:** $35,000 - $110,000
- **Loan Range:** $8,000 - $60,000

## 🔍 Data Quality

- ✅ No missing values
- ✅ No duplicates
- ✅ All values validated
- ✅ Proper data types
- ✅ Encoded categorical variables
- ✅ Normalized features ready

---

**Ready for ML training!** 🚀
