import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, {Jwt, JwtPayload} from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const router = Router();
router.use(cookieParser())
import { User } from '../db/models/userModel';
import {RefreshToken} from "../db/models/refreshToken";``
import {DecodedToken, UserType} from "../types";

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
        const SECRET_KEY = process.env.SECRET_KEY || 'generic';
        const REFRESH_SECRET = process.env.REFRESH_SECRET || 'generic_refresh';
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User does not exist');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Wrong password');
        }

        // Access token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '12h' });

        // Refresh token
        const refreshToken = await  RefreshToken.createToken(user)
        return res.status(200).send({ token, refreshToken });
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
});

router.post('/refresh_token', async (req, res) => {
    const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'generic_refresh'
    const SECRET_KEY = process.env.SECRET_KEY || 'generic';
    const {refreshToken} = req.body;

    if (!refreshToken) {
        return res.status(401).send('No refresh token provided');
    }

    try {
        const dbToken = await RefreshToken.findOne({ token: refreshToken })
        if (!dbToken) {
            return res.status(400).send('Invalid refresh token.(server)');
        }
        const decoded : any = jwt.verify(refreshToken, REFRESH_SECRET);
        const token = jwt.sign({ userId: decoded.userId}, SECRET_KEY, { expiresIn: '12h' });
        return res.status(200).send({token});

    }
    catch (error) {
        await RefreshToken.findOneAndDelete({ token: refreshToken });
        return res.status(400).send('Invalid refresh token.(expired)');

    }

});


router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const token = await RefreshToken.findOneAndDelete({ token: refreshToken }).lean();
        if (token) {
            res.status(201).send('Logged out successfully');
            return;
        } else {
            res.status(400).send('Refresh token not found');
            return;
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');

    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser){
            return res.status(501).send('User already exists');
        }
        const user = new User({ email, password, role: 'user'});
        await user.save();
        return res.status(201).send('User registered successfully');
    } catch (error) {
       return res.status(500).send('Error registering new user');
    }
});

// Dummy Get User Data Route
router.get('/getUserData',authMiddleware, async (req, res) => {
    const user : UserType | null = await User.findById(req.user.userId)

    const mockData = {
        username: user?.email || 'Generic user',
        role: user?.role || 'unknown role',
        randomInfo1: 'User is retarded',
        arrayOfInfo: ['info1', 'info2'],
        infoObject: {infoId: 512523, infoText: 'coffee addiction'}
    }
    return res.send(mockData);
});

export default router;
