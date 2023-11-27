import { Router, Request, Response, NextFunction } from 'express';
import {authMiddleware} from "../utils/authUtils";
import {UserType} from "../types";
import {User} from "../db/models/userModel";
import {Doctor} from "../db/models/doctorModel";
import Appointment from "../db/models/appointmentModel";
const router = Router();

const fields : string[] = [
    "General Practice",
    "Infectious Diseases",
    "Gastroenterology",
    "Dermatology",
    "Urology",
    "Gynecology",
    "Venereology",
    "Pulmonology",
    "Pediatrics",
    "Parasitology",
];

const appointmentTypes : string[] = [
    'Consultation',
    'Follow-Up',
    'Examination',
    'Lab Tests',
    'Surgery'
]

const appointmentDurations: { [key: string]: number } = {
    'Examination': 1, // 30 minutes
    'Consultation': 1, // 30 minutes
    'Follow-Up': 2, // 60 minutes
    'Lab Tests': 2, // 60 minutes
    'Surgery': 6, // 3 hours
};

const timeSlots = [
    '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
];

router.get('/getPracticeFields', async (req,res) =>{
    return res.status(200).json(fields)
})

router.get('/getAppointmentTypes', async (req,res) =>{
    return res.status(200).json(appointmentTypes)
})

// FOR TESTING PURPOSES
router.get('/getAllAppointments', async (req,res) =>{
    try{
        const appointments = await Appointment.find().lean();
        return res.status(200).json(appointments)
    } catch (err){
        return res.status(500).send('Internal server error')
    }

})

router.get('/getAppointments',authMiddleware, async (req,res) =>{
    const user = await User.findById(req.user.userId).lean()
    if (!user){
        return res.status(400).send("Error retreiving user's data")
    }
    try{
        const appointments = await Appointment.find( user.role === 'user' ? ({'patientRef': user._id}) : ({'doctorRef': user._id})).lean();
        return res.status(200).json(appointments)
    } catch (err){
        return res.status(500).send('Internal server error')
    }

})



router.get("/checkAppointmentSlots",authMiddleware, async (req,res)=>{
    //const user : UserType | null = await User.findById(req.user.userId)
    const {
        date,
        field ,
        type,
    } = req.query;

    if (!date || !field || !type){
        return res.status(400).send('Not enough arguments')
    }

    const reuiredSlots = appointmentDurations[type.toString()];
    let availableSlots: string[] = [];

    const existingAppointments = await Appointment.find({
        'date': date,
        'field': field,
        'status': 'Scheduled'
    }).lean();
    const reservedTimeSlots = existingAppointments.map(appointment => ({
        time: appointment.time,
        type: appointmentDurations[appointment.appointmentType.toString()],
    })).sort((a, b) => {
        const indexA = timeSlots.indexOf(a.time);
        const indexB = timeSlots.indexOf(b.time);
        return indexA - indexB;
    });

    let reserved_iter = 0;
    for (let i = 0; i<timeSlots.length;i){
        if (timeSlots.indexOf(reservedTimeSlots[reserved_iter].time) - i >= reuiredSlots){
            availableSlots.push(timeSlots[i]);
            i++;
        }
        else {
            i = timeSlots.indexOf(reservedTimeSlots[reserved_iter].time) + reservedTimeSlots[reserved_iter].type;
            if (reserved_iter < reservedTimeSlots.length - 1){
                reserved_iter++;
            } else {
                if (reservedTimeSlots.some(appointment => appointment.time === '17:00')){
                    console.log(availableSlots)
                    return res.status(200).json(availableSlots)
                }
                else {
                    reservedTimeSlots.push({time: '17:00', type: 1});
                }
            }
        }
    }
        return res.status(500).send('Internal server error')
})

router.put('/rescheduleAppointment/:appointmentId',authMiddleware, async (req, res) => {
    const { appointmentId } = req.params;
    const { newDate, newTime } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { date: newDate, time: newTime }, { new: true });
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.put('/changeStatus/:appointmentId',authMiddleware, async (req, res) => {
    const { appointmentId } = req.params;
    const { newStatus } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { status: newStatus }, { new: true });
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post('/createAppointment',authMiddleware, async (req,res)=>{
    const user : UserType | null = await User.findById(req.user.userId);

    const {date,time, field, type, isVirtual} = req.body;

    try{
        const doctor = await Doctor.findOne({'specialty': field})
        if(doctor){
            const appointment = new Appointment({
                patientRef: req.user.userId,
                doctorRef: doctor._id,
                date: date,
                time: time,
                field: field,
                appointmentType: type,
                isVirtual: isVirtual,
                status: 'Scheduled',
            })

            appointment.save()
            return res.status(200).send(`Appointment scheduled on ${date} ${time}`)
        }
        else {
            return res.status(400).send("No doctors available")
        }

    } catch (err){
        return res.status(500).send("Internal server error")
    }
})

export default router;