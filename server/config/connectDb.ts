import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI!}/voting_management`);
    } catch (error: any) {
        console.error(error?.message);
        process.exit(1);
    }
}
export default connectDB;