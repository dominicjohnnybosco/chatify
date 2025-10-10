import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Successfully Connected To DB');
    } catch (error) {
        console.error('Failed To Connect DB', error);
        process.exit(1);
    }
    
}

