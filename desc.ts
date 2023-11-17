//LOGIN

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
 *       400:
 *         description: User does not exist.
 *       401:
 *         description: Wrong password.
 *       500:
 *         description: Internal server error.
 */

// REGISTER

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User Registration
 *     description: Registers a new user with their email and password.
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
 *       201:
 *         description: User registered successfully.
 *       501:
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
 *         description: User data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 randomInfo1:
 *                   type: string
 *                 arrayOfInfo:
 *                   type: array
 *                   items:
 *                     type: string
 *                 infoObject:
 *                   type: object
 *                   properties:
 *                     infoId:
 *                       type: integer
 *                     infoText:
 *                       type: string
 *       401:
 *         description: Access denied. No token provided or invalid token.
 *       500:
 *         description: Internal server error.
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
