import mongoose from "mongoose";

export const connection = async () => {
    // mongoose.connect('mongodb://127.0.0.1:27017/e-commerce-api')
    await mongoose.connect(process.env.CLOUD_DATABASE)
        .then(() => console.log('Database connection established successfully'))
        .catch((err) => console.log('Database connection failed', err.message));
}; 