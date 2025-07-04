import { Router } from "express";
import UploadController from "../controllers/bulk-actions.controller";

const bulkActionRoutes = Router();

/**
 * Routes required:
 * 1. GET /bulk-actions - Lists all the bulk actions
 * 2. GET /bulk-actions/:actionId - Retrieves the details about the bulk action
 * 3. GET /bulk-actions/{actionId}/stats - Retrieves a summary of the bulk action. Including success, failure, and skipped counts.
 * 3. GET /bulk-actions/{actionId}/progress - Real Time progress of bulk action.
 */

bulkActionRoutes.get("/", UploadController.listBulkActions);
bulkActionRoutes.get("/:actionId", UploadController.getAction);
bulkActionRoutes.get("/:actionId/stats", UploadController.getActionStats);
bulkActionRoutes.get("/:actionId/progress", UploadController.getActionProgress);

export default bulkActionRoutes;
