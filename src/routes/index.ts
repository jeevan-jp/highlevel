import { IRouter, Router } from "express";
import bulkActionRoutes from "./bulk-actions.routes";
import logRoutes from "./log.routes";
import uploadRoutes from "./upload.routes";

const router: IRouter = Router();

router.use("/uploads", uploadRoutes);
router.use("/bulk-actions", bulkActionRoutes);
router.use("/logs", logRoutes);

export default router;
