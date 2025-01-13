import mongoose from "mongoose"


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('database connected'))
            .catch(err => console.log("database not connected -" + err?.message));

    } catch (error) {
        console.log(error);
    }
}