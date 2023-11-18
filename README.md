# BACKEND CLINIC WEBSITE
[API LINK](https://med-api-zap1.onrender.com/)

## Authentication Routes

- ### `POST /login`
    - **Returns:** JWT access token and refresh token upon successful authentication.
    - **Status Codes:** 200 (Success), 400 (User does not exist), 401 (Wrong password), 500 (Internal server error).

    - ### **Request body**
  ```
  { 
   "email": "user@example.com",
   "password": "string" 
  }
  ```
    - ### **Example value**
  ```
  {
   "token": "string",
   "refreshToken": "string"
  }
  ```

- ### `POST /logout`
    - **Returns:** Confirmation message upon successful logout.
    - **Status Codes:** 201 (Logout successful), 500 (Internal server error).
    - ### **Request body**
  ```
  {
   "refreshToken": "string"
  }
  ```

- ### `POST /register`
    - **Returns:** Confirmation message upon successful registration.
    - **Status Codes:** 201 (User registered successfully), 500 (Error registering user), 501 (User already exists).
    - ### **Request body**
  ```
  { 
   "email": "user@example.com",
   "password": "string" 
  }
  ```

- ### `POST /refresh_token`
    - **Returns:** A new JWT access token.
    - **Status Codes:** 200 (New token generated), 400 (Invalid token), 401 (No token provided).
    - ### **Request body**
  ```
  {
   "refreshToken": "string"
  }
  ```
    - ### **Example value**
  ```
  {
   "token": "string",
  }
  ```

## User Data Route

- ### `GET /getUserData`
    - **Returns:** User-specific data including username, randomInfo1, arrayOfInfo, and infoObject.
    - **Status Codes:** 200 (Data retrieved), 401 (Access denied), 500 (Internal server error).
    - ### **Example value**
  ```
  {
  "username": "string",
  "randomInfo1": "string",
  "arrayOfInfo": [
    "string"
  ],
  "infoObject": {
    "infoId": 0,
    "infoText": "string"
  }
  }
  ```
  
## Medical Routes

- ### `GET /medicalData`
  - **Returns:** Mock medical data including patientId, diagnosis, treatmentPlan, and nextAppointment.
  - **Status Codes:** 200 (Data retrieved), 500 (Internal server error).
  - ### **Example value**
  ```
  {
   "patientId": "string",
   "diagnosis": "string",
   "treatmentPlan": {
   "medication": "string",
   "dosage": "string",
   "frequency": "string"
  },
   "nextAppointment": "2023-11-18"
  }
  ```

- ### `POST /patientDiagnosis`
  - **Returns:** Mock diagnosis based on the provided patient information.
  - **Status Codes:** 200 (Diagnosis provided), 400 (Bad request), 500 (Internal server error).
  - ### **Request body**
  ```
  {
  "age": 0,
  "symptoms": [
  "string"
  ]
  }
  ```
  - ### **Example value**
  ```
  {
  "diagnosis": "string"
  }
  ```


