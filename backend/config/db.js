import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;