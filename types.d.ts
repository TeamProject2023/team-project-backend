import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any; // Replace `any` with a more specific type if needed
    }
}
