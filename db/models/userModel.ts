import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

type Role = 'admin' | 'user';

type UserType = {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    role: Role
    resetPasswordToken: string | undefined
    resetPasswordExpires: number | undefined
};

const userSchema = new mongoose.Schema<UserType>({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, required: true},
    resetPasswordToken: String,
    resetPasswordExpires:  String
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
    next();
});

export const User = mongoose.model<UserType>('User', userSchema);
