import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {UserType} from "../../types";

type RefreshTokenType = {
    token: string;
    user: mongoose.Schema.Types.ObjectId;
    expiryDate: Date;
};

interface RefreshTokenModel extends mongoose.Model<RefreshTokenType> {
    createToken(user: UserType): Promise<string>;
}


const refreshTokenSchema = new mongoose.Schema<RefreshTokenType>({
    token: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiryDate: Date
});

refreshTokenSchema.statics.createToken = async function(user) {
    let expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7); // 7 days from now

    let _token = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: '7d'});
    let _object = new this({
        token: _token,
        user: user._id,
        expiryDate: expiredAt
    });

    let refreshToken = await _object.save();
    return refreshToken.token;
};

export const RefreshToken = mongoose.model<RefreshTokenType, RefreshTokenModel>('RefreshToken', refreshTokenSchema);
