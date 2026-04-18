import express from "express";
import { createInvite, acceptInvite } from "../controllers/invite.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createInvite);
router.post("/accept", acceptInvite);

export default router;