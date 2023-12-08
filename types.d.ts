import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any; // Replace `any` with a more specific type if needed
    }
}
type DecodedToken = {
    userId: string
    iat: Date
    exp: Date
}

type Role = 'admin' | 'user';

type UserType = {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    role: 'doctor' | 'user'
    resetPasswordToken: string | undefined
    resetPasswordExpires: number | undefined
};

type DoctorType = {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    role: 'doctor' | 'user'
    specialty: string
    workHours: string[]
    resetPasswordToken: string | undefined
    resetPasswordExpires: number | undefined
};

type InputDataType = {
    age: string
    cholesterol: string
    bloodPressure: string
}

type ResultType  = {
    negativeChance: string
    positiveChance: string
}

type PredictionType = {
    userRef: mongoose.Schema.Types.ObjectId;
    date: string
    time: string
    inputData: InputDataType
    result: ResultType
}

import { Document } from 'mongoose';

type PastSurgery = {
    type: string;
    date: Date;
};

type CurrentMedication = {
    medication: string;
    dosage: string;
};

type Immunization = {
    vaccine: string;
    date: Date;
};

type EmergencyContact = {
    name: string;
    relationship: string;
    phone: string;
};

type InsuranceInfo = {
    provider: string;
    policyNumber: string;
};

type ContactInfo = {
    address?: string;
    phone?: string;
    email?: string;
};

type MedicalRecord = Document & {
    patientRef: mongoose.Schema.Types.ObjectId; // Assuming user_id is stored as a string
    date_of_birth: string;
    gender: string;
    contact_info: ContactInfo;
    height?: number;
    weight?: number;
    bmi?: number;
    blood_type?: string;
    rh_factor?: string;
    allergies: string[];
    chronic_conditions: string[];
    past_surgeries: PastSurgery[];
    current_medications: CurrentMedication[];
    immunizations: Immunization[];
    family_hereditary_conditions: string[];
    smoking_status?: string;
    alcohol_consumption?: string;
    exercise_habits?: string;
    emergency_contact: EmergencyContact;
    insurance_info: InsuranceInfo;
    consent_to_treat: boolean;
    privacy_agreement: boolean;
    doctors_notes?: string;
};
