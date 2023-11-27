import mongoose, { Document, Model } from 'mongoose';

interface IAppointment extends Document {
    patientRef: mongoose.Schema.Types.ObjectId;
    doctorRef: mongoose.Schema.Types.ObjectId;
    date: string;
    time: string;
    field: string;
    appointmentType: 'Consultation' | 'Follow-Up' | 'Examination' | 'Lab Tests' | 'Surgery',
    isVirtual: boolean
    status: 'Scheduled' | 'Completed' | 'Canceled';
}

const appointmentSchema = new mongoose.Schema<IAppointment>({
    patientRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    field: {
        type: String,
        required: true,
    },
    appointmentType: {
        type: String,
        enum: ['Consultation', 'Follow-Up', 'Examination', 'Lab Tests', 'Surgery'],
        default: 'Consultation',
    },

    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Canceled'],
        default: 'Scheduled',
    },
});

const Appointment: Model<IAppointment> = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
