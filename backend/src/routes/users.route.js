import { getWorkspaceUsers } from "../controllers/users.controller.js";
import { protect } from "../middleware/auth.js";
import express from "express";

const router = express.Router()

router.get("/", protect, getWorkspaceUsers);

export default router