import express from "express";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // allow us to parse incoming json data
app.use(cookieParser());
// run the server
app.listen(PORT, () => {
  console.log(`-BACKEND SERVER RUNNING' ON PORT: ${PORT}...`);
});

// verify node env
console.log("Environment:", process.env.NODE_ENV);

// Routes
app.use("/api/auth", authRoutes);
