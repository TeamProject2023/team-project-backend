import pandas as pd
import joblib
import sys
import os

def convert_input_data(input_list):
    keys = ['gender', 'age', 'hypertension', 'heart_disease', 'ever_married', 
            'work_type', 'Residence_type', 'avg_glucose_level', 'bmi', 'smoking_status']
    input_data = dict(zip(keys, input_list))
    
    types = {
        'gender': str,
        'age': int,
        'hypertension': int,
        'heart_disease': int,
        'ever_married': int,
        'work_type': str,
        'Residence_type': str,
        'avg_glucose_level': float,
        'bmi': float,
        'smoking_status': str
    }

    # Convert each field to its expected type
    for key, expected_type in types.items():
        if key in input_data:
            try:
                if expected_type is int:
                    input_data[key] = int(input_data[key])
                elif expected_type is float:
                    input_data[key] = float(input_data[key])
            except ValueError:
                raise ValueError(f"Invalid format for {key}")

    return input_data


# Load the trained model
dir_path = os.path.dirname(os.path.realpath(__file__))
model_filename = os.path.join(dir_path, 'Brain_Stroke.joblib')
loaded_model = joblib.load(model_filename)

# Load the encoders
try:
    columns_to_encode = ['gender', 'work_type', 'Residence_type', 'smoking_status']
    encoders = {}
    
    for col in columns_to_encode:
        encoder_filename = os.path.join(dir_path, f'{col}_encoder.pkl')
        encoders[col] = joblib.load(encoder_filename)
        
    input_list = [arg for arg in sys.argv[1:]]
    input_data = convert_input_data(input_list)

    # Create a DataFrame from input_data
    test_df = pd.DataFrame([input_data])

    # Encode categorical columns in test_df using loaded encoders
    for col, encoder in encoders.items():
        test_df[col] = encoder.transform(test_df[col])

    # Make predictions
    predicted_probabilities = loaded_model.predict_proba(test_df)
    print(predicted_probabilities[0][1])
    
except Exception as e:
    print(f"Error: {e}")
    # Optionally, raise the exception again to halt the script
    raise



# input_data = {
#     'gender': 'Male',
#     'age': 50,
#     'hypertension': 0,
#     'heart_disease': 1,
#     'ever_married': 1,
#     'work_type': 'Private',
#     'Residence_type': 'Urban',
#     'avg_glucose_level': 80.6,
#     'bmi': 30.7,
#     'smoking_status': 'never smoked'
# }





