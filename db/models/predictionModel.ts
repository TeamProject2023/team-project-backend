import mongoose, { Document, Model } from 'mongoose';
import {HeartDiseaseInputType, PredictionType, HeartDiseaseResultType, BrainStrokeInputType} from "../../types";

type PredictionModelType = Document & PredictionType;
type BrainStrokeInputModelType = Document & BrainStrokeInputType;
type HeartDiseaseResultModelType = Document & HeartDiseaseResultType;
type HeartDiseaseInputModelType = Document & HeartDiseaseInputType;

const HeartDiseaseInputSchema = new mongoose.Schema({
    cholesterol: { type: String, required: true },
    age: { type: String, required: true },
    bloodPressure: { type: String, required: true }
});

const HeartDiseaseResultSchema = new mongoose.Schema({
    negativeChance: { type: String, required: true },
    positiveChance: { type: String, required: true }
});

const BrainStrokeInputSchema = new mongoose.Schema({
    gender: { type: String, required: true },
    age: { type: String, required: true },
    hypertension: { type: String, required: true },
    heart_disease: { type: String, required: true },
    ever_married: { type: String, required: true },
    work_type: { type: String, required: true },
    Residence_type: { type: String, required: true },
    avg_glucose_level: { type: String, required: true },
    bmi: { type: String, required: true },
    smoking_status: { type: String, required: true }
});

const predictionSchema = new mongoose.Schema({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {type: String, required: true},
    model: {
        type: String,
        enum: [ 'HeartDisease', 'BrainStroke' ],
        required: true
    },
    time: {
        type: String,
        required: true
    },
    inputData: { type: mongoose.Schema.Types.Mixed, required: true }, // Mixed type for flexibility
    result: { type: mongoose.Schema.Types.Mixed, required: true }
});

export const Prediction: Model<PredictionModelType> = mongoose.model<PredictionModelType>('Prediction', predictionSchema);
export const BrainStrokeInput: Model<BrainStrokeInputModelType> = mongoose.model<BrainStrokeInputModelType>('BrainStrokeInput', BrainStrokeInputSchema);
export const HeartDiseaseInput: Model<HeartDiseaseInputModelType> = mongoose.model<HeartDiseaseInputModelType>('HeartDiseaseInput', HeartDiseaseInputSchema);
export const HeartDiseaseResult: Model<HeartDiseaseResultModelType> = mongoose.model<HeartDiseaseResultModelType>('HeartDiseaseResult', HeartDiseaseResultSchema);
