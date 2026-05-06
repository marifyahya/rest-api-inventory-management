import express, { Application } from "express";
import apiRoutes from "./routes/api";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.middleware";
import "dotenv/config";

const app: Application = express();

app.use(express.json());

// Register Routes
app.use("/api", apiRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Nodes",
    status: "healthy",
    server_time: new Date().toLocaleString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
