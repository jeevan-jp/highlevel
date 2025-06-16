import { IRouter, Router } from "express";
import bulkActionRoutes from "./bulk-actions.routes";
import uploadRoutes from "./upload.routes";

const router: IRouter = Router();

router.use("/uploads", uploadRoutes);
router.use("/bulk-actions", bulkActionRoutes);

export default router;
