import express, { Application } from "express";
import apiRoutes from "./routes/api";
import 'dotenv/config';

const app: Application = express();

app.use(express.json());

// Register Routes
app.use("/api", apiRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Node.js",
    status: "healthy",
  });
});

export default app;
