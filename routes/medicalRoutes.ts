import express, { Request, Response } from 'express';
import { PythonShell } from 'python-shell'
const router = express.Router();

// Mock medical data route
router.get('/medicalData', (req, res) => {
    const medicalData = {
        patientId: '123456',
        diagnosis: 'Hypertension',
        treatmentPlan: {
            medication: 'Amlodipine',
            dosage: '10mg',
            frequency: 'Once daily'
        },
        nextAppointment: '2023-12-01'
    };

    return res.json(medicalData);
});

router.post('/patientDiagnosis', (req: Request, res: Response) => {
    const { age, symptoms } = req.body;

    // Mock diagnosis logic (purely fictional)
    let diagnosis = 'Unknown';
    if (age > 50 && symptoms.includes('fatigue')) {
        diagnosis = 'Hypertension';
    } else if (symptoms.includes('headache')) {
        diagnosis = 'Migraine';
    }

    return res.json({ diagnosis });
});

// router.post('/predictHeartDisease', (req,res) => {
//     let {age, cholesterol, pressure} = req.body;
//
//     if (!age || !cholesterol || !pressure){
//         return res.status(400).send('Incorrect data');
//     }
//     if (typeof age !== 'string' || typeof cholesterol !== 'string' || typeof pressure !== 'string'){
//         age = age.toString()
//         cholesterol = cholesterol.toString()
//         pressure = pressure.toString()
//     }
//
//     let negativeChance = 0;
//     let positiveChance  = 0;
//
//     let options = {
//         scriptPath: './models',
//         args: [age, cholesterol, pressure]
//     }
//
//     try {
//         PythonShell.run('PredictHeartDisease.py', options).then(messages=>{
//             negativeChance = parseFloat(messages[0].slice(2, -2).split(' ')[0])
//             positiveChance = parseFloat(messages[0].slice(2, -2).split(' ')[1])
//             return res.status(201).json({negativeChance, positiveChance});
//         }).catch(err => {return res.status(500).send('Internal server error')});
//     } catch (err) {
//         return res.status(500).send('Internal server error')
//     }
//
// } )

export default router;
