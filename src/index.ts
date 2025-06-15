import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import { logger } from "./logger/logger";

dotenv.config({ path: ".env" });

const app = express();

app.get("/", (req, res, next) => {
  res.json({ time: Date.now() });
});

const port = process.env.PORT;
app.listen(process.env.PORT, () => {
	logger.info(`listening on ${port}`);
});
