import express, { Application } from "express";
import dotenv from "dotenv"; // For env File
import morgan from "morgan"; // For logging
import cors from "cors"; // For Cross Origin Resource Sharing

import Config from "./config";

import ProductRouter from "./routers/product";
import UpdateRouter from "./routers/update";
import UserRouter from "./routers/user";
import { protect } from "./modules/auth";
import { errorHandler, serverErrorHandler } from "./handlers/error";

// NODE.JS error handling
serverErrorHandler();

//For env File
dotenv.config();

// PORT
const PORT = Config.port;

const app: Application = express();

app.use(cors()); // For Cross Origin Resource Sharing

app.use(express.json()); // For parsing application/json

app.use(morgan("dev")); // For logging

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

/**
 * Routes
 */

const API_ROUTES = [ProductRouter, UpdateRouter, UserRouter];

app.use("/api", protect, API_ROUTES);

// Error Handler : SHOULD have it at the end of the file ... it gets triggered when a routhe `THROW` an error

app.use(errorHandler);

// LAUNCHING THE SERVER ...

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} ... 🚀`);
});
