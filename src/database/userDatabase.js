import mongoose from "mongoose";
import { ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

export const connectUserDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            dbName: "Car_Management",
            serverApi: ServerApiVersion.v1,
            ssl: true, 
            tls: true, 
            retryWrites: true,
            tlsInsecure: false
        });
        console.log("Connected to MongoDB database");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};