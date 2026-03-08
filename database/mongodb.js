import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";


if (!DB_URI) throw new Error('Please define the mongodb uri inside .env.<development | production>.local');

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to mongodb in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Error connecting to db: ', error);
        process.exit(1);        
    }
}