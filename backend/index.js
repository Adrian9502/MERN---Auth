import express from "express";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
// middleware
app.use(express.json()); // allow us to parse incoming json data
app.use(cookieParser());
// run the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

// verify node env
console.log("Environment:", process.env.NODE_ENV);

// Routes
app.use("/api/auth", authRoutes);
