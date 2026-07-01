import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Self-Healing: Programmatically drop non-sparse unique indexes to prevent null duplicates crash
        try {
            const collections = await conn.connection.db.listCollections().toArray();
            if (collections.some(col => col.name === 'users')) {
                const indexes = await conn.connection.db.collection('users').indexes();
                const emailIdx = indexes.find(idx => idx.name === 'email_1');
                const phoneIdx = indexes.find(idx => idx.name === 'phone_1');
                
                if (emailIdx && !emailIdx.sparse) {
                    console.log("Self-Healing: Dropping old non-sparse email_1 index...");
                    await conn.connection.db.collection('users').dropIndex('email_1');
                }
                if (phoneIdx && !phoneIdx.sparse) {
                    console.log("Self-Healing: Dropping old non-sparse phone_1 index...");
                    await conn.connection.db.collection('users').dropIndex('phone_1');
                }
            }
        } catch (idxError) {
            console.warn("Self-Healing index check warning:", idxError.message);
        }
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;