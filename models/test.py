from joblib import load
import os
import sys
#print("Current Directory:", os.getcwd())

# Load the joblib model
model = load('./models/HeartDiseaseModel.joblib')

# Test data
input_data = sys.argv[1:] # [num, num, num]
input_data_converted =  [int(item) for item in input_data]
#print(input_data)

# Make predictions using the loaded model
prediction = model.predict_proba([input_data_converted])[0][1]
y_prob = model.predict_proba([input_data_converted])

# Output the result
#print(f"Input data: {test_data}")
print(y_prob)
