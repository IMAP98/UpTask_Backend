import express  from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import { corsOptions } from "./config/cors";
import cors  from "cors";
import morgan from "morgan";

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
app.use('/api/projects', projectRoutes);

export default app;