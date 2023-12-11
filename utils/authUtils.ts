import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import cron from 'node-cron';

import {RefreshToken} from "../db/models/refreshToken";
import Appointment from "../db/models/appointmentModel";

``

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

const deleteOldAppointments = async () => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const formattedTenDaysAgo = tenDaysAgo.toISOString().split('T')[0];
    try {
        const result = await Appointment.deleteMany({
            status: 'Canceled',
            date: {
                $lt: formatDateToComparable(formattedTenDaysAgo)
            }
        });
        console.log(`Deleted ${result.deletedCount} old canceled appointments.`);
    } catch (error) {
        console.error('Error deleting old canceled appointments:', error);
    }
};

const formatDateToComparable = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
};

cron.schedule('0 0 * * *', () => {
    console.log('Running a daily task to delete old canceled appointments');
    deleteOldAppointments();
});

deleteOldAppointments();
deleteOldTokens();
deleteExpiredTokens();