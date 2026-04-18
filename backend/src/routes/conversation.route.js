import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
    createDM,
    createGroup,
    getConversations,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router.post("/dm", protect, createDM);
router.post("/group", protect, createGroup);
router.get("/", protect, getConversations);

export default router;