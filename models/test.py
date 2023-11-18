import joblib

# Load the joblib model
model = joblib.load('/Users/monkey/Public/Python/Jop_prepar/TeamProj1/Model/HeartDiseaseModel.joblib')

# Test data (adjust these values accordingly)
test_data = [62,267, 130]

# Make predictions using the loaded model
prediction = model.predict_proba([test_data])[0][1]
print(prediction)
y_prob = model.predict_proba([test_data])

# Output the result
print(f"Input data: {test_data}")
print(f"Predicted Probability: {y_prob}")
