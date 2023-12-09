//LOGIN

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *            type: string
 *         patientRef:
 *           type: string
 *         doctorRef:
 *           type: string
 *         appointmentType:
 *           type: string
 *         date:
 *           type: string
 *           format: DD-MM-YYYY
 *         time:
 *           type: string
 *         status:
 *           type: string
 *       required:
 *         - _id
 *         - patientRef
 *         - doctorRef
 *         - date
 *         - time
 *         - status
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           enum: [doctor, user]
 *           default: user
 *         resetPasswordToken:
 *           type: string
 *         resetPasswordExpires:
 *           type: string
 *     Doctor:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           required:
 *             - specialty
 *             - workHours
 *           properties:
 *             specialty:
 *               type: string
 *             workHours:
 *               type: array
 *               items:
 *                 type: string
 *     InputData:
 *       type: object
 *       required:
 *         - cholesterol
 *         - age
 *         - bloodPressure
 *       properties:
 *         cholesterol:
 *           type: string
 *         age:
 *           type: string
 *         bloodPressure:
 *           type: string
 *
 *     Result:
 *       type: object
 *       required:
 *         - negativeChance
 *         - positiveChance
 *       properties:
 *         negativeChance:
 *           type: string
 *         positiveChance:
 *           type: string
 *
 *     Prediction:
 *       type: object
 *       required:
 *         - userRef
 *         - date
 *         - time
 *         - inputData
 *         - result
 *       properties:
 *         userRef:
 *           type: string
 *           format: uuid
 *           description: Reference to the user
 *         date:
 *           type: string
 *         time:
 *           type: string
 *         inputData:
 *           $ref: '#/components/schemas/InputData'
 *         result:
 *           $ref: '#/components/schemas/Result'
 */


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a JWT token if successful.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *                 refreshToken:
 *                   type: string
 *                   description: JWT token for issuing new access token for user.
 *       400:
 *         description: User does not exist.
 *       401:
 *         description: Wrong password.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User Logout
 *     description: Unvalidate user's refresh token. Manage removing access token on client-side
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: refreshToken to unvalidate.
 *     responses:
 *       201:
 *         description: Logout successful.
 *       501:
 *         description: Internal server error.
 */

// REGISTER

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User Registration
 *     description: Registers a new user with their details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *               firstName:
 *                 type: string
 *                 description: User's first name.
 *               lastName:
 *                 type: string
 *                 description: User's last name.
 *               phone:
 *                 type: string
 *                 description: User's phone number.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: User already exists.
 *       500:
 *         description: Error registering new user.
 */


/**
 * @swagger
 * /refresh_token:
 *   post:
 *     summary: Refresh Access Token
 *     description: Allows a user to obtain a new access token by providing a valid refresh token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token received during login or previous token refresh.
 *     responses:
 *       200:
 *         description: Successfully generated a new access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT access token.
 *       400:
 *         description: Invalid refresh token.
 *       401:
 *         description: No refresh token provided.
 *
 * @swagger
 * /requestPasswordReset:
 *   post:
 *     summary: Request Password Reset
 *     description: Sends a password reset link to the user's email if the account exists.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset link sent to your email
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 * @swagger
 * /resetPassword:
 *   post:
 *     summary: Reset Password
 *     description: Allows a user to reset their password using a valid reset token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password
 *     responses:
 *       200:
 *         description: Your password has been updated
 *       400:
 *         description: Password reset token is invalid or has expired
 *       500:
 *         description: Internal server error
 */

//GET USER DATA

/**
 * @swagger
 * /getUserData:
 *   get:
 *     summary: Retrieve User Data
 *     description: Fetches data for the logged-in user. Requires a valid JWT token.
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User' # Ensure this schema is defined in components/schemas
 *       401:
 *         description: Access denied. No token provided or invalid token.
 *       400:
 *         description: No user found
 * /savePredictionResult:
 *   post:
 *     tags:
 *       - User Data
 *     summary: Save Prediction Result
 *     description: Saves the result of a prediction for a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - negativeChance
 *               - positiveChance
 *               - age
 *               - cholesterol
 *               - bloodPressure
 *             properties:
 *               negativeChance:
 *                 type: number
 *               positiveChance:
 *                 type: number
 *               age:
 *                 type: number
 *               cholesterol:
 *                 type: number
 *               bloodPressure:
 *                 type: number
 *     responses:
 *       200:
 *         description: Data recorded successfully
 *       400:
 *         description: Not enough arguments
 *       500:
 *         description: Internal server error
 *
 * /getPatientPredictionHistory:
 *   get:
 *     tags:
 *       - User Data
 *     summary: Get Patient Prediction History
 *     description: Retrieves the prediction history for a user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prediction history of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prediction' # Define Prediction schema in components/schemas
 *       204:
 *         description: No records of the user
 *       500:
 *         description: Internal server error
 * /upcomingAppointment:
 *   get:
 *     tags:
 *       - User Data
 *     summary: Get Upcoming Appointment
 *     description: Retrieves upcoming appointments for the logged-in user, based on their role (doctor or patient).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of upcoming appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment' # Ensure this schema is defined in components/schemas
 *       401:
 *         description: User can't be found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /medicalData:
 *   get:
 *     summary: Retrieve Medical Data
 *     description: Fetches mock medical data for a patient.
 *     tags: [Medical]
 *     responses:
 *       200:
 *         description: Medical data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 patientId:
 *                   type: string
 *                   description: Unique identifier for the patient.
 *                 diagnosis:
 *                   type: string
 *                   description: Patient's diagnosis.
 *                 treatmentPlan:
 *                   type: object
 *                   description: Proposed plan for patient's treatment.
 *                   properties:
 *                     medication:
 *                       type: string
 *                       description: Prescribed medication.
 *                     dosage:
 *                       type: string
 *                       description: Dosage of the medication.
 *                     frequency:
 *                       type: string
 *                       description: Frequency of medication intake.
 *                 nextAppointment:
 *                   type: string
 *                   format: date
 *                   description: Date of the next scheduled appointment.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /checkAppointmentSlots:
 *   get:
 *     tags:
 *       - Medical
 *     summary: Check Appointment Slots
 *     description: Checks available appointment slots for a given date, field, and type.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: The date to check for availability.
 *       - in: query
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *         description: The medical field of the appointment.
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of the appointment.
 *     responses:
 *       200:
 *         description: List of available slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Not enough arguments
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /createAppointment:
 *   post:
 *     tags:
 *       - Medical
 *     summary: Create Appointment
 *     description: Creates a new appointment.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - time
 *               - field
 *               - type
 *               - isVirtual
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the appointment.
 *               time:
 *                 type: string
 *                 description: Time of the appointment.
 *               field:
 *                 type: string
 *                 description: Medical field of the appointment.
 *               type:
 *                 type: string
 *                 description: Type of the appointment (e.g., consultation, check-up).
 *               isVirtual:
 *                 type: boolean
 *                 description: Whether the appointment is virtual.
 *     responses:
 *       200:
 *         description: Appointment scheduled successfully.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /rescheduleAppointment/{appointmentId}:
 *   put:
 *     tags:
 *       - Medical
 *     summary: Reschedule an Appointment
 *     description: Reschedules an appointment to a new date and time.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the appointment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newDate
 *               - newTime
 *             properties:
 *               newDate:
 *                 type: string
 *                 format: DD-MM-YYYY
 *               newTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment successfully rescheduled
 *       500:
 *         description: Internal server error
 *
 * /changeStatus/{appointmentId}:
 *   put:
 *     tags:
 *       - Medical
 *     summary: Change Appointment Status
 *     description: Changes the status of an appointment.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the appointment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newStatus
 *             properties:
 *               newStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment status successfully updated
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /getAllAppointments:
 *   get:
 *     tags:
 *       - User Data
 *     summary: Get All Appointments
 *     description: Retrieves all appointments (for testing purposes).
 *     responses:
 *       200:
 *         description: A list of all appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Internal server error
 *
 * /getAppointments:
 *   get:
 *     tags:
 *       - User Data
 *     summary: Get User Appointments
 *     description: Retrieves appointments for the logged-in user, based on their role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user-specific appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Error retrieving user's data
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /patientDiagnosis:
 *   post:
 *     summary: Receive Patient Answers and Return Mock Diagnosis
 *     description: Accepts answers to medical questions from a patient and returns a mock diagnosis.
 *     tags: [Medical]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - age
 *               - symptoms
 *             properties:
 *               age:
 *                 type: integer
 *                 description: Age of the patient.
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of symptoms described by the patient.
 *     responses:
 *       200:
 *         description: Diagnosis based on patient's input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 diagnosis:
 *                   type: string
 *                   description: Mock diagnosis based on the provided information.
 *       400:
 *         description: Bad request if input data is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /predictHeartDisease:
 *   post:
 *     summary: Predict Heart Disease
 *     description: Returns the probability of having or not having a heart disease based on the provided data.
 *     tags: [Medical]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: string
 *                 description: Age of the individual
 *               cholesterol:
 *                 type: string
 *                 description: Cholesterol level
 *               pressure:
 *                 type: string
 *                 description: Blood pressure level
 *             example:
 *               age: "55"
 *               cholesterol: "240"
 *               pressure: "120"
 *     responses:
 *       200:
 *         description: Chances provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 negativeChance:
 *                   type: number
 *                   description: Probability of not having a heart disease
 *                 positiveChance:
 *                   type: number
 *                   description: Probability of having a heart disease
 *       400:
 *         description: Incorrect data provided
 *       500:
 *         description: Internal server error
 *
 */

/**
 * @swagger
 * /getPracticeFields:
 *   get:
 *     tags:
 *       - utils
 *     summary: Get Practice Fields
 *     description: Retrieves a list of medical practice fields.
 *     responses:
 *       200:
 *         description: A list of practice fields
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - General Practice
 *                 - Infectious Diseases
 *                 - Gastroenterology
 *                 # ... other fields
 *       500:
 *         description: Internal server error
 *
 * /getAppointmentTypes:
 *   get:
 *     tags:
 *       - utils
 *     summary: Get Appointment Types
 *     description: Retrieves a list of appointment types.
 *     responses:
 *       200:
 *         description: A list of appointment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - Consultation
 *                 - Follow-Up
 *                 - Examination
 *                 - Lab Tests
 *                 - Surgery
 *       500:
 *         description: Internal server error
 * /getAppointmentStatuses:
 *   get:
 *     tags:
 *       - utils
 *     summary: Get Appointment Statuses
 *     description: Retrieves a list of possible appointment statuses.
 *     responses:
 *       200:
 *         description: A list of appointment types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - Scheduled
 *                 - Completed
 *                 - Canceled
 *       500:
 *         description: Internal server error
 * /getSymptoms:
 *   get:
 *     tags:
 *       - utils
 *     summary: Get List of Symptoms
 *     description: Retrieves a list of possible symptoms
 *     responses:
 *       200:
 *         description: A list of symptoms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Internal server error
 * /getSymptomsToDisease:
 *   get:
 *     tags:
 *       - utils
 *     summary: Get Symptoms to Disease Mapping
 *     description: Retrieves a mapping of diseases to their associated symptoms.
 *     responses:
 *       200:
 *         description: A mapping of diseases to symptoms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nameOfDisease:
 *                     type: string
 *                     description: The name of the disease
 *                   symptoms:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of symptoms associated with the disease
 *       500:
 *         description: Internal server error
 * /getDiseaseToSpecialty:
 *   get:
 *     tags:
 *       - utils
 *     summary: Get Disease to Specialty Mapping
 *     description: Retrieves a mapping of medical specialties to their associated diseases.
 *     responses:
 *       200:
 *         description: A mapping of specialties to diseases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   specialty:
 *                     type: string
 *                     description: The medical specialty
 *                   diseases:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of diseases associated with the specialty
 *       500:
 *         description: Internal server error
 * /getDoctors:
 *   get:
 *     tags:
 *       - utils
 *     summary: Get List of Doctors
 *     description: Retrieves a list of all doctors.
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Internal server error
 * /getDoctor/{doctorId}:
 *     get:
 *       tags:
 *         - utils
 *       summary: Get Doctor by ID
 *       description: Retrieves details of a specific doctor by their ID.
 *       parameters:
 *         - name: doctorId
 *           in: path
 *           required: true
 *           description: Unique identifier of the doctor
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Doctor details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Doctor'
 *         400:
 *           description: Doctor not found
 *         500:
 *           description: Internal server error
 */
