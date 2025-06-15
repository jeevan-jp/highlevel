import { Router } from "express";
import { logger } from "../logger/logger";

const router = Router();

router.post("/bulk-actions", (req, res) => {
  const entityId = req.body.entityId;
  logger.info(`Processing bulk update: ${entityId}`);

  res.json({ success: true, entity: entityId });
});

export default router;
