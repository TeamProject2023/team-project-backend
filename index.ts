import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';

import dbConnect from './db/connection';
import userRoutes from './routes/userRoutes';
import medicalRoutes from './routes/medicalRoutes';
import predictionRoutes from "./routes/predictionRoutes";

import {getObjectFromJSON, inputDoctors} from './utils/JSONutils'
import appointmentRoutes from "./routes/appointmentRoutes";

dotenv.config();

const app = express();
dbConnect();

const IP_ADDRESS = process.env.APP_IP || '0.0.0.0';
const PORT = Number(process.env.APP_PORT) || 4500;

app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
})); // TODO: SPECIFY ORIGINS
app.use(express.json());

//routes
app.use(userRoutes);
app.use(medicalRoutes);
app.use(appointmentRoutes);
app.use(predictionRoutes);

//swagger initialization
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('MedApp backend Running');
});

app.listen(PORT, IP_ADDRESS, function () {
    return console.log('\x1b[32m%s\x1b[0m',"MedApp backend running " + IP_ADDRESS + ":" + PORT);
});

getObjectFromJSON('diseases_symptoms.json');
getObjectFromJSON('sorted_symptoms.json');
getObjectFromJSON('disease_specialty.json');
//inputDoctors('doctors_list.json');
