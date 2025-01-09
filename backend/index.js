import express from "express";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://mern-advance-auth-system.vercel.app"
      : "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connect to database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Backend API is running" });
});

// API Routes
app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "This is a test route!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// For Vercel, export the app
export default app;

// Only start the server if running locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`-BACKEND SERVER RUNNING ON PORT: ${PORT}...`);
    console.log("Environment:", process.env.NODE_ENV);
  });
}
