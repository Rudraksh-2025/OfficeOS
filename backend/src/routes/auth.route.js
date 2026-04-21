import express from "express";
import { register, login, verifyEmail, resendVerification, forgotPassword, verifyOtp, resetPassword } from "../controllers/auth.controller.js";
import {
    registerSchema,
    loginSchema,
} from "../validations/auth.validation.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/verify-email", verifyEmail);
router.post("/resend-email", resendVerification)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp", verifyOtp)
router.post("/reset-password", resetPassword)

export default router;