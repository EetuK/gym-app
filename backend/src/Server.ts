import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import BaseRouter from "./routes";
import { initDb } from "./shared/db";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kuntosali-app",
      version: "1.0.0" // Version (required)
    }
  },
  // Path to the API docs
  apis: ["./src/routes/Auth.ts", "./src/routes/index.ts"]
};
const swaggerSpec = swaggerJSDoc(options);

// Init express
const app = express();

// Init db
initDb();

// Add middleware/settings/routes to express.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api", BaseRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Export express instance
export default app;
