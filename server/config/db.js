import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Connection events
        mongoose.connection.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Connection options
        const options = {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds
            connectTimeoutMS: 10000, // 10 seconds
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow?retryWrites=true&w=majority`, options);
        
        // Test the connection
        await mongoose.connection.db.admin().ping();
        console.log('MongoDB connection test successful');
        
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error; // Re-throw to be handled by the caller
    }
};

export default connectDB;