import express from "express";
import connectDB from "./db/connectDB.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
// middleware
app.use(express.json()); // allow us to parse incoming json data

// run the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});

// verify node env
console.log("Environment:", process.env.NODE_ENV);

// Routes
app.use("/api/auth", authRoutes);
