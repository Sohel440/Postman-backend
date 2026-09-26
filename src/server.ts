import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://postman-frontend-omega.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from "./routes/auth.routes.js";
import collectionRouter from "./routes/collection.routes.js";
import environmentRoutes from "./routes/enviroment.route.js";
import requestRouter from "./routes/request.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
const PORT = process.env.PORT || 3000;
console.log(PORT);

app.get("/", (req, res) => {
  res.send({message: "Hello World!"});
});

app.use("/api/auth", authRoutes);
app.use("/api/collection", collectionRouter);
app.use("/api/requests", requestRouter);
app.use(
  "/api/v1/environments",
  environmentRoutes
);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server connected at : Port -> ${PORT}`);
});

export default app;