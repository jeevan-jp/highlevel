import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import {
  accessErrorLogger,
  accessSuccessLogger,
  logger,
} from "./logger/logger";
import { tokenHandler } from "./middleware";
import apiV1Routes from "./routes";

const app = express();

// register loggers
app.use(accessSuccessLogger);
app.use(accessErrorLogger);

const ALLOWED_ORIGINS = new RegExp(process.env.ALLOWED_ORIGINS || "");

app.use(
  cors({
    credentials: true,
    origin: ALLOWED_ORIGINS,
  }),
);

app.use(cookieParser("CookieSecret"));
app.disable("x-powered-by");
app.use(express.json({ limit: "50mb" }) as RequestHandler); // 50mb limit on payload size - allows large image upload
app.use(express.urlencoded({ extended: true }) as RequestHandler);

// will be used to poll to check whether server is alive
app.use("/api/highlevel", (request, response) => {
  response.status(200).json({
    // eslint-disable-next-line no-undef
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  });
});

/**
 * Rate limiter to make the limited request in particular time for manual api routes
 */
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "You exceeded 100 requests in 15 minutes limit!",
});

// app.use("/api/v1", apiLimiter, tokenHandler, apiV1Routes);
app.use("/api/v1", apiLimiter, apiV1Routes);

// global error handler
app.use(async (err: Error, _req: any, res: any, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json("Ouch! Something broke!");
  next();
});

export = app;
