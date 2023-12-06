import mongoose, { Document, Model } from 'mongoose';
import {InputDataType, PredictionType, ResultType} from "../../types";

type PredictionModelType = Document & PredictionType;

const inputDataSchema = new mongoose.Schema({
    cholesterol: {type: String, required: true},
    age: {type: String, required: true},
    bloodPressure: {type: String, required: true},
});

const resultSchema = new mongoose.Schema({
    negativeChance: {type: String, required: true},
    positiveChance: {type: String, required: true},
});

const predictionSchema = new mongoose.Schema({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {type: String, required: true},
    time: {type: String, required: true},
    inputData: {type: inputDataSchema, required: true},
    result:{type: resultSchema, required: true},
});

export const Prediction: Model<PredictionModelType> = mongoose.model<PredictionModelType>('Prediction', predictionSchema);

