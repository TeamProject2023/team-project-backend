import { Request } from 'express';

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
    role: 'admin' | 'user'
    resetPasswordToken: string | undefined
    resetPasswordExpires: number | undefined
};