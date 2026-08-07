# # AI-Based Emergency Triage Severity Prediction (Triagegeist)

## 🏥 Overview
Triagegeist is an intelligent clinical decision-support system that leverages machine learning to predict patient severity levels in emergency departments. By analyzing vital signs and demographic data, the system classifies patients into Low, Medium, or High severity categories, enabling faster and more objective triage decisions.

## 🎯 Problem Statement
Emergency departments face critical challenges in patient triage—manual assessment is time-consuming, subjective, and prone to human error. Triagegeist addresses this by providing automated, data-driven severity predictions to assist clinical staff in prioritizing care efficiently.

## 📊 Key Features
- **6-Algorithm Comparison**: Evaluated Logistic Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost, and LightGBM
- **High Performance**: LightGBM and XGBoost achieve ~97% accuracy and F1 Macro score
- **Advanced Feature Engineering**: 4 composite clinical features (shock index, pulse pressure, fever flag, hypoxia flag) significantly improve predictions
- **Interactive Web Demo**: React-based UI for real-time severity predictions
- **Clinical Interpretability**: Feature importance analysis reveals top predictive signals

## 🧠 Technical Architecture

### Data Preprocessing
- Median imputation for ~8% missing values
- StandardScaler normalization for continuous features
- LabelEncoder for categorical variables
- Realistic class distribution: ~55% Low, ~30% Medium, ~15% High

### Feature Engineering
| Feature | Formula/Definition | Clinical Relevance |
|---------|-------------------|-------------------|
| **Shock Index** | Heart Rate / Systolic BP | Circulatory stability indicator |
| **Pulse Pressure** | Systolic BP - Diastolic BP | Arterial stiffness marker |
| **Fever Flag** | Temperature > 38°C | Infection indicator |
| **Hypoxia Flag** | SpO₂ < 95% | Respiratory distress indicator |

### Model Performance
| Algorithm | Accuracy | F1 Macro | Status |
|-----------|----------|----------|--------|
| LightGBM | **97%** | **0.97** | ✅ Best |
| XGBoost | **97%** | **0.97** | ✅ Best |
| Gradient Boosting | 95% | 0.95 | Good |
| Random Forest | 93% | 0.92 | Good |
| Decision Tree | 88% | 0.86 | Baseline |
| Logistic Regression | 84% | 0.81 | Baseline |

### Top Predictive Features (by importance)
1. SpO₂ (Oxygen Saturation)
2. Heart Rate
3. Shock Index
4. Systolic Blood Pressure
5. Chief Complaint

## 📁 Project Structure
```
Triagegeist/
├── Project_Code.ipynb          # Full ML pipeline (EDA, preprocessing, training)
├── Triagegeist_Report.pdf       # Comprehensive technical documentation
├── triagegeist_app.html         # Interactive web demo (React)
└── README.md                    # This file
```

## 🚀 Usage

### Running the Web Demo
Open `triagegeist_app.html` in any web browser. Enter patient vitals and demographics to receive instant severity predictions.

### Training Models
Execute `Project_Code.ipynb` in Jupyter:
- Generates synthetic patient data (realistic ED distributions)
- Performs exploratory data analysis
- Trains and evaluates all 6 algorithms
- Conducts hyperparameter tuning via GridSearchCV
- Computes SHAP values for model interpretability

## 👥 Team
- **Abdullah Sheikh** (23L-6129)
- **Shabeeb Haider** (23P-0649)
- **Haseeb Nadeem** (23L-2646)

## ⚠️ Limitations & Future Work
- **Current scope**: Vitals and demographics only (no lab results, imaging, prior history)
- **Data**: Synthetic dataset (real clinical validation needed)
- **Web app**: Deterministic rule-based scoring (mirrors training logic)
- **Future improvements**: Integration with EHR systems, real patient data validation, fairness auditing across demographics

## 📖 References
- Report includes comprehensive methodology and clinical considerations
- Feature engineering justified by medical literature
- Ethical implications and fairness analysis included

## 📝 License
Academic project for educational purposes.
