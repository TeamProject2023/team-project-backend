import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {User} from "./userModel";


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

const doctorSchema = new mongoose.Schema<DoctorType>(
    {
        specialty: { type: String, required: true },
        workHours: { type: [String], required: true },
    },
    { discriminatorKey: 'role' }
);
doctorSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

export const Doctor = User.discriminator('Doctor', doctorSchema);
