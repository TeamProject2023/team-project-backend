import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();
import { User } from '../db/models/userModel';

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
// Login Route
router.post('/login', async (req, res) => {
    try {
        const SECRET_KEY = process.env.SECRET_KEY || 'generic'
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User doesn not exist');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Wrong password');
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '7d' });
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering new user');
    }
});

// Dummy Get User Data Route
router.get('/getUserData', (req, res) => {
    const mockData = {
        username: 'Generic user',
        randomInfo1: 'User is retarded',
        arrayOfInfo: ['info1', 'info2'],
        infoObject: {infoId: 512523, infoText: 'coffee addiction'}
    }
    res.send(mockData);
});

export default router;
