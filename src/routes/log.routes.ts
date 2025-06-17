import { Router } from "express";
import LogController from "../controllers/log.controller";

const logRoutes = Router();

logRoutes.get("/", LogController.fetchLogs);
logRoutes.get("/worker", LogController.fetchWorkerLogs);

export default logRoutes;
