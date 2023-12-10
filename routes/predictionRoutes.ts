import {BrainStrokeInput, HeartDiseaseInput, HeartDiseaseResult, Prediction} from "../db/models/predictionModel";
import { Router } from 'express';
import {authMiddleware, formatDate} from "../utils/authUtils";
import {getObjectFromJSON} from "../utils/JSONutils";
import {UserType} from "../types";
import {User} from "../db/models/userModel";
import {PythonShell} from "python-shell";
const router = Router();

const properties = [
    'gender',
    'age',
    'hypertension',
    'heart_disease',
    'ever_married',
    'work_type',
    'Residence_type',
    'avg_glucose_level',
    'bmi',
    'smoking_status'
];

const models = [ 'HeartDisease', 'BrainStroke' ]

router.post("/saveHeartDiseasePrediction", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId).lean();
    if (!user) {
        return res.status(401).send("User not found");
    }

    const { negativeChance, positiveChance, age, cholesterol, bloodPressure } = req.body;
    if (!negativeChance || !positiveChance || !age || !cholesterol || !bloodPressure) {
        return res.status(400).send("Not enough arguments");
    }

    const now = Date.now();
    const date = formatDate(now);
    const time = new Date(now).getHours() + ':' + new Date(now).getMinutes();

    try {
        const prediction = new Prediction({
            userRef: user._id,
            date: date,
            model: 'HeartDisease',
            time: time,
            inputData: new HeartDiseaseInput({ age: age, cholesterol: cholesterol, bloodPressure: bloodPressure }),
            result: new HeartDiseaseResult({ negativeChance: negativeChance, positiveChance: positiveChance }),
        });
        await prediction.save();
        res.status(200).send("Heart disease prediction data recorded");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});

router.post("/saveBrainStrokePrediction", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        return res.status(401).send("User not found");
    }

    const {
        positiveChance,
        gender,
        age,
        hypertension,
        heart_disease,
        ever_married,
        work_type,
        Residence_type,
        avg_glucose_level,
        bmi,
        smoking_status
    } = req.body;
    if (!positiveChance || !gender || !age || !hypertension || !heart_disease || !ever_married || !work_type || !Residence_type || !avg_glucose_level || !bmi || !smoking_status) {
        return res.status(400).send("Not enough arguments");
    }

    const now = Date.now();
    const date = formatDate(now);
    const time = new Date(now).getHours() + ':' + new Date(now).getMinutes();

    try {
        const prediction = new Prediction({
            userRef: user._id,
            date: date,
            model: 'BrainStroke',
            time: time,
            inputData: new BrainStrokeInput({ gender, age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status }),
            result: positiveChance ,
        });
        await prediction.save();
        res.status(200).send("Brain stroke prediction data recorded");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
    }
});



router.get("/getPatientPredictionHistory", authMiddleware, async (req, res) => {
    const user : UserType | null = await User.findById(req.user.userId);

    try {
        const data = await Prediction.find({'userRef': req.user.userId}).lean()

        if (!data){
            return res.status(204).send("No records of the user")
        }

        return res.status(200).json(data);

    } catch (err){
        console.error(err)
        return res.status(500).send("Internal server error")
    }

})


router.post('/predictHeartDisease', (req,res) => {
    let {age, cholesterol, pressure} = req.body;

    if (!age || !cholesterol || !pressure){
        return res.status(400).send('Incorrect data');
    }
    if (typeof age !== 'string' || typeof cholesterol !== 'string' || typeof pressure !== 'string'){
        age = age.toString()
        cholesterol = cholesterol.toString()
        pressure = pressure.toString()
    }

    let negativeChance = 0;
    let positiveChance  = 0;

    let options = {
        scriptPath: './models/HeartDiseaseModel',
        args: [age, cholesterol, pressure]
    }

    try {
        PythonShell.run('PredictHeartDisease.py', options).then(messages=>{
            negativeChance = parseFloat(messages[0].slice(2, -2).split(' ')[0])
            positiveChance = parseFloat(messages[0].slice(2, -2).split(' ')[1])
            return res.status(201).json({negativeChance, positiveChance});
        }).catch(err => {return res.status(500).send(err)});
    } catch (err) {
        return res.status(500).send('Internal server error')
    }

})

router.post('/predictBrainStroke', async (req,res) => {
    const {
        gender,
        age,
        hypertension,
        heart_disease,
        ever_married,
        work_type,
        Residence_type,
        avg_glucose_level,
        bmi,
        smoking_status
    } = req.body

    let missingProperties = [];

    for (const prop of properties) {
        if (req.body[prop] === undefined || req.body[prop] === null) {
            missingProperties.push(prop);
        }
    }

    if (missingProperties.length > 0) {
        return res.status(400).send("Not enough arguments")
    }

    let chance = 0;

    let options = {
        scriptPath: './models/BrainStrokeModel',
        args: [
            gender.toString(),
            age.toString(),
            hypertension.toString(),
            heart_disease.toString(),
            ever_married.toString(),
            work_type.toString(),
            Residence_type.toString(),
            avg_glucose_level.toString(),
            bmi.toString(),
            smoking_status.toString()
        ]
    }

    try {
        PythonShell.run('PredictBrainStroke.py', options).then(messages=>{
            chance = parseFloat(messages[0])
            return res.status(201).json(chance);
        }).catch(err => {return res.status(500).send(err)});
    } catch (err) {
        return res.status(500).send('Internal server error')
    }

})


export default router;