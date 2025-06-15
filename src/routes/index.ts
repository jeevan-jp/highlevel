import { Router } from "express";
import { logger } from "../logger/logger";

const router = Router();

router.post("/bulk/:entityId", (req, res) => {
  const entityId = req.params.entityId;
  logger.info(`Processing bulk update: ${entityId}`);
  res.json({ message: "Success", entity: entityId });
});

export default router;
