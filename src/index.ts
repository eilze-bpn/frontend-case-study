import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { initDb } from "./data/generators";
import { swaggerOptions } from "./config/swagger";

import customersRouter from "./routes/customers";
import walletsRouter from "./routes/wallets";
import transactionsRouter from "./routes/transactions";
// import resetRouter from "./routes/reset";

dotenv.config();

const app = express();

// initialize dynamic mock data
initDb();

app.use(cors());
app.use(express.json());

// Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/customers", customersRouter);
app.use("/api/wallets", walletsRouter);
app.use("/api/transactions", transactionsRouter);
// app.use("/api/reset", resetRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
