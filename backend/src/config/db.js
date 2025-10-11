import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const { MONGO_URL } = process.env;
        // check if the mongo url is set
        if ( !MONGO_URL ) {
            throw new Error("MONGO_URL is not set");
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Successfully Connected To DB');
    } catch (error) {
        console.error('Failed To Connect DB', error);
        process.exit(1);
    }
    
}

