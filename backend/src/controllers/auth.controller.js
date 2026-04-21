import { registerService, loginService, verifyEmailService, resendVerificationService, forgotPasswordService, verifyOtpService, resetPasswordService } from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, workspaceName } = req.body;

        const data = await registerService({
            name,
            email,
            password,
            workspaceName,
        });

        res.status(201).json({
            message: "User registered successfully",
            ...data,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const data = await loginService({ email, password });

        res.status(200).json({
            message: "Login successful",
            ...data,
        });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const data = await verifyEmailService(token);

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const data = await resendVerificationService(email)
        res.status(200).json(data);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const data = await forgotPasswordService(email);

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const data = await verifyOtpService({ email, otp });

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const data = await resetPasswordService({
            email,
            otp,
            newPassword,
        });

        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};