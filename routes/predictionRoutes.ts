import { Prediction } from "../db/models/predictionModel";
import { Router } from 'express';
import {authMiddleware, formatDate} from "../utils/authUtils";
import {getObjectFromJSON} from "../utils/JSONutils";
import {UserType} from "../types";
import {User} from "../db/models/userModel";
import {PythonShell} from "python-shell";
const router = Router();

router.post("/savePredictionResult", authMiddleware, async (req, res)=>{
    const user : UserType | null = await User.findById(req.user.userId);

    const { negativeChance, positiveChance, age, cholesterol, bloodPressure } = req.body

    if ( !negativeChance || !positiveChance || !age || !cholesterol || !bloodPressure ){
        return res.status(400).send("Not enough arguments");
    }

    const now = Date.now();
    const date = formatDate(now);
    const time = new Date(now).getHours() + ':' + new Date(now).getMinutes();
    try{
        const prediction = new Prediction({
            userRef: req.user.userId,
            date: date,
            time: time,
            inputData: { age: age, cholesterol: cholesterol, bloodPressure: bloodPressure },
            result: { negativeChance: negativeChance, positiveChance: positiveChance },
        })
        await prediction.save()
        res.status(200).send("Data recorded");
    } catch (err) {
        console.error(err)
        return res.status(500).send("Internal server error");
    }

})

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
        scriptPath: './models',
        args: [age, cholesterol, pressure]
    }

    try {
        PythonShell.run('test.py', options).then(messages=>{
            negativeChance = parseFloat(messages[0].slice(2, -2).split(' ')[0])
            positiveChance = parseFloat(messages[0].slice(2, -2).split(' ')[1])
            return res.status(201).json({negativeChance, positiveChance});
        }).catch(err => {return res.status(500).send('Internal server error')});
    } catch (err) {
        return res.status(500).send('Internal server error')
    }

} )

export default router;