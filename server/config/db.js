import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on(`connect`,()=>console.log('Database Connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`);
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;