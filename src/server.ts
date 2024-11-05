import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { corsOptions } from "./config/cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";

dotenv.config();

connectDB();

const app = express();

// NOTE: CORS
app.use(cors(corsOptions));

// NOTE: Logging
app.use(morgan('dev'));

// NOTE: Get data from body
app.use(express.json());

// NOTE: Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

export default app;