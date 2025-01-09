import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI; // Make sure this matches the variable in your .env file
if (!uri) {
  console.error("MONGO_URI is not defined in .env file");
  process.exit(1); // Exit if no connection string is found
}
// MongoDB connection
export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED TO MONGODB: ", conn.connection.host);
  } catch (error) {
    console.log();

    console.error("NOT CONNECTED TO MONGODB:", error.message);
    process.exit(1); // 1 is for exit with failure, 0 is for success
  }
}
