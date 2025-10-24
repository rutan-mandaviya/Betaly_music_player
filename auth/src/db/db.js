
import mongoose from "mongoose";
import _config from "../config/config.js";



export async function connectDB() {
    try {
        await mongoose.connect(_config.MONGO_URI)
     console.log("MongoDB connected successfully");
    } catch (error) {
          console.error("MongoDB connection failed:", error);
        
    }
    
}