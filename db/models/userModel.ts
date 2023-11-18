import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

type Role = 'admin' | 'user';

type UserType = {
    email: string;
    password: string;
    role: Role
};

const userSchema = new mongoose.Schema<UserType>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, required: true}
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
