import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import {RefreshToken} from "../db/models/refreshToken";``

export const authMiddleware = (req: any, res: Response, next: NextFunction) => { // FIX REQ TYPE
    const SECRET_KEY = process.env.SECRET_KEY || 'generic'
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).send('Access denied. No token provided.');

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};


const deleteExpiredTokens = async () => {
    try {
        const now = new Date();
        await RefreshToken.deleteMany({ expiryDate: { $lt: now } });
        console.log('\x1b[34m%s\x1b[0m','Expired tokens cleaned up');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m','Error cleaning up tokens:', error);
    }
};

const deleteOldTokens = async () => {
    try {
        const tokens = await RefreshToken.find().sort({ expiryDate: -1 }).lean();
        const latestTokens = new Map();

        // Keep only the latest token for each user
        tokens.forEach(token => {
            if (!latestTokens.has(token.user.toString())) {
                latestTokens.set(token.user.toString(), token._id.toString());
            }
        });

        // Remove tokens that are not the latest
        await Promise.all(tokens.map(token => {
            if (latestTokens.get(token.user.toString()) !== token._id.toString()) {
                return RefreshToken.findByIdAndDelete(token._id);
            }
        }));

        console.log('\x1b[34m%s\x1b[0m','Old tokens cleaned up');
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m','Error cleaning up tokens:', error);
    }
};


export function formatDate(milliseconds: number) {
    const date = new Date(milliseconds);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}


deleteOldTokens();
deleteExpiredTokens();