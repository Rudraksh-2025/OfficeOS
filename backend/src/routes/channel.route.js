import express from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

import {
    createChannel,
    getChannels,
    joinChannel,
    addMember,
} from "../controllers/channel.controller.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize(PERMISSIONS.CREATE_CHANNEL),
    createChannel
);

router.get("/", protect, getChannels);

router.post("/:channelId/join", protect, joinChannel);

router.post(
    "/:channelId/add-member",
    protect,
    authorize(PERMISSIONS.CREATE_CHANNEL),
    addMember
);

export default router;