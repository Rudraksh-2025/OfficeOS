import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:channelId", protect, authorize(PERMISSIONS.SEND_MESSAGE), getMessages);

export default router;