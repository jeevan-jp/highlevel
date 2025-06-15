import { Router } from "express";
import UploadController from "../controllers/upload.controller";

const router = Router();

/**
 * Routes required:
 * 1. GET /bulk-actions/:actionId - Lists all the bulk actions
 * 2. POST /bulk-actions - Bulk Action Creation Endpoint:
 * 3. GET /bulk-actions/:actionId - Retrieves the details about the bulk action
 * 4. GET /bulk-actions/{actionId}/stats - Retrieves a summary of the bulk action. Including success, failure, and skipped counts.
 */

router.post("/bulk-actions", UploadController.createBulkAction);
router.get("/bulk-actions", UploadController.getSucceddedActions);
router.get("/bulk-actions/:actionId", UploadController.getAction);
router.get("/bulk-actions/:actionId/stats", UploadController.getActionStats);

export default router;
