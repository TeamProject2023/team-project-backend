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