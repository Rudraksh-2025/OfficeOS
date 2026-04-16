import { registerService, loginService } from "../services/auth.service.js";

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