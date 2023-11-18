from flask import Flask, jsonify, request
import joblib

app = Flask(__name__)

model = joblib.load('/Users/monkey/Public/Python/Jop_prepar/TeamProj1/Model/HeartDiseaseModel.joblib')

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        response = jsonify(success=True)
    else:
        data = request.json 
        prediction = model.predict_proba([data])[0][1] * 100
        prediction = round(prediction,3)
        response = jsonify(probability=float(prediction))

    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response

if __name__ == '__main__':
    app.run(debug=True, port=5009)
