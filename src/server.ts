import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import authRoutes from "./routes/auth.routes.js";
import collectionRouter from "./routes/collection.routes.js";
import environmentRoutes from "./routes/enviroment.route.js";
import requestRouter from "./routes/request.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
const PORT = process.env.PORT || 3000;
console.log(PORT);

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
