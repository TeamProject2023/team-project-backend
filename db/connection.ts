import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri : string = process.env.CLOUD_DB_URI || 'NO URI';

const dbConnect = () => {
    mongoose.connect(uri)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
};

export default dbConnect;
