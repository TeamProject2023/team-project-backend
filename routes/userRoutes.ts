import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
import nodemailer from 'nodemailer';
import jwt, {Jwt, JwtPayload} from 'jsonwebtoken';
const router = Router();
import { User } from '../db/models/userModel';
import {RefreshToken} from "../db/models/refreshToken";``
import {DecodedToken, UserType} from "../types";
import {authMiddleware} from "../utils/authUtils";

const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
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
            return res.status(401).send('Invalid refresh token.(server)');
        }
        const decoded : any = jwt.verify(refreshToken, REFRESH_SECRET);
        const token = jwt.sign({ userId: decoded.id}, SECRET_KEY, { expiresIn: '12h' });
        return res.status(200).send({token});
    }
    catch (error) {
        await RefreshToken.findOneAndDelete({ token: refreshToken });
        return res.status(401).send('Invalid refresh token.(expired)');

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
        const { email, password, firstName, lastName, phone } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser){
            return res.status(400).send('User already exists');
        }
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
            role: 'user'});
        await user.save();
        return res.status(201).send('User registered successfully');
    } catch (error) {
       return res.status(500).send('Error registering new user');
    }
});

router.get('/getUserData',authMiddleware, async (req, res) => {
    const user : UserType | null = await User.findById(req.user.userId).select("-password -resetPasswordExpires -resetPasswordToken").lean()
    if (!user) {
        return res.status(400).send("No user found");
    }
    return res.status(200).json(user);
});

router.post('/requestPasswordReset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        // Token expiration in 1 hour
        const resetTokenExpiration = Date.now() + 3600000;
        const resetLink = `https://some-link.com/${resetToken}`

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiration;
        await user.save();
        const htmlMessage = `
            <h4>Hello ${user.firstName}</h4>
                <hr>
            <p>You requested a pasword reset on MedAI Labs website:</p>
                <h3>To reset your password, please follow the link:</h3>
                <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
                <a href=${resetLink}>${resetLink}</a>
            </p>
            <p>
            Best wishes,<br>MedAI Labs team
            </p>
        `
        const response = await  transporter.sendMail({
            from: "'MedAI Labs' <postmaster@sandbox97969bcf20824472b3c26c36d178ea32.mailgun.org>" , // sender address
            to: email, // list of receivers
            subject: "Password reset", // Subject line
            text: `To reset your password, please follow the link: \n ${resetLink}`, // plain text body
            html: htmlMessage, // html body
        });

       // if (response.info.status !== 200) return  res.status(503).send('Error sending an email');

        return res.status(200).send('Password reset link sent to your email');
    } catch (error) {
        console.log(error)
        return  res.status(500).send('Internal Server Error');
    }
});

router.post('/resetPassword', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

       return res.status(200).send('Your password has been updated.');
    } catch (error) {
       return res.status(500).send('Internal Server Error');
    }
});


export default router;
