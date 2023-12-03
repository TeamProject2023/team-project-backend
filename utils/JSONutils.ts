import fs from 'node:fs'
import {DoctorType, UserType} from "../types";
import {Doctor} from "../db/models/doctorModel";
import {Transform} from "stream";

export const getObjectFromJSON = async (filename: string) =>{
    try{
        const data =  fs.readFileSync(`./utils/jsons/${filename}`, 'utf8')
        const obj = JSON.parse(data);
        return obj;
    } catch (err){
        console.error('Error reading the file', err);
        return;
    }
}

export const inputDoctors = async (filename: string) => {
    try {
        // Read file and explicitly assert the type of data as string
        const data =  fs.readFileSync(`./utils/jsons/${filename}`, 'utf8')
        const doctors: DoctorType[] = JSON.parse(data);

        const processedDoctors = doctors.map(doctor => (new Doctor({
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: 'some-phone-number',  // Add appropriate phone number
            password: 'some_password',  // Add appropriate password
            role: 'doctor',
            resetPasswordToken: undefined,  // If applicable
            resetPasswordExpires: undefined,  // If applicable
            specialty: doctor.specialty,
            workHours: doctor.workHours,
        })));
        console.log(processedDoctors)
        for (let doc of processedDoctors){
            doc.save()
        }
    } catch (err) {
        console.error('Error:', err);
    }
};
