import mongoose from "mongoose";
import config from "../config/config.js";

export async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("notification services is connected to database");
  } catch (error) {
    console.log("mogodb connection failed!!!");
  }
}
