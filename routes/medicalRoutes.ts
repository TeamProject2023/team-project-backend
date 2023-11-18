import express, { Request, Response } from 'express';

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

    res.json(medicalData);
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

    res.json({ diagnosis });
});

export default router;
