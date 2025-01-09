import mongoose from "mongoose";

// MongoDB connection
export default async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED TO MONGODB: ", conn.connection.host);
  } catch (error) {
    console.error("NOT CONNECTED TO MONGODB:", error.message);
    process.exit(1); // 1 is for exit with failure, 0 is for success
  }
}
