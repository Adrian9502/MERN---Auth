import express from "express";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://mern-advance-auth-system.vercel.app/" // production URL
      : "http://localhost:5173", // development URL
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API Routes - these should come BEFORE the static file handling
app.use("/api/auth", authRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "This is a test route!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`-BACKEND SERVER RUNNING ON PORT: ${PORT}...`);
  console.log("Environment:", process.env.NODE_ENV);
});
